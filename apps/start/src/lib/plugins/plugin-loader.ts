import React, { lazy } from 'react';
import type { ExtensionPointComponent, ExtensionPointContext, PlatformSDK } from 'ticketsplatform-plugin-sdk';

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

const loadedPlugins = new Map<string, Promise<any>>();

/**
 * Dynamically loads a remote plugin using Module Federation
 */
async function loadRemotePlugin(manifest: PluginManifest): Promise<any> {
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
export function createPluginComponent(options: LoadPluginOptions): ExtensionPointComponent | undefined {
  const key = `${options.pluginId}@${options.version}:${options.extensionPoint}`;

  try {
    return lazy(async () => {
      // Get plugin manifest from plugin server
      const response = await fetch(`/api/plugins/${options.pluginId}/manifest`);
      if (!response.ok) {
        throw new Error(`Failed to load plugin manifest: ${response.statusText}`);
      }

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

      // Create a wrapper component that matches the ExtensionPointComponent type
      function WrappedComponent({ context, sdk }: { context: ExtensionPointContext; sdk: PlatformSDK }) {
        return React.createElement(Component, { context, sdk });
      }

      return { default: WrappedComponent };
    }) as ExtensionPointComponent;
  } catch (error) {
    console.error(`Failed to create plugin component:`, error);
    return undefined;
  }
} 