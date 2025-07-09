/**
 * Plugin Manager for Dynamic Module Federation
 * Handles loading, registering, and managing plugins from MinIO storage
 */

import React from "react";
// Note: loadRemote will be available at runtime via Module Federation
declare const loadRemote: any;

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  category: string;
  bundleUrl: string;
  requiredPermissions?: string[];
  extensionPoints?: string[];
  priority?: number;
}

export interface LoadedPlugin {
  metadata: PluginMetadata;
  module: any;
  extensionPoints: Record<string, React.ComponentType<any>>;
  isLoaded: boolean;
  error?: string;
}

export interface PluginContext {
  user: any;
  organization: any;
  permissions: string[];
  sdk: any;
  [key: string]: any;
}

class PluginManager {
  private loadedPlugins = new Map<string, LoadedPlugin>();
  private extensionPointRegistry = new Map<string, LoadedPlugin[]>();
  private eventListeners = new Map<string, Function[]>();

  /**
   * Load a plugin from MinIO storage using Module Federation
   */
  async loadPlugin(metadata: PluginMetadata): Promise<LoadedPlugin> {
    const { id, bundleUrl } = metadata;

    // Check if already loaded
    if (this.loadedPlugins.has(id)) {
      return this.loadedPlugins.get(id)!;
    }

    try {
      console.log(`🔌 Loading plugin: ${id} from ${bundleUrl}`);

      // Load the remote module using dynamic import for Module Federation
      const pluginModule = await this.loadRemotePlugin(bundleUrl, id);

      // Create loaded plugin instance
      const loadedPlugin: LoadedPlugin = {
        metadata,
        module: pluginModule,
        extensionPoints: {},
        isLoaded: true,
      };

      // Extract extension points from the plugin
      if (pluginModule.default && pluginModule.default.extensionPoints) {
        loadedPlugin.extensionPoints = pluginModule.default.extensionPoints;

        // Register extension points
        for (const [extensionPoint, component] of Object.entries(
          loadedPlugin.extensionPoints,
        )) {
          this.registerExtensionPoint(extensionPoint, loadedPlugin);
        }
      }

      // Store the loaded plugin
      this.loadedPlugins.set(id, loadedPlugin);

      // Emit plugin loaded event
      this.emit("plugin:loaded", { plugin: loadedPlugin });

      console.log(`✅ Plugin loaded successfully: ${id}`);
      return loadedPlugin;
    } catch (error) {
      console.error(`❌ Failed to load plugin ${id}:`, error);

      const failedPlugin: LoadedPlugin = {
        metadata,
        module: null,
        extensionPoints: {},
        isLoaded: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      this.loadedPlugins.set(id, failedPlugin);
      this.emit("plugin:error", { plugin: failedPlugin, error });

      return failedPlugin;
    }
  }

  /**
   * Load multiple plugins concurrently
   */
  async loadPlugins(plugins: PluginMetadata[]): Promise<LoadedPlugin[]> {
    console.log(`🔌 Loading ${plugins.length} plugins...`);

    const loadPromises = plugins.map((plugin) => this.loadPlugin(plugin));
    const results = await Promise.allSettled(loadPromises);

    const loadedPlugins = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<LoadedPlugin>).value);

    console.log(
      `✅ Successfully loaded ${loadedPlugins.length}/${plugins.length} plugins`,
    );

