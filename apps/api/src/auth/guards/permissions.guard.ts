import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user, params, query, body } = context.switchToHttp().getRequest();

    // Organization owners always have all permissions
    if (user.role === UserRole.OWNER) {
      return true;
    }

    // Department-scoped permission check
    const departmentId =
      params.departmentId || query.departmentId || body.departmentId;

    // Check if the permission is required at the department level
    const isDepartmentPermission = requiredPermissions.some((p) =>
      p.startsWith('department.'),
    );

    if (isDepartmentPermission) {
      // If it's a department permission and no department is specified, deny access
      if (!departmentId) {
        return false;
      }

      // If the user doesn't belong to the specified department and is not an admin, deny access
      if (user.departmentId !== departmentId && user.role !== UserRole.ADMIN) {
        return false;
      }
    }

    // Check that the user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) => {
      // Check for the exact permission
      if (user.permissions.includes(permission)) {
        return true;
      }

      // Check for wildcard permissions
      const wildcardPermission =
        permission.split('.').slice(0, -1).join('.') + '.*';
      if (user.permissions.includes(wildcardPermission)) {
        return true;
      }

      // Check for global admin permission
      if (
        user.permissions.includes('*') ||
        (user.role === UserRole.ADMIN && user.permissions.includes('admin.*'))
      ) {
        return true;
      }

      return false;
    });

    return hasAllPermissions;
  }
}
