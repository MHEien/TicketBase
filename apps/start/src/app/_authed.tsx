
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Login } from '@/components/login'
import { authControllerLogin } from '@repo/api-sdk'
import { useAppSession } from '@/utils/session';

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {


    try {
      // Use the API SDK login function
      const login = await authControllerLogin({
        email: data.email,
        password: data.password,
    })


    // Create a session
    const session = await useAppSession()

    // Store the user's email in the session
    await session.update({
      userEmail: login.email,
    })
  } catch (error) {
    console.error(error)
  }
})

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <Login />
    }

    throw error
  },
})
