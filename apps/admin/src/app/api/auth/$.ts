import { auth } from '@/lib/auth';
import { createServerFileRoute } from '@tanstack/react-start/server';

export const Route = createServerFileRoute('/api/auth/$').methods({
  GET: ({ request }: { request: Request }) => {
    return auth.handler(request);
  },
  POST: ({ request }: { request: Request }) => {
    return auth.handler(request);
  },
}); 