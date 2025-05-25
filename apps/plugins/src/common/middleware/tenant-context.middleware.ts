import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

// Extend Express Request type to include user property
interface RequestWithUser extends Request {
  user?: any;
}

/**
 * A simple tenant context class to store and retrieve tenant information
 * throughout a request lifecycle.
 */
export class TenantContext {
  private static tenantIdStorage = new AsyncLocalStorage<string>();

  static setCurrentTenant(tenantId: string): void {
    this.tenantIdStorage.enterWith(tenantId);
  }

  static getCurrentTenant(): string | undefined {
    return this.tenantIdStorage.getStore();
  }

  static clear(): void {
    // AsyncLocalStorage doesn't have a direct "clear" method
    // We'll set to undefined to effectively clear it
    this.tenantIdStorage.enterWith(undefined);
  }
}

/**
 * Middleware to extract tenant ID from request headers and make it available
 * in the TenantContext for the duration of the request.
 * 
 * Tenant ID can come from:
 * 1. x-tenant-id header (legacy)
 * 2. JWT token in the authorization header (preferred)
 * 3. req.user if set by Passport
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: RequestWithUser, res: Response, next: NextFunction) {
    let tenantId: string | undefined;
    
    // Try to get tenant ID from the user object (set by JwtStrategy)
    if (req.user && 'tenantId' in req.user) {
      tenantId = req.user['tenantId'] as string;
    }
    
    // If not found, try the x-tenant-id header
    if (!tenantId) {
      const headerTenantId = req.headers['x-tenant-id'];
      if (headerTenantId && typeof headerTenantId === 'string') {
        tenantId = headerTenantId;
      }
    }
    
    // Set the tenant ID in the context if found
    if (tenantId) {
      TenantContext.setCurrentTenant(tenantId);
      
      // Clear the context when the response finishes
      res.on('finish', () => {
        TenantContext.clear();
      });
    }
    
    next();
  }
} 