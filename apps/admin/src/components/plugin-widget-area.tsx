"use client";

import React, { useState, useEffect } from "react";
import { pluginManager } from "@/lib/plugin-manager";
import { pluginLoader } from "@/lib/plugin-loader";
import { Loader2 } from "lucide-react";

interface PluginWidgetAreaProps {
  areaName: string;
  eventData?: Record<string, any>;
  className?: string;
}

/**
 * A component that renders plugin widgets in a designated area of the storefront
 */
export function PluginWidgetArea({
  areaName,
  eventData,
  className = "",
}: PluginWidgetAreaProps) {
  const [widgets, setWidgets] = useState<
    {
      pluginId: string;
      component: React.ComponentType<any>;
      config: Record<string, any>;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWidgets() {
      try {
        setLoading(true);

        // Load installed plugins
        await pluginLoader.loadInstalledPlugins();

        // Get plugins for this widget area (using extension point)
        const relevantPlugins = pluginManager.getPluginsForExtensionPoint(areaName);

        const loadedWidgets = [];

        for (const plugin of relevantPlugins) {
          // Skip if the plugin is not loaded
          if (!plugin.isLoaded) continue;

          const Component = plugin.extensionPoints[areaName];

          if (Component) {
            loadedWidgets.push({
              pluginId: plugin.metadata.id,
              component: Component as React.ComponentType<any>,
              config: {} as Record<string, any>,
            });
          }
        }

        if (isMounted) {
          setWidgets(loadedWidgets);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          console.error(`Failed to load widgets for area ${areaName}:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadWidgets();

    return () => {
      isMounted = false;
    };
  }, [areaName]);

  // Don't render anything if there are no widgets for this area
  if (!loading && widgets.length === 0) {
    return null;
  }

  return (
    <div
      className={`plugin-widget-area ${className}`}
      data-area-name={areaName}
    >
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        widgets.map(({ pluginId, component: Widget, config }, index) => (
          <div key={`${pluginId}-${index}`} className="plugin-widget mb-4">
            <Widget config={config} eventData={eventData} />
          </div>
        ))
      )}
    </div>
  );
}
