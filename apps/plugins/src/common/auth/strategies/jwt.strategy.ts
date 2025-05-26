import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TenantContext } from '../../middleware/tenant-context.middleware';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  name?: string;
  tenantId?: string;
  organizationId?: string; // Support both field names
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug('🔐 JWT Validation - Payload received:', {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      tenantId: payload.tenantId,
      organizationId: payload.organizationId,
      role: payload.role,
      iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : undefined,
      exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : undefined,
    });

    if (!payload.sub) {
      this.logger.error('❌ JWT Validation failed: Missing user ID (sub)');
      throw new UnauthorizedException('Invalid token payload');
    }

    // Use tenantId if available, otherwise fall back to organizationId
    const tenantId = payload.tenantId || payload.organizationId;
    
    if (!tenantId) {
      this.logger.warn('⚠️ JWT Validation: No tenantId or organizationId found in token');
    } else {
      this.logger.debug('✅ JWT Validation: Using tenant ID:', tenantId);
      // Set the tenant context
      TenantContext.setCurrentTenant(tenantId);
    }

    const user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      tenantId: tenantId,
      role: payload.role || 'user',
    };

    this.logger.debug('✅ JWT Validation successful - User:', {
      userId: user.userId,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    });

    // Return user information that will be attached to the request
    return user;
  }
}
