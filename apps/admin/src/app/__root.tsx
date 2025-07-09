import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SessionProvider } from "@/components/session-provider";
import { AuthErrorHandler } from "@/components/ui/auth-error-handler";
import { PluginSDKProvider } from "@/lib/plugin-sdk-context";
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
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SessionProvider>
          <PluginSDKProvider>
            <AuthErrorHandler />
            <Outlet />
          </PluginSDKProvider>
        </SessionProvider>
        <Scripts />
      </body>
    </html>
  );
}
