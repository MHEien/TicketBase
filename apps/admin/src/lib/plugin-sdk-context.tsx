"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/components/session-provider";
import { useRouter } from "@tanstack/react-router";
import { useToast } from "@/components/ui/use-toast";
import "@/types/plugins"; // Import global types

// Import your UI components that plugins can use
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Plugin SDK Interface
export interface PluginSDK {
  // Authentication context
  auth: {
    session: any;
    token?: string;
    user?: any;
    isAuthenticated: boolean;
  };

  // Pre-configured API client with authentication
  api: {
    get: (url: string) => Promise<Response>;
    post: (url: string, data: any) => Promise<Response>;
    put: (url: string, data: any) => Promise<Response>;
    delete: (url: string) => Promise<Response>;
    // Plugin-specific endpoints
    saveConfig: (pluginId: string, config: any) => Promise<any>;
    loadConfig: (pluginId: string) => Promise<any>;
    getPlugin: (pluginId: string) => Promise<any>;
  };

  // Environment variables (client-safe only)
  env: {
    API_URL?: string;
    APP_NAME?: string;
    NODE_ENV?: string;
    [key: string]: string | undefined;
  };

  // Navigation utilities
  navigation: {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
  };

  // UI components that plugins can use
  components: {
    Button: typeof Button;
    Input: typeof Input;
    Card: typeof Card;
    CardContent: typeof CardContent;
    CardDescription: typeof CardDescription;
    CardHeader: typeof CardHeader;
    CardTitle: typeof CardTitle;
    Label: typeof Label;
    Switch: typeof Switch;
    Separator: typeof Separator;
    Alert: typeof Alert;
    AlertDescription: typeof AlertDescription;
    AlertTitle: typeof AlertTitle;
    Badge: typeof Badge;
  };

  // Utility functions
  utils: {
    toast: (options: any) => void;
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: Date | string) => string;
  };

  // Plugin lifecycle hooks
  hooks: {
    useState: typeof React.useState;
    useEffect: typeof React.useEffect;
    useCallback: typeof React.useCallback;
    useMemo: typeof React.useMemo;
    useContext: typeof React.useContext;
    useReducer: typeof React.useReducer;
    useRef: typeof React.useRef;
  };
}

// Create the context
const PluginSDKContext = createContext<PluginSDK | null>(null);

