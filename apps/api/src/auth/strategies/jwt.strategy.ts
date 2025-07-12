import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    
    // Enhanced token validation
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    // Check token expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException('Token expired');
    }

    // Check if token was issued in the future (clock skew protection)
    if (payload.iat && payload.iat > Date.now() / 1000 + 300) { // 5 minutes tolerance
      throw new UnauthorizedException('Invalid token timestamp');
    }

    // Validate session
    const session = await this.usersService.findSessionByToken(token);
    if (!session || session.isRevoked) {
      throw new UnauthorizedException('Session has been revoked');
    }

    // Validate user exists and is active
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is still active/enabled
    if (user.status && user.status !== 'active') {
      throw new UnauthorizedException('User account is disabled');
    }

    // Update session's last active time
    await this.usersService.updateLastActive(user.id);

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      permissions: payload.permissions,
      organizationId: payload.organizationId,
      sessionId: session.id,
    };
  }
}
