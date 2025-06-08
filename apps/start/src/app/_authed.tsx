
import { createServerFn } from '@tanstack/react-start'
import { Login } from '@/components/login'
import { login } from '@repo/api-sdk'

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {


    try {
      // Use the API SDK login function
      await login({
        email: data.email,
        password: data.password,
      })

      return {
        success: true
      }
    } catch (error: any) {
      return {
        error: true,
        message: error.message || 'Authentication failed'
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
