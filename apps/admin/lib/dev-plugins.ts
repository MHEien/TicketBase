/**
 * Development utility for testing plugins without a plugin server
 * This file is only used in development mode
 */

import { InstalledPlugin } from "./plugin-types";

// Mock plugins for development
const DEV_PLUGINS: InstalledPlugin[] = [
  {
    id: "dev-plugin-1",
    name: "Development Test Plugin",
    version: "1.0.0",
    description: "A test plugin for development",
    category: "payment",
    bundleUrl: "/plugins/dev-plugin-1.js", // This will be served from the public folder
    extensionPoints: ["payment-methods", "admin-settings"],
    adminComponents: {
      settings: "adminSettings",
    },
    storefrontComponents: {
      checkout: "checkout",
      widgets: {},
    },
    metadata: {
      priority: 10,
      displayName: "Development Plugin",
      author: "Dev Team",
    },
    enabled: true,
    tenantId: "dev-tenant",
    configuration: {
      testSetting: "test-value",
    },
    installedAt: new Date(),
    updatedAt: new Date(),
    requiredPermissions: [],
  },
];

/**
 * Helper to check if a plugin script is already loaded
 */
function isPluginScriptLoaded(scriptSrc: string): boolean {
  if (typeof document === "undefined") return false;

  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes(scriptSrc)) {
      return true;
    }
  }
  return false;
}

/**
 * Helper to load plugin scripts
 */
function loadPluginScript(plugin: InstalledPlugin): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    if (isPluginScriptLoaded(plugin.bundleUrl)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = plugin.bundleUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (err) =>
      reject(new Error(`Failed to load plugin script: ${plugin.bundleUrl}`));
    document.body.appendChild(script);
  });
}

/**
 * Register a development mock plugin
 */
export async function registerDevPlugin(
  plugin: InstalledPlugin,
): Promise<void> {
  // This function would normally communicate with the plugin server
  // But for development, we just add it to our mock data
  DEV_PLUGINS.push(plugin);

  // Attempt to load the plugin script
  try {
    await loadPluginScript(plugin);
  } catch (error) {
    console.error(`Failed to load dev plugin script: ${plugin.id}`, error);
  }
}

/**
 * Get all development mock plugins
 */
export function getDevPlugins(): InstalledPlugin[] {
  return [...DEV_PLUGINS];
}

/**
 * Get a specific development mock plugin by ID
 */
export function getDevPlugin(id: string): InstalledPlugin | undefined {
  return DEV_PLUGINS.find((p) => p.id === id);
}

/**
 * Helper to check if we should use development plugins
 */
export function isDevEnvironment(): boolean {
  return process.env.NODE_ENV === "development";
}
