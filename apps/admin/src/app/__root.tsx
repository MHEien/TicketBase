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
      {
        type: "importmap",
        children: JSON.stringify({
          imports: {
            "react": "data:text/javascript,export default window.__pluginModules.react;const React=window.__pluginModules.react;export const {useState,useEffect,useLayoutEffect,useCallback,useMemo,useReducer,useRef,useImperativeHandle,useDebugValue,useDeferredValue,useTransition,useId,useSyncExternalStore,useInsertionEffect,createContext,useContext,createElement,Fragment,forwardRef,memo,lazy,Suspense,startTransition,Component,PureComponent,createRef,Children,cloneElement,isValidElement,StrictMode,Profiler}=React;",
            "react-dom": "data:text/javascript,export default window.__pluginModules['react-dom'];",
            "react/jsx-runtime": "data:text/javascript,const React=window.__pluginModules.react;export const jsx=React.createElement;export const jsxs=React.createElement;export const Fragment=React.Fragment;",
            "react/jsx-dev-runtime": "data:text/javascript,const React=window.__pluginModules.react;export const jsxDEV=(type,props,key)=>React.createElement(type,{key,...props});export const Fragment=React.Fragment;",
            "ticketsplatform-plugin-sdk": "data:text/javascript,export const usePlatformSDK=()=>{if(!window.PluginSDK){console.error('PluginSDK not available. Make sure PluginSDKProvider is properly set up.');return null;}return window.PluginSDK;};export const usePluginConfig=(pluginId)=>{const sdk=window.PluginSDK;if(!sdk){throw new Error('PluginSDK not available');}const [config,setConfig]=window.React.useState(null);const [loading,setLoading]=window.React.useState(true);const [error,setError]=window.React.useState(null);window.React.useEffect(()=>{sdk.api.loadConfig(pluginId).then(setConfig).catch(setError).finally(()=>setLoading(false));},[pluginId]);const saveConfig=window.React.useCallback(async(newConfig)=>{try{await sdk.api.saveConfig(pluginId,newConfig);setConfig(newConfig);}catch(err){setError(err);throw err;}},[pluginId]);return{config,loading,error,saveConfig};};export const definePlugin=(def)=>def;export const createPuckWidget=(def)=>def;export const createExtensionPoint=(comp)=>comp;export const registerPuckComponents=()=>{};export default {usePlatformSDK,usePluginConfig,definePlugin,createPuckWidget,createExtensionPoint,registerPuckComponents};"
          }
        })
      }
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
