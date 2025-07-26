import type { PluginRegistry, PluginComponentDefinition } from './types';

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
    // Validate the component definition
    if (!this.validateComponentDefinition(definition)) {
      console.warn('Invalid plugin component definition:', definition);
      return;
    }

    // Register the component
    this.components.set(definition.id, definition);
    
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
    // Basic validation
    if (!definition.id || !definition.name || !definition.component) {
      return false;
    }

    const { component } = definition;
    
    // Validate required component properties
    if (!component.label || !component.render || typeof component.render !== 'function') {
      return false;
    }

    // Validate defaultProps
    if (!component.defaultProps || typeof component.defaultProps !== 'object') {
      return false;
    }

    // Validate fields
    if (!component.fields || typeof component.fields !== 'object') {
      return false;
    }

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

  // Method to manually load plugin components for testing
  async loadPluginComponents(tenantId: string): Promise<void> {
    try {
      // This would typically come from the platform API
      const response = await fetch(`/api/plugins/active-components/${tenantId}`);
      const { components } = await response.json();
      
      components.forEach((componentDef: PluginComponentDefinition) => {
        this.register(componentDef);
      });
    } catch (error) {
      console.error('Failed to load plugin components:', error);
    }
  }
}

// Export singleton instance
export const pluginRegistry = new EditorPluginRegistry();

// Export the class for testing
export { EditorPluginRegistry };