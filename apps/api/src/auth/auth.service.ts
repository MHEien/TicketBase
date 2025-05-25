import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
  iat?: number;
  exp?: number;
}

export interface TokenPair {
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
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private organizationsService: OrganizationsService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    return this.usersService.validateUser(email, password);
  }

  async login(user: User): Promise<TokenPair> {
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

    return tokens;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    // Check if the user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
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

        // Check if token is in the database
        const session =
          await this.usersService.findSessionByRefreshToken(refreshToken);

        if (!session) {
          console.error('Session not found for token');
          throw new UnauthorizedException(
            'Invalid refresh token - session not found',
          );
        }

        if (session.isRevoked) {
          console.error('Session was revoked for token');
          throw new UnauthorizedException('Refresh token has been revoked');
        }

        if (session.expiresAt < new Date()) {
          console.error('Session expired at', session.expiresAt);
          await this.usersService.revokeSession(session.id);
          throw new UnauthorizedException('Refresh token expired');
        }

        // Get the user
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
          console.error('User not found:', payload.sub);
          throw new UnauthorizedException('User not found');
        }

        // Invalidate old session
        await this.usersService.revokeSession(session.id);
        console.log('Old session revoked, generating new tokens');

        // Generate new tokens and session
        return this.login(user);
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
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      organizationId: user.organizationId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: parseInt(this.configService.get('jwt.expiresIn') || '900', 10),
    };
  }
}
