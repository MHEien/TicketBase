"use client";

import React, { useState, useEffect } from "react";
import {
  loadPluginWithContext,
  getPluginLoadingState,
} from "@/lib/context-aware-plugin-loader";
import { pluginRegistry } from "@/lib/plugin-registry";
import { InstalledPlugin } from "@/lib/plugin-types";

export interface ExtensionPointProps {
  name: string;
  context?: Record<string, any>;
  fallback?: React.ReactNode;
}

/**
 * A component that renders an extension point where plugins can inject content
 * Now uses context-aware plugin loading to solve auth and environment issues
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

  useEffect(() => {
    let isMounted = true;

    async function loadExtensions() {
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

        if (!isMounted) return;

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

            // Use the new context-aware plugin loader
            const Component = await loadPluginWithContext(plugin, name);

            if (Component && isMounted) {
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

        if (isMounted) {
          setExtensions(loadedExtensions);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load extensions:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setLoading(false);
        }
      }
    }

    loadExtensions();

    return () => {
      isMounted = false;
    };
  }, [name]);

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
        <p className="text-red-800 text-sm">
          Error loading plugins: {error.message}
        </p>
        <p className="text-red-600 text-xs mt-1">
          Using context-aware plugin loader - check browser console for details
        </p>
      </div>
    );
  }

  if (extensions.length === 0) {
    return <>{fallback}</>;
  }

  // Render all loaded extensions
  return (
    <>
      {extensions.map(({ id, component: Component, plugin }) => (
        <div key={id} className="plugin-extension" data-plugin-id={id}>
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
      ))}
    </>
  );
}