    return loadedPlugins;
  }

  /**
   * Get all plugins for a specific extension point
   */
  getPluginsForExtensionPoint(extensionPoint: string): LoadedPlugin[] {
    return this.extensionPointRegistry.get(extensionPoint) || [];
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Get a specific plugin by ID
   */
  getPlugin(id: string): LoadedPlugin | undefined {
    return this.loadedPlugins.get(id);
  }

  /**
   * Check if a plugin is loaded and available
   */
  isPluginLoaded(id: string): boolean {
    const plugin = this.loadedPlugins.get(id);
    return plugin?.isLoaded === true;
  }

  /**
   * Unload a plugin (remove from registry)
   */
  unloadPlugin(id: string): boolean {
    const plugin = this.loadedPlugins.get(id);
    if (!plugin) return false;

    // Remove from extension point registry
    for (const [
      extensionPoint,
      plugins,
    ] of this.extensionPointRegistry.entries()) {
      const index = plugins.findIndex((p) => p.metadata.id === id);
      if (index > -1) {
        plugins.splice(index, 1);
        if (plugins.length === 0) {
          this.extensionPointRegistry.delete(extensionPoint);
        }
      }
    }

    // Remove from loaded plugins
    this.loadedPlugins.delete(id);

    this.emit("plugin:unloaded", { pluginId: id });
    console.log(`🔌 Plugin unloaded: ${id}`);

    return true;
  }

  /**
   * Register an extension point for a plugin
   */
  private registerExtensionPoint(
    extensionPoint: string,
    plugin: LoadedPlugin,
  ): void {
    if (!this.extensionPointRegistry.has(extensionPoint)) {
      this.extensionPointRegistry.set(extensionPoint, []);
    }

    const plugins = this.extensionPointRegistry.get(extensionPoint)!;

    // Sort by priority (higher priority first)
    const insertIndex = plugins.findIndex(
      (p) => (p.metadata.priority || 0) < (plugin.metadata.priority || 0),
    );

    if (insertIndex === -1) {
      plugins.push(plugin);
    } else {
      plugins.splice(insertIndex, 0, plugin);
    }
  }

  /**
   * Dynamic plugin loading helper
   */
  private async loadRemotePlugin(
    bundleUrl: string,
    pluginId: string,
  ): Promise<any> {
    try {
      // Check if Module Federation is available
      const hasMF =
        typeof window !== "undefined" && (window as any).__FEDERATION__;

      if (hasMF && process.env.NODE_ENV === "production") {
        // Use Module Federation in production
        try {
          const container = (window as any).__FEDERATION__[pluginId];
          if (container) {
            const factory = await container.get("./plugin");
            return { default: await factory() };
          }
        } catch (mfError) {
          console.warn(
            `Module Federation failed for ${pluginId}, falling back to script loading:`,
            mfError,
          );
        }
      }

      // Fallback to direct script loading (development mode or MF failure)
      await this.injectPluginScript(bundleUrl, pluginId);

      // Then get the plugin from the global registry
      const plugin = (window as any).__PLUGIN_REGISTRY?.registered?.[pluginId];

      if (!plugin) {
        throw new Error(
          `Plugin ${pluginId} not found in registry after loading`,
        );
      }

      return {
        default: plugin,
      };
    } catch (error) {
      throw new Error(`Failed to load remote plugin: ${error}`);
    }
  }

  /**
   * Inject plugin script into the page
   */
  private async injectPluginScript(
    bundleUrl: string,
    pluginId: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).__PLUGIN_REGISTRY?.registered?.[pluginId]) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = bundleUrl;
      script.async = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        console.log(`✅ Plugin script loaded: ${pluginId}`);
        resolve();
      };

      script.onerror = (error) => {
        console.error(`❌ Failed to load plugin script: ${pluginId}`, error);
        reject(new Error(`Failed to load script for plugin ${pluginId}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Render components for an extension point
   */
  renderExtensionPoint(
    extensionPoint: string,
    context: PluginContext,
    filter?: (plugin: LoadedPlugin) => boolean,
  ): React.ComponentType<any>[] {
    let plugins = this.getPluginsForExtensionPoint(extensionPoint);

    // Apply filter if provided
    if (filter) {
      plugins = plugins.filter(filter);
    }

    return plugins
      .filter(
        (plugin) => plugin.isLoaded && plugin.extensionPoints[extensionPoint],
      )
      .map((plugin) => {
        const Component = plugin.extensionPoints[extensionPoint];

        // Return a wrapped component with context
        return function PluginWrapper(props: any) {
          return React.createElement(Component, {
            ...props,
            context,
            pluginId: plugin.metadata.id,
            sdk: window.PluginSDK, // Make SDK available
          });
        };
      });
  }

  /**
   * Event system for plugin lifecycle
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in plugin event listener (${event}):`, error);
      }
    });
  }

  /**
   * Clear all plugins (useful for cleanup)
   */
  clear(): void {
    this.loadedPlugins.clear();
    this.extensionPointRegistry.clear();
    this.eventListeners.clear();
  }
}

// Create singleton instance
export const pluginManager = new PluginManager();

// Make it globally available for debugging
if (typeof window !== "undefined") {
  (window as any).pluginManager = pluginManager;
}

export default pluginManager;
