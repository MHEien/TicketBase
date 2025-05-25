import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class OrganizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId =
      request.query.organizationId || request.body.organizationId;

    // If there's no organization ID in the request, we can't validate access
    if (!organizationId) {
      throw new UnauthorizedException('Organization ID is required');
    }

    // Check if the user has access to the requested organization
    const hasAccess =
      user.organizationId === organizationId ||
      (user.organizations && user.organizations.includes(organizationId));

    if (!hasAccess) {
      throw new UnauthorizedException(
        'You do not have access to this organization',
      );
    }

    return true;
  }
}
