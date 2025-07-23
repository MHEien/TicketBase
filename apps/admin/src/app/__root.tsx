import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "@/components/session-provider";
import { AuthErrorHandler } from "@/components/ui/auth-error-handler";
import { PluginSDKProvider } from "@/lib/plugin-sdk-context";
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
    scripts: [
      {
        type: "importmap",
        children: JSON.stringify({
          imports: {
            react:
              "data:text/javascript;base64=" +
              btoa(`
              export default window.React;
              export const useState = window.React.useState;
              export const useEffect = window.React.useEffect;
              export const useCallback = window.React.useCallback;
              export const createElement = window.React.createElement;
            `),
            "react-dom":
              "data:text/javascript;base64=" +
              btoa(`
              export default window.ReactDOM;
              export const render = window.ReactDOM.render;
              export const createRoot = window.ReactDOM.createRoot;
            `),
            "react/jsx-runtime":
              "data:text/javascript;base64=" +
              btoa(`
              export const jsx = window.React.createElement;
              export const jsxs = window.React.createElement;
              export const Fragment = window.React.Fragment;
            `),
            "react/jsx-dev-runtime":
              "data:text/javascript;base64=" +
              btoa(`
              export const jsxDEV = (type, props, key, isStaticChildren, source, self) => {
                return window.React.createElement(type, { key, ...props });
              };
              export const Fragment = window.React.Fragment;
            `),
          },
        }),
      },
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
            <PluginSDKProvider>
              <DateRangeProvider>
                <AuthErrorHandler />
                <Outlet />
              </DateRangeProvider>
            </PluginSDKProvider>
          </SessionProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
