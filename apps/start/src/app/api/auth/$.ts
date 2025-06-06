import { auth } from '@/lib/auth' // import your auth instance
 
// routes/hello.tsx

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    return auth.handler(request)
  },
  POST: async ({ request }) => {
    return auth.handler(request)
  },
})

