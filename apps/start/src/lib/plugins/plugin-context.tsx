"use client";
import React from "react";
import type { ExtensionPointComponent } from "ticketsplatform-plugin-sdk";
import { createPluginComponent } from "./plugin-loader";
import { Plugin, PluginManifest } from "./types";

interface PluginContextValue {
  // Plugin state
  plugins: Plugin[];
  loadingPlugins: boolean;
  error: string | null;

  // Plugin management
  loadPlugin: (
    pluginId: string,
    extensionPoint: string,
  ) => Promise<ExtensionPointComponent>;
  installPlugin: (pluginId: string) => Promise<void>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;

  // Extension point rendering
  getExtensionPoint: (extensionPoint: string) => ExtensionPointComponent[];
}

const PluginContext = React.createContext<PluginContextValue | null>(null);

export function usePlugins() {
  const context = React.useContext(PluginContext);
  if (!context) {
    throw new Error("usePlugins must be used within a PluginProvider");
  }
  return context;
}

interface PluginProviderProps {
  children: React.ReactNode;
}

export function PluginProvider({ children }: PluginProviderProps) {
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [loadingPlugins, setLoadingPlugins] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Cache for loaded plugin components
  const pluginComponents = React.useRef<Map<string, ExtensionPointComponent>>(
    new Map(),
  );

  // Load installed plugins on mount
  React.useEffect(() => {
    async function loadInstalledPlugins() {
      try {
        const response = await fetch("/api/plugins/installed");
        const installedPlugins = await response.json();
        setPlugins(installedPlugins);
      } catch (err) {
        setError("Failed to load installed plugins");
        console.error("Failed to load plugins:", err);
      } finally {
        setLoadingPlugins(false);
      }
    }

    loadInstalledPlugins();
  }, []);

  // Load a specific plugin component
  const loadPlugin = React.useCallback(
    async (pluginId: string, extensionPoint: string) => {
      const cacheKey = `${pluginId}:${extensionPoint}`;

      // Return cached component if available
      const cached = pluginComponents.current.get(cacheKey);
      if (cached) return cached;

      // Find plugin
      const plugin = plugins.find((p) => p.id === pluginId);
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`);
      }

      // Check if plugin supports this extension point
      if (!plugin.extensionPoints.includes(extensionPoint)) {
        throw new Error(
          `Plugin ${pluginId} does not support extension point ${extensionPoint}`,
        );
      }

      // Create component
      const component = createPluginComponent({
        pluginId,
        version: plugin.version,
        extensionPoint,
      });

      if (!component) {
        throw new Error(
          `Failed to load plugin component for ${pluginId} ${extensionPoint}`,
        );
      }

      // Cache component
      pluginComponents.current.set(cacheKey, component);

      return component;
    },
    [plugins],
  );

  // Install a plugin
  const installPlugin = React.useCallback(async (pluginId: string) => {
    try {
      const response = await fetch("/api/plugins/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId }),
      });

      if (!response.ok) {
        throw new Error("Failed to install plugin");
      }

      const installedPlugin = await response.json();
      setPlugins((prev) => [...prev, installedPlugin]);
    } catch (err) {
      setError("Failed to install plugin");
      throw err;
    }
  }, []);

  // Uninstall a plugin
  const uninstallPlugin = React.useCallback(async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}/uninstall`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to uninstall plugin");
      }

      setPlugins((prev) => prev.filter((p) => p.id !== pluginId));

      // Clear cached components for this plugin
      for (const [key] of pluginComponents.current) {
        if (key.startsWith(`${pluginId}:`)) {
          pluginComponents.current.delete(key);
        }
      }
    } catch (err) {
      setError("Failed to uninstall plugin");
      throw err;
    }
  }, []);

  // Enable a plugin
  const enablePlugin = React.useCallback(async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}/enable`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to enable plugin");
      }

      setPlugins((prev) =>
        prev.map((p) => (p.id === pluginId ? { ...p, enabled: true } : p)),
      );
    } catch (err) {
      setError("Failed to enable plugin");
      throw err;
    }
  }, []);

  // Disable a plugin
  const disablePlugin = React.useCallback(async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/${pluginId}/disable`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to disable plugin");
      }

      setPlugins((prev) =>
        prev.map((p) => (p.id === pluginId ? { ...p, enabled: false } : p)),
      );
    } catch (err) {
      setError("Failed to disable plugin");
      throw err;
    }
  }, []);

  // Get all components for an extension point
  const getExtensionPoint = React.useCallback(
    (extensionPoint: string): ExtensionPointComponent[] => {
      return plugins
        .filter(
          (p) => p.isEnabled && p.extensionPoints.includes(extensionPoint),
        )
        .map((p) => {
          const cacheKey = `${p.id}:${extensionPoint}`;
          let component = pluginComponents.current.get(cacheKey);

          if (!component) {
            component = createPluginComponent({
              pluginId: p.id,
              version: p.version,
              extensionPoint,
            });
            if (component) {
              pluginComponents.current.set(cacheKey, component);
            }
          }

          // Skip plugins with no component
          return component as ExtensionPointComponent;
        })
        .filter(
          (component): component is ExtensionPointComponent =>
            component !== undefined,
        );
    },
    [plugins],
  );

  const value: PluginContextValue = {
    plugins,
    loadingPlugins,
    error,
    loadPlugin,
    installPlugin,
    uninstallPlugin,
    enablePlugin,
    disablePlugin,
    getExtensionPoint,
  };

  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
}
