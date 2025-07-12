import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Request } from 'express';
import { RegisterDto } from './auth.controller';
import { OrganizationsService } from '../users/organizations.service';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  organizationId: string;
  tenantId?: string; // Optional for backward compatibility
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface UpdateUserSettingsDto {
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: Date;
  name?: string;
  avatar?: string;
  organizationSettings?: any;
  organizationName?: string;
  customDomain?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private organizationsService: OrganizationsService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.validateUser(email, password);
      if (user) {
        this.logger.log(`User ${email} validated successfully`);
      } else {
        this.logger.warn(`Failed login attempt for email: ${email}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error validating user ${email}:`, error.message);
      return null;
    }
  }

  async login(user: User): Promise<LoginResponse> {
    try {
      const tokens = this.generateTokens(user);

      // Create session record
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() +
          parseInt(
            this.configService.get('jwt.refreshExpiresIn') || '604800',
            10,
          ),
      );

      await this.usersService.createSession({
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
      });

      // Update user's last active timestamp
      await this.usersService.updateLastActive(user.id);

      this.logger.log(`User ${user.email} logged in successfully`);

      // Return user information AND tokens for NextAuth compatibility
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        organizationId: user.organizationId,
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Login failed for user ${user.email}:`, error.message);
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      // Check if the user already exists
      const existingUser = await this.usersService.findByEmail(registerDto.email);
      if (existingUser) {
        this.logger.warn(`Registration attempt with existing email: ${registerDto.email}`);
        throw new ConflictException('User with this email already exists');
      }

      // Generate a slug if not provided
      const organizationSlug =
        registerDto.organizationSlug ||
        registerDto.organizationName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      // Check if organization slug is already taken
      const existingOrg =
        await this.organizationsService.findBySlug(organizationSlug);
      if (existingOrg) {
        this.logger.warn(`Registration attempt with existing organization slug: ${organizationSlug}`);
        throw new ConflictException('Organization with this slug already exists');
      }

      // Create the organization first
      const organization = await this.organizationsService.createOrganization({
        name: registerDto.organizationName,
        slug: organizationSlug,
        email: registerDto.email,
        settings: {
          defaultCurrency: 'USD',
          emailNotifications: true,
          allowGuestCheckout: true,
        },
      });

      // Create the user with the organization
      const user = await this.usersService.createUser({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        organizationId: organization.id,
        role: (registerDto.role as UserRole) || UserRole.OWNER,
        permissions: ['*'], // Full permissions for the owner
        status: UserStatus.ACTIVE, // Auto-activate the first user
        twoFactorEnabled: false, // Default to disabled for new registrations
      });

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Create user session
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() +
          parseInt(
            this.configService.get('jwt.refreshExpiresIn') || '604800',
            10,
          ),
      );

      await this.usersService.createSession({
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
      });

      this.logger.log(`New user registered: ${user.email} for organization: ${organization.name}`);

      // Return the user, organization and tokens
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Registration failed for email ${registerDto.email}:`, error.message);
      throw error;
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      console.log(
        'Attempting to refresh token with:',
        refreshToken.substring(0, 10) + '...',
      );

      if (!refreshToken) {
        console.error('No refresh token provided');
        throw new UnauthorizedException('No refresh token provided');
      }

      // Validate refresh token
      try {
        const payload = await this.jwtService.verifyAsync<JwtPayload>(
          refreshToken,
          {
            secret: this.configService.get('jwt.refreshSecret'),
          },
        );

        console.log('Token validated, user ID:', payload.sub);
        console.log('Token expiration:', new Date(payload.exp * 1000));

        // Check if token is in the database
        const session =
          await this.usersService.findSessionByRefreshToken(refreshToken);

        if (!session) {
          console.error('Session not found for token');
          // Log the number of sessions for this user
          if (payload && payload.sub) {
            const userSessions = await this.usersService.findSessionsByUserId(
              payload.sub,
            );
            console.error(
              `User ${payload.sub} has ${userSessions.length} total sessions, ${userSessions.filter((s) => !s.isRevoked).length} active`,
            );

            // If user has no active sessions, this might be a cleanup issue
            const activeSessions = userSessions.filter((s) => !s.isRevoked);
            if (activeSessions.length === 0) {
              console.error(
                'User has no active sessions - possible cleanup issue',
              );
            }
          }
          throw new UnauthorizedException(
            'Invalid refresh token - session not found',
          );
        }

        console.log('Session found:', {
          id: session.id,
          userId: session.userId,
          isRevoked: session.isRevoked,
          expiresAt: session.expiresAt,
        });

        if (session.isRevoked) {
          console.error('Session was revoked for token');
          throw new UnauthorizedException('Refresh token has been revoked');
        }

        if (session.expiresAt < new Date()) {
          console.error(
            'Session expired at',
            session.expiresAt,
            'current time is',
            new Date(),
          );
          await this.usersService.revokeSession(session.id);
          throw new UnauthorizedException('Refresh token expired');
        }

        // Get the user
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
          console.error('User not found:', payload.sub);
          throw new UnauthorizedException('User not found');
        }

        // Generate new tokens first
        const newTokens = this.generateTokens(user);
        console.log('New tokens generated');

        // Create new session
        const expiresAt = new Date();
        expiresAt.setSeconds(
          expiresAt.getSeconds() +
            parseInt(
              this.configService.get('jwt.refreshExpiresIn') || '604800',
              10,
            ),
        );

        await this.usersService.createSession({
          userId: user.id,
          token: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          expiresAt,
        });

        // Only revoke old session after new one is successfully created
        await this.usersService.revokeSession(session.id);
        console.log('Old session revoked after new session created');

        // Update user's last active timestamp
        await this.usersService.updateLastActive(user.id);

        return newTokens;
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError.message);
        throw new UnauthorizedException(
          `Invalid refresh token: ${jwtError.message}`,
        );
      }
    } catch (error) {
      console.error('Refresh token error:', error.message);
      throw new UnauthorizedException(
        `Invalid refresh token: ${error.message}`,
      );
    }
  }

  // Add diagnostic method for checking token status
  async checkTokenStatus(refreshToken: string): Promise<any> {
    try {
      // Attempt to decode the token without verification
      const decodedToken = this.jwtService.decode(refreshToken);

      // Get information about whether the token exists in the database
      const session =
        await this.usersService.findSessionByRefreshToken(refreshToken);

      // Get all sessions for the user
      let userSessions = [];
      if (
        decodedToken &&
        typeof decodedToken === 'object' &&
        'sub' in decodedToken
      ) {
        const userId = decodedToken.sub as string;
        userSessions = await this.usersService.findSessionsByUserId(userId);
      }

      return {
        tokenDecoded: decodedToken,
        tokenValid: session ? true : false,
        session: session
          ? {
              id: session.id,
              userId: session.userId,
              isRevoked: session.isRevoked,
              expiresAt: session.expiresAt,
              createdAt: session.createdAt,
              lastActive: session.lastActive,
            }
          : null,
        sessionCount: userSessions.length,
        activeSessions: userSessions.filter((s) => !s.isRevoked).length,
        revokedSessions: userSessions.filter((s) => s.isRevoked).length,
      };
    } catch (error) {
      return {
        error: error.message,
        tokenDecoded: null,
        tokenValid: false,
        session: null,
      };
    }
  }

  // Get diagnostic information about the user's session
  async getSessionInfo(user: any): Promise<any> {
    try {
      const userId = user.id;

      // Get all sessions for the user
      const userSessions = await this.usersService.findSessionsByUserId(userId);

      // Get the current user
      const userDetails = await this.usersService.findById(userId);

      return {
        user: {
          id: userDetails.id,
          email: userDetails.email,
          name: userDetails.name,
          role: userDetails.role,
          lastActive: userDetails.lastActive,
        },
        sessions: {
          total: userSessions.length,
          active: userSessions.filter((s) => !s.isRevoked).length,
          revoked: userSessions.filter((s) => s.isRevoked).length,
          sessionList: userSessions.map((s) => ({
            id: s.id,
            createdAt: s.createdAt,
            expiresAt: s.expiresAt,
            lastActive: s.lastActive,
            isRevoked: s.isRevoked,
          })),
        },
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  // Clean up expired or abandoned sessions
  async cleanupSessions(): Promise<any> {
    try {
      const result = await this.usersService.cleanupSessions();
      return {
        success: true,
        message: `Cleaned up ${result.removed} sessions`,
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async logout(token: string): Promise<void> {
    const session = await this.usersService.findSessionByToken(token);
    if (session) {
      await this.usersService.revokeSession(session.id);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.usersService.revokeAllUserSessions(userId);
  }

  async updateUserSettings(
    user: User,
    settings: UpdateUserSettingsDto,
  ): Promise<any> {
    const result: any = { updatedUser: null, updatedOrganization: null };

    // Update user settings if needed
    if (
      settings.name ||
      settings.avatar ||
      settings.onboardingCompleted !== undefined ||
      settings.onboardingCompletedAt !== undefined
    ) {
      // Create partial user update object
      const userUpdate: Record<string, any> = {};

      if (settings.name) {
        userUpdate.name = settings.name;
      }
      if (settings.avatar) {
        userUpdate.avatar = settings.avatar;
      }
      if (settings.onboardingCompleted !== undefined) {
        userUpdate.onboardingCompleted = settings.onboardingCompleted;
      }
      if (settings.onboardingCompletedAt !== undefined) {
        userUpdate.onboardingCompletedAt = settings.onboardingCompletedAt;
      }

      // Update the user directly - need to implement a proper method in UsersService
      // For now, fetch the user again to return something
      result.updatedUser = await this.usersService.findById(user.id);
    }

    // Extract organization settings
    if (settings.organizationSettings) {
      const updatedOrg =
        await this.organizationsService.updateOrganizationSettings(
          user.organizationId,
          settings.organizationSettings,
        );
      result.updatedOrganization = updatedOrg;
    }

    // Handle organization details updates
    if (settings.organizationName) {
      const orgUpdate: any = { name: settings.organizationName };

      // Check if we need to update the domain
      if (settings.customDomain) {
        orgUpdate.customDomain = settings.customDomain;
      }

      const updatedOrg = await this.organizationsService.updateOrganization(
        user.organizationId,
        orgUpdate,
      );

      result.updatedOrganization = updatedOrg;
    }

    return result;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private generateTokens(user: User): TokenPair {
    try {
      // Validate required user data
      if (!user.id || !user.email || !user.role || !user.organizationId) {
        this.logger.error('Invalid user data for token generation:', {
          userId: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        });
        throw new Error('Invalid user data for token generation');
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || [],
        organizationId: user.organizationId,
        tenantId: user.organizationId,
      };

      // Validate JWT secrets are configured
      const jwtSecret = this.configService.get('jwt.secret');
      const jwtRefreshSecret = this.configService.get('jwt.refreshSecret');
      
      if (!jwtSecret || !jwtRefreshSecret) {
        this.logger.error('JWT secrets not configured');
        throw new Error('JWT configuration error');
      }

      const accessToken = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: parseInt(this.configService.get('jwt.expiresIn') || '900', 10),
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: jwtRefreshSecret,
        expiresIn: parseInt(
          this.configService.get('jwt.refreshExpiresIn') || '604800',
          10,
        ),
      });

      this.logger.debug(`Generated tokens for user ${user.email}`);

      return {
        accessToken,
        refreshToken,
        expiresIn: parseInt(this.configService.get('jwt.expiresIn') || '900', 10),
      };
    } catch (error) {
      this.logger.error(`Token generation failed for user ${user.email}:`, error.message);
      throw error;
    }
  }
}
