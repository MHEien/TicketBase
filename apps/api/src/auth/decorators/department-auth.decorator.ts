import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { DepartmentGuard } from '../guards/department.guard';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export function DepartmentAuth(options?: {
  roles?: UserRole[];
  permissions?: string[];
}) {
  const decorators = [
    UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, DepartmentGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized or insufficient department permissions',
    }),
  ];

  if (options?.roles) {
    decorators.push(SetMetadata(ROLES_KEY, options.roles));
  }

  if (options?.permissions) {
    decorators.push(SetMetadata(PERMISSIONS_KEY, options.permissions));
  }

  return applyDecorators(...decorators);
}