// Plugin SDK Provider Component
export const PluginSDKProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Create authenticated API client
  const createApiClient = () => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

    const request = async (method: string, url: string, data?: any) => {
      const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken && {
            Authorization: `Bearer ${session.accessToken}`,
          }),
        },
      };

      if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(fullUrl, options);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return response;
    };

    return {
      get: (url: string) => request("GET", url),
      post: (url: string, data: any) => request("POST", url, data),
      put: (url: string, data: any) => request("PUT", url, data),
      delete: (url: string) => request("DELETE", url),

      // Plugin-specific endpoints
      saveConfig: async (pluginId: string, config: any) => {
        const response = await request(
          "POST",
          `/api/plugins/${pluginId}/config`,
          config,
        );
        return response.json();
      },

      loadConfig: async (pluginId: string) => {
        const response = await request(
          "GET",
          `/api/plugins/${pluginId}/config`,
        );
        return response.json();
      },

      getPlugin: async (pluginId: string) => {
        const response = await request("GET", `/api/plugins/${pluginId}`);
        return response.json();
      },
    };
  };

  // Utility functions
  const utils = {
    toast: ({
      title,
      description,
      variant,
    }: {
      title: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      toast({ title, description, variant });
    },

    formatCurrency: (amount: number, currency: string = "USD") => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(amount);
    },

    formatDate: (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  };

  // Plugin SDK object
  const pluginSDK: PluginSDK = React.useMemo(
    () => ({
      auth: {
        session,
        token: session?.accessToken,
        user: session?.user,
        isAuthenticated: status === "authenticated",
      },

      api: createApiClient(),

      env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL,
        APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NODE_ENV: process.env.NODE_ENV,
      },

      navigation: {
        push: (url: string) => router.navigate({ to: url }),
        replace: (url: string) => router.navigate({ to: url, replace: true }),
        back: () => router.history.back(),
      },

      components: {
        Button,
        Input,
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
        Label,
        Switch,
        Separator,
        Alert,
        AlertDescription,
        AlertTitle,
        Badge,
      },

      utils,

      hooks: {
        useState: React.useState,
        useEffect: React.useEffect,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useContext: React.useContext,
        useReducer: React.useReducer,
        useRef: React.useRef,
      },
    }),
    [session, status, router, toast],
  );

  // Make SDK and React globally available for plugins
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("🔧 Setting up global React and PluginSDK...");

      // CRITICAL: Validate React first
      if (!React || !React.useState || !React.useEffect) {
        console.error("❌ React or React hooks not available in provider");
        return;
      }

      // Create a robust React instance with thorough validation
      const ReactWithHooks = {
        // Copy all React properties first
        ...React,

        // Explicitly set essential hooks with validation
        useState: React.useState,
        useEffect: React.useEffect,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useContext: React.useContext,
        useReducer: React.useReducer,
        useRef: React.useRef,

        // Essential React functions
        createElement: React.createElement,
        Fragment: React.Fragment,
        Component: React.Component,
        PureComponent: React.PureComponent,
      };

      // Validate each hook individually
      const hooks = [
        "useState",
        "useEffect",
        "useCallback",
        "useMemo",
        "useContext",
        "useReducer",
        "useRef",
      ];
      const missingHooks = hooks.filter(
        (hook) =>
          typeof ReactWithHooks[hook as keyof typeof ReactWithHooks] !==
          "function",
      );

      if (missingHooks.length > 0) {
        console.error("❌ Missing React hooks:", missingHooks);
        console.error("Available React properties:", Object.keys(React));
        return;
      }

      console.log("✅ All React hooks validated successfully");
      console.log(
        "React hook types:",
        hooks.map(
          (hook) =>
            `${hook}: ${typeof ReactWithHooks[hook as keyof typeof ReactWithHooks]}`,
        ),
      );

      // Make React available globally with comprehensive validation
      (window as any).React = ReactWithHooks;
      window.PluginSDK = pluginSDK;

      // Final validation that global React is working
      try {
        const testState = (window as any).React.useState;
        if (typeof testState !== "function") {
          throw new Error("Global React.useState is not a function");
        }
        console.log("✅ Global React validation passed");
      } catch (error) {
        console.error("❌ Global React validation failed:", error);
      }

      // Validate that React hooks are properly available globally
      const globalReact = (window as any).React;
      if (!globalReact || !globalReact.useState || !globalReact.useEffect) {
        console.error(
          "❌ React hooks not properly available in global scope after assignment",
        );
        console.error("Global React:", globalReact);
        console.error(
          "Global React keys:",
          globalReact ? Object.keys(globalReact) : "React is null",
        );
      } else {
        console.log("✅ React and hooks are properly available globally");
        console.log("Global React hook validation:", {
          useState: typeof globalReact.useState,
          useEffect: typeof globalReact.useEffect,
          useCallback: typeof globalReact.useCallback,
          useMemo: typeof globalReact.useMemo,
        });
      }

      // Create a plugin registry if it doesn't exist
      if (!(window as any).__PLUGIN_REGISTRY) {
        (window as any).__PLUGIN_REGISTRY = {
          registered: {},
          register: (pluginId: string, exports: any) => {
            (window as any).__PLUGIN_REGISTRY.registered[pluginId] = exports;
            console.log(`Plugin ${pluginId} registered successfully`);
            return exports;
          },
          get: (pluginId: string) => {
            return (window as any).__PLUGIN_REGISTRY.registered[pluginId];
          },
        };
        console.log("✅ Plugin registry created");
      }

      // Additional debugging for plugin development
      console.log("🔧 Plugin development environment ready:", {
        hasReact: !!(window as any).React,
        hasPluginSDK: !!window.PluginSDK,
        hasRegistry: !!(window as any).__PLUGIN_REGISTRY,
        reactHooksAvailable: !!(window as any).React?.useState,
      });
    }
  }, [pluginSDK]);

  return (
    <PluginSDKContext.Provider value={pluginSDK}>
      {children}
    </PluginSDKContext.Provider>
  );
};

// Hook to use Plugin SDK (for internal components)
export const usePluginSDK = (): PluginSDK => {
  const context = useContext(PluginSDKContext);
  if (!context) {
    throw new Error("usePluginSDK must be used within a PluginSDKProvider");
  }
  return context;
};

// Global type declarations - keeping consistent with plugin-loader.ts
declare global {
  interface Window {
    PluginSDK: PluginSDK;
    ReactDOM?: any;
    React: typeof React;
    __PLUGIN_REGISTRY: {
      registered: Record<string, any>;
      register: (pluginId: string, exports: any) => any;
      get: (pluginId: string) => any;
    };
  }
}

export default PluginSDKProvider;
