import React from "react";
import ReactDOM from "react-dom";

// ===================================================================
// PLUGIN RUNTIME SETUP
// ===================================================================

// Make React available globally for externalized plugins
if (typeof window !== "undefined") {
  // @ts-ignore
  window.React = React;
  // @ts-ignore
  window.ReactDOM = ReactDOM;

  // Also set up a simple module resolution for external imports
  // @ts-ignore
  if (!window.__pluginModules) {
    // @ts-ignore
    window.__pluginModules = {
      react: React,
      "react-dom": ReactDOM,
    };
  }
}

// ===================================================================
// TYPES
// ===================================================================

interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  extensionPoints: string[];
  bundleUrl: string;
  enabled?: boolean;
}

interface LoadedPlugin {
  metadata: PluginMetadata;
  components: Record<string, React.ComponentType<any>>;
  isLoaded: boolean;
  error?: string;
}

interface PluginContext {
  tenantId?: string;
  eventData?: any;
  configuration?: Record<string, any>;
  // Allow any additional context properties for flexibility
  [key: string]: any;
}

// ===================================================================
// SIMPLE PLUGIN LOADER
// ===================================================================

class SimplePluginLoader {
  private loadedPlugins = new Map<string, LoadedPlugin>();

  async loadPlugin(metadata: PluginMetadata): Promise<LoadedPlugin> {
    if (this.loadedPlugins.has(metadata.id)) {
      return this.loadedPlugins.get(metadata.id)!;
    }

    try {
      console.log(`🔌 Loading plugin: ${metadata.name}`);
      console.log(`🔌 Bundle URL: ${metadata.bundleUrl}`);
      console.log(
        `🔌 Expected extension points: ${metadata.extensionPoints.join(", ")}`,
      );

      const module = await import(/* @vite-ignore */ metadata.bundleUrl);
      console.log(`🔌 Loaded module:`, module);
      console.log(`🔌 Module default:`, module.default);
      console.log(
        `🔌 Module default extensionPoints:`,
        module.default?.extensionPoints,
      );
      console.log(`🔌 Module keys:`, Object.keys(module));
      console.log(
        `🔌 Module default keys:`,
        module.default ? Object.keys(module.default) : "no default",
      );

      // Try to understand the structure better
      if (module.default) {
        console.log(`🔌 Module default type:`, typeof module.default);
        console.log(
          `🔌 Module default constructor:`,
          module.default.constructor?.name,
        );
        console.log(
          `🔌 Module default stringified:`,
          JSON.stringify(module.default, null, 2),
        );
      }

      const components: Record<string, React.ComponentType<any>> = {};

      // Extract components from module - try multiple export patterns
      let extensionPoints = null;

      // Pattern 1: module.default.extensionPoints
      if (module.default?.extensionPoints) {
        extensionPoints = module.default.extensionPoints;
        console.log(
          `🔌 Found extensionPoints via module.default.extensionPoints`,
        );
      }
      // Pattern 2: module.extensionPoints
      else if (module.extensionPoints) {
        extensionPoints = module.extensionPoints;
        console.log(`🔌 Found extensionPoints via module.extensionPoints`);
      }
      // Pattern 3: check if module.default is the plugin object itself
      else if (
        module.default &&
        typeof module.default === "object" &&
        metadata.extensionPoints.some((point) => module.default[point])
      ) {
        extensionPoints = module.default;
        console.log(
          `🔌 Found extensionPoints as direct properties on module.default`,
        );
      }

      if (extensionPoints) {
        for (const point of metadata.extensionPoints) {
          const component = extensionPoints[point];
          console.log(`🔌 Checking extension point "${point}":`, component);
          if (component && typeof component === "function") {
            components[point] = component;
            console.log(
              `✅ Registered component for extension point: ${point}`,
            );
          } else {
            console.log(
              `❌ No valid component found for extension point: ${point}`,
            );
          }
        }
      } else {
        console.log(`❌ No extension points found in module structure`);
      }

      const plugin: LoadedPlugin = {
        metadata,
        components,
        isLoaded: true,
      };

      this.loadedPlugins.set(metadata.id, plugin);
      console.log(`✅ Plugin loaded: ${metadata.name}`);
      return plugin;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to load plugin ${metadata.id}:`, error);

      const failedPlugin: LoadedPlugin = {
        metadata,
        components: {},
        isLoaded: false,
        error: errorMessage,
      };

      this.loadedPlugins.set(metadata.id, failedPlugin);
      return failedPlugin;
    }
  }

  getPlugin(pluginId: string): LoadedPlugin | null {
    return this.loadedPlugins.get(pluginId) || null;
  }

  getPluginsForExtensionPoint(extensionPoint: string): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values()).filter(
      (plugin) => plugin.isLoaded && plugin.components[extensionPoint],
    );
  }

  clear(): void {
    this.loadedPlugins.clear();
  }
}

// ===================================================================
// EXTENSION POINT COMPONENT
// ===================================================================

interface ExtensionPointProps {
  name: string;
  context?: PluginContext;
  fallback?: React.ReactNode;
}

export const ExtensionPoint: React.FC<ExtensionPointProps> = ({
  name,
  context = {},
  fallback = null,
}) => {
  const [components, setComponents] = React.useState<
    Array<{
      pluginId: string;
      component: React.ComponentType<any>;
    }>
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadExtensionComponents();
  }, [name]);

  const loadExtensionComponents = async () => {
    try {
      setLoading(true);
      console.log(`🎯 Loading extension point "${name}"`);

      // Get installed plugins using proper API client
      const {
        fetchInstalledPlugins,
        filterByExtensionPoint,
        filterEnabledPlugins,
      } = await import("./plugin-integration");
      const allPlugins = await fetchInstalledPlugins();
      console.log(`🎯 All plugins:`, allPlugins);

      const installedPlugins = filterEnabledPlugins(allPlugins);
      console.log(`🎯 Enabled plugins:`, installedPlugins);

      // Filter relevant plugins
      const relevantPlugins = installedPlugins.filter(
        (p) => p.enabled && p.extensionPoints.includes(name),
      );
      console.log(`🎯 Relevant plugins for "${name}":`, relevantPlugins);

      const loadedComponents = [];

      for (const pluginMeta of relevantPlugins) {
        try {
          console.log(
            `🎯 Loading plugin "${pluginMeta.id}" for extension point "${name}"`,
          );
          const plugin = await pluginLoader.loadPlugin(pluginMeta);
          console.log(`🎯 Plugin loaded:`, plugin);

          if (plugin.isLoaded && plugin.components[name]) {
            console.log(
              `✅ Found component for extension point "${name}" in plugin "${pluginMeta.id}"`,
            );
            loadedComponents.push({
              pluginId: plugin.metadata.id,
              component: plugin.components[name],
            });
          } else {
            console.log(
              `❌ No component found for extension point "${name}" in plugin "${pluginMeta.id}"`,
              {
                isLoaded: plugin.isLoaded,
                hasComponent: !!plugin.components[name],
                availableComponents: Object.keys(plugin.components),
                error: plugin.error,
              },
            );
          }
        } catch (err) {
          console.error(`Failed to load plugin ${pluginMeta.id}:`, err);
        }
      }

      console.log(
        `🎯 Final loaded components for "${name}":`,
        loadedComponents,
      );
      setComponents(loadedComponents);
    } catch (err) {
      console.error(`Failed to load extension point ${name}:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading plugins...</div>;
  }

  if (components.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <>
      {components.map(({ pluginId, component: Component }) => {
        // Debug log the context being passed to plugin components
        if (import.meta.env.NODE_ENV === "development") {
          console.log(
            `🔧 Passing context to plugin "${pluginId}" for extension point "${name}":`,
            context,
          );
        }

        return (
          <div key={pluginId}>
            <Component {...context} pluginId={pluginId} />
          </div>
        );
      })}
    </>
  );
};

// ===================================================================
// EXPORTS
// ===================================================================

export const pluginLoader = new SimplePluginLoader();

export type {
  PluginMetadata,
  LoadedPlugin,
  PluginContext,
  ExtensionPointProps,
};
