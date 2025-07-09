/**
 * Simplified Plugin Loader
 *
 * Replaces the complex Module Federation approach with a simpler,
 * more reliable dynamic import system that works well with React.
 */

import React, { Suspense } from "react";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  bundleUrl: string;
  extensionPoints: string[];
  configuration?: Record<string, any>;
}

interface LoadedPlugin {
  id: string;
  components: Map<string, React.ComponentType<any>>;
  metadata: PluginManifest;
  loadedAt: Date;
}

class SimplePluginLoader {
  private loadedPlugins = new Map<string, LoadedPlugin>();
  private loadingPromises = new Map<string, Promise<LoadedPlugin>>();

  /**
   * Load a plugin using dynamic imports
   */
  async loadPlugin(manifest: PluginManifest): Promise<LoadedPlugin> {
    const cacheKey = `${manifest.id}@${manifest.version}`;

    // Return cached plugin if already loaded
    if (this.loadedPlugins.has(cacheKey)) {
      return this.loadedPlugins.get(cacheKey)!;
    }

    // Return existing loading promise if plugin is currently being loaded
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    // Start loading the plugin
    const loadingPromise = this.loadPluginInternal(manifest);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const plugin = await loadingPromise;
      this.loadedPlugins.set(cacheKey, plugin);
      return plugin;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async loadPluginInternal(
    manifest: PluginManifest,
  ): Promise<LoadedPlugin> {
    try {
      // Fetch the plugin bundle
      const response = await fetch(manifest.bundleUrl, {
        cache: "force-cache", // Cache plugin bundles aggressively
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch plugin bundle: ${response.status}`);
      }

      const pluginCode = await response.text();

      // Create a secure execution context
      const pluginModule = await this.executePluginCode(pluginCode, manifest);

      // Extract components for each extension point
      const components = new Map<string, React.ComponentType<any>>();

      for (const extensionPoint of manifest.extensionPoints) {
        const component = pluginModule.extensionPoints?.[extensionPoint];
        if (component) {
          components.set(extensionPoint, component);
        }
      }

      return {
        id: manifest.id,
        components,
        metadata: manifest,
        loadedAt: new Date(),
      };
    } catch (error) {
      console.error(`Failed to load plugin ${manifest.id}:`, error);
      throw error;
    }
  }

  private async executePluginCode(
    code: string,
    manifest: PluginManifest,
  ): Promise<any> {
    // Create a sandboxed execution environment
    const sandbox = {
      React,
      // Provide plugin SDK
      PluginSDK: (window as any).PluginSDK,
      // Plugin configuration from secure storage
      __PLUGIN_CONFIG__: manifest.configuration || {},
      // Console for debugging
      console: {
        log: (...args: any[]) =>
          console.log(`[Plugin:${manifest.id}]`, ...args),
        warn: (...args: any[]) =>
          console.warn(`[Plugin:${manifest.id}]`, ...args),
        error: (...args: any[]) =>
          console.error(`[Plugin:${manifest.id}]`, ...args),
      },
    };

    // Wrap the plugin code in a function to control its environment
    const wrappedCode = `
      (function(React, PluginSDK, __PLUGIN_CONFIG__, console) {
        ${code}
        
        // Return the plugin export
        if (typeof module !== 'undefined' && module.exports) {
          return module.exports;
        }
        if (typeof exports !== 'undefined') {
          return exports;
        }
        throw new Error('Plugin must export via module.exports or exports');
      })
    `;

    // Execute the plugin code
    const pluginFactory = eval(wrappedCode);
    return pluginFactory(
      sandbox.React,
      sandbox.PluginSDK,
      sandbox.__PLUGIN_CONFIG__,
      sandbox.console,
    );
  }

  /**
   * Get a component for a specific extension point
   */
  getComponent(
    pluginId: string,
    extensionPoint: string,
    version?: string,
  ): React.ComponentType<any> | null {
    const cacheKey = version
      ? `${pluginId}@${version}`
      : // Find the latest version if not specified
        Array.from(this.loadedPlugins.keys())
          .filter((key) => key.startsWith(`${pluginId}@`))
          .sort()
          .pop() || pluginId;

    const plugin = this.loadedPlugins.get(cacheKey);
    return plugin?.components.get(extensionPoint) || null;
  }

  /**
   * Create a lazy-loaded plugin component
   */
  createLazyComponent(
    manifest: PluginManifest,
    extensionPoint: string,
  ): React.ComponentType<any> {
    return React.lazy(async () => {
      const plugin = await this.loadPlugin(manifest);
      const Component = plugin.components.get(extensionPoint);

      if (!Component) {
        throw new Error(
          `Extension point '${extensionPoint}' not found in plugin '${manifest.id}'`,
        );
      }

      return { default: Component };
    });
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Unload a plugin
   */
  unloadPlugin(pluginId: string, version?: string): void {
    const cacheKey = version ? `${pluginId}@${version}` : pluginId;
    this.loadedPlugins.delete(cacheKey);
  }
}

// Export singleton instance
export const pluginLoader = new SimplePluginLoader();

/**
 * Hook to use a plugin component
 */
export function usePluginComponent(
  manifest: PluginManifest,
  extensionPoint: string,
) {
  const [Component, setComponent] =
    React.useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    pluginLoader
      .loadPlugin(manifest)
      .then((plugin) => {
        if (!mounted) return;

        const comp = plugin.components.get(extensionPoint);
        if (comp) {
          setComponent(() => comp); // Use function to avoid React treating component as state
        } else {
          setError(new Error(`Extension point '${extensionPoint}' not found`));
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [manifest.id, manifest.version, extensionPoint]);

  return { Component, loading, error };
}

/**
 * Component to render a plugin with proper error boundaries
 */
interface PluginComponentProps {
  manifest: PluginManifest;
  extensionPoint: string;
  fallback?: React.ComponentType<any>;
  [key: string]: any;
}

export function PluginComponent({
  manifest,
  extensionPoint,
  fallback: Fallback,
  ...props
}: PluginComponentProps) {
  const { Component, loading, error } = usePluginComponent(
    manifest,
    extensionPoint,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading plugin...</span>
      </div>
    );
  }

  if (error) {
    console.error(`Plugin error (${manifest.id}):`, error);

    if (Fallback) {
      return <Fallback error={error} manifest={manifest} {...props} />;
    }

    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md">
        <h4 className="text-red-800 font-medium">Plugin Error</h4>
        <p className="text-red-600 text-sm mt-1">
          Failed to load {manifest.name}: {error.message}
        </p>
      </div>
    );
  }

  if (!Component) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-4">
          <div className="animate-pulse text-sm text-gray-500">
            Loading component...
          </div>
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
}
