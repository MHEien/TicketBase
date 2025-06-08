import { SessionProvider } from "@/components/session-provider";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider, getUser } from "@repo/api-sdk";
import { QueryProvider } from "@/components/query-provider";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import appCss from "@/styles/app.css?url";

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
    const user = await getUser()
    return { user }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
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
    <QueryProvider>
            <main>
              {children}
            <TanStackRouterDevtools position="bottom-right" />
            <Scripts />
            </main>

            </QueryProvider>
      </body>
    </html>
  );
}
