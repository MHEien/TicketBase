import { redirect, createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { hashPassword } from '~/utils/hashPassword'
import { useMutation } from '~/hooks/useMutation'
import { Auth } from '~/components/Auth'
import { useAppSession } from '~/utils/session'
import { AuthControllerQuery } from '@repo/api-sdk'

export const signupFn = createServerFn({ method: 'POST' })
  .validator(
    (d: { email: string; password: string; redirectUrl?: string; name: string; organizationName: string }) => d,
  )
  .handler(async ({ data }) => {
    // Check if the user already exists
    const signupMutation = AuthControllerQuery.useRegisterMutation()

    // Encrypt the password using Sha256 into plaintext
    const password = await hashPassword(data.password)

    // Create a session
    const session = await useAppSession()

    const user = await signupMutation.mutateAsync({
      email: data.email,
      password: data.password,
      name: data.name,
      organizationName: data.organizationName,
      init: () => {},
      toJSON: () => ({}),
    })

      // Store the user's email in the session
      await session.update({
        userEmail: user.email,
      })

      // Redirect to the prev page stored in the "redirect" search param
      throw redirect({
        href: data.redirectUrl || '/',
      })
    })

export const Route = createFileRoute('/signup')({
  component: SignupComp,
})

function SignupComp() {
  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  })

  return (
    <Auth
      actionText="Sign Up"
      status={signupMutation.status}
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement)

        signupMutation.mutate({
          data: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            name: formData.get('name') as string,
            organizationName: formData.get('organizationName') as string,
          },
        })
      }}
      afterSubmit={
        signupMutation.data?.error ? (
          <>
            <div className="text-red-400">{signupMutation.data.message}</div>
          </>
        ) : null
      }
    />
  )
}
