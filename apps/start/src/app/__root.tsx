
import { SessionProvider } from "@/components/session-provider";
import { PluginSDKProvider } from "@/lib/plugin-sdk-context";
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
  } from "@tanstack/react-router"
  
  import appCss from "@/styles/app.css?url"

export const Route = createRootRoute({
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { title: "TanStack Start Starter" }
      ],
      link: [
        { rel: "stylesheet", href: appCss },
      ],
    }),
    component: RootComponent,
  })

  function RootComponent() {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    )
  }

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <head>
            <HeadContent />
        </head>
      <body>
        <SessionProvider>
          <PluginSDKProvider>
            {children}
            <Scripts />
          </PluginSDKProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
