/**
 * Plugin Integration Helper
 * Bridges between existing plugin-api.ts and simple plugin system
 */

import { getTenantPlugins, getPlugin, ApiResponse } from "./plugin-api";
import { PluginMetadata } from "./simple-plugin-system";

/**
 * Transform InstalledPlugin from plugin-api to PluginMetadata for simple plugin system
 */
function transformToPluginMetadata(installedPlugin: any): PluginMetadata {
  const bundleUrl = installedPlugin.bundleUrl || installedPlugin.url || "";

  return {
    id: installedPlugin.pluginId || installedPlugin.id || "unknown-plugin",
    name:
      installedPlugin.name || installedPlugin.displayName || "Unknown Plugin",
    version: installedPlugin.version || "1.0.0",
    extensionPoints: Array.isArray(installedPlugin.extensionPoints)
      ? installedPlugin.extensionPoints
      : [],
    bundleUrl: bundleUrl,
    enabled: installedPlugin.enabled !== false, // default to true if not specified
  };
}

/**
 * Fetch all installed plugins and transform to PluginMetadata format
 */
export async function fetchInstalledPlugins(): Promise<PluginMetadata[]> {
  try {
    const result = await getTenantPlugins();

    if (!result.success) {
      console.error("Failed to fetch tenant plugins:", result.error);
      return [];
    }

    console.log("🔍 Raw installed plugins data:", result.data);
    const transformed = (result.data || []).map(transformToPluginMetadata);
    console.log("🔍 Transformed installed plugins:", transformed);

    return transformed;
  } catch (error) {
    console.error("Error fetching installed plugins:", error);
    return [];
  }
}

/**
 * Fetch a specific plugin and transform to PluginMetadata format
 */
export async function fetchPluginMetadata(
  pluginId: string,
): Promise<PluginMetadata | null> {
  try {
    const result = await getPlugin(pluginId);

    if (!result.success || !result.data) {
      console.error(`Failed to fetch plugin ${pluginId}:`, result.error);
      return null;
    }

    return transformToPluginMetadata(result.data);
  } catch (error) {
    console.error(`Error fetching plugin ${pluginId}:`, error);
    return null;
  }
}

/**
 * Check if a plugin has a specific extension point
 */
export function hasExtensionPoint(
  plugin: PluginMetadata,
  extensionPoint: string,
): boolean {
  return plugin.extensionPoints.includes(extensionPoint);
}

/**
 * Filter plugins by extension point
 */
export function filterByExtensionPoint(
  plugins: PluginMetadata[],
  extensionPoint: string,
): PluginMetadata[] {
  return plugins.filter((plugin) => hasExtensionPoint(plugin, extensionPoint));
}

/**
 * Filter enabled plugins only
 */
export function filterEnabledPlugins(
  plugins: PluginMetadata[],
): PluginMetadata[] {
  return plugins.filter((plugin) => plugin.enabled);
}
