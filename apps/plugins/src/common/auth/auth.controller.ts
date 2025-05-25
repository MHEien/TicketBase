import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint to validate authentication and get user info
   * Can be used by the client to check if the token is valid
   */
  @Get('me')
  async getUserInfo(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const tokenInfo = await this.authService.validateToken(token);

    if (!tokenInfo.isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: tokenInfo.userId,
      email: tokenInfo.email,
      name: tokenInfo.name,
      tenantId: tokenInfo.tenantId,
      role: tokenInfo.role,
    };
  }
} 