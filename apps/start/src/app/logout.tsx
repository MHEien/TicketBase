import { useAppSession } from '@/utils/session'
import { redirect, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const logoutFn = createServerFn().handler(async () => {
  const session = await useAppSession()
  session.clear()

  throw redirect({
    href: '/login',
  })
})

export const Route = createFileRoute('/logout')({
  preload: false,
  loader: () => logoutFn(),
})
