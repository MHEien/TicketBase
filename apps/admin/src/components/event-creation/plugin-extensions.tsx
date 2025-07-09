"use client";

import { useState, useEffect } from "react";
import { pluginRegistry } from "@/src/lib/plugin-registry";
import { loadPluginComponent } from "@/src/lib/plugin-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PluginExtensionsProps {
  formData: Record<string, any>;
  onChange: (pluginId: string, data: any) => void;
}

/**
 * A component that renders plugin integration points during event creation
 *
 * This component loads all plugins that have registered event creation components
 * and renders them in the event creation form. Each plugin can provide its own
 * UI for configuring event-specific settings.
 */
export function PluginExtensions({
  formData,
  onChange,
}: PluginExtensionsProps) {
  const [plugins, setPlugins] = useState<
    {
      id: string;
      name: string;
      component: React.ComponentType<any>;
      config: Record<string, any>;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugins() {
      try {
        setLoading(true);

        // Initialize the plugin registry
        await pluginRegistry.initialize();

        // Get all plugins that have event creation components
        const eventPlugins =
          pluginRegistry.getPluginsWithComponent("eventCreation");

        if (eventPlugins.length === 0) {
          setPlugins([]);
          return;
        }

        // Load all plugin components
        const loadedPlugins = [];

        for (const plugin of eventPlugins) {
          if (!plugin.enabled || !plugin.adminComponents.eventCreation)
            continue;

          try {
            const Component = await loadPluginComponent(
              plugin,
              plugin.adminComponents.eventCreation,
            );

            if (Component) {
              loadedPlugins.push({
                id: plugin.id,
                name: plugin.name,
                component: Component,
                config: plugin.configuration || {},
              });
            }
          } catch (e) {
            console.error(
              `Failed to load event creation component for plugin ${plugin.id}:`,
              e,
            );
          }
        }

        if (isMounted) {
          setPlugins(loadedPlugins);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          console.error("Failed to load event creation plugins:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPlugins();

    return () => {
      isMounted = false;
    };
  }, []);

  // Don't render anything if there are no plugins
  if (!loading && plugins.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plugin Features</h2>
        <span className="text-sm text-muted-foreground">
          {plugins.length} plugin{plugins.length !== 1 ? "s" : ""} available
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        plugins.map(({ id, name, component: PluginComponent, config }) => (
          <Card key={id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <PluginComponent
                config={config}
                data={formData[id] || {}}
                onChange={(data: any) => onChange(id, data)}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
