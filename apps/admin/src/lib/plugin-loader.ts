/**
 * Plugin Loader Service
 * Fetches plugin metadata from API and loads them using the Plugin Manager
 */

import { pluginManager, type PluginMetadata } from "./plugin-manager";

export interface PluginLoaderConfig {
  apiBaseUrl: string;
  organizationId?: string;
  authToken?: string;
}

class PluginLoader {
  private config: PluginLoaderConfig;
  private isLoading = false;
  private loadedPluginIds = new Set<string>();

  constructor(config: PluginLoaderConfig) {
    this.config = config;
  }

  /**
   * Load all available plugins for the current organization
   */
  async loadAvailablePlugins(): Promise<void> {
    if (this.isLoading) {
      console.log("🔌 Plugin loading already in progress...");
      return;
    }

    this.isLoading = true;

    try {
      console.log("🔌 Fetching available plugins...");

      // Fetch available plugins from the API
      const plugins = await this.fetchAvailablePlugins();

      console.log(`🔌 Found ${plugins.length} available plugins`);

      // Load plugins in batches to avoid overwhelming the browser
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
  async loadInstalledPlugins(): Promise<void> {
    if (this.isLoading) {
      console.log("🔌 Plugin loading already in progress...");
      return;
    }

    this.isLoading = true;

    try {
      console.log("🔌 Fetching installed plugins...");

      // Fetch installed plugins from the API
      const plugins = await this.fetchInstalledPlugins();

      console.log(`🔌 Found ${plugins.length} installed plugins`);

      // Load plugins in batches
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
  async loadPlugin(pluginId: string): Promise<void> {
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
  private async fetchAvailablePlugins(): Promise<PluginMetadata[]> {
    const response = await fetch(
      `${this.config.apiBaseUrl}/api/plugins/available`,
      {
        headers: this.createHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch available plugins: ${response.status} ${response.statusText}`,
      );
    }

    const plugins = await response.json();
    return this.transformPluginsResponse(plugins);
  }

  /**
   * Fetch installed plugins from API
   */
  private async fetchInstalledPlugins(): Promise<PluginMetadata[]> {
    const url = new URL(`${this.config.apiBaseUrl}/api/plugins/installed`);

    if (this.config.organizationId) {
      url.searchParams.set("organizationId", this.config.organizationId);
    }

    const response = await fetch(url.toString(), {
      headers: this.createHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch installed plugins: ${response.status} ${response.statusText}`,
      );
    }

    const plugins = await response.json();
    return this.transformPluginsResponse(plugins);
  }

  /**
   * Fetch a specific plugin by ID
   */
  private async fetchPluginById(
    pluginId: string,
  ): Promise<PluginMetadata | null> {
    const response = await fetch(
      `${this.config.apiBaseUrl}/api/plugins/${pluginId}`,
      {
        headers: this.createHeaders(),
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch plugin ${pluginId}: ${response.status} ${response.statusText}`,
      );
    }

    const plugin = await response.json();
    return this.transformPluginResponse(plugin);
  }

  /**
   * Load plugins in batches to avoid overwhelming the browser
   */
  private async loadPluginsInBatches(
    plugins: PluginMetadata[],
    batchSize: number,
  ): Promise<void> {
    const batches = [];

    for (let i = 0; i < plugins.length; i += batchSize) {
      batches.push(plugins.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      console.log(`🔌 Loading batch of ${batch.length} plugins...`);

      // Load batch concurrently
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

      // Small delay between batches to prevent overwhelming
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Transform API response to PluginMetadata format
   */
  private transformPluginsResponse(plugins: any[]): PluginMetadata[] {
    return plugins.map((plugin) => this.transformPluginResponse(plugin));
  }

  /**
   * Transform single plugin response to PluginMetadata format
   */
  private transformPluginResponse(plugin: any): PluginMetadata {
    return {
      id: plugin.id,
      name: plugin.name || plugin.displayName,
      version: plugin.version,
      description: plugin.description,
      category: plugin.category,
      bundleUrl: plugin.bundleUrl || plugin.url,
      requiredPermissions: plugin.requiredPermissions || [],
      extensionPoints: plugin.extensionPoints || [],
      priority: plugin.priority || 0,
    };
  }

  /**
   * Create HTTP headers for API requests
   */
  private createHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.authToken) {
      headers["Authorization"] = `Bearer ${this.config.authToken}`;
    }

    return headers;
  }

  /**
   * Check if currently loading
   */
  get loading(): boolean {
    return this.isLoading;
  }

  /**
   * Get list of loaded plugin IDs
   */
  get loadedPlugins(): string[] {
    return Array.from(this.loadedPluginIds);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PluginLoaderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear loaded plugins cache
   */
  clearCache(): void {
    this.loadedPluginIds.clear();
    pluginManager.clear();
  }
}

// Create and export singleton instance
export const pluginLoader = new PluginLoader({
  apiBaseUrl:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

export default pluginLoader;
