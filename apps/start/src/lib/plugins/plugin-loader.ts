import React, { lazy } from "react";
import type {
  ExtensionPointComponent,
  ExtensionPointContext,
  PlatformSDK,
} from "ticketsplatform-plugin-sdk";
import { Plugin, PluginManifest } from "./types";
import { InstalledPlugin } from "@/lib/plugin-types";

interface LoadPluginOptions {
  pluginId: string;
  version: string;
  extensionPoint: string;
}

interface PluginLoadingState {
  loading: boolean;
  error: Error | null;
}

const loadedPlugins = new Map<string, Promise<any>>();
const pluginLoadingStates = new Map<string, PluginLoadingState>();

/**
 * Get the loading state for a plugin's extension point
 */
export function getPluginLoadingState(pluginId: string, extensionPoint: string): PluginLoadingState {
  const key = `${pluginId}:${extensionPoint}`;
  return pluginLoadingStates.get(key) || { loading: false, error: null };
}

/**
 * Set the loading state for a plugin's extension point
 */
function setPluginLoadingState(pluginId: string, extensionPoint: string, state: Partial<PluginLoadingState>) {
  const key = `${pluginId}:${extensionPoint}`;
  const currentState = getPluginLoadingState(pluginId, extensionPoint);
  pluginLoadingStates.set(key, { ...currentState, ...state });
}

/**
 * Load a plugin with context for a specific extension point
 */
export async function loadPluginWithContext(plugin: InstalledPlugin, extensionPoint: string): Promise<React.ComponentType<any> | null> {
  const key = `${plugin.id}:${extensionPoint}`;
  
  try {
    setPluginLoadingState(plugin.id, extensionPoint, { loading: true, error: null });
    
    // Get plugin manifest
    const manifest = await loadPluginManifest(plugin.id);
    
    // Load plugin if not already loaded
    let pluginPromise = loadedPlugins.get(key);
    if (!pluginPromise) {
      pluginPromise = loadRemotePlugin(manifest);
      loadedPlugins.set(key, pluginPromise);
    }

    const loadedPlugin = await pluginPromise;

    // Get component for extension point
    const Component = loadedPlugin.extensionPoints[extensionPoint];
    if (!Component) {
      throw new Error(`Plugin ${plugin.id} does not support extension point ${extensionPoint}`);
    }

    setPluginLoadingState(plugin.id, extensionPoint, { loading: false, error: null });
    return Component;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error loading plugin');
    setPluginLoadingState(plugin.id, extensionPoint, { loading: false, error: err });
    console.error(`Failed to load plugin ${plugin.id} for extension point ${extensionPoint}:`, error);
    return null;
  }
}

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
export function createPluginComponent(
  options: LoadPluginOptions,
): ExtensionPointComponent | undefined {
  const key = `${options.pluginId}@${options.version}:${options.extensionPoint}`;

  try {
    return lazy(async () => {
      // Get plugin manifest from plugin server
      const response = await fetch(`/api/plugins/${options.pluginId}/manifest`);
      if (!response.ok) {
        throw new Error(
          `Failed to load plugin manifest: ${response.statusText}`,
        );
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
      function WrappedComponent({
        context,
        sdk,
      }: {
        context: ExtensionPointContext;
        sdk: PlatformSDK;
      }) {
        return React.createElement(Component, { context, sdk });
      }

      return { default: WrappedComponent };
    }) as ExtensionPointComponent;
  } catch (error) {
    console.error(`Failed to create plugin component:`, error);
    return undefined;
  }
}

export async function loadPluginManifest(
  pluginId: string,
): Promise<PluginManifest> {
  try {
    const response = await fetch(`/plugins/${pluginId}/manifest.json`);
    if (!response.ok) {
      throw new Error(`Failed to load plugin manifest: ${response.statusText}`);
    }

    const manifest = await response.json();

    // Validate manifest has required fields
    if (!manifest.id || !manifest.name || !manifest.version || !manifest.main) {
      throw new Error("Invalid plugin manifest: missing required fields");
    }

    return manifest as PluginManifest;
  } catch (error) {
    console.error(`Error loading plugin manifest for ${pluginId}:`, error);
    throw error;
  }
}
