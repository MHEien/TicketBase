"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  loadPluginWithContext,
  getPluginLoadingState,
} from "@/lib/context-aware-plugin-loader";
import { pluginRegistry } from "@/lib/plugin-registry";
import { InstalledPlugin } from "@/lib/plugin-types";
import "@/types/plugins"; // Import global types

export interface ExtensionPointProps {
  name: string;
  context?: Record<string, any>;
  fallback?: React.ReactNode;
}

/**
 * A component that renders an extension point where plugins can inject content
 * Enhanced with better error handling and React hooks validation
 */
export function ExtensionPoint({
  name,
  context = {},
  fallback = null,
}: ExtensionPointProps) {
  const [extensions, setExtensions] = useState<
    {
      id: string;
      component: React.ComponentType<any>;
      plugin: InstalledPlugin;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reactReady, setReactReady] = useState(false);

  // Check if React and PluginSDK are properly available
  const checkDependencies = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    // Check if React is available with hooks
    if (
      !(window as any).React ||
      !(window as any).React.useState ||
      !(window as any).React.useEffect
    ) {
      console.error("React or React hooks not available in global scope");
      return false;
    }

    // Check if PluginSDK is available
    if (!window.PluginSDK) {
      console.error("PluginSDK not available in global scope");
      return false;
    }

    return true;
  }, []);

  // Initialize dependencies check
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (checkDependencies()) {
        setReactReady(true);
        clearInterval(checkInterval);
      }
    }, 100);

    // Clear interval after 10 seconds to avoid infinite checking
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!reactReady) {
        setError(
          new Error(
            "React or PluginSDK dependencies not available after timeout",
          ),
        );
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [checkDependencies, reactReady]);

  const loadExtensions = useCallback(async () => {
    if (!reactReady) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize the plugin registry
      await pluginRegistry.initialize();

      // Get all plugins that implement this extension point
      const plugins = pluginRegistry.getPluginsForExtensionPoint(name);

      // For admin-settings extension point, also include plugins with admin.settings components
      let allPlugins = [...plugins];
      if (name === "admin-settings") {
        const pluginsWithAdminSettings =
          pluginRegistry.getPluginsWithComponent("settings");
        // Add plugins that have admin settings but aren't in the extension points list
        for (const plugin of pluginsWithAdminSettings) {
          if (!allPlugins.find((p) => p.id === plugin.id)) {
            allPlugins.push(plugin);
          }
        }
      }

      if (allPlugins.length === 0) {
        setExtensions([]);
        setLoading(false);
        return;
      }

      // Load all extension components using context-aware loader
      const loadedExtensions = [];

      for (const plugin of allPlugins) {
        if (!plugin.enabled) continue;

        try {
          console.log(
            `Loading extension point "${name}" for plugin: ${plugin.id}`,
          );

          // Check plugin loading state first
          const loadState = getPluginLoadingState(plugin.id, name);
          if (loadState.loading) {
            console.log(`Plugin ${plugin.id} is already loading, waiting...`);
            continue;
          }

          if (loadState.error) {
            console.error(
              `Plugin ${plugin.id} has loading error:`,
              loadState.error,
            );
            continue;
          }

          // Use the new context-aware plugin loader
          const Component = await loadPluginWithContext(plugin, name);

          if (Component) {
            loadedExtensions.push({
              id: plugin.id,
              component: Component,
              plugin,
            });

            console.log(
              `Successfully loaded extension point "${name}" for plugin: ${plugin.id}`,
            );
          } else {
            console.warn(
              `Plugin ${plugin.id} does not properly implement extension point "${name}"`,
            );
          }
        } catch (err) {
          console.error(
            `Failed to load extension from plugin ${plugin.id} for "${name}":`,
            err,
          );

          // Check if it's a specific loading error we can handle
          const loadState = getPluginLoadingState(plugin.id, name);
          if (loadState.error) {
            console.error(
              `Plugin loading error for ${plugin.id}:`,
              loadState.error,
            );
          }
        }
      }

      setExtensions(loadedExtensions);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load extensions:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setLoading(false);
    }
  }, [name, reactReady]);

  useEffect(() => {
    if (reactReady) {
      loadExtensions();
    }
  }, [reactReady, loadExtensions]);

  // Error boundary for plugin components
  const ErrorBoundary: React.FC<{
    children: React.ReactNode;
    pluginId: string;
  }> = ({ children, pluginId }) => {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
      const handleError = (error: ErrorEvent) => {
        if (
          error.filename?.includes(pluginId) ||
          error.message?.includes(pluginId)
        ) {
          console.error(`Plugin ${pluginId} error:`, error);
          setHasError(true);
          setErrorMessage(error.message || "Unknown plugin error");
        }
      };

      window.addEventListener("error", handleError);
      return () => window.removeEventListener("error", handleError);
    }, [pluginId]);

    if (hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-red-800 text-sm font-medium">Plugin Error</p>
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
          <p className="text-red-500 text-xs mt-1">Plugin: {pluginId}</p>
        </div>
      );
    }

    return <>{children}</>;
  };

  if (!reactReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">
          Initializing plugin system...
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">
          Loading plugins...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-800 text-sm font-medium">
          Error loading plugins: {error.message}
        </p>
        <p className="text-red-600 text-xs mt-1">Extension point: {name}</p>
        <button
          onClick={() => {
            setError(null);
            loadExtensions();
          }}
          className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (extensions.length === 0) {
    return <>{fallback}</>;
  }

  // Render all loaded extensions with error boundaries
  return (
    <>
      {extensions.map(({ id, component: Component, plugin }) => (
        <ErrorBoundary key={id} pluginId={id}>
          <div className="plugin-extension" data-plugin-id={id}>
            <React.Suspense
              fallback={
                <div className="p-2 text-sm text-muted-foreground">
                  Loading {plugin.name}...
                </div>
              }
            >
              <Component context={context} pluginId={id} plugin={plugin} />
            </React.Suspense>
          </div>
        </ErrorBoundary>
      ))}
    </>
  );
}
