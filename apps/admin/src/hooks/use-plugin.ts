import { useState, useEffect } from "react";
import { pluginManager, type LoadedPlugin } from "@/lib/plugin-manager";
import { pluginLoader } from "@/lib/plugin-loader";

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
        let loadedPlugin = pluginManager.getPlugin(pluginId);

        if (!loadedPlugin) {
          // If not loaded, try to load it
          await pluginLoader.loadPlugin(pluginId);
          loadedPlugin = pluginManager.getPlugin(pluginId);
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

        const component = plugin.extensionPoints[extensionPoint];

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

        // Load installed plugins
        await pluginLoader.loadInstalledPlugins();

        if (isMounted) {
          setPlugins(pluginManager.getAllPlugins());
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
      pluginManager.clear();
      await pluginLoader.loadInstalledPlugins();
      setPlugins(pluginManager.getAllPlugins());
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

        await pluginLoader.loadInstalledPlugins();

        if (isMounted) {
          const allPlugins = pluginManager.getAllPlugins();
          const filteredPlugins = allPlugins.filter(
            (plugin) => plugin.metadata.category === category,
          );
          setPlugins(filteredPlugins);
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
