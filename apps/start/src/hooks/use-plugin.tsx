"use client";

import { useState, useEffect, useCallback } from "react";
import { InstalledPlugin } from "../lib/plugin-types";
import {
  getTenantPlugins,
  installPlugin,
  uninstallPlugin,
  updatePluginConfig,
  setPluginEnabled,
} from "../lib/plugin-api";
import { pluginRegistry } from "../lib/plugin-registry";

// Debug logging helper
function debugLog(operation: string, details: any) {
  console.group(`🔌 usePlugins Hook Debug: ${operation}`);
  console.log("Timestamp:", new Date().toISOString());
  console.log("Details:", details);
  console.groupEnd();
}

// Error logging helper
function errorLog(operation: string, error: any, context?: any) {
  console.group(`❌ usePlugins Hook Error: ${operation}`);
  console.log("Timestamp:", new Date().toISOString());
  console.error("Error:", error);
  if (context) {
    console.log("Context:", context);
  }
  console.groupEnd();
}

/**
 * A hook for managing plugins
 * Provides methods for loading, installing, uninstalling, and configuring plugins
 */
export function usePlugins(organizationId?: string) {
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load plugins
  const loadPlugins = useCallback(async () => {
    const operation = "loadPlugins";

    try {
      setLoading(true);
      setError(null);

      debugLog(operation, {
        organizationId,
        description: "Starting to load plugins for organization",
      });

      const response = await getTenantPlugins(organizationId);

      if (!response.success) {
        const errorMessage = response.error || "Failed to load plugins";
        throw new Error(errorMessage);
      }

      debugLog(`${operation} - Success`, {
        pluginCount: response.data?.length || 0,
        plugins: response.data,
      });

      setPlugins(response.data || []);

      // Also update the plugin registry
      debugLog(`${operation} - Registry Refresh`, {
        description: "Refreshing plugin registry",
      });

      await pluginRegistry.refreshPlugins();

      debugLog(`${operation} - Complete`, {
        description: "Plugin loading completed successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      errorLog(operation, err, {
        organizationId,
        errorMessage,
      });

      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  // Initial load
  useEffect(() => {
    debugLog("useEffect - Initial Load", {
      organizationId,
      description: "Triggering initial plugin load",
    });

    loadPlugins();
  }, [loadPlugins]);

  // Install a plugin
  const install = useCallback(
    async (pluginId: string) => {
      const operation = "install";

      try {
        debugLog(operation, {
          pluginId,
          organizationId,
          description: "Starting plugin installation",
        });

        const response = await installPlugin(pluginId, organizationId);

        if (!response.success) {
          const errorMessage = response.error || "Failed to install plugin";
          throw new Error(errorMessage);
        }

        const installedPlugin = response.data;
        if (!installedPlugin) {
          throw new Error("No plugin data returned from installation");
        }

        debugLog(`${operation} - Success`, {
          pluginId,
          installedPlugin,
          description: "Plugin installed successfully",
        });

        // Update local state
        setPlugins((prev) => {
          // Check if the plugin already exists
          const exists = prev.some((p) => p.id === pluginId);
          if (exists) {
            debugLog(`${operation} - State Update`, {
              action: "update existing",
              pluginId,
            });
            return prev.map((p) => (p.id === pluginId ? installedPlugin : p));
          }

          debugLog(`${operation} - State Update`, {
            action: "add new",
            pluginId,
          });
          return [...prev, installedPlugin];
        });

        // Update registry
        debugLog(`${operation} - Registry Refresh`, {
          description: "Refreshing plugin registry after installation",
        });
        await pluginRegistry.refreshPlugins();

        return installedPlugin;
      } catch (err) {
        errorLog(operation, err, {
          pluginId,
          organizationId,
        });
        throw err;
      }
    },
    [organizationId],
  );

  // Uninstall a plugin
  const uninstall = useCallback(
    async (pluginId: string) => {
      const operation = "uninstall";

      try {
        debugLog(operation, {
          pluginId,
          description: "Starting plugin uninstallation",
        });

        // Find the installed plugin to get its ID
        const installedPlugin = plugins.find((p) => p.id === pluginId);
        if (!installedPlugin) {
          throw new Error(`Plugin ${pluginId} is not installed`);
        }

        const installedPluginId = installedPlugin.id;

        const response = await uninstallPlugin(installedPluginId);

        if (!response.success) {
          const errorMessage = response.error || "Failed to uninstall plugin";
          throw new Error(errorMessage);
        }

        debugLog(`${operation} - Success`, {
          pluginId,
          installedPluginId,
          description: "Plugin uninstalled successfully",
        });

        // Update local state
        setPlugins((prev) => {
          const filtered = prev.filter((p) => p.id !== installedPluginId);

          debugLog(`${operation} - State Update`, {
            removedPluginId: pluginId,
            remainingCount: filtered.length,
          });

          return filtered;
        });

        // Update registry
        debugLog(`${operation} - Registry Refresh`, {
          description: "Refreshing plugin registry after uninstallation",
        });
        await pluginRegistry.refreshPlugins();
      } catch (err) {
        errorLog(operation, err, {
          pluginId,
        });
        throw err;
      }
    },
    [plugins],
  );

  // Update plugin configuration
  const updateConfig = useCallback(
    async (pluginId: string, config: Record<string, any>) => {
      const operation = "updateConfig";

      try {
        debugLog(operation, {
          pluginId,
          config,
          description: "Starting plugin configuration update",
        });

        // Find the installed plugin to get its ID
        const installedPlugin = plugins.find((p) => p.id === pluginId);
        if (!installedPlugin) {
          throw new Error(`Plugin ${pluginId} is not installed`);
        }

        const installedPluginId = installedPlugin.id;

        const response = await updatePluginConfig(installedPluginId, config);

        if (!response.success) {
          const errorMessage =
            response.error || "Failed to update plugin config";
          throw new Error(errorMessage);
        }

        const updatedPlugin = response.data;
        if (!updatedPlugin) {
          throw new Error("No plugin data returned from config update");
        }

        debugLog(`${operation} - Success`, {
          pluginId,
          installedPluginId,
          updatedPlugin,
          description: "Plugin configuration updated successfully",
        });

        // Update local state
        setPlugins((prev) =>
          prev.map((p) => (p.id === installedPluginId ? updatedPlugin : p)),
        );

        // Update registry
        debugLog(`${operation} - Registry Refresh`, {
          description: "Refreshing plugin registry after configuration update",
        });
        await pluginRegistry.refreshPlugins();

        return updatedPlugin;
      } catch (err) {
        errorLog(operation, err, {
          pluginId,
          config,
        });
        throw err;
      }
    },
    [plugins],
  );

  // Enable or disable a plugin
  const toggleEnabled = useCallback(
    async (pluginId: string, enabled: boolean) => {
      const operation = "toggleEnabled";

      try {
        debugLog(operation, {
          pluginId,
          enabled,
          description: `Starting to ${enabled ? "enable" : "disable"} plugin`,
        });

        // Find the installed plugin to get its ID
        const installedPlugin = plugins.find((p) => p.id === pluginId);
        if (!installedPlugin) {
          throw new Error(`Plugin ${pluginId} is not installed`);
        }

        const installedPluginId = installedPlugin.id;

        const response = await setPluginEnabled(installedPluginId, enabled);

        if (!response.success) {
          const errorMessage =
            response.error || "Failed to update plugin status";
          throw new Error(errorMessage);
        }

        const updatedPlugin = response.data;
        if (!updatedPlugin) {
          throw new Error("No plugin data returned from status update");
        }

        debugLog(`${operation} - Success`, {
          pluginId,
          installedPluginId,
          enabled,
          updatedPlugin,
          description: `Plugin ${enabled ? "enabled" : "disabled"} successfully`,
        });

        // Update local state
        setPlugins((prev) =>
          prev.map((p) => (p.id === installedPluginId ? updatedPlugin : p)),
        );

        // Update registry
        debugLog(`${operation} - Registry Refresh`, {
          description: "Refreshing plugin registry after status change",
        });
        await pluginRegistry.refreshPlugins();

        return updatedPlugin;
      } catch (err) {
        errorLog(operation, err, {
          pluginId,
          enabled,
        });
        throw err;
      }
    },
    [plugins],
  );

  return {
    plugins,
    loading,
    error,
    refreshPlugins: loadPlugins,
    installPlugin: install,
    uninstallPlugin: uninstall,
    updatePluginConfig: updateConfig,
    setPluginEnabled: toggleEnabled,
  };
}
