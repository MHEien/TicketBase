import type { InstalledPlugin } from "./plugin-types";

class PluginRegistry {
  private plugins: Map<string, any> = new Map();

  async refreshPlugins() {
    // Clear existing plugins
    this.plugins.clear();
    
    // In a real implementation, this would:
    // 1. Load plugin bundles
    // 2. Register plugin components
    // 3. Initialize plugin SDKs
    console.log("Plugin registry refreshed");
  }

  getPlugin(id: string) {
    return this.plugins.get(id);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = new PluginRegistry(); 