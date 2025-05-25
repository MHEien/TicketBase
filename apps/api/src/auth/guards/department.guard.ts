import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class DepartmentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const departmentId =
      request.params.id ||
      request.query.departmentId ||
      request.body.departmentId;

    // If there's no department ID in the request, we can't validate access
    if (!departmentId) {
      throw new UnauthorizedException('Department ID is required');
    }

    // Organization owners and admins have access to all departments in their organization
    if (user.role === UserRole.OWNER || user.role === UserRole.ADMIN) {
      return true;
    }

    // For managers and other roles, check if they belong to the specified department
    // or if they have a specific permission like 'departments.access.all'
    const hasDepartmentAccess =
      user.departmentId === departmentId ||
      (user.permissions && user.permissions.includes('departments.access.all'));

    if (!hasDepartmentAccess) {
      throw new UnauthorizedException(
        'You do not have access to this department',
      );
    }

    return true;
  }
}
