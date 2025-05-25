"use client";

import { useEffect, useState, Suspense } from "react";
import { InstalledPlugin, ExtensionPointContext } from "@/lib/plugin-types";
import { pluginRegistry } from "@/lib/plugin-registry";
import { loadPluginModule } from "@/lib/plugin-loader";
import { ErrorBoundary } from "@/components/error-boundary";
import { Loader2 } from "lucide-react";

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
  </div>
);

interface ExtensionPointProps {
  name: string;
  context?: ExtensionPointContext;
  fallback?: React.ReactNode;
}

/**
 * A component that renders an extension point where plugins can inject content
 */
export function ExtensionPoint({ name, context = {}, fallback = null }: ExtensionPointProps) {
  const [extensions, setExtensions] = useState<{
    id: string;
    component: React.ComponentType<any>;
    plugin: InstalledPlugin;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadExtensions() {
      try {
        setLoading(true);

        // Initialize the plugin registry
        await pluginRegistry.initialize();

        // Get all plugins that implement this extension point
        const plugins = pluginRegistry.getPluginsForExtensionPoint(name);

        if (plugins.length === 0) {
          setExtensions([]);
          return;
        }

        // Load all extension components
        const loadedExtensions = [];

        for (const plugin of plugins) {
          if (!plugin.enabled) continue;
          
          try {
            // Use the plugin loader utility to load the plugin module
            const componentModule = await loadPluginModule(plugin);

            // First check for globally defined extension points
            if (typeof window !== 'undefined' && window[`devPlugin1`]) {
              const globalPlugin = window[`devPlugin1`];
              if (globalPlugin && globalPlugin.extensionPoints?.[name]) {
                loadedExtensions.push({
                  id: plugin.id,
                  component: globalPlugin.extensionPoints[name],
                  plugin
                });
                continue;
              }
            }

            // Check for extension points from dynamic imports
            if (!componentModule.default?.extensionPoints?.[name] && !componentModule.extensionPoints?.[name]) {
              console.warn(`Plugin ${plugin.id} does not properly implement extension point "${name}"`);
              continue;
            }

            const Component = componentModule.default?.extensionPoints?.[name] || componentModule.extensionPoints?.[name];

            if (Component) {
              loadedExtensions.push({
                id: plugin.id,
                component: Component,
                plugin
              });
            }
          } catch (e) {
            console.error(`Failed to load extension from plugin ${plugin.id} for "${name}":`, e);
          }
        }

        // Sort by priority (higher numbers first)
        loadedExtensions.sort((a, b) => 
          (b.plugin.metadata?.priority || 0) - (a.plugin.metadata?.priority || 0)
        );

        if (isMounted) {
          setExtensions(loadedExtensions);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          console.error(`Failed to load extensions for "${name}":`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadExtensions();

    return () => {
      isMounted = false;
    };
  }, [name]);

  // Show loading state initially
  if (loading) {
    return <LoadingIndicator />;
  }

  // If no extensions are available, show the fallback
  if (extensions.length === 0) {
    return <>{fallback}</>;
  }

  // Render all enabled extensions
  return (
    <>
      {extensions.map(({ id, component: ExtensionComponent, plugin }) => (
        <ErrorBoundary key={id} fallback={<div>Error loading plugin: {plugin.name}</div>}>
          <Suspense fallback={<LoadingIndicator />}>
            <ExtensionComponent 
              context={context} 
              configuration={plugin.configuration} 
              plugin={plugin}
            />
          </Suspense>
        </ErrorBoundary>
      ))}
    </>
  );
} 