// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  auth: {
    verify: '/auth/verify',
    refresh: '/auth/refresh',
    login: '/auth/login',
    logout: '/auth/logout',
  },
} as const

// Helper to get full API URL
export const getApiUrl = (path: string) => {
  return `${API_CONFIG.baseUrl}${path}`
} 