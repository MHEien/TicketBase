"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PluginsControllerQuery,
  InstalledPluginDto,
  SimpleInstallPluginDto,
  UpdatePluginDto,
  InstalledPluginDtoCategory,
  PluginResponseDto,
  InstalledPluginDtoStatus
} from "@repo/api-sdk";
import { pluginRegistry } from "../lib/plugin-registry";

// Helper to create a new InstalledPluginDto
const createInstalledPluginDto = (data: Partial<InstalledPluginDto> | PluginResponseDto): InstalledPluginDto => {
  const dto = new InstalledPluginDto();
  dto.id = "";
  dto.pluginId = "";
  dto.organizationId = "";
  dto.name = "";
  dto.version = "";
  dto.description = "";
  dto.category = InstalledPluginDtoCategory.Payment;
  dto.status = InstalledPluginDtoStatus.Active;
  dto.enabled = false;
  dto.configuration = {};
  dto.installedAt = new Date();
  dto.updatedAt = new Date();
  dto.metadata = {};

  Object.assign(dto, data);
  return dto;
};

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
  const [plugins, setPlugins] = useState<InstalledPluginDto[]>([]);
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

      const { data } = await PluginsControllerQuery.useFindAllQuery();
      
      // Transform response data to InstalledPluginDto
      const installedPlugins = data?.map(plugin => createInstalledPluginDto(plugin)) || [];

      debugLog(`${operation} - Success`, {
        pluginCount: installedPlugins.length,
        plugins: installedPlugins,
      });

      setPlugins(installedPlugins);

      await pluginRegistry.refreshPlugins();

    } catch (err) {
      errorLog(operation, err, { organizationId });
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  // Install a plugin
  const install = useCallback(async (pluginId: string) => {
    const operation = "install";

    try {
      const installDto = new SimpleInstallPluginDto();
      installDto.pluginId = pluginId;

      const { data } = await PluginsControllerQuery.useInstallMutation().mutateAsync(installDto);

      if (!data) {
        throw new Error("No plugin data returned from installation");
      }

      const installedPlugin = createInstalledPluginDto(data);

      setPlugins(prev => {
        const exists = prev.some(p => p.id === pluginId);
        return exists 
          ? prev.map(p => p.id === pluginId ? installedPlugin : p)
          : [...prev, installedPlugin];
      });

      await pluginRegistry.refreshPlugins();
      return installedPlugin;
    } catch (err) {
      errorLog(operation, err, { pluginId, organizationId });
      throw err;
    }
  }, [organizationId]);

  // Update plugin configuration
  const updateConfig = useCallback(async (pluginId: string, config: Record<string, any>) => {
    const operation = "updateConfig";

    try {
      const { data } = await PluginsControllerQuery.useConfigureMutation(pluginId).mutateAsync();

      const updatedPlugin = createInstalledPluginDto({
        ...data,
        configuration: config
      });

      setPlugins(prev =>
        prev.map(p => p.id === pluginId ? updatedPlugin : p)
      );

      return updatedPlugin;
    } catch (err) {
      errorLog(operation, err, { pluginId, config });
      throw err;
    }
  }, []);

  // Enable/disable plugin
  const setEnabled = useCallback(async (pluginId: string, enabled: boolean) => {
    const operation = "setEnabled";

    try {
      if (enabled) {
        await PluginsControllerQuery.useEnableMutation(pluginId).mutateAsync();
      } else {
        await PluginsControllerQuery.useDisableMutation(pluginId).mutateAsync();
      }

      setPlugins(prev =>
        prev.map(p => p.id === pluginId ? createInstalledPluginDto({ ...p, enabled }) : p)
      );
    } catch (err) {
      errorLog(operation, err, { pluginId, enabled });
      throw err;
    }
  }, []);

  // Uninstall a plugin
  const uninstall = useCallback(async (pluginId: string) => {
    const operation = "uninstall";

    try {
      await PluginsControllerQuery.useRemoveMutation(pluginId).mutateAsync();
      setPlugins(prev => prev.filter(p => p.id !== pluginId));
      await pluginRegistry.refreshPlugins();
    } catch (err) {
      errorLog(operation, err, { pluginId });
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPlugins();
  }, [loadPlugins]);

  return {
    plugins,
    loading,
    error,
    install,
    uninstall,
    updateConfig,
    setEnabled,
    loadPlugins,
  };
}
