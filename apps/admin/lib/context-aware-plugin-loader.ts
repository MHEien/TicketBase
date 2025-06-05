import { InstalledPlugin } from "./plugin-types";

// Cache for loaded plugins to avoid redundant loading
const loadedPlugins: Record<string, any> = {};

// Plugin loading state
interface PluginLoadState {
  loading: boolean;
  error: string | null;
  component: React.ComponentType<any> | null;
}

const pluginStates: Record<string, PluginLoadState> = {};

/**
 * Enhanced plugin loader that provides context to external plugins
 */
export async function loadPluginWithContext(
  plugin: InstalledPlugin,
  extensionPoint: string,
): Promise<React.ComponentType<any> | null> {
  try {
    // Skip loading if we're on the server
    if (typeof window === "undefined") {
      throw new Error("Plugin modules can only be loaded in the browser");
    }

    // Check if already loaded
    const cacheKey = `${plugin.id}-${extensionPoint}`;
    if (loadedPlugins[cacheKey]) {
      return loadedPlugins[cacheKey];
    }

    // Set loading state
    pluginStates[cacheKey] = { loading: true, error: null, component: null };

    console.log(`Loading plugin ${plugin.id} from: ${plugin.bundleUrl}`);

    // Validate bundle URL
    if (!plugin.bundleUrl) {
      throw new Error(`Plugin ${plugin.id} has no bundle URL`);
    }

    // First, validate the bundle is accessible
    const bundleResponse = await fetch(plugin.bundleUrl, {
      method: "HEAD",
      cache: "no-cache",
    });

    if (!bundleResponse.ok) {
      throw new Error(
        `Bundle URL returned ${bundleResponse.status}: ${bundleResponse.statusText}`,
      );
    }

    // Ensure PluginSDK is available
    if (!window.PluginSDK) {
      throw new Error(
        "PluginSDK not available. Ensure PluginSDKProvider is wrapped around your app.",
      );
    }

    // Load the plugin bundle
    const module = await loadPluginBundle(plugin.bundleUrl);

    // Extract the component for the specific extension point
    const component = extractExtensionPointComponent(
      module,
      extensionPoint,
      plugin,
    );

    if (!component) {
      throw new Error(
        `Extension point "${extensionPoint}" not found in plugin ${plugin.id}. Available components: ${getAvailableComponents(module)}`,
      );
    }

    // Wrap the component to provide context
    const ContextAwareComponent = createContextAwareWrapper(component, plugin);

    // Cache the result
    loadedPlugins[cacheKey] = ContextAwareComponent;
    pluginStates[cacheKey] = {
      loading: false,
      error: null,
      component: ContextAwareComponent,
    };

    return ContextAwareComponent;
  } catch (error) {
    console.error(`Failed to load plugin ${plugin.id}:`, error);

    const cacheKey = `${plugin.id}-${extensionPoint}`;
    pluginStates[cacheKey] = {
      loading: false,
      error: error instanceof Error ? error.message : "Unknown error",
      component: null,
    };

    return null;
  }
}

/**
 * Load plugin bundle using dynamic import
 */
