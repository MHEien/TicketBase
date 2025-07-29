/**
 * Module Federation Plugin Loader
 * Securely loads and manages plugin remotes using Module Federation
 */

export interface FederationPluginMetadata {
  id: string;
  federationName: string;
  remoteEntryUrl: string;
  exposes: Record<string, string>;
  shared: Record<string, any>;
  version: string;
}

export interface LoadedPlugin {
  id: string;
  module: any;
  puckComponents?: any[];
  extensionPoints?: Record<string, any>;
  metadata: FederationPluginMetadata;
}

export class ModuleFederationLoader {
  private loadedPlugins = new Map<string, LoadedPlugin>();
  private loadingPromises = new Map<string, Promise<LoadedPlugin>>();
  private remoteContainers = new Map<string, any>();

  /**
   * Loads a plugin using Module Federation
   * @param metadata - Plugin federation metadata
   * @returns Promise resolving to loaded plugin
   */
  async loadPlugin(metadata: FederationPluginMetadata): Promise<LoadedPlugin> {
    const { id, remoteEntryUrl, federationName } = metadata;

    // Check if plugin is already loaded
    if (this.loadedPlugins.has(id)) {
      return this.loadedPlugins.get(id)!;
    }

    // Check if plugin is currently loading
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id)!;
    }

    // Start loading process
    const loadingPromise = this._loadPluginInternal(metadata);
    this.loadingPromises.set(id, loadingPromise);

    try {
      const loadedPlugin = await loadingPromise;
      this.loadedPlugins.set(id, loadedPlugin);
      return loadedPlugin;
    } finally {
      this.loadingPromises.delete(id);
    }
  }

  /**
   * Internal plugin loading implementation
   */
  private async _loadPluginInternal(metadata: FederationPluginMetadata): Promise<LoadedPlugin> {
    const { id, remoteEntryUrl, federationName } = metadata;

    try {
      console.log(`🔄 Loading Module Federation plugin: ${id}`);
      
      // Load the remote container
      const container = await this._loadRemoteContainer(remoteEntryUrl, federationName);
      
      // Initialize the container with shared dependencies
      await this._initializeContainer(container, metadata.shared);
      
      // Load the main plugin module
      const pluginModule = await container.get('./plugin');
      const plugin = pluginModule();

      console.log(`✅ Successfully loaded plugin: ${id}`, plugin);

      // Extract plugin components and extension points
      const loadedPlugin: LoadedPlugin = {
        id,
        module: plugin,
        puckComponents: plugin.puckComponents || [],
        extensionPoints: plugin.extensionPoints || {},
        metadata,
      };

      // Register with global plugin registry if available
      this._registerWithGlobalRegistry(loadedPlugin);

      return loadedPlugin;
    } catch (error) {
      console.error(`❌ Failed to load plugin ${id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to load plugin ${id}: ${errorMessage}`);
    }
  }

  /**
   * Loads a remote container from the federation entry point
   */
  private async _loadRemoteContainer(remoteEntryUrl: string, federationName: string): Promise<any> {
    // Check if container is already loaded
    if (this.remoteContainers.has(federationName)) {
      return this.remoteContainers.get(federationName);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = remoteEntryUrl;

      script.onload = () => {
        // Try different patterns to find the container
        let container = (window as any)[federationName];
        
        // Fallback patterns for different Module Federation versions
        if (!container) {
          // Try with underscore replacement
          const altName = federationName.replace(/-/g, '_');
          container = (window as any)[altName];
        }
        
        if (!container) {
          // Try global container registry
          container = (window as any).__webpack_require__?.cache?.[federationName];
        }

        if (!container) {
          reject(new Error(`Remote container ${federationName} not found after loading ${remoteEntryUrl}. Available globals: ${Object.keys(window).filter(k => k.includes('plugin') || k.includes('remote')).join(', ')}`));
          return;
        }

        this.remoteContainers.set(federationName, container);
        resolve(container);
      };

      script.onerror = () => {
        reject(new Error(`Failed to load remote entry: ${remoteEntryUrl}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initializes a container with shared dependencies
   */
  private async _initializeContainer(container: any, shared: Record<string, any>): Promise<void> {
    if (typeof container.init === 'function') {
      // Get shared modules from the host
      const sharedModules = this._getSharedModules(shared);
      await container.init(sharedModules);
    }
  }

  /**
   * Gets shared modules for container initialization
   */
  private _getSharedModules(shared: Record<string, any>): Record<string, any> {
    const sharedModules: Record<string, any> = {};

    // Check if we're in Node.js environment (SSR)
    const isNodeEnv = typeof window === 'undefined';
    
    if (isNodeEnv) {
      // For SSR, create a require function using createRequire
      const { createRequire } = eval('require')('node:module');
      const require = createRequire(import.meta.url);
      
      // Add React and ReactDOM as shared
      if (shared.react) {
        sharedModules.react = {
          get: () => () => require('react'),
          loaded: true,
        };
      }

      if (shared['react-dom']) {
        sharedModules['react-dom'] = {
          get: () => () => require('react-dom'),
          loaded: true,
        };
      }

      // Add plugin SDK as shared
      if (shared['ticketsplatform-plugin-sdk']) {
        sharedModules['ticketsplatform-plugin-sdk'] = {
          get: () => () => require('ticketsplatform-plugin-sdk'),
          loaded: true,
        };
      }
    } else {
      // For browser, use dynamic imports
      if (shared.react) {
        sharedModules.react = {
          get: () => () => import('react'),
          loaded: true,
        };
      }

      if (shared['react-dom']) {
        sharedModules['react-dom'] = {
          get: () => () => import('react-dom'),
          loaded: true,
        };
      }

      // Add plugin SDK as shared
      if (shared['ticketsplatform-plugin-sdk']) {
        sharedModules['ticketsplatform-plugin-sdk'] = {
          get: () => () => import('ticketsplatform-plugin-sdk'),
          loaded: true,
        };
      }
    }

    return sharedModules;
  }

  /**
   * Registers plugin with global registries (Puck, extension points, etc.)
   */
  private _registerWithGlobalRegistry(plugin: LoadedPlugin): void {
    // Register Puck components if available
    if (plugin.puckComponents && Array.isArray(plugin.puckComponents)) {
      if (typeof (window as any).registerPuckComponents === 'function') {
        (window as any).registerPuckComponents(plugin.puckComponents);
        console.log(`🎨 Registered ${plugin.puckComponents.length} Puck components for plugin ${plugin.id}`);
      }
    }

    // Register extension points if available
    if (plugin.extensionPoints && typeof plugin.extensionPoints === 'object') {
      if (typeof (window as any).registerExtensionPoints === 'function') {
        (window as any).registerExtensionPoints(plugin.id, plugin.extensionPoints);
        console.log(`🔌 Registered extension points for plugin ${plugin.id}:`, Object.keys(plugin.extensionPoints));
      }
    }

    // Dispatch plugin loaded event
    window.dispatchEvent(new CustomEvent('plugin-loaded', {
      detail: {
        pluginId: plugin.id,
        plugin: plugin,
      }
    }));
  }

  /**
   * Unloads a plugin and cleans up resources
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      console.warn(`Plugin ${pluginId} is not loaded`);
      return;
    }

    try {
      // Unregister from global registries
      if (typeof (window as any).unregisterPuckComponents === 'function') {
        (window as any).unregisterPuckComponents(plugin.puckComponents || []);
      }

      if (typeof (window as any).unregisterExtensionPoints === 'function') {
        (window as any).unregisterExtensionPoints(pluginId);
      }

      // Clean up resources
      this.loadedPlugins.delete(pluginId);
      
      // Note: We don't remove the remote container as it might be shared
      // This is a limitation of current Module Federation implementation

      console.log(`🗑️ Unloaded plugin: ${pluginId}`);

      // Dispatch plugin unloaded event
      window.dispatchEvent(new CustomEvent('plugin-unloaded', {
        detail: { pluginId }
      }));
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Gets a loaded plugin by ID
   */
  getPlugin(pluginId: string): LoadedPlugin | undefined {
    return this.loadedPlugins.get(pluginId);
  }

  /**
   * Gets all loaded plugins
   */
  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Checks if a plugin is loaded
   */
  isPluginLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId);
  }

  /**
   * Preloads multiple plugins concurrently
   */
  async preloadPlugins(pluginMetadataList: FederationPluginMetadata[]): Promise<LoadedPlugin[]> {
    console.log(`🚀 Preloading ${pluginMetadataList.length} plugins...`);
    
    const loadPromises = pluginMetadataList.map(metadata => this.loadPlugin(metadata));
    const results = await Promise.allSettled(loadPromises);
    
    const successful: LoadedPlugin[] = [];
    const failed: string[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push(pluginMetadataList[index]?.id || 'unknown');
        console.error(`Failed to preload plugin ${pluginMetadataList[index]?.id || 'unknown'}:`, result.reason);
      }
    });
    
    console.log(`✅ Preloaded ${successful.length} plugins successfully`);
    if (failed.length > 0) {
      console.warn(`❌ Failed to preload ${failed.length} plugins:`, failed);
    }
    
    return successful;
  }
}

// Export singleton instance
export const moduleFederationLoader = new ModuleFederationLoader();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).__MODULE_FEDERATION_LOADER__ = moduleFederationLoader;
}