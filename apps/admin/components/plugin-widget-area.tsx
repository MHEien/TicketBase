"use client";

import { useState, useEffect } from "react";
import { pluginRegistry } from "@/lib/plugin-registry";
import { loadPluginComponent } from "@/lib/plugin-loader";
import { Loader2 } from "lucide-react";

interface PluginWidgetAreaProps {
  areaName: string;
  eventData?: Record<string, any>;
  className?: string;
}

/**
 * A component that renders plugin widgets in a designated area of the storefront
 *
 * Widget areas can be placed throughout your storefront to allow plugins to
 * render components in specific locations. Plugins can register widgets for
 * specific areas in their metadata.
 *
 * Example areas:
 * - "event-detail-sidebar"
 * - "checkout-payment-methods"
 * - "ticket-selection-options"
 * - "event-detail-header"
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

        // Initialize the plugin registry if not already initialized
        await pluginRegistry.initialize();

        // Get all plugins that have widgets for this area
        const relevantPlugins = pluginRegistry.getPluginsWithWidget(areaName);

        if (relevantPlugins.length === 0) {
          setWidgets([]);
          return;
        }

        // Load all widget components
        const loadedWidgets = [];

        for (const plugin of relevantPlugins) {
          // Skip if the plugin is not enabled
          if (!plugin.enabled) continue;

          const widgetPath = plugin.storefrontComponents.widgets?.[areaName];

          if (!widgetPath) continue;

          try {
            const Component = await loadPluginComponent(plugin, widgetPath);

            if (Component) {
              loadedWidgets.push({
                pluginId: plugin.id,
                component: Component,
                config: plugin.configuration || {},
              });
            }
          } catch (e) {
            console.error(
              `Failed to load widget from plugin ${plugin.id} for area ${areaName}:`,
              e,
            );
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
