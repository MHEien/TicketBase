import type { PluginRegistry, PluginComponentDefinition } from './types';
import '@/components/fullscreen-puck.css';
// Extend Window interface to include loadedPlugins
declare global {
  interface Window {
    loadedPlugins?: Record<string, any>;
  }
}

class EditorPluginRegistry implements PluginRegistry {
  public components: Map<string, PluginComponentDefinition> = new Map();
  private subscribers: Set<(components: PluginComponentDefinition[]) => void> = new Set();

  constructor() {
    // Listen for plugin status changes from the platform
    this.initializePluginListener();
  }

  private initializePluginListener() {
    // Listen for custom events from the platform
    window.addEventListener('plugin:activated', this.handlePluginActivated.bind(this) as EventListener);
    window.addEventListener('plugin:deactivated', this.handlePluginDeactivated.bind(this) as EventListener);
    window.addEventListener('plugin:updated', this.handlePluginUpdated.bind(this) as EventListener);
  }

  private handlePluginActivated(event: Event) {
    const customEvent = event as CustomEvent;
    const { components } = customEvent.detail;
    
    if (components && Array.isArray(components)) {
      components.forEach((componentDef: PluginComponentDefinition) => {
        this.register(componentDef);
      });
    }
  }

  private handlePluginDeactivated(event: Event) {
    const customEvent = event as CustomEvent;
    const { pluginId } = customEvent.detail;
    
    // Remove all components for this plugin
    const toRemove: string[] = [];
    this.components.forEach((def, id) => {
      if (def.pluginId === pluginId) {
        toRemove.push(id);
      }
    });
    
    toRemove.forEach(id => this.unregister(id));
  }

  private handlePluginUpdated(event: Event) {
    const customEvent = event as CustomEvent;
    const { pluginId } = customEvent.detail;
    
    // Remove old components for this plugin
    this.handlePluginDeactivated(new CustomEvent('plugin:deactivated', { detail: { pluginId } }));
    
    // Add updated components
    this.handlePluginActivated(event);
  }

