import { useState, useEffect } from "react";
import { pluginLoader, type LoadedPlugin } from "@/lib/simple-plugin-system";

// Helper function to fetch plugin metadata
async function fetchPluginMetadata(pluginId: string) {
  try {
    const { fetchPluginMetadata } = await import("@/lib/plugin-integration");
    return await fetchPluginMetadata(pluginId);
  } catch (error) {
    console.error(`Failed to fetch metadata for plugin ${pluginId}:`, error);
    return null;
  }
}

/**
 * Hook to load a plugin by ID
 */
export function usePlugin(pluginId: string) {
  const [plugin, setPlugin] = useState<LoadedPlugin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugin() {
      try {
        setLoading(true);

        // Try to get already loaded plugin first
        let loadedPlugin = pluginLoader.getPlugin(pluginId);

        if (!loadedPlugin) {
          // If not loaded, try to load it
          const metadata = await fetchPluginMetadata(pluginId);
          if (metadata) {
            loadedPlugin = await pluginLoader.loadPlugin(metadata);
          }
        }

        if (!loadedPlugin) {
          throw new Error(`Plugin ${pluginId} not found`);
        }

        if (!loadedPlugin.isLoaded) {
          throw new Error(
            `Plugin ${pluginId} failed to load: ${loadedPlugin.error}`,
          );
        }

        if (isMounted) {
          setPlugin(loadedPlugin);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPlugin();

    return () => {
      isMounted = false;
    };
  }, [pluginId]);

  return { plugin, loading, error };
}

/**
 * Hook to load a plugin component
 */
export function usePluginComponent<T = any>(
  plugin: LoadedPlugin | null,
  extensionPoint: string,
) {
  const [component, setComponent] = useState<React.ComponentType<T> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadComponent() {
      try {
        setLoading(true);

        if (!plugin) {
          throw new Error("No plugin provided");
        }

        if (!plugin.isLoaded) {
          throw new Error(`Plugin ${plugin.metadata.id} is not loaded`);
        }

        const component = plugin.components[extensionPoint];

        if (!component) {
          throw new Error(
            `Extension point ${extensionPoint} not found in plugin ${plugin.metadata.id}`,
          );
        }

        if (isMounted) {
          setComponent(component as React.ComponentType<T>);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [plugin, extensionPoint]);

  return { component, loading, error };
}

/**
 * Hook to get all loaded plugins
 */
export function usePlugins() {
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugins() {
      try {
        setLoading(true);

        // Load installed plugins using proper API client
        const { fetchInstalledPlugins, filterEnabledPlugins } = await import(
          "@/lib/plugin-integration"
        );
        const installedPlugins = await fetchInstalledPlugins();

        const loadedPlugins = [];
        for (const metadata of installedPlugins) {
          if (metadata.enabled) {
            const plugin = await pluginLoader.loadPlugin(metadata);
            loadedPlugins.push(plugin);
          }
        }

        if (isMounted) {
          setPlugins(loadedPlugins);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
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

  const refreshPlugins = async () => {
    try {
      setLoading(true);
      pluginLoader.clear();

      const { fetchInstalledPlugins } = await import(
        "@/lib/plugin-integration"
      );
      const installedPlugins = await fetchInstalledPlugins();

      const loadedPlugins = [];
      for (const metadata of installedPlugins) {
        if (metadata.enabled) {
          const plugin = await pluginLoader.loadPlugin(metadata);
          loadedPlugins.push(plugin);
        }
      }

      setPlugins(loadedPlugins);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { plugins, loading, error, refreshPlugins };
}

/**
 * Hook to get plugins by category
 */
export function usePluginsByCategory(category: string) {
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugins() {
      try {
        setLoading(true);

        const {
          fetchInstalledPlugins,
          filterByExtensionPoint,
          filterEnabledPlugins,
        } = await import("@/lib/plugin-integration");
        const allPlugins = await fetchInstalledPlugins();
        const installedPlugins = filterEnabledPlugins(allPlugins);

        const loadedPlugins = [];
        for (const metadata of installedPlugins.filter(
          (p: any) => p.enabled && p.category === category,
        )) {
          const plugin = await pluginLoader.loadPlugin(metadata);
          loadedPlugins.push(plugin);
        }

        if (isMounted) {
          setPlugins(loadedPlugins);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
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
  }, [category]);

  return { plugins, loading, error };
}
