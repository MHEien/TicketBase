import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class NextAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Handle session endpoint for NextAuth
    if (req.path === '/api/auth/session') {
      try {
        const authCookie =
          req.cookies['next-auth.session-token'] ||
          req.cookies['__Secure-next-auth.session-token'];

        if (!authCookie) {
          return res.json({ user: null });
        }

        // Verify JWT using NextAuth secret
        const payload = await this.jwtService.verifyAsync(authCookie, {
          secret: this.configService.get('nextAuth.secret'),
        });

        // Find or create user in our database
        let user = await this.usersService.findByEmail(payload.email);

        if (!user) {
          // Create user based on NextAuth data
          user = await this.usersService.createUser({
            email: payload.email,
            name: payload.name,
            // Generate a secure random password as user authenticated via NextAuth
            password: Math.random().toString(36).substring(2),
            organizationId: payload.organizationId || 'default',
            permissions: [],
          });
        }

        return res.json({ user: payload });
      } catch (error) {
        return res.json({ user: null });
      }
    }

    next();
  }
}
