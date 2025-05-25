import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validates a JWT token from Next Auth and returns user information
   */
  async validateToken(token: string): Promise<any> {
    try {
      // Verify the token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
        tenantId: payload.tenantId,
        role: payload.role,
        isValid: true,
      };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  /**
   * Gets tenant info from the user's token
   */
  extractTenantFromToken(token: string): string | null {
    try {
      const payload = this.jwtService.decode(token);
      if (payload && typeof payload === 'object' && 'tenantId' in payload) {
        return payload.tenantId as string;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
