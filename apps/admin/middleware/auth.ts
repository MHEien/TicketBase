import { createMiddleware } from '@tanstack/react-start'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import { API_CONFIG, getApiUrl } from '../config/api'

// Context type for auth data
interface AuthContext {
  user: {
    id: string
    role: string
    permissions: string[]
  }
  accessToken: string
}

// Create auth middleware
export const authMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    // Get auth token from localStorage or your preferred storage
    const token = localStorage.getItem('auth_token')
    
    return next({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      sendContext: {
        accessToken: token || '',
      },
    })
  })
  .server(async ({ next, context }) => {
    // Validate the access token
    if (!context.accessToken) {
      throw new Error('Unauthorized: No access token provided')
    }

    try {
      // Verify token and get user data
      const response = await fetch(getApiUrl(API_CONFIG.auth.verify), {
        headers: {
          Authorization: `Bearer ${context.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Invalid or expired token')
      }

      const userData = await response.json()

      // Continue with the validated user context
      return next({
        context: {
          user: {
            id: userData.id,
            role: userData.role,
            permissions: userData.permissions,
          },
          accessToken: context.accessToken,
        },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Authentication failed: ${errorMessage}`)
    }
  })

// Role-based middleware factory
export const createRoleMiddleware = (requiredRole: string) => {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      if (context.user.role !== requiredRole) {
        throw new Error(`Unauthorized: Required role "${requiredRole}"`)
      }
      return next()
    })
}

// Permission-based middleware factory
export const createPermissionMiddleware = (requiredPermission: string) => {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      if (!context.user.permissions.includes(requiredPermission)) {
        throw new Error(`Unauthorized: Required permission "${requiredPermission}"`)
      }
      return next()
    })
}

// Example of a validated auth middleware with Zod
export const validatedAuthMiddleware = createMiddleware({ type: 'function', validateClient: true })
  .middleware([authMiddleware])
  .validator(
    zodValidator(
      z.object({
        userId: z.string(),
        action: z.enum(['read', 'write', 'delete']),
      })
    )
  )
  .server(async ({ next, data, context }) => {
    // Additional validation logic here
    console.log(`User ${context.user.id} attempting ${data.action} on ${data.userId}`)
    return next()
  }) 