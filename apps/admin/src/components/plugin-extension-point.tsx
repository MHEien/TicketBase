/**
 * Plugin Extension Point Component
 * Renders all plugins registered for a specific extension point
 */

import React, { useEffect, useState, useMemo } from 'react';
import { pluginManager, type LoadedPlugin, type PluginContext } from '@/lib/plugin-manager';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface PluginExtensionPointProps {
  /** The extension point to render plugins for */
  extensionPoint: string;
  /** Context to pass to plugin components */
  context: PluginContext;
  /** Optional filter function to control which plugins are rendered */
  filter?: (plugin: LoadedPlugin) => boolean;
  /** Whether to show loading state */
  showLoading?: boolean;
  /** Whether to show error states */
  showErrors?: boolean;
  /** Wrapper component for each plugin */
  pluginWrapper?: React.ComponentType<{ 
    plugin: LoadedPlugin; 
    children: React.ReactNode;
    error?: string;
  }>;
  /** Fallback component when no plugins are available */
  fallback?: React.ComponentType;
  /** Additional props to pass to plugin components */
  pluginProps?: Record<string, any>;
}

export const PluginExtensionPoint: React.FC<PluginExtensionPointProps> = ({
  extensionPoint,
  context,
  filter,
  showLoading = true,
  showErrors = true,
  pluginWrapper: PluginWrapper,
  fallback: Fallback,
  pluginProps = {},
}) => {
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Array<{ plugin: LoadedPlugin; error: string }>>([]);

  // Get plugins for this extension point
  const availablePlugins = useMemo(() => {
    let extensionPlugins = pluginManager.getPluginsForExtensionPoint(extensionPoint);
    
    if (filter) {
      extensionPlugins = extensionPlugins.filter(filter);
    }
    
    return extensionPlugins;
  }, [extensionPoint, filter]);

  // Update plugins when they change
  useEffect(() => {
    const updatePlugins = () => {
      setPlugins(availablePlugins);
    };

    // Initial load
    updatePlugins();

    // Listen for plugin events
    const handlePluginLoaded = ({ plugin }: { plugin: LoadedPlugin }) => {
      if (plugin.metadata.extensionPoints?.includes(extensionPoint)) {
        updatePlugins();
      }
    };

    const handlePluginUnloaded = ({ pluginId }: { pluginId: string }) => {
      setPlugins(prev => prev.filter(p => p.metadata.id !== pluginId));
    };

    const handlePluginError = ({ plugin, error }: { plugin: LoadedPlugin; error: any }) => {
      if (plugin.metadata.extensionPoints?.includes(extensionPoint)) {
        setErrors(prev => [...prev, { plugin, error: error.message || 'Unknown error' }]);
      }
    };

    pluginManager.on('plugin:loaded', handlePluginLoaded);
    pluginManager.on('plugin:unloaded', handlePluginUnloaded);
    pluginManager.on('plugin:error', handlePluginError);

    return () => {
      pluginManager.off('plugin:loaded', handlePluginLoaded);
      pluginManager.off('plugin:unloaded', handlePluginUnloaded);
      pluginManager.off('plugin:error', handlePluginError);
    };
  }, [extensionPoint, availablePlugins]);

  // Render loading state
  if (loading && showLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  // Render fallback if no plugins
  if (plugins.length === 0) {
    if (Fallback) {
      return <Fallback />;
    }
    return null;
  }

  return (
    <div className="plugin-extension-point" data-extension-point={extensionPoint}>
      {/* Render error alerts */}
      {showErrors && errors.map(({ plugin, error }, index) => (
        <Alert key={`error-${plugin.metadata.id}-${index}`} variant="destructive" className="mb-4">
          <AlertDescription>
            Plugin "{plugin.metadata.name}" failed to load: {error}
          </AlertDescription>
        </Alert>
      ))}

      {/* Render plugin components */}
      {plugins.map((plugin) => {
        if (!plugin.isLoaded || !plugin.extensionPoints[extensionPoint]) {
          return null;
        }

        const Component = plugin.extensionPoints[extensionPoint];
        
        try {
          const pluginElement = (
            <Component
              key={plugin.metadata.id}
              context={context}
              pluginId={plugin.metadata.id}
              sdk={typeof window !== 'undefined' ? (window as any).PluginSDK : null}
              {...pluginProps}
            />
          );

          // Wrap with custom wrapper if provided
          if (PluginWrapper) {
            return (
              <PluginWrapper key={plugin.metadata.id} plugin={plugin}>
                {pluginElement}
              </PluginWrapper>
            );
          }

          return pluginElement;
        } catch (error) {
          console.error(`Error rendering plugin ${plugin.metadata.id}:`, error);
          
          if (showErrors) {
            return (
              <Alert key={`render-error-${plugin.metadata.id}`} variant="destructive" className="mb-4">
                <AlertDescription>
                  Error rendering plugin "{plugin.metadata.name}": {error instanceof Error ? error.message : 'Unknown error'}
                </AlertDescription>
              </Alert>
            );
          }
          
          return null;
        }
      })}
    </div>
  );
};

/**
 * Hook to get plugins for an extension point
 */
export const usePlugins = (extensionPoint: string, filter?: (plugin: LoadedPlugin) => boolean) => {
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([]);

  useEffect(() => {
    const updatePlugins = () => {
      let extensionPlugins = pluginManager.getPluginsForExtensionPoint(extensionPoint);
      
      if (filter) {
        extensionPlugins = extensionPlugins.filter(filter);
      }
      
      setPlugins(extensionPlugins);
    };

    updatePlugins();

    const handlePluginChange = () => updatePlugins();
    
    pluginManager.on('plugin:loaded', handlePluginChange);
    pluginManager.on('plugin:unloaded', handlePluginChange);

    return () => {
      pluginManager.off('plugin:loaded', handlePluginChange);
      pluginManager.off('plugin:unloaded', handlePluginChange);
    };
  }, [extensionPoint, filter]);

  return plugins;
};

/**
 * Hook to check if a specific plugin is loaded
 */
export const usePluginLoaded = (pluginId: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(pluginManager.isPluginLoaded(pluginId));

    const handlePluginLoaded = ({ plugin }: { plugin: LoadedPlugin }) => {
      if (plugin.metadata.id === pluginId) {
        setIsLoaded(true);
      }
    };

    const handlePluginUnloaded = ({ pluginId: unloadedId }: { pluginId: string }) => {
      if (unloadedId === pluginId) {
        setIsLoaded(false);
      }
    };

    pluginManager.on('plugin:loaded', handlePluginLoaded);
    pluginManager.on('plugin:unloaded', handlePluginUnloaded);

    return () => {
      pluginManager.off('plugin:loaded', handlePluginLoaded);
      pluginManager.off('plugin:unloaded', handlePluginUnloaded);
    };
  }, [pluginId]);

  return isLoaded;
};

export default PluginExtensionPoint; 