async function loadPluginBundle(bundleUrl: string): Promise<any> {
  try {
    // Create a dynamic script element for SystemJS-style loading
    // This avoids webpack trying to analyze the import
    const scriptId = `plugin-${Date.now()}`;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.crossOrigin = "anonymous";

      // Global variable to capture plugin exports
      const globalVar = `PluginExports_${scriptId}`;

      script.onload = () => {
        try {
          // Get the plugin exports from global scope
          const exports = (window as any)[globalVar];

          if (!exports) {
            // Fallback: check for common plugin globals
            const fallbackExports =
              (window as any).PluginRegistry?.pop() ||
              (window as any).LastLoadedPlugin ||
              {};
            console.log(
              "Plugin loaded via fallback registry:",
              fallbackExports,
            );
            resolve(fallbackExports);
          } else {
            console.log("Plugin loaded via global export:", exports);
            resolve(exports);
          }

          // Cleanup
          try {
            document.head.removeChild(script);
            delete (window as any)[globalVar];
          } catch (cleanupError) {
            console.warn("Error during cleanup:", cleanupError);
          }
        } catch (err) {
          console.error("Error processing plugin script:", err);
          reject(err);
        }
      };

      script.onerror = (event) => {
        console.error("Script loading error:", event);
        try {
          document.head.removeChild(script);
        } catch (cleanupError) {
          console.warn(
            "Error during cleanup after script error:",
            cleanupError,
          );
        }
        reject(new Error(`Failed to load plugin bundle from ${bundleUrl}`));
      };

      // Modify the script to export to a global variable
      fetch(bundleUrl)
        .then((response) => response.text())
        .then((code) => {
          console.log("Plugin bundle code loaded, wrapping for execution...");
          console.log(
            "First 500 characters of plugin bundle:",
            code.substring(0, 500),
          );

          // Check for common syntax issues before wrapping
          if (code.includes("__dirname")) {
            console.warn(
              "⚠️ Plugin bundle contains __dirname - this will cause browser errors",
            );
          }
          if (
            code.includes("process.env") &&
            !code.includes("process.env.NODE_ENV")
          ) {
            console.warn(
              "⚠️ Plugin bundle contains process.env - environment variables may not be available",
            );
          }
          if (code.includes("require(") && !code.includes("var require")) {
            console.warn(
              "⚠️ Plugin bundle contains require() calls - this may cause errors in browser",
            );
          }

          // Try to validate JavaScript syntax before execution
          try {
            new Function(code);
            console.log("✅ Plugin bundle syntax appears valid");
          } catch (syntaxError) {
            const errorMessage =
              syntaxError instanceof Error
                ? syntaxError.message
                : String(syntaxError);
            console.error("❌ Plugin bundle has syntax errors:", syntaxError);
            reject(new Error(`Plugin bundle syntax error: ${errorMessage}`));
            return;
          }

          // Fix circular reference issue and improve plugin environment
          const wrappedCode = `
            (function() {
              try {
                var exports = {};
                var module = { exports: exports };
                
                // Make PluginSDK available to the plugin
                var PluginSDK = window.PluginSDK;
                
                // Fix circular reference by getting React from window first
                var WindowReact = window.React;
                var React = PluginSDK && PluginSDK.hooks ? {
                  useState: PluginSDK.hooks.useState,
                  useEffect: PluginSDK.hooks.useEffect,
                  useCallback: PluginSDK.hooks.useCallback,
                  useMemo: PluginSDK.hooks.useMemo,
                  createElement: WindowReact ? WindowReact.createElement : function() { console.error('React not available'); }
                } : WindowReact;
                
                // Provide additional globals that plugins might expect
                var require = function(moduleName) {
                  console.warn('Plugin tried to require:', moduleName);
                  if (moduleName === 'react') return React;
                  if (moduleName === 'react-dom') return window.ReactDOM;
                  throw new Error('Module not available: ' + moduleName);
                };
                
                // Mock Node.js globals that might be in the bundle
                var process = { env: { NODE_ENV: 'production' } };
                var __dirname = '/virtual/plugin';
                var __filename = '/virtual/plugin/index.js';
                var global = window;
                
                console.log('About to execute plugin code...');
                
                // Execute the plugin code
                ${code}
                
                // Export the result - handle different export patterns
                var result = module.exports.default || module.exports || exports;
                window.${globalVar} = result;
                
                console.log('Plugin executed successfully, exports:', result);
              } catch (error) {
                console.error('Plugin execution error:', error);
                console.error('Error stack:', error.stack);
                window.${globalVar} = { error: error.message, stack: error.stack };
              }
            })();
          `;

          script.textContent = wrappedCode;
          document.head.appendChild(script);
        })
        .catch((error) => {
          console.error("Failed to fetch plugin bundle:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Failed to load plugin bundle:", error);
    throw error;
  }
}

/**
 * Get available components from a plugin module for debugging
 */
function getAvailableComponents(module: any): string {
  const components = [];

  if (module.extensionPoints) {
    components.push(...Object.keys(module.extensionPoints));
  }
  if (module.default?.extensionPoints) {
    components.push(...Object.keys(module.default.extensionPoints));
  }
  if (module.AdminSettingsComponent) components.push("AdminSettingsComponent");
  if (module.SettingsComponent) components.push("SettingsComponent");
  if (module.default?.AdminSettingsComponent)
    components.push("default.AdminSettingsComponent");
  if (module.default?.SettingsComponent)
    components.push("default.SettingsComponent");

  return components.length > 0 ? components.join(", ") : "none found";
}

/**
 * Extract component for specific extension point from plugin module
 */
function extractExtensionPointComponent(
  module: any,
  extensionPoint: string,
  plugin: InstalledPlugin,
): React.ComponentType<any> | null {
  console.log(
    `Extracting component for extension point "${extensionPoint}" from plugin:`,
    module,
  );

  // Check for error in module loading
  if (module.error) {
    throw new Error(`Plugin bundle execution failed: ${module.error}`);
  }

  // Check multiple possible locations for the extension point
  const possibleLocations = [
    module.extensionPoints?.[extensionPoint],
    module.default?.extensionPoints?.[extensionPoint],
    module[extensionPoint],
    module.default?.[extensionPoint],
    module.components?.[extensionPoint],
    module.default?.components?.[extensionPoint],
  ];

  for (const component of possibleLocations) {
    if (component && typeof component === "function") {
      console.log(`Found component for extension point "${extensionPoint}"`);
      return component;
    }
  }

  // Special handling for admin-settings
  if (extensionPoint === "admin-settings") {
    const adminComponents = [
      module.AdminSettingsComponent,
      module.default?.AdminSettingsComponent,
      module.SettingsComponent,
      module.default?.SettingsComponent,
      // Handle case where plugin defines admin settings differently
      module.Settings,
      module.default?.Settings,
      module.adminSettings,
      module.default?.adminSettings,
    ];

    for (const component of adminComponents) {
      if (component && typeof component === "function") {
        console.log(`Found admin settings component for plugin ${plugin.id}`);
        return component;
      }
    }

    // Check if plugin has adminComponents defined in metadata
    if (plugin.adminComponents?.settings) {
      console.log(
        `Plugin ${plugin.id} has adminComponents.settings defined: ${plugin.adminComponents.settings}`,
      );
      // Try to find component by the path specified
      const settingsPath = plugin.adminComponents.settings.replace("./", "");
      const settingsComponent =
        module[settingsPath] || module.default?.[settingsPath];
      if (settingsComponent && typeof settingsComponent === "function") {
        console.log(`Found settings component at path: ${settingsPath}`);
        return settingsComponent;
      }
    }
  }

  console.warn(
    `No component found for extension point "${extensionPoint}" in plugin ${plugin.id}`,
  );
  console.log("Available module properties:", Object.keys(module));
  return null;
}

/**
 * Create a wrapper that provides PluginSDK context to the component
 */
function createContextAwareWrapper(
  Component: React.ComponentType<any>,
  plugin: InstalledPlugin,
): React.ComponentType<any> {
  return function ContextAwarePlugin(props: any) {
    // Use React from window to avoid circular dependencies
    const React = window.React;

    if (!window.PluginSDK) {
      return React.createElement(
        "div",
        {
          style: {
            padding: "1rem",
            textAlign: "center",
            border: "1px solid #f87171",
            borderRadius: "0.5rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
          },
        },
        "PluginSDK not available. Please ensure PluginSDKProvider is active.",
      );
    }

    const { useState, useEffect } = window.PluginSDK.hooks;
    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
      // Ensure SDK is available before rendering
      if (window.PluginSDK) {
        setSdkReady(true);
      }
    }, []);

    if (!sdkReady) {
      return React.createElement(
        "div",
        {
          style: { padding: "1rem", textAlign: "center" },
        },
        "Loading plugin...",
      );
    }

    // Create enhanced props with PluginSDK access
    const enhancedProps = {
      ...props,
      pluginId: plugin.id,
      sdk: window.PluginSDK,
      // Provide direct access to common SDK features
      api: window.PluginSDK.api,
      auth: window.PluginSDK.auth,
      components: window.PluginSDK.components,
      utils: window.PluginSDK.utils,
      navigation: window.PluginSDK.navigation,
    };

    try {
      return React.createElement(Component, enhancedProps);
    } catch (error) {
      console.error(`Error rendering plugin ${plugin.id}:`, error);

      return React.createElement(
        "div",
        {
          style: {
            padding: "1rem",
            border: "1px solid #f87171",
            borderRadius: "0.5rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
          },
        },
        [
          React.createElement("strong", { key: "title" }, "Plugin Error: "),
          React.createElement(
            "span",
            { key: "message" },
            error instanceof Error ? error.message : "Unknown error",
          ),
          React.createElement("br", { key: "br" }),
          React.createElement(
            "small",
            { key: "plugin" },
            `Plugin: ${plugin.name} (${plugin.id})`,
          ),
        ],
      );
    }
  };
}

/**
 * Get plugin loading state
 */
export function getPluginLoadingState(
  pluginId: string,
  extensionPoint: string,
): PluginLoadState {
  const cacheKey = `${pluginId}-${extensionPoint}`;
  return (
    pluginStates[cacheKey] || { loading: false, error: null, component: null }
  );
}

/**
 * Clear plugin cache (useful for development/hot reload)
 */
export function clearPluginCache(pluginId?: string): void {
  if (pluginId) {
    Object.keys(loadedPlugins).forEach((key) => {
      if (key.startsWith(pluginId)) {
        delete loadedPlugins[key];
        delete pluginStates[key];
      }
    });
  } else {
    Object.keys(loadedPlugins).forEach((key) => {
      delete loadedPlugins[key];
      delete pluginStates[key];
    });
  }
}

/**
 * Debug function to inspect plugin bundle without loading
 * Use this in browser console: debugPluginBundle('your-bundle-url')
 */
export async function debugPluginBundle(bundleUrl: string): Promise<void> {
  try {
    console.log(`🔍 Debugging plugin bundle: ${bundleUrl}`);

    const response = await fetch(bundleUrl);
    if (!response.ok) {
      console.error(
        `❌ Bundle not accessible: ${response.status} ${response.statusText}`,
      );
      return;
    }

    const code = await response.text();
    console.log(`📦 Bundle size: ${code.length} characters`);
    console.log(`📝 First 1000 characters:\n${code.substring(0, 1000)}`);
    console.log(
      `📝 Last 500 characters:\n${code.substring(code.length - 500)}`,
    );

    // Check for common issues
    const issues = [];
    if (code.includes("__dirname"))
      issues.push("Contains __dirname (Node.js specific)");
    if (code.includes("require(") && !code.includes("var require"))
      issues.push("Contains require() calls");
    if (code.includes("process.env") && !code.includes("process.env.NODE_ENV"))
      issues.push("Contains process.env references");
    if (code.includes("module.exports") && !code.includes("var module"))
      issues.push("Uses module.exports without declaration");
    if (code.includes("exports.") && !code.includes("var exports"))
      issues.push("Uses exports without declaration");

    if (issues.length > 0) {
      console.warn(`⚠️ Potential issues found:`, issues);
    } else {
      console.log("✅ No obvious issues detected");
    }

    // Try syntax validation
    try {
      new Function(code);
      console.log("✅ JavaScript syntax is valid");
    } catch (syntaxError) {
      const errorMessage =
        syntaxError instanceof Error
          ? syntaxError.message
          : String(syntaxError);
      console.error("❌ JavaScript syntax error:", errorMessage);

      // Try to find the line with the error
      const lines = code.split("\n");
      console.log("📍 Bundle lines around potential error:");
      lines.slice(0, 20).forEach((line, index) => {
        console.log(`${index + 1}: ${line}`);
      });
    }
  } catch (error) {
    console.error("Error debugging bundle:", error);
  }
}

// Make debug function globally available
if (typeof window !== "undefined") {
  (window as any).debugPluginBundle = debugPluginBundle;
}

export default loadPluginWithContext;
