/**
 * @deprecated This plugin loader is deprecated. Use context-aware-plugin-loader.ts instead.
 *
 * The old approach had issues with:
 * - __dirname not being defined in browser
 * - Environment variables not being accessible to external plugins
 * - Authentication context not being shared
 * - Complex dependency management
 *
 * The new context-aware-plugin-loader.ts solves these issues by:
 * - Providing PluginSDK context with auth, API client, components, etc.
 * - Proper browser-compatible loading
 * - Clean separation of concerns
 *
 * This file is kept for reference but should not be used in new code.
 */

import { InstalledPlugin } from "./plugin-types";
import React from "react";
import * as BetterAuthReact from "better-auth/react";

// Declare window with additional properties
declare global {
  interface Window {
    React: typeof React;
    BetterAuthReact: typeof BetterAuthReact;
    devPlugin1: any;
    __PLUGIN_REGISTRY: {
      register: (pluginId: string, exports: any) => void;
      get: (pluginId: string) => any;
    };
  }
}

// Expose React and NextAuth to plugins via window
if (typeof window !== "undefined") {
  window.React = React;
  window.BetterAuthReact = BetterAuthReact;
}

// Cache for loaded modules to avoid redundant loading
const loadedModules: Record<string, any> = {};

/**
 * Dynamically loads a plugin module
 */
export async function loadPluginModule(plugin: InstalledPlugin): Promise<any> {
  try {
    // Skip loading if we're on the server
    if (typeof window === "undefined") {
      throw new Error("Plugin modules can only be loaded in the browser");
    }

    // Check if the module is already cached
    if (loadedModules[plugin.id]) {
      return loadedModules[plugin.id];
    }

    // For better error messages, log the URL we're trying to load
    console.log(`Attempting to load plugin from: ${plugin.bundleUrl}`);

    // First, let's check what the server actually returns
    try {
      const response = await fetch(plugin.bundleUrl);
      console.log(`Bundle URL Response Status: ${response.status}`);
      console.log(
        `Bundle URL Response Content-Type: ${response.headers.get("content-type")}`,
      );
      console.log(`Bundle URL Response OK: ${response.ok}`);

      if (!response.ok) {
        const responseText = await response.text();
        console.error(
          `Bundle URL returned ${response.status}:`,
          responseText.substring(0, 500),
        );
        throw new Error(
          `Bundle URL returned ${response.status}: ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("javascript")) {
        const responseText = await response.text();
        console.error(
          `Bundle URL returned wrong content type (${contentType}):`,
          responseText.substring(0, 500),
        );
        throw new Error(
          `Bundle URL returned wrong content type: ${contentType}`,
        );
      }

      // Content-Type check is sufficient - no need for additional content validation
      // since JSX code can contain < and > characters which would trigger false positives
    } catch (fetchError) {
      console.error("Failed to fetch bundle URL:", fetchError);
      throw fetchError;
    }

    // Check if the plugin is already loaded globally
    const pluginId = plugin.id.replace(/-/g, "");
    if (window[pluginId as keyof Window]) {
      console.log(`Plugin ${plugin.id} is loaded globally`);
      loadedModules[plugin.id] = {
        default: window[pluginId as keyof Window],
        extensionPoints: window[pluginId as keyof Window].extensionPoints,
      };
      return loadedModules[plugin.id];
    }

    // Check if the plugin is registered in the global registry
    const registeredPlugin = window.__PLUGIN_REGISTRY?.get(plugin.id);
    if (registeredPlugin) {
      console.log(`Plugin ${plugin.id} found in registry`);
      loadedModules[plugin.id] = {
        default: registeredPlugin,
        extensionPoints: registeredPlugin.extensionPoints,
      };
      return loadedModules[plugin.id];
    }

    // Load the plugin bundle using dynamic import
    // Using special webpack comments to mark this as an acceptable dynamic import
    // webpackIgnore: true tells webpack not to try to analyze or parse this import
    const importFn = new Function(
      "url",
      "return import(/* webpackIgnore: true */ url)",
    );
    const module = await importFn(plugin.bundleUrl);

    // Cache the module
    loadedModules[plugin.id] = module;

    return module;
  } catch (error) {
    console.error(`Failed to load plugin module: ${plugin.id}`, error);
    console.error("Error details:", error);
    throw error;
  }
}

/**
 * Loads a specific component from a plugin
 */
export async function loadPluginComponent(
  plugin: InstalledPlugin,
  componentPath: string,
): Promise<React.ComponentType<any> | null> {
  try {
    // Load the plugin module
    const module = await loadPluginModule(plugin);

    // Get the component from the module
    let component: any;

    // Support nested paths like "admin.settings"
    if (componentPath.includes(".")) {
      const pathParts = componentPath.split(".");
      let currentObj = module;

      for (const part of pathParts) {
        if (!currentObj || typeof currentObj !== "object") {
          return null;
        }
        currentObj = currentObj[part];
      }

      component = currentObj;
    } else {
      component = module[componentPath];
    }

    // Make sure the component is valid
    if (!component || typeof component !== "function") {
      console.error(
        `Component ${componentPath} not found in plugin ${plugin.id} or is not a valid component`,
      );
      return null;
    }

    return component;
  } catch (error) {
    console.error(
      `Failed to load component ${componentPath} from plugin ${plugin.id}:`,
      error,
    );
    return null;
  }
}

/**
 * Loads an extension point component from a plugin
 */
export async function loadExtensionPointComponent(
  plugin: InstalledPlugin,
  extensionPoint: string,
): Promise<React.ComponentType<any> | null> {
  try {
    // Load the plugin module
    const module = await loadPluginModule(plugin);

    // Make sure the plugin implements the extension point
    if (!plugin.extensionPoints?.includes(extensionPoint)) {
      console.warn(
        `Plugin ${plugin.id} does not implement extension point: ${extensionPoint}`,
      );
      return null;
    }

    // Get the extension point component
    if (!module.extensionPoints || !module.extensionPoints[extensionPoint]) {
      console.error(
        `Extension point ${extensionPoint} not found in plugin ${plugin.id}`,
      );
      return null;
    }

    const component = module.extensionPoints[extensionPoint];

    // Make sure the component is valid
    if (typeof component !== "function") {
      console.error(
        `Extension point ${extensionPoint} in plugin ${plugin.id} is not a valid component`,
      );
      return null;
    }

    return component;
  } catch (error) {
    console.error(
      `Failed to load extension point ${extensionPoint} from plugin ${plugin.id}:`,
      error,
    );
    return null;
  }
}
