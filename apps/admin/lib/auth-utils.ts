import { auth } from "./auth"

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await auth()
  
  if (!session?.user?.permissions) {
    return false
  }
  
  return session.user.permissions.includes(permission)
}

/**
 * Check if a user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth()
  
  if (!session?.user?.role) {
    return false
  }
  
  return session.user.role === role
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
} 