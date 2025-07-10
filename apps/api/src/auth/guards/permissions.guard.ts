import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Get required permissions from metadata
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // Get required roles from metadata
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    // If no permissions or roles are required, allow access
    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    // Check roles first (roles can override permission requirements)
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role);

      // Owners always have access unless explicitly restricted
      if (user.role === UserRole.OWNER) {
        return true;
      }

      if (!hasRole) {
        throw new ForbiddenException(
          `Access denied. Required roles: ${requiredRoles.join(', ')}`,
        );
      }
    }

    // Check individual permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = user.permissions || [];

      // Check if user has wildcard permission (full access)
      if (userPermissions.includes('*')) {
        return true;
      }

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasAllPermissions) {
        const missingPermissions = requiredPermissions.filter(
          (permission) => !userPermissions.includes(permission),
        );

        throw new ForbiddenException(
          `Access denied. Missing permissions: ${missingPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }
}
