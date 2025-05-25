import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (request) => {
        // Try to extract from body first
        let token = request.body?.refreshToken;

        // If not in body, try Authorization header
        if (!token && request.headers.authorization) {
          const authHeader = request.headers.authorization;
          if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
          }
        }

        if (!token) {
          this.logger.error('No refresh token found in request');
        } else {
          this.logger.log('Found refresh token in request');
        }

        return token as string | undefined;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    try {
      const refreshToken =
        request.body?.refreshToken ||
        (request.headers.authorization?.startsWith('Bearer ')
          ? request.headers.authorization.substring(7)
          : null);

      if (!refreshToken) {
        this.logger.error('No refresh token in validate method');
        throw new UnauthorizedException('No refresh token provided');
      }

      this.logger.log(`Validating refresh token for user: ${payload.sub}`);

      const session =
        await this.usersService.findSessionByRefreshToken(refreshToken);

      if (!session) {
        this.logger.error(`Session not found for token`);
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (session.isRevoked) {
        this.logger.error(`Session is revoked`);
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (session.expiresAt < new Date()) {
        this.logger.error(
          `Session expired at ${session.expiresAt.toISOString()}`,
        );
        await this.usersService.revokeSession(session.id);
        throw new UnauthorizedException('Refresh token expired');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        this.logger.error(`User not found: ${payload.sub}`);
        throw new UnauthorizedException();
      }

      this.logger.log(`Token validated for user: ${user.id}`);

      return {
        id: payload.sub,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(`Validation error: ${error.message}`);
      throw error;
    }
  }
}