  subscribe(callback: (components: PluginComponentDefinition[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current components
    callback(this.getActiveComponents());
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  register(definition: PluginComponentDefinition): void {
    console.log('🔌 Plugin Registry: Attempting to register definition:', definition);
    
    // Validate the component definition
    if (!this.validateComponentDefinition(definition)) {
      console.warn('🔌 Plugin Registry: Invalid plugin component definition:', definition);
      return;
    }

    console.log('🔌 Plugin Registry: Component definition validated successfully');
    
    // Register the component
    this.components.set(definition.id, definition);
    console.log('🔌 Plugin Registry: Component added to registry. New size:', this.components.size);
    
    // Notify subscribers
    this.notifySubscribers();
  }

  unregister(componentId: string): void {
    if (this.components.has(componentId)) {
      this.components.delete(componentId);
      this.notifySubscribers();
    }
  }

  getActiveComponents(): PluginComponentDefinition[] {
    return Array.from(this.components.values());
  }

  private validateComponentDefinition(definition: PluginComponentDefinition): boolean {
    console.log('🔌 Plugin Registry: Validating component definition...');
    
    // Basic validation
    if (!definition.id || !definition.name || !definition.component) {
      console.warn('🔌 Plugin Registry: Failed basic validation. Missing:', {
        id: !definition.id,
        name: !definition.name, 
        component: !definition.component
      });
      return false;
    }

    const { component } = definition;
    console.log('🔌 Plugin Registry: Component object:', component);
    
    // Validate required component properties
    if (!component.label || !component.render || typeof component.render !== 'function') {
      console.warn('🔌 Plugin Registry: Failed component properties validation. Issues:', {
        noLabel: !component.label,
        noRender: !component.render,
        renderNotFunction: typeof component.render !== 'function'
      });
      return false;
    }

    // Validate defaultProps
    if (!component.defaultProps || typeof component.defaultProps !== 'object') {
      console.warn('🔌 Plugin Registry: Failed defaultProps validation:', {
        missing: !component.defaultProps,
        type: typeof component.defaultProps
      });
      return false;
    }

    // Validate fields
    if (!component.fields || typeof component.fields !== 'object') {
      console.warn('🔌 Plugin Registry: Failed fields validation:', {
        missing: !component.fields,
        type: typeof component.fields
      });
      return false;
    }

    console.log('🔌 Plugin Registry: All validations passed!');
    return true;
  }

  private notifySubscribers(): void {
    const components = this.getActiveComponents();
    this.subscribers.forEach(callback => {
      try {
        callback(components);
      } catch (error) {
        console.error('Error notifying plugin registry subscriber:', error);
      }
    });
  }

  // Load plugin components from externally provided plugin data (no API calls)
  loadPluginComponentsFromData(activatedPlugins: any[]): void {
    console.log('🔌 Plugin Registry: Loading components from provided data:', activatedPlugins);
    
    // Extract Puck components from each activated plugin
    for (const plugin of activatedPlugins) {
      console.log('🔌 Plugin Registry: Processing plugin:', plugin.pluginId || plugin.id, plugin.metadata);
      
      // Check multiple possible locations for puckComponents
      const puckComponents = plugin.metadata?.puckComponents || 
                            plugin.puckComponents || 
                            plugin.bundleMetadata?.puckComponents ||
                            plugin.packageMetadata?.puckComponents;
      
      if (puckComponents && Array.isArray(puckComponents)) {
        console.log('🔌 Plugin Registry: Found puckComponents:', puckComponents);
        
        puckComponents.forEach((puckComponent: any) => {
          console.log('🔌 Plugin Registry: Registering component:', puckComponent.id);
          
          // Transform the plugin's Puck component to our format
          // Since the database only contains basic metadata, we need to construct
          // a valid Puck component definition with proper defaults
          const componentDef: PluginComponentDefinition = {
            id: puckComponent.id,
            name: puckComponent.name || puckComponent.label || plugin.metadata?.displayName || plugin.name,
            component: {
              // Ensure label is always present for validation
              label: puckComponent.name || puckComponent.label || plugin.metadata?.displayName || plugin.name,
              // Provide default props suitable for the component type
              defaultProps: puckComponent.defaultProps || this.getDefaultPropsForComponent(puckComponent.id),
              // Provide basic field definitions
              fields: puckComponent.fields || this.getDefaultFieldsForComponent(puckComponent.id),
              render: this.createPluginRenderer(plugin.pluginId || plugin.id, puckComponent),
              category: puckComponent.category || plugin.category || 'Plugin Components',
              icon: puckComponent.icon || plugin.metadata?.iconUrl,
            },
            pluginId: plugin.pluginId || plugin.id,
            version: plugin.version,
            extensionPoint: 'puck-editor',
          };
          
          this.register(componentDef);
          console.log('🔌 Plugin Registry: Successfully registered component:', componentDef.id);
        });
      } else {
        console.log('🔌 Plugin Registry: No puckComponents found for plugin:', plugin.pluginId || plugin.id);
        console.log('🔌 Plugin Registry: Available metadata keys:', Object.keys(plugin.metadata || {}));
      }
    }
    
    console.log('🔌 Plugin Registry: Total components registered:', this.components.size);
  }

  // Legacy method for backwards compatibility - now delegates to external loading
  async loadPluginComponents(tenantId: string): Promise<void> {
    console.log('🔌 Plugin Registry: Legacy loadPluginComponents called for tenant:', tenantId);
    console.log('🔌 Plugin Registry: Use loadPluginComponentsFromData() with authenticated API data instead');
  }

  private getDefaultPropsForComponent(componentId: string): Record<string, any> {
    // Provide sensible defaults based on component type
    switch (componentId) {
      case 'countdown-widget':
        return {
          title: 'Event Countdown',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Get ready for an amazing experience!',
          showSeconds: true,
          textColor: '#ffffff',
          accentColor: '#3B82F6',
          animation: 'fadeIn',
          styling: {
            blur: 'backdrop-blur-md',
            opacity: 'bg-white/20',
            borderStyle: 'border-white/20',
          },
          spacing: {
            top: 24,
            right: 24,
            bottom: 24,
            left: 24,
          },
          className: '',
        };
      default:
        return {
          title: 'Plugin Component',
          className: '',
        };
    }
  }

  private getDefaultFieldsForComponent(componentId: string): Record<string, any> {
    // Provide basic field definitions based on component type
    switch (componentId) {
      case 'countdown-widget':
        return {
          title: {
            type: 'text',
            label: 'Countdown Title',
          },
          targetDate: {
            type: 'text',
            label: 'Target Date (ISO format)',
          },
          description: {
            type: 'textarea',
            label: 'Description',
          },
          showSeconds: {
            type: 'select',
            label: 'Show Seconds',
            options: [
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ],
          },
          textColor: {
            type: 'text',
            label: 'Text Color (hex)',
          },
          accentColor: {
            type: 'text',
            label: 'Accent Color (hex)',
          },
        };
      default:
        return {
          title: {
            type: 'text',
            label: 'Title',
          },
          className: {
            type: 'text',
            label: 'CSS Classes',
          },
        };
    }
  }

  private createPluginRenderer(pluginId: string, puckComponent: any) {
    return (props: any) => {
      try {
        // Method 1: Try to access plugin from global window object
        if (window.loadedPlugins?.[pluginId]) {
          const plugin = window.loadedPlugins[pluginId];
          const component = plugin.metadata?.puckComponents?.find((c: any) => c.id === puckComponent.id);
          if (component?.render) {
            return component.render(props);
          }
        }

        // Method 2: Try to access the render function directly if it was passed during registration
        if (puckComponent.render && typeof puckComponent.render === 'function') {
          return puckComponent.render(props);
        }

        // Method 3: Dynamic import approach (for future implementation)
        // This could be enhanced to dynamically load the plugin bundle from MinIO
        
        // Fallback: create a placeholder
        return (
          <div className="p-4 border border-blue-300 bg-blue-50 rounded-md text-center">
            <div className="text-2xl mb-2">{puckComponent.icon || '🧩'}</div>
            <p className="text-blue-700 font-medium">{puckComponent.label}</p>
            <p className="text-blue-600 text-sm">Plugin component ready</p>
            <p className="text-xs text-blue-500 mt-1">ID: {puckComponent.id}</p>
          </div>
        );
      } catch (error) {
        console.error(`Error rendering plugin component ${puckComponent.id}:`, error);
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-center">
            <p className="text-red-700 font-medium">Plugin Error</p>
            <p className="text-red-600 text-sm">Failed to render {puckComponent.label}</p>
            <p className="text-xs text-red-500 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        );
      }
    };
  }
}

// Export singleton instance
export const pluginRegistry = new EditorPluginRegistry();

// Export the class for testing
export { EditorPluginRegistry };

// Helper functions for your plugin system to integrate with the editor
export const notifyPluginActivated = (plugin: any) => {
  if (plugin.metadata?.puckComponents) {
    const event = new CustomEvent('plugin:activated', {
      detail: { 
        pluginId: plugin.id,
        components: plugin.metadata.puckComponents.map((puckComponent: any) => ({
          id: puckComponent.id,
          name: puckComponent.label || plugin.metadata.displayName,
          component: {
            label: puckComponent.label,
            defaultProps: puckComponent.defaultProps || {},
            fields: puckComponent.fields || {},
            render: puckComponent.render,
            category: puckComponent.category || plugin.metadata.category,
            icon: puckComponent.icon || plugin.metadata.iconUrl,
          },
          pluginId: plugin.id,
          version: plugin.metadata.version,
          extensionPoint: 'puck-editor',
        }))
      }
    });
    window.dispatchEvent(event);
  }
};

export const notifyPluginDeactivated = (pluginId: string) => {
  const event = new CustomEvent('plugin:deactivated', {
    detail: { pluginId }
  });
  window.dispatchEvent(event);
};

export const notifyPluginUpdated = (plugin: any) => {
  // First deactivate, then activate with new components
  notifyPluginDeactivated(plugin.id);
  notifyPluginActivated(plugin);
};