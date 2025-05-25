"use client";

import { useState, useEffect, useCallback } from 'react';
import { InstalledPlugin } from '@/lib/plugin-types';
import { getTenantPlugins, installPlugin, uninstallPlugin, updatePluginConfig, setPluginEnabled } from '@/lib/plugin-api';
import { pluginRegistry } from '@/lib/plugin-registry';

/**
 * A hook for managing plugins
 * Provides methods for loading, installing, uninstalling, and configuring plugins
 */
export function usePlugins() {
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load plugins
  const loadPlugins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const installedPlugins = await getTenantPlugins();
      setPlugins(installedPlugins);
      
      // Also update the plugin registry
      await pluginRegistry.refreshPlugins();
    } catch (err) {
      console.error('Failed to load plugins:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPlugins();
  }, [loadPlugins]);

  // Install a plugin
  const install = useCallback(async (pluginId: string) => {
    try {
      const installedPlugin = await installPlugin(pluginId);
      
      // Update local state
      setPlugins(prev => {
        // Check if the plugin already exists
        const exists = prev.some(p => p.id === pluginId);
        if (exists) {
          return prev.map(p => p.id === pluginId ? installedPlugin : p);
        }
        return [...prev, installedPlugin];
      });
      
      // Update registry
      await pluginRegistry.refreshPlugins();
      
      return installedPlugin;
    } catch (err) {
      console.error(`Failed to install plugin ${pluginId}:`, err);
      throw err;
    }
  }, []);

  // Uninstall a plugin
  const uninstall = useCallback(async (pluginId: string) => {
    try {
      await uninstallPlugin(pluginId);
      
      // Update local state
      setPlugins(prev => prev.filter(p => p.id !== pluginId));
      
      // Update registry
      await pluginRegistry.refreshPlugins();
    } catch (err) {
      console.error(`Failed to uninstall plugin ${pluginId}:`, err);
      throw err;
    }
  }, []);

  // Update plugin configuration
  const updateConfig = useCallback(async (pluginId: string, config: Record<string, any>) => {
    try {
      const updatedPlugin = await updatePluginConfig(pluginId, config);
      
      // Update local state
      setPlugins(prev => prev.map(p => p.id === pluginId ? updatedPlugin : p));
      
      // Update registry
      await pluginRegistry.refreshPlugins();
      
      return updatedPlugin;
    } catch (err) {
      console.error(`Failed to update config for plugin ${pluginId}:`, err);
      throw err;
    }
  }, []);

  // Enable or disable a plugin
  const toggleEnabled = useCallback(async (pluginId: string, enabled: boolean) => {
    try {
      const updatedPlugin = await setPluginEnabled(pluginId, enabled);
      
      // Update local state
      setPlugins(prev => prev.map(p => p.id === pluginId ? updatedPlugin : p));
      
      // Update registry
      await pluginRegistry.refreshPlugins();
      
      return updatedPlugin;
    } catch (err) {
      console.error(`Failed to ${enabled ? 'enable' : 'disable'} plugin ${pluginId}:`, err);
      throw err;
    }
  }, []);

  return {
    plugins,
    loading,
    error,
    refreshPlugins: loadPlugins,
    installPlugin: install,
    uninstallPlugin: uninstall,
    updatePluginConfig: updateConfig,
    setPluginEnabled: toggleEnabled
  };
} 