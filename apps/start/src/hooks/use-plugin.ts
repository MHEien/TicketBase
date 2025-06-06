import { useState, useEffect } from "react";
import { InstalledPlugin } from "@/lib/plugin-types";
import { pluginRegistry } from "@/lib/plugin-registry";
import { loadPluginComponent } from "@/lib/plugin-loader";

/**
 * Hook to load a plugin by ID
 */
export function usePlugin(pluginId: string) {
  const [plugin, setPlugin] = useState<InstalledPlugin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugin() {
      try {
        setLoading(true);

        // Make sure plugin registry is initialized
        await pluginRegistry.initialize();

        const plugin = pluginRegistry.getPlugin(pluginId);

        if (!plugin) {
          throw new Error(`Plugin ${pluginId} not found`);
        }

        if (!plugin.enabled) {
          throw new Error(`Plugin ${pluginId} is not enabled`);
        }

        if (isMounted) {
          setPlugin(plugin);
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
  plugin: InstalledPlugin | null,
  componentPath: string,
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

        const loadedComponent = await loadPluginComponent(
          plugin,
          componentPath,
        );

        if (!loadedComponent) {
          throw new Error(
            `Component ${componentPath} not found in plugin ${plugin.id}`,
          );
        }

        if (isMounted) {
          setComponent(loadedComponent as React.ComponentType<T>);
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
  }, [plugin, componentPath]);

  return { component, loading, error };
}

/**
 * Hook to get all installed plugins
 */
export function usePlugins() {
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugins() {
      try {
        setLoading(true);

        // Make sure plugin registry is initialized
        await pluginRegistry.initialize();

        if (isMounted) {
          setPlugins(pluginRegistry.getPlugins());
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
      await pluginRegistry.refreshPlugins();
      setPlugins(pluginRegistry.getPlugins());
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
export function usePluginsByCategory(category: InstalledPlugin["category"]) {
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugins() {
      try {
        setLoading(true);

        // Make sure plugin registry is initialized
        await pluginRegistry.initialize();

        if (isMounted) {
          setPlugins(pluginRegistry.getPluginsByCategory(category));
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
