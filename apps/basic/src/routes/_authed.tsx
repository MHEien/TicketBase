import { createServerFn } from '@tanstack/react-start'
import { Login } from '~/components/Login'
import { useAppSession } from '~/utils/session'
import { hashPassword } from '~/utils/hashPassword'
import { AuthControllerClient, AuthControllerQuery } from '@repo/api-sdk'

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    // Find the user
    const userMutation = await AuthControllerClient.login({
      email: data.email,
      password: data.password,
      init: () => ({}),
      toJSON: () => ({}),
    })

    // Check if the user exists
    if (!userMutation.data) {
      return {
        error: true,
        userNotFound: true,
        message: 'User not found',
      }
    }

    // Create a session
    const session = await useAppSession()

    // Store the user's email in the session
    await session.update({
      userEmail: userMutation.data.email,
    })
  })

export const Route = createFileRoute({
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
