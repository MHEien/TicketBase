import { SessionProvider } from "@/components/session-provider";
import { PluginSDKProvider } from "@/lib/plugin-sdk-context";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@ticketsmonorepo/api-sdk"

import appCss from "@/styles/app.css?url";
import { QueryClientProvider } from "@tanstack/react-query";

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
        <AuthProvider>
          <PluginSDKProvider> 
            {children}
            <Scripts />
          </PluginSDKProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
