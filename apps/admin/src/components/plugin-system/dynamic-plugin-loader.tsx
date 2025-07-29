import React, { useEffect, useState, useCallback } from 'react';
import { useModuleFederationPluginManager } from '@/lib/module-federation-plugin-manager';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@ticketbase/api';
import type { FederationPluginMetadata } from '@ticketbase/api/services/module-federation-loader';

interface DynamicPluginLoaderProps {
  children: React.ReactNode;
  tenantId?: string;
  autoLoad?: boolean;
}

interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  bundleUrl: string;
  remoteEntryUrl: string;
  federationName: string;
  exposes: Record<string, string>;
  shared: Record<string, any>;
  enabled: boolean;
}

export const DynamicPluginLoader: React.FC<DynamicPluginLoaderProps> = ({
  children,
  tenantId,
  autoLoad = true,
}) => {
  const { preloadPlugins, loadedPlugins } = useModuleFederationPluginManager();
  const [loadingPlugins, setLoadingPlugins] = useState<Set<string>>(new Set());
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch enabled plugins for the tenant
  const { data: enabledPlugins, isLoading, error } = useQuery({
    queryKey: ['tenant-plugins', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        // For admin context, load all approved plugins
        const response = await apiClient.get('/api/plugins');
        return response.data.filter((plugin: any) => plugin.status === 'approved');
      } else {
        // For tenant context, load tenant-specific enabled plugins
        const response = await apiClient.get(`/api/tenants/${tenantId}/plugins`);
        return response.data.filter((plugin: any) => plugin.enabled);
      }
    },
    enabled: autoLoad,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform plugin data to federation metadata
  const transformToFederationMetadata = useCallback((plugins: PluginMetadata[]): FederationPluginMetadata[] => {
    return plugins.map(plugin => ({
      id: plugin.id,
      federationName: plugin.federationName || `${plugin.id.replace(/[^a-zA-Z0-9_]/g, '_')}_plugin`,
      remoteEntryUrl: plugin.remoteEntryUrl || plugin.bundleUrl,
      exposes: plugin.exposes || { './plugin': './src/index.tsx' },
      shared: plugin.shared || {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'ticketsplatform-plugin-sdk': { singleton: true },
      },
      version: plugin.version,
    }));
  }, []);

  // Load plugins when they become available
  useEffect(() => {
    if (!enabledPlugins || enabledPlugins.length === 0) {
      return;
    }

    const loadPlugins = async () => {
      console.log('🔄 Loading enabled plugins:', enabledPlugins.map((p: any) => p.id));
      
      try {
        setLoadingError(null);
        const federationMetadata = transformToFederationMetadata(enabledPlugins);
        
        // Filter out already loaded plugins
        const pluginsToLoad = federationMetadata.filter(metadata => 
          !loadedPlugins.has(metadata.id)
        );
        
        if (pluginsToLoad.length === 0) {
          console.log('✅ All plugins already loaded');
          return;
        }

        // Set loading state
        const pluginIds = new Set(pluginsToLoad.map(p => p.id));
        setLoadingPlugins(pluginIds);

        // Load plugins
        const loadedPluginList = await preloadPlugins(pluginsToLoad);
        
        console.log(`✅ Successfully loaded ${loadedPluginList.length} plugins:`, 
          loadedPluginList.map(p => p.id)
        );

      } catch (error) {
        console.error('❌ Failed to load plugins:', error);
        setLoadingError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoadingPlugins(new Set());
      }
    };

    loadPlugins();
  }, [enabledPlugins, loadedPlugins, preloadPlugins, transformToFederationMetadata]);

  // Manually load a specific plugin
  const loadPlugin = useCallback(async (pluginId: string) => {
    const plugin = enabledPlugins?.find((p: any) => p.id === pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found in enabled plugins`);
    }

    const metadata = transformToFederationMetadata([plugin])[0];
    setLoadingPlugins(prev => new Set(prev).add(pluginId));

    try {
      const { loadPlugin: loadSinglePlugin } = useModuleFederationPluginManager();
      const loadedPlugin = await loadSinglePlugin(metadata);
      console.log(`✅ Manually loaded plugin: ${pluginId}`);
      return loadedPlugin;
    } catch (error) {
      console.error(`❌ Failed to manually load plugin ${pluginId}:`, error);
      throw error;
    } finally {
      setLoadingPlugins(prev => {
        const newSet = new Set(prev);
        newSet.delete(pluginId);
        return newSet;
      });
    }
  }, [enabledPlugins, transformToFederationMetadata]);

  // Get loading status
  const getLoadingStatus = useCallback(() => {
    return {
      isLoading: isLoading || loadingPlugins.size > 0,
      loadingPlugins: Array.from(loadingPlugins),
      error: error || loadingError,
      totalPlugins: enabledPlugins?.length || 0,
      loadedPluginsCount: loadedPlugins.size,
    };
  }, [isLoading, loadingPlugins, error, loadingError, enabledPlugins, loadedPlugins]);

  // Provide context to children if needed
  const contextValue = {
    loadPlugin,
    getLoadingStatus,
    enabledPlugins: enabledPlugins || [],
  };

  // Make plugin loader globally available for debugging
  useEffect(() => {
    (window as any).__DYNAMIC_PLUGIN_LOADER__ = {
      loadPlugin,
      getLoadingStatus,
      enabledPlugins: enabledPlugins || [],
    };
  }, [loadPlugin, getLoadingStatus, enabledPlugins]);

  return (
    <DynamicPluginLoaderContext.Provider value={contextValue}>
      {children}
    </DynamicPluginLoaderContext.Provider>
  );
};

// Context for accessing plugin loader functionality
const DynamicPluginLoaderContext = React.createContext<{
  loadPlugin: (pluginId: string) => Promise<any>;
  getLoadingStatus: () => any;
  enabledPlugins: any[];
} | null>(null);

export const useDynamicPluginLoader = () => {
  const context = React.useContext(DynamicPluginLoaderContext);
  if (!context) {
    throw new Error('useDynamicPluginLoader must be used within a DynamicPluginLoader');
  }
  return context;
};

// Hook for getting plugin loading status
export const usePluginLoadingStatus = () => {
  const { getLoadingStatus } = useDynamicPluginLoader();
  const [status, setStatus] = useState(getLoadingStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getLoadingStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [getLoadingStatus]);

  return status;
};

// Component for displaying plugin loading status
export const PluginLoadingStatus: React.FC = () => {
  const status = usePluginLoadingStatus();

  if (!status.isLoading && status.error === null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
      {status.isLoading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">
            Loading plugins... ({status.loadedPluginsCount}/{status.totalPlugins})
          </span>
        </div>
      )}
      
      {status.loadingPlugins.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500">Loading:</div>
          <ul className="text-xs text-gray-600 list-disc list-inside">
            {status.loadingPlugins.map(pluginId => (
              <li key={pluginId}>{pluginId}</li>
            ))}
          </ul>
        </div>
      )}

      {status.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
          Error: {status.error}
        </div>
      )}
    </div>
  );
};