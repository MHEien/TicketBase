import { lazy } from "react";
import type { PluginDefinition, ExtensionPointComponent } from "./index";

interface PluginManifest {
  scope: string;
  module: string;
  url: string;
}

interface LoadPluginOptions {
  pluginId: string;
  version: string;
  extensionPoint: string;
}

const loadedPlugins = new Map<string, Promise<PluginDefinition>>();

/**
 * Dynamically loads a remote plugin using Module Federation
 */
async function loadRemotePlugin(
  manifest: PluginManifest,
): Promise<PluginDefinition> {
  // Ensure container is loaded
  // @ts-ignore - Module Federation types
  if (!window[manifest.scope]) {
    // Load remote container
    // @ts-ignore - Module Federation types
    await __federation_method_ensure__(manifest.scope);
  }

  // Get container
  // @ts-ignore - Module Federation types
  const container = window[manifest.scope];

  // Get plugin module
  const factory = await container.get(manifest.module);
  const plugin = factory();

  return plugin;
}

/**
 * Creates a React component that loads and renders a plugin extension point
 */
export function createPluginComponent(
  options: LoadPluginOptions,
): ExtensionPointComponent {
  const key = `${options.pluginId}@${options.version}:${options.extensionPoint}`;

  return lazy(async () => {
    try {
      // Get plugin manifest from plugin server
      const response = await fetch(`/api/plugins/${options.pluginId}/manifest`);
      const manifest: PluginManifest = await response.json();

      // Load plugin if not already loaded
      let pluginPromise = loadedPlugins.get(key);
      if (!pluginPromise) {
        pluginPromise = loadRemotePlugin(manifest);
        loadedPlugins.set(key, pluginPromise);
      }

      const plugin = await pluginPromise;

      // Get component for extension point
      const Component = plugin.extensionPoints[options.extensionPoint];
      if (!Component) {
        throw new Error(
          `Plugin ${options.pluginId} does not support extension point ${options.extensionPoint}`,
        );
      }

      return { default: Component };
    } catch (error) {
      console.error(`Failed to load plugin ${options.pluginId}:`, error);
      throw error;
    }
  });
}

/**
 * Hook to load and manage plugin state
 */
export function usePlugin(options: LoadPluginOptions) {
  const Component = createPluginComponent(options);

  return {
    Component,
    // Add additional plugin management functions here
  };
}
