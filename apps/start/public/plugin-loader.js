/**
 * Plugin Loader Helper Script
 * This script helps load plugins by providing the necessary global dependencies
 */

// Ensure React is available globally for plugins
(function () {
  // Check if React DevTools or React is already properly initialized
  if (
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
    (window.React && window.React.useState)
  ) {
    console.log("Plugin loader: React already properly initialized");
    return;
  }

  console.error(
    "Plugin loader: React not found globally. Plugins might not work correctly.",
  );

  // Create a global plugin registry if it doesn't exist
  window.__PLUGIN_REGISTRY = window.__PLUGIN_REGISTRY || {
    registered: {},

    // Register a plugin
    register: function (pluginId, pluginExports) {
      this.registered[pluginId] = pluginExports;
      console.log(`Plugin registered: ${pluginId}`);
      return pluginExports;
    },

    // Get a registered plugin
    get: function (pluginId) {
      return this.registered[pluginId];
    },
  };

  console.log("Plugin loader initialized");
})();
