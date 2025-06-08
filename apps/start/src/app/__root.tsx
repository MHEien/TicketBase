import { SessionProvider } from "@/components/session-provider";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@repo/api-sdk";
import { QueryProvider } from "@/components/query-provider";

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
        <AuthProvider
          baseUrl={process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}
        >
          <QueryProvider>
            <main>
              {children}
            </main>
            <Scripts />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
