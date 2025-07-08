// @ts-ignore - Temporary until we fix type definitions
import { useAuth as useApiAuth } from '@repo/api-sdk/client'

// TanStack Router expects this specific interface
export interface AuthContext {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  user: any | null // Using any for now since we don't have types
}

export function useAuth(): AuthContext {
  const apiAuth = useApiAuth()
  
  return {
    isAuthenticated: apiAuth.isAuthenticated,
    login: apiAuth.login,
    logout: apiAuth.logout,
    user: apiAuth.user,
  }
}
