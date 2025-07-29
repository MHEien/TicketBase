import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, User } from "@/components/session-provider";
import { AuthErrorHandler } from "@/components/ui/auth-error-handler";
import { PluginSDKProvider } from "@/lib/plugin-sdk-context";
import { ModuleFederationPluginManagerProvider } from "@/lib/module-federation-plugin-manager";
import { ModuleFederationPuckRegistryProvider } from "@/lib/module-federation-puck-registry";
import { DynamicPluginLoader, PluginLoadingStatus } from "@/components/plugin-system/dynamic-plugin-loader";
import { DateRangeProvider } from "@/hooks/use-date-range";
import appCss from "@/styles/app.css?url";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: User;
}>()({
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
    scripts: [
      // Module Federation initialization will be handled by Vite plugin
    ],
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
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ModuleFederationPluginManagerProvider>
              <ModuleFederationPuckRegistryProvider>
                <DynamicPluginLoader autoLoad={true}>
                  <PluginSDKProvider>
                    <DateRangeProvider>
                      <AuthErrorHandler />
                      <Outlet />
                      <PluginLoadingStatus />
                    </DateRangeProvider>
                  </PluginSDKProvider>
                </DynamicPluginLoader>
              </ModuleFederationPuckRegistryProvider>
            </ModuleFederationPluginManagerProvider>
          </SessionProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
