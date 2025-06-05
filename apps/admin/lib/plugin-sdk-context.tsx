"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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
  const pluginSDK: PluginSDK = {
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
      push: router.push,
      replace: router.replace,
      back: router.back,
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
    },
  };

  // Make SDK globally available for plugins
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.PluginSDK = pluginSDK;
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

// Global type declarations
declare global {
  interface Window {
    PluginSDK: PluginSDK;
  }
}

export default PluginSDKProvider;
