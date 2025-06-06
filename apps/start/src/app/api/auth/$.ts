import { auth } from '@/lib/auth' // import your auth instance
import { createServerFileRoute } from '@tanstack/react-start/server'
 
// routes/hello.tsx

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    return auth.handler(request)
  },
  POST: async ({ request }) => {
    return auth.handler(request)
  },
})

