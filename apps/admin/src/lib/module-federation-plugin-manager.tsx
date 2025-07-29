import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { moduleFederationLoader, type FederationPluginMetadata, type LoadedPlugin } from '@ticketbase/api/services/module-federation-loader';

interface ModuleFederationPluginManagerContext {
  loadedPlugins: Map<string, LoadedPlugin>;
  loadPlugin: (metadata: FederationPluginMetadata) => Promise<LoadedPlugin>;
  unloadPlugin: (pluginId: string) => Promise<void>;
  isPluginLoaded: (pluginId: string) => boolean;
  getPlugin: (pluginId: string) => LoadedPlugin | undefined;
  preloadPlugins: (pluginMetadataList: FederationPluginMetadata[]) => Promise<LoadedPlugin[]>;
}

const ModuleFederationPluginManagerContext = createContext<ModuleFederationPluginManagerContext | null>(null);

interface ModuleFederationPluginManagerProviderProps {
  children: React.ReactNode;
}

export const ModuleFederationPluginManagerProvider: React.FC<ModuleFederationPluginManagerProviderProps> = ({ children }) => {
  const [loadedPlugins, setLoadedPlugins] = useState<Map<string, LoadedPlugin>>(new Map());

  // Update state when plugins are loaded/unloaded
  useEffect(() => {
    const handlePluginLoaded = (event: CustomEvent) => {
      const { pluginId, plugin } = event.detail;
      setLoadedPlugins(prev => new Map(prev).set(pluginId, plugin));
    };

    const handlePluginUnloaded = (event: CustomEvent) => {
      const { pluginId } = event.detail;
      setLoadedPlugins(prev => {
        const newMap = new Map(prev);
        newMap.delete(pluginId);
        return newMap;
      });
    };

    window.addEventListener('plugin-loaded', handlePluginLoaded as EventListener);
    window.addEventListener('plugin-unloaded', handlePluginUnloaded as EventListener);

    return () => {
      window.removeEventListener('plugin-loaded', handlePluginLoaded as EventListener);
      window.removeEventListener('plugin-unloaded', handlePluginUnloaded as EventListener);
    };
  }, []);

  const loadPlugin = useCallback(async (metadata: FederationPluginMetadata): Promise<LoadedPlugin> => {
    console.log('🔄 Loading plugin via Module Federation:', metadata.id);
    return await moduleFederationLoader.loadPlugin(metadata);
  }, []);

  const unloadPlugin = useCallback(async (pluginId: string): Promise<void> => {
    console.log('🗑️ Unloading plugin:', pluginId);
    await moduleFederationLoader.unloadPlugin(pluginId);
  }, []);

  const isPluginLoaded = useCallback((pluginId: string): boolean => {
    return moduleFederationLoader.isPluginLoaded(pluginId);
  }, []);

  const getPlugin = useCallback((pluginId: string): LoadedPlugin | undefined => {
    return moduleFederationLoader.getPlugin(pluginId);
  }, []);

  const preloadPlugins = useCallback(async (pluginMetadataList: FederationPluginMetadata[]): Promise<LoadedPlugin[]> => {
    console.log('🚀 Preloading plugins via Module Federation:', pluginMetadataList.map(p => p.id));
    return await moduleFederationLoader.preloadPlugins(pluginMetadataList);
  }, []);

  const contextValue: ModuleFederationPluginManagerContext = {
    loadedPlugins,
    loadPlugin,
    unloadPlugin,
    isPluginLoaded,
    getPlugin,
    preloadPlugins,
  };

  return (
    <ModuleFederationPluginManagerContext.Provider value={contextValue}>
      {children}
    </ModuleFederationPluginManagerContext.Provider>
  );
};

export const useModuleFederationPluginManager = (): ModuleFederationPluginManagerContext => {
  const context = useContext(ModuleFederationPluginManagerContext);
  if (!context) {
    throw new Error('useModuleFederationPluginManager must be used within a ModuleFederationPluginManagerProvider');
  }
  return context;
};

// Hook for components that want to access a specific plugin
export const usePlugin = (pluginId: string): LoadedPlugin | undefined => {
  const { getPlugin } = useModuleFederationPluginManager();
  return getPlugin(pluginId);
};

// Hook for components that want to load a plugin on demand
export const usePluginLoader = () => {
  const { loadPlugin, unloadPlugin, isPluginLoaded } = useModuleFederationPluginManager();
  
  return {
    loadPlugin,
    unloadPlugin,
    isPluginLoaded,
  };
};