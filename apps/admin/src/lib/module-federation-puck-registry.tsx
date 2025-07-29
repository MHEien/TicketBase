import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ComponentConfig } from '@measured/puck';

interface PuckComponent {
  id: string;
  name: string;
  category?: string;
  component: React.ComponentType<any>;
  defaultProps?: any;
  fields?: any;
  description?: string;
  pluginId?: string;
}

interface ModuleFederationPuckRegistryContext {
  registeredComponents: Map<string, PuckComponent>;
  registerComponents: (components: PuckComponent[]) => void;
  unregisterComponents: (componentIds: string[]) => void;
  getComponentConfig: () => ComponentConfig;
  getComponentsByCategory: (category?: string) => PuckComponent[];
}

const ModuleFederationPuckRegistryContext = createContext<ModuleFederationPuckRegistryContext | null>(null);

interface ModuleFederationPuckRegistryProviderProps {
  children: React.ReactNode;
}

export const ModuleFederationPuckRegistryProvider: React.FC<ModuleFederationPuckRegistryProviderProps> = ({ children }) => {
  const [registeredComponents, setRegisteredComponents] = useState<Map<string, PuckComponent>>(new Map());

  // Listen for plugin component registrations
  useEffect(() => {
    const handlePuckComponentsRegistered = (event: CustomEvent) => {
      const { components } = event.detail;
      console.log('🎨 Registering Puck components from plugin:', components);
      
      if (Array.isArray(components)) {
        const puckComponents: PuckComponent[] = components.map(comp => ({
          id: comp.id,
          name: comp.label || comp.name,
          category: comp.category,
          component: comp.render,
          defaultProps: comp.defaultProps,
          fields: comp.fields,
          description: comp.description,
          pluginId: comp.pluginId,
        }));
        
        registerComponents(puckComponents);
      }
    };

    window.addEventListener('puck-components-registered', handlePuckComponentsRegistered as EventListener);

    return () => {
      window.removeEventListener('puck-components-registered', handlePuckComponentsRegistered as EventListener);
    };
  }, []);

  // Listen for plugin unloads to clean up components
  useEffect(() => {
    const handlePluginUnloaded = (event: CustomEvent) => {
      const { pluginId } = event.detail;
      console.log('🗑️ Removing Puck components for unloaded plugin:', pluginId);
      
      // Find and remove components from this plugin
      const componentsToRemove: string[] = [];
      registeredComponents.forEach((component, id) => {
        if (component.pluginId === pluginId) {
          componentsToRemove.push(id);
        }
      });
      
      if (componentsToRemove.length > 0) {
        unregisterComponents(componentsToRemove);
      }
    };

    window.addEventListener('plugin-unloaded', handlePluginUnloaded as EventListener);

    return () => {
      window.removeEventListener('plugin-unloaded', handlePluginUnloaded as EventListener);
    };
  }, [registeredComponents]);

  const registerComponents = useCallback((components: PuckComponent[]) => {
    setRegisteredComponents(prev => {
      const newMap = new Map(prev);
      components.forEach(component => {
        newMap.set(component.id, component);
        console.log(`✅ Registered Puck component: ${component.id} from plugin: ${component.pluginId || 'core'}`);
      });
      return newMap;
    });
  }, []);

  const unregisterComponents = useCallback((componentIds: string[]) => {
    setRegisteredComponents(prev => {
      const newMap = new Map(prev);
      componentIds.forEach(id => {
        newMap.delete(id);
        console.log(`🗑️ Unregistered Puck component: ${id}`);
      });
      return newMap;
    });
  }, []);

  const getComponentConfig = useCallback((): ComponentConfig => {
    const config: ComponentConfig = {};
    
    registeredComponents.forEach((component, id) => {
      config[id] = {
        render: component.component,
        defaultProps: component.defaultProps || {},
        fields: component.fields || {},
      };
    });

    return config;
  }, [registeredComponents]);

  const getComponentsByCategory = useCallback((category?: string): PuckComponent[] => {
    const components = Array.from(registeredComponents.values());
    
    if (!category) {
      return components;
    }
    
    return components.filter(component => component.category === category);
  }, [registeredComponents]);

  const contextValue: ModuleFederationPuckRegistryContext = {
    registeredComponents,
    registerComponents,
    unregisterComponents,
    getComponentConfig,
    getComponentsByCategory,
  };

  // Make registry globally available for plugins
  useEffect(() => {
    (window as any).registerPuckComponents = (components: any[]) => {
      // Convert plugin components to our format
      const puckComponents: PuckComponent[] = components.map(comp => ({
        id: comp.id,
        name: comp.label || comp.name,
        category: comp.category,
        component: comp.render,
        defaultProps: comp.defaultProps,
        fields: comp.fields,
        description: comp.description,
      }));
      
      registerComponents(puckComponents);
      
      // Dispatch event for other systems
      window.dispatchEvent(new CustomEvent('puck-components-registered', {
        detail: { components: puckComponents }
      }));
    };

    (window as any).unregisterPuckComponents = (components: any[]) => {
      const componentIds = components.map(comp => comp.id);
      unregisterComponents(componentIds);
    };

    return () => {
      delete (window as any).registerPuckComponents;
      delete (window as any).unregisterPuckComponents;
    };
  }, [registerComponents, unregisterComponents]);

  return (
    <ModuleFederationPuckRegistryContext.Provider value={contextValue}>
      {children}
    </ModuleFederationPuckRegistryContext.Provider>
  );
};

export const useModuleFederationPuckRegistry = (): ModuleFederationPuckRegistryContext => {
  const context = useContext(ModuleFederationPuckRegistryContext);
  if (!context) {
    throw new Error('useModuleFederationPuckRegistry must be used within a ModuleFederationPuckRegistryProvider');
  }
  return context;
};

// Hook specifically for getting Puck component configuration
export const usePuckConfig = () => {
  const { getComponentConfig } = useModuleFederationPuckRegistry();
  return getComponentConfig();
};

// Hook for getting components by category (useful for component palette)
export const usePuckComponentsByCategory = (category?: string) => {
  const { getComponentsByCategory } = useModuleFederationPuckRegistry();
  return getComponentsByCategory(category);
};