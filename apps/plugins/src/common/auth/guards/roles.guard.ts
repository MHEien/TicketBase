import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // If no user or no role, deny access
    if (!user || !user.role) {
      throw new ForbiddenException('Role information missing');
    }

    // Check if user role matches any of the required roles
    // Also allow 'owner' role to access 'admin' endpoints since owners have admin privileges
    const userRole = user.role;
    const hasRequiredRole =
      requiredRoles.includes(userRole) ||
      (requiredRoles.includes('admin') && userRole === 'owner');

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access requires role: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
