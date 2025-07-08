import { createServerFn } from '@tanstack/react-start'
import { Login } from '@/components/login'
import { authControllerLogin } from '@repo/api-sdk'
import { useAppSession } from '@/utils/session';

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    try {
      console.log('loginFn', data)
      // Use the API SDK login function
      const response = await authControllerLogin({
        email: data.email,
        password: data.password,
      })

      const user = response.data;
      const session = await useAppSession()
      
      // Store complete user info and tokens in session
      session.update({
        userEmail: user.email,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        organizationId: user.organizationId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        permissions: user.permissions,
        expiresIn: user.expiresIn
      })

      return {
        success: true,
        user: user
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        error: true,
        message: error.response?.data?.message || error.message || 'Authentication failed'
      }
    }
  })

export const Route = createFileRoute({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <Login search={{}} />
    }

    throw error
  },
})
