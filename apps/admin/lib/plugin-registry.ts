import { Plugin, InstalledPlugin } from "./plugin-types";
import { getTenantPlugins } from "./plugin-api";
import { getDevPlugins, isDevEnvironment } from "./dev-plugins";

class PluginRegistry {
  private plugins: InstalledPlugin[] = [];
  private initialized = false;
  private initializing = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Initializes the plugin registry by loading all installed plugins
   */
  async initialize(): Promise<void> {
    // Only initialize once or return existing promise if already initializing
    if (this.initialized) {
      return;
    }

    if (this.initializing && this.initPromise) {
      return this.initPromise;
    }

    this.initializing = true;
    this.initPromise = this._initialize();
    return this.initPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      // We only want to run this on the client
      if (typeof window === "undefined") {
        return;
      }

      // In development mode, use the mock plugins
      if (isDevEnvironment()) {
        console.log("Using development plugins");
        this.plugins = getDevPlugins();
      } else {
        // In production, fetch installed plugins from the API
        console.log("Fetching plugins from API");
        const response = await getTenantPlugins();
        if (response.success && response.data) {
          this.plugins = response.data;
        } else {
          console.error("Failed to load plugins:", response.error);
          this.plugins = [];
        }
      }

      console.log(`Loaded ${this.plugins.length} plugins`);
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize plugin registry:", error);
      throw error;
    } finally {
      this.initializing = false;
    }
  }

  /**
   * Refresh the plugin list from the server
   */
  async refreshPlugins(): Promise<void> {
    try {
      // In development mode, use the mock plugins
      if (isDevEnvironment()) {
        this.plugins = getDevPlugins();
      } else {
        // In production, fetch installed plugins from the API
        const response = await getTenantPlugins();
        if (response.success && response.data) {
          this.plugins = response.data;
        } else {
          console.error("Failed to refresh plugins:", response.error);
          // Keep the existing plugins if refresh fails
        }
      }
    } catch (error) {
      console.error("Failed to refresh plugins:", error);
    }
  }

  /**
   * Get all installed plugins
   */
  getPlugins(): InstalledPlugin[] {
    return [...this.plugins];
  }

  /**
   * Get all enabled plugins
   */
  getEnabledPlugins(): InstalledPlugin[] {
    return this.plugins.filter((plugin) => plugin.enabled);
  }

  /**
   * Get a specific plugin by ID
   */
  getPlugin(id: string): InstalledPlugin | undefined {
    return this.plugins.find((plugin) => plugin.id === id);
  }

  /**
   * Get all plugins for a specific category
   */
  getPluginsByCategory(category: Plugin["category"]): InstalledPlugin[] {
    return this.plugins.filter(
      (plugin) => plugin.category === category && plugin.enabled,
    );
  }

  /**
   * Get all plugins that have a specific component type
   */
  getPluginsWithComponent(
    componentType:
      | "settings"
      | "eventCreation"
      | "dashboard"
      | "checkout"
      | "eventDetail"
      | "ticketSelection",
  ): InstalledPlugin[] {
    return this.plugins
      .filter((plugin) => {
        if (componentType === "settings" && plugin.adminComponents.settings)
          return true;
        if (
          componentType === "eventCreation" &&
          plugin.adminComponents.eventCreation
        )
          return true;
        if (componentType === "dashboard" && plugin.adminComponents.dashboard)
          return true;
        if (
          componentType === "checkout" &&
          plugin.storefrontComponents.checkout
        )
          return true;
        if (
          componentType === "eventDetail" &&
          plugin.storefrontComponents.eventDetail
        )
          return true;
        if (
          componentType === "ticketSelection" &&
          plugin.storefrontComponents.ticketSelection
        )
          return true;
        return false;
      })
      .filter((plugin) => plugin.enabled);
  }

  /**
   * Get all plugins that have a widget for a specific area
   */
  getPluginsWithWidget(widgetArea: string): InstalledPlugin[] {
    return this.plugins.filter(
      (plugin) =>
        plugin.enabled &&
        plugin.storefrontComponents.widgets &&
        plugin.storefrontComponents.widgets[widgetArea],
    );
  }

  /**
   * Get all plugins that implement a specific extension point
   */
  getPluginsForExtensionPoint(extensionPoint: string): InstalledPlugin[] {
    return this.plugins.filter(
      (plugin) =>
        plugin.enabled &&
        plugin.extensionPoints &&
        plugin.extensionPoints.includes(extensionPoint),
    );
  }
}

// Create a singleton instance
export const pluginRegistry = new PluginRegistry();

// Auto-initialize in client environments
if (typeof window !== "undefined") {
  // Initialize after a short delay to allow the main app to load first
  setTimeout(() => {
    pluginRegistry.initialize().catch((error) => {
      console.error("Failed to initialize plugin registry:", error);
    });
  }, 1000);
}
