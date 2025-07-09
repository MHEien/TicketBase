import { InstalledPlugin } from "./plugin-types";
import "@/src/types/plugins";

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

    // Ensure React is available
    if (!window.React) {
      throw new Error("React not available in global scope");
    }

    // Load the plugin bundle
    const module = await loadPluginBundle(plugin.bundleUrl);

    // Extract the component for the specific extension point
    const component = await extractExtensionPointComponent(plugin, extensionPoint, module);

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
 * Load plugin bundle using dynamic import with proper React context
 */
async function loadPluginBundle(bundleUrl: string): Promise<any> {
  try {
    return new Promise((resolve, reject) => {
      // First fetch the bundle content
      fetch(bundleUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch bundle: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then((code) => {
          console.log("Plugin bundle code loaded, preparing for execution...");
          console.log("First 500 characters of plugin bundle:", code.substring(0, 500));

          // Check for common syntax issues before wrapping
          if (code.includes("__dirname")) {
            console.warn("⚠️ Plugin bundle contains __dirname - this will cause browser errors");
          }

          try {
            // Validate JavaScript syntax before execution
            new Function(code);
            console.log("✅ Plugin bundle syntax appears valid");
          } catch (syntaxError) {
            const errorMessage = syntaxError instanceof Error ? syntaxError.message : String(syntaxError);
            console.error("❌ Plugin bundle has syntax errors:", syntaxError);
            reject(new Error(`Plugin bundle syntax error: ${errorMessage}`));
            return;
          }

          try {
            // Ensure React is available and has hooks - CRITICAL FIX
            const ReactInstance = window.React;
            if (!ReactInstance || !ReactInstance.useState) {
              reject(new Error("React or React hooks not available in global scope"));
              return;
            }

            console.log("✅ React validation passed:", {
              hasReact: !!ReactInstance,
              hasUseState: !!ReactInstance.useState,
              hasUseEffect: !!ReactInstance.useEffect,
              reactKeys: Object.keys(ReactInstance)
            });

            // Create a robust React reference with validation
            const ReactReference = {
              // Core React
              ...ReactInstance,
              
              // Essential hooks with validation
              useState: ReactInstance.useState,
              useEffect: ReactInstance.useEffect,
              useCallback: ReactInstance.useCallback,
              useMemo: ReactInstance.useMemo,
              useContext: ReactInstance.useContext,
              useReducer: ReactInstance.useReducer,
              useRef: ReactInstance.useRef,
              
              // Core functions
              createElement: ReactInstance.createElement,
              Fragment: ReactInstance.Fragment,
              Component: ReactInstance.Component,
              PureComponent: ReactInstance.PureComponent,
            };

            // Validate all required hooks are present
            const requiredHooks = ['useState', 'useEffect', 'useCallback', 'useMemo'] as const;
            const missingHooks = requiredHooks.filter(hook => !ReactReference[hook as keyof typeof ReactReference]);
            
            if (missingHooks.length > 0) {
              reject(new Error(`Missing React hooks: ${missingHooks.join(', ')}`));
              return;
            }

            console.log("✅ All required React hooks validated");

            // Create a context object for the plugin with proper React reference
            const context = {
              exports: {},
              module: { exports: {} },
              PluginSDK: window.PluginSDK,
              React: ReactReference,
              require: function(moduleName: string) {
                console.log('Plugin requiring:', moduleName);
                if (moduleName === 'react') return ReactReference;
                if (moduleName === 'react-dom') return (window as any).ReactDOM;
                if (moduleName === '@/components/ui/button') return { Button: window.PluginSDK?.components?.Button };
                if (moduleName === '@/components/ui/input') return { Input: window.PluginSDK?.components?.Input };
                // Add more component mappings as needed
                throw new Error('Module not available: ' + moduleName);
              },
              process: { env: { NODE_ENV: 'production' } },
              __dirname: '/virtual/plugin',
              __filename: '/virtual/plugin/index.js',
              global: {
                ...window,
                React: ReactReference,
                PluginSDK: window.PluginSDK
              }
            };

            // CRITICAL: Make React hooks available globally for plugins
            const globalHooks = {
              useState: ReactReference.useState,
              useEffect: ReactReference.useEffect,
              useCallback: ReactReference.useCallback,
              useMemo: ReactReference.useMemo,
              useContext: ReactReference.useContext,
              useReducer: ReactReference.useReducer,
              useRef: ReactReference.useRef,
            };

            // Wrap the code in a function that provides the context with proper React access
            const wrappedCode = `
              (function(exports, module, PluginSDK, React, require, process, __dirname, __filename, global) {
                // CRITICAL: Validate React before destructuring
                if (!React || !React.useState) {
                  throw new Error('React or React.useState not available in plugin context');
                }
                
                // Destructure React hooks for easier access - with validation
                const { 
                  useState, 
                  useEffect, 
                  useCallback, 
                  useMemo, 
                  useContext, 
                  useReducer, 
                  useRef,
                  createElement,
                  Fragment 
                } = React;
                
                // Validate that hooks are actually functions
                if (typeof useState !== 'function') {
                  throw new Error('useState is not a function: ' + typeof useState);
                }
                if (typeof useEffect !== 'function') {
                  throw new Error('useEffect is not a function: ' + typeof useEffect);
                }
                
                console.log('✅ Plugin context: React hooks validated successfully');
                
                // Make everything available globally for the plugin
                global.React = React;
                global.useState = useState;
                global.useEffect = useEffect;
                global.useCallback = useCallback;
                global.useMemo = useMemo;
                global.useContext = useContext;
                global.useReducer = useReducer;
                global.useRef = useRef;
                global.createElement = createElement;
                global.Fragment = Fragment;
                global.PluginSDK = PluginSDK;

                try {
                  // Execute the plugin code
                  ${code}
                  
                  // Return module exports with better debugging
                  const result = module.exports.default || module.exports || exports;
                  console.log('Plugin execution result type:', typeof result);
                  console.log('Plugin execution result keys:', Object.keys(result || {}));
                  console.log('Plugin execution module.exports:', module.exports);
                  console.log('Plugin execution exports:', exports);
                  
                  return result;
                } catch (pluginError) {
                  console.error('Plugin execution error:', pluginError);
                  throw pluginError;
                }
              })(
                context.exports,
                context.module,
                context.PluginSDK,
                context.React,
                context.require,
                context.process,
                context.__dirname,
                context.__filename,
                context.global
              );
            `;

            // Execute the wrapped code
            console.log('Executing plugin code...');
            const result = eval(wrappedCode);
            console.log('Plugin executed successfully, result:', result);
            console.log('Result type:', typeof result);
            console.log('Result keys:', Object.keys(result || {}));

            // Store the result in the global scope for debugging
            const scriptId = Date.now().toString();
            const globalVar = `PluginExports_${scriptId}`;
            (window as any)[globalVar] = result;

            // Validate that we got a valid result
            if (!result || typeof result !== 'object') {
              console.warn('Plugin did not return a valid object, wrapping in default structure');
              resolve({
                default: result,
                extensionPoints: {}
              });
            } else {
              resolve(result);
            }
          } catch (error: unknown) {
            console.error('Plugin execution error:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            reject(error);
          }
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
async function extractExtensionPointComponent(
  plugin: InstalledPlugin,
  extensionPoint: string,
  module: any, // Pass the module directly
): Promise<React.ComponentType<any> | null> {
  try {
    console.log('Extracting extension point:', extensionPoint);
    console.log('Module structure:', {
      hasDefault: !!module.default,
      hasExtensionPoints: !!module.extensionPoints,
      defaultHasExtensionPoints: !!module.default?.extensionPoints,
      moduleKeys: Object.keys(module || {}),
      defaultKeys: Object.keys(module.default || {})
    });

    // Make sure the plugin implements the extension point
    if (!plugin.extensionPoints?.includes(extensionPoint)) {
      console.warn(
        `Plugin ${plugin.id} does not implement extension point: ${extensionPoint}`,
      );
      return null;
    }

    // Try different ways to get the component
    let component = null;

    // Method 1: Check if module has extensionPoints directly
    if (module.extensionPoints && module.extensionPoints[extensionPoint]) {
      component = module.extensionPoints[extensionPoint];
      console.log('Found component via module.extensionPoints');
    }
    
    // Method 2: Check if module.default has extensionPoints
    else if (module.default?.extensionPoints && module.default.extensionPoints[extensionPoint]) {
      component = module.default.extensionPoints[extensionPoint];
      console.log('Found component via module.default.extensionPoints');
    }
    
    // Method 3: Check global plugin registry
    else {
      const registeredPlugin = (window as any).__PLUGIN_REGISTRY?.registered[plugin.id];
      if (registeredPlugin?.extensionPoints?.[extensionPoint]) {
        component = registeredPlugin.extensionPoints[extensionPoint];
        console.log('Found component via plugin registry');
      }
    }

    // Method 4: Try legacy component names
    if (!component) {
      const legacyNames: Record<string, string[]> = {
        "admin-settings": ["AdminSettingsComponent", "SettingsComponent"],
        "payment-methods": ["PaymentMethodComponent"],
        "checkout-confirmation": ["CheckoutConfirmationComponent"],
      };

      const possibleNames = legacyNames[extensionPoint] || [];
      for (const name of possibleNames) {
        if (module[name]) {
          component = module[name];
          console.log(`Found component via legacy name: ${name}`);
          break;
        }
        if (module.default?.[name]) {
          component = module.default[name];
          console.log(`Found component via module.default.${name}`);
          break;
        }
      }
    }

    // Make sure the component is valid
    if (!component || typeof component !== "function") {
      console.error(
        `Extension point ${extensionPoint} in plugin ${plugin.id} is not a valid component`,
        { component, type: typeof component }
      );
      return null;
    }

    console.log(`✅ Successfully extracted component for ${extensionPoint}`);
    return component;
  } catch (error: unknown) {
    console.error(
      `Failed to load extension point ${extensionPoint} from plugin ${plugin.id}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

/**
 * Create a wrapper that provides PluginSDK context to the component
 */
function createContextAwareWrapper(
  Component: React.ComponentType<any>,
  plugin: InstalledPlugin,
): React.ComponentType<any> {
  return function ContextAwarePlugin(props: any) {
    // Get React from global scope with proper error handling
    if (typeof window === "undefined" || !(window as any).React) {
      console.error("React not available in plugin context");
      return null;
    }

    const React = (window as any).React;

    // Validate that React hooks are available
    if (!React.useState || !React.useEffect) {
      console.error("React hooks not available");
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
        "React hooks not available. Please ensure React is properly loaded.",
      );
    }

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

    // Use React hooks directly from the React instance
    const [sdkReady, setSdkReady] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      try {
        // Ensure SDK is available before rendering
        if (window.PluginSDK) {
          setSdkReady(true);
        } else {
          setError("PluginSDK became unavailable");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }, []);

    if (error) {
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
        `Plugin Error: ${error}`,
      );
    }

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
    } catch (error: unknown) {
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
            error instanceof Error ? error.message : String(error),
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