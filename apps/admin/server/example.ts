import { createServerFn } from '@tanstack/react-start'
import { createRoleMiddleware, createPermissionMiddleware, validatedAuthMiddleware } from '../middleware/auth'

// Example protected function that requires admin role
export const adminOnlyFunction = createServerFn()
  .middleware([createRoleMiddleware('admin')])
  .handler(async ({ context }) => {
    // This will only execute if the user has admin role
    return {
      message: `Hello admin ${context.user.id}!`,
    }
  })

// Example function that requires specific permission
export const manageUsersFunction = createServerFn()
  .middleware([createPermissionMiddleware('manage_users')])
  .handler(async ({ context }) => {
    // This will only execute if the user has the manage_users permission
    return {
      message: 'User management operation successful',
    }
  })

// Example function with validated input
export const userActionFunction = createServerFn()
  .middleware([validatedAuthMiddleware])
  .handler(async ({ data, context }) => {
    // data is typed and validated by Zod
    return {
      message: `${context.user.id} performed ${data.action} on ${data.userId}`,
    }
  }) 