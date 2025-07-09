import { aM as React } from './main-D54NVj6U.js';

class PluginManager {
  constructor() {
    this.loadedPlugins = /* @__PURE__ */ new Map();
    this.extensionPointRegistry = /* @__PURE__ */ new Map();
    this.eventListeners = /* @__PURE__ */ new Map();
  }
  /**
   * Load a plugin from MinIO storage using Module Federation
   */
  async loadPlugin(metadata) {
    const { id, bundleUrl } = metadata;
    if (this.loadedPlugins.has(id)) {
      return this.loadedPlugins.get(id);
    }
    try {
      console.log(`🔌 Loading plugin: ${id} from ${bundleUrl}`);
      const pluginModule = await this.loadRemotePlugin(bundleUrl, id);
      const loadedPlugin = {
        metadata,
        module: pluginModule,
        extensionPoints: {},
        isLoaded: true
      };
      if (pluginModule.default && pluginModule.default.extensionPoints) {
        loadedPlugin.extensionPoints = pluginModule.default.extensionPoints;
        for (const [extensionPoint, component] of Object.entries(loadedPlugin.extensionPoints)) {
          this.registerExtensionPoint(extensionPoint, loadedPlugin);
        }
      }
      this.loadedPlugins.set(id, loadedPlugin);
      this.emit("plugin:loaded", { plugin: loadedPlugin });
      console.log(`✅ Plugin loaded successfully: ${id}`);
      return loadedPlugin;
    } catch (error) {
      console.error(`❌ Failed to load plugin ${id}:`, error);
      const failedPlugin = {
        metadata,
        module: null,
        extensionPoints: {},
        isLoaded: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
      this.loadedPlugins.set(id, failedPlugin);
      this.emit("plugin:error", { plugin: failedPlugin, error });
      return failedPlugin;
    }
  }
  /**
   * Load multiple plugins concurrently
   */
  async loadPlugins(plugins) {
    console.log(`🔌 Loading ${plugins.length} plugins...`);
    const loadPromises = plugins.map((plugin) => this.loadPlugin(plugin));
    const results = await Promise.allSettled(loadPromises);
    const loadedPlugins = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
    console.log(`✅ Successfully loaded ${loadedPlugins.length}/${plugins.length} plugins`);
    return loadedPlugins;
  }
  /**
   * Get all plugins for a specific extension point
   */
  getPluginsForExtensionPoint(extensionPoint) {
    return this.extensionPointRegistry.get(extensionPoint) || [];
  }
  /**
   * Get all loaded plugins
   */
  getAllPlugins() {
    return Array.from(this.loadedPlugins.values());
  }
  /**
   * Get a specific plugin by ID
   */
  getPlugin(id) {
    return this.loadedPlugins.get(id);
  }
  /**
   * Check if a plugin is loaded and available
   */
  isPluginLoaded(id) {
    const plugin = this.loadedPlugins.get(id);
    return plugin?.isLoaded === true;
  }
  /**
   * Unload a plugin (remove from registry)
   */
  unloadPlugin(id) {
    const plugin = this.loadedPlugins.get(id);
    if (!plugin) return false;
    for (const [extensionPoint, plugins] of this.extensionPointRegistry.entries()) {
      const index = plugins.findIndex((p) => p.metadata.id === id);
      if (index > -1) {
        plugins.splice(index, 1);
        if (plugins.length === 0) {
          this.extensionPointRegistry.delete(extensionPoint);
        }
      }
    }
    this.loadedPlugins.delete(id);
    this.emit("plugin:unloaded", { pluginId: id });
    console.log(`🔌 Plugin unloaded: ${id}`);
    return true;
  }
  /**
   * Register an extension point for a plugin
   */
  registerExtensionPoint(extensionPoint, plugin) {
    if (!this.extensionPointRegistry.has(extensionPoint)) {
      this.extensionPointRegistry.set(extensionPoint, []);
    }
    const plugins = this.extensionPointRegistry.get(extensionPoint);
    const insertIndex = plugins.findIndex(
      (p) => (p.metadata.priority || 0) < (plugin.metadata.priority || 0)
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
  async loadRemotePlugin(bundleUrl, pluginId) {
    try {
      const hasMF = typeof window !== "undefined" && window.__FEDERATION__;
      if (hasMF && true) {
        try {
          const container = window.__FEDERATION__[pluginId];
          if (container) {
            const factory = await container.get("./plugin");
            return { default: await factory() };
          }
        } catch (mfError) {
          console.warn(`Module Federation failed for ${pluginId}, falling back to script loading:`, mfError);
        }
      }
      await this.injectPluginScript(bundleUrl, pluginId);
      const plugin = window.__PLUGIN_REGISTRY?.registered?.[pluginId];
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found in registry after loading`);
      }
      return {
        default: plugin
      };
    } catch (error) {
      throw new Error(`Failed to load remote plugin: ${error}`);
    }
  }
  /**
   * Inject plugin script into the page
   */
  async injectPluginScript(bundleUrl, pluginId) {
    return new Promise((resolve, reject) => {
      if (window.__PLUGIN_REGISTRY?.registered?.[pluginId]) {
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
  renderExtensionPoint(extensionPoint, context, filter) {
    let plugins = this.getPluginsForExtensionPoint(extensionPoint);
    if (filter) {
      plugins = plugins.filter(filter);
    }
    return plugins.filter((plugin) => plugin.isLoaded && plugin.extensionPoints[extensionPoint]).map((plugin) => {
      const Component = plugin.extensionPoints[extensionPoint];
      return function PluginWrapper(props) {
        return React.createElement(Component, {
          ...props,
          context,
          pluginId: plugin.metadata.id,
          sdk: window.PluginSDK
          // Make SDK available
        });
      };
    });
  }
  /**
   * Event system for plugin lifecycle
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }
  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  emit(event, data) {
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
  clear() {
    this.loadedPlugins.clear();
    this.extensionPointRegistry.clear();
    this.eventListeners.clear();
  }
}
const pluginManager = new PluginManager();
if (typeof window !== "undefined") {
  window.pluginManager = pluginManager;
}

var define_process_env_default = {};
class PluginLoader {
  constructor(config) {
    this.isLoading = false;
    this.loadedPluginIds = /* @__PURE__ */ new Set();
    this.config = config;
  }
  /**
   * Load all available plugins for the current organization
   */
  async loadAvailablePlugins() {
    if (this.isLoading) {
      console.log("🔌 Plugin loading already in progress...");
      return;
    }
    this.isLoading = true;
    try {
      console.log("🔌 Fetching available plugins...");
      const plugins = await this.fetchAvailablePlugins();
      console.log(`🔌 Found ${plugins.length} available plugins`);
      await this.loadPluginsInBatches(plugins, 3);
    } catch (error) {
      console.error("❌ Failed to load available plugins:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
  /**
   * Load installed plugins for the current organization
   */
  async loadInstalledPlugins() {
    if (this.isLoading) {
      console.log("🔌 Plugin loading already in progress...");
      return;
    }
    this.isLoading = true;
    try {
      console.log("🔌 Fetching installed plugins...");
      const plugins = await this.fetchInstalledPlugins();
      console.log(`🔌 Found ${plugins.length} installed plugins`);
      await this.loadPluginsInBatches(plugins, 3);
    } catch (error) {
      console.error("❌ Failed to load installed plugins:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
  /**
   * Load a specific plugin by ID
   */
  async loadPlugin(pluginId) {
    try {
      console.log(`🔌 Loading specific plugin: ${pluginId}`);
      const plugin = await this.fetchPluginById(pluginId);
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`);
      }
      await pluginManager.loadPlugin(plugin);
      this.loadedPluginIds.add(pluginId);
    } catch (error) {
      console.error(`❌ Failed to load plugin ${pluginId}:`, error);
      throw error;
    }
  }
  /**
   * Fetch available plugins from API
   */
  async fetchAvailablePlugins() {
    const response = await fetch(`${this.config.apiBaseUrl}/api/plugins/available`, {
      headers: this.createHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch available plugins: ${response.status} ${response.statusText}`);
    }
    const plugins = await response.json();
    return this.transformPluginsResponse(plugins);
  }
  /**
   * Fetch installed plugins from API
   */
  async fetchInstalledPlugins() {
    const url = new URL(`${this.config.apiBaseUrl}/api/plugins/installed`);
    if (this.config.organizationId) {
      url.searchParams.set("organizationId", this.config.organizationId);
    }
    const response = await fetch(url.toString(), {
      headers: this.createHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch installed plugins: ${response.status} ${response.statusText}`);
    }
    const plugins = await response.json();
    return this.transformPluginsResponse(plugins);
  }
  /**
   * Fetch a specific plugin by ID
   */
  async fetchPluginById(pluginId) {
    const response = await fetch(`${this.config.apiBaseUrl}/api/plugins/${pluginId}`, {
      headers: this.createHeaders()
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch plugin ${pluginId}: ${response.status} ${response.statusText}`);
    }
    const plugin = await response.json();
    return this.transformPluginResponse(plugin);
  }
  /**
   * Load plugins in batches to avoid overwhelming the browser
   */
  async loadPluginsInBatches(plugins, batchSize) {
    const batches = [];
    for (let i = 0; i < plugins.length; i += batchSize) {
      batches.push(plugins.slice(i, i + batchSize));
    }
    for (const batch of batches) {
      console.log(`🔌 Loading batch of ${batch.length} plugins...`);
      const promises = batch.map(async (plugin) => {
        try {
          if (!this.loadedPluginIds.has(plugin.id)) {
            await pluginManager.loadPlugin(plugin);
            this.loadedPluginIds.add(plugin.id);
          }
        } catch (error) {
          console.error(`Failed to load plugin ${plugin.id}:`, error);
        }
      });
      await Promise.allSettled(promises);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  /**
   * Transform API response to PluginMetadata format
   */
  transformPluginsResponse(plugins) {
    return plugins.map((plugin) => this.transformPluginResponse(plugin));
  }
  /**
   * Transform single plugin response to PluginMetadata format
   */
  transformPluginResponse(plugin) {
    return {
      id: plugin.id,
      name: plugin.name || plugin.displayName,
      version: plugin.version,
      description: plugin.description,
      category: plugin.category,
      bundleUrl: plugin.bundleUrl || plugin.url,
      requiredPermissions: plugin.requiredPermissions || [],
      extensionPoints: plugin.extensionPoints || [],
      priority: plugin.priority || 0
    };
  }
  /**
   * Create HTTP headers for API requests
   */
  createHeaders() {
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.config.authToken) {
      headers["Authorization"] = `Bearer ${this.config.authToken}`;
    }
    return headers;
  }
  /**
   * Check if currently loading
   */
  get loading() {
    return this.isLoading;
  }
  /**
   * Get list of loaded plugin IDs
   */
  get loadedPlugins() {
    return Array.from(this.loadedPluginIds);
  }
  /**
   * Update configuration
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }
  /**
   * Clear loaded plugins cache
   */
  clearCache() {
    this.loadedPluginIds.clear();
    pluginManager.clear();
  }
}
const pluginLoader = new PluginLoader({
  apiBaseUrl: typeof window !== "undefined" ? window.location.origin : define_process_env_default.NEXT_PUBLIC_API_URL || "http://localhost:3000"
});

export { pluginManager as a, pluginLoader as p };
