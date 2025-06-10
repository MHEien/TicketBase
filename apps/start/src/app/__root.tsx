import { SessionProvider } from "@/components/session-provider";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAppSession } from "@/utils/session";

import appCss from "@/styles/app.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "TanStack Start Starter" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  beforeLoad: async () => {
    const user = await useAppSession()
    return { user }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
              <AuthProvider>
                {children}
              </AuthProvider>
            <TanStackRouterDevtools position="bottom-right" />
            <Scripts />
      </body>
    </html>
  );
}
