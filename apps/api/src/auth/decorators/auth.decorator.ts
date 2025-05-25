import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

export function Auth(options?: { roles?: UserRole[]; permissions?: string[] }) {
  const decorators = [
    UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  ];

  if (options?.roles) {
    decorators.push(Roles(...options.roles));
  }

  if (options?.permissions) {
    decorators.push(Permissions(...options.permissions));
  }

  return applyDecorators(...decorators);
} 