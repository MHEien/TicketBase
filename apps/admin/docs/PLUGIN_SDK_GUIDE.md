# Plugin SDK Guide

## Overview

The Plugin SDK provides a context-aware approach to plugin development that solves common issues with external plugin loading:

- ✅ **No environment variable bundling** - Injected at runtime
- ✅ **Automatic authentication** - Session/tokens provided via context
- ✅ **Consistent UI components** - Shared component library
- ✅ **Type safety** - Full TypeScript support
- ✅ **Error isolation** - Proper error boundaries

## Quick Start

### 1. Plugin Structure

Your plugin should export components for specific extension points:

```javascript
// my-plugin.js (served from MinIO)
(function () {
  // Access the PluginSDK provided by the host app
  const { React, components, api, auth, utils } = window.PluginSDK;
  const { useState, useEffect } = window.PluginSDK.hooks;

  // Admin Settings Component
  const AdminSettingsComponent = ({ pluginId, sdk, api, auth, components }) => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(false);

    // Load existing configuration
    useEffect(() => {
      const loadConfig = async () => {
        try {
          const savedConfig = await api.loadConfig(pluginId);
          setConfig(savedConfig);
        } catch (error) {
          utils.toast({
            title: "Error",
            description: "Failed to load configuration",
            variant: "destructive",
          });
        }
      };
      loadConfig();
    }, [pluginId]);

    const handleSave = async () => {
      setLoading(true);
      try {
        await api.saveConfig(pluginId, config);
        utils.toast({
          title: "Success",
          description: "Configuration saved successfully",
        });
      } catch (error) {
        utils.toast({
          title: "Error",
          description: "Failed to save configuration",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    return React.createElement(components.Card, {}, [
      React.createElement(components.CardHeader, { key: "header" }, [
        React.createElement(
          components.CardTitle,
          { key: "title" },
          "Plugin Configuration",
        ),
        React.createElement(
          components.CardDescription,
          { key: "desc" },
          `Authenticated as: ${auth.user?.email || "Unknown"}`,
        ),
      ]),
      React.createElement(components.CardContent, { key: "content" }, [
        React.createElement("div", { key: "form", className: "space-y-4" }, [
          React.createElement("div", { key: "api-key" }, [
            React.createElement(components.Label, { key: "label" }, "API Key"),
            React.createElement(components.Input, {
              key: "input",
              placeholder: "Enter API key",
              value: config.apiKey || "",
              onChange: (e) => setConfig({ ...config, apiKey: e.target.value }),
            }),
          ]),
          React.createElement("div", { key: "webhook" }, [
            React.createElement(
              components.Label,
              { key: "label" },
              "Webhook URL",
            ),
            React.createElement(components.Input, {
              key: "input",
              placeholder: "https://example.com/webhook",
              value: config.webhookUrl || "",
              onChange: (e) =>
                setConfig({ ...config, webhookUrl: e.target.value }),
            }),
          ]),
          React.createElement(
            components.Button,
            {
              key: "save",
              onClick: handleSave,
              disabled: loading,
            },
            loading ? "Saving..." : "Save Configuration",
          ),
        ]),
      ]),
    ]);
  };

  // Export components for different extension points
  const extensionPoints = {
    "admin-settings": AdminSettingsComponent,
    "checkout-payment": PaymentComponent, // Add other extension points as needed
  };

  // Make available globally (the loader will pick this up)
  window.PluginRegistry = window.PluginRegistry || [];
  window.PluginRegistry.push({
    extensionPoints: extensionPoints,
    AdminSettingsComponent: AdminSettingsComponent, // Alternative access
  });
})();
```

### 2. Available SDK Features

#### Authentication

```javascript
const { auth } = window.PluginSDK;

// Check if user is authenticated
if (auth.isAuthenticated) {
  console.log("User:", auth.user);
  console.log("Access Token:", auth.token);
}
```

#### API Client

```javascript
const { api } = window.PluginSDK;

// Pre-authenticated API calls
const response = await api.get("/api/events");
const events = await response.json();

// Plugin-specific endpoints
await api.saveConfig("my-plugin", { apiKey: "xxx" });
const config = await api.loadConfig("my-plugin");
```

#### UI Components

```javascript
const { components } = window.PluginSDK;

// Use consistent UI components
React.createElement(components.Button, { variant: "primary" }, "Click me");
React.createElement(components.Input, { placeholder: "Enter text" });
React.createElement(components.Card, {}, "Card content");
```

#### Utilities

```javascript
const { utils } = window.PluginSDK;

// Show toasts
utils.toast({ title: "Success", description: "Operation completed" });

// Format data
const formatted = utils.formatCurrency(1234.56); // "$1,234.56"
const date = utils.formatDate(new Date()); // "January 15, 2024"
```

#### Navigation

```javascript
const { navigation } = window.PluginSDK;

// Navigate programmatically
navigation.push("/admin/events");
navigation.back();
```

#### React Hooks

```javascript
const { hooks } = window.PluginSDK;
const { useState, useEffect, useCallback, useMemo } = hooks;

// Use React hooks normally
const [state, setState] = useState(initialValue);
```

### 3. Extension Points

#### `admin-settings`

Configuration interface for your plugin in the admin panel.

```javascript
const AdminSettingsComponent = ({ pluginId, api, components }) => {
  // Plugin configuration UI
  return React.createElement("div", {}, "Settings here");
};
```

#### `checkout-payment`

Payment processing during checkout.

```javascript
const PaymentComponent = ({ context, api, components }) => {
  const { cartTotal, onPaymentComplete } = context;
  // Payment processing UI
};
```

#### `event-widget`

Widget displayed on event pages.

```javascript
const EventWidget = ({ context, api, components }) => {
  const { event } = context;
  // Event-specific widget
};
```

### 4. TypeScript Support

Create type definitions for better development experience:

```typescript
// types/plugin-sdk.d.ts
export interface PluginSDK {
  auth: {
    session: any;
    token?: string;
    user?: any;
    isAuthenticated: boolean;
  };
  api: {
    get: (url: string) => Promise<Response>;
    post: (url: string, data: any) => Promise<Response>;
    saveConfig: (pluginId: string, config: any) => Promise<any>;
    loadConfig: (pluginId: string) => Promise<any>;
  };
  components: {
    Button: React.ComponentType<any>;
    Input: React.ComponentType<any>;
    Card: React.ComponentType<any>;
    // ... other components
  };
  utils: {
    toast: (options: {
      title: string;
      description?: string;
      variant?: string;
    }) => void;
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | string) => string;
  };
  navigation: {
    push: (url: string) => void;
    back: () => void;
  };
  hooks: {
    useState: typeof React.useState;
    useEffect: typeof React.useEffect;
    // ... other hooks
  };
}

declare global {
  interface Window {
    PluginSDK: PluginSDK;
  }
}
```

### 5. Development Tips

#### Local Testing

```javascript
// For local development, you can test by injecting your plugin:
if (typeof window !== "undefined") {
  window.devPlugin1 = {
    extensionPoints: {
      "admin-settings": YourAdminComponent,
    },
  };
}
```

#### Error Handling

```javascript
const SafeComponent = ({ pluginId, api }) => {
  try {
    // Your component logic
    return React.createElement("div", {}, "Plugin content");
  } catch (error) {
    console.error(`Plugin ${pluginId} error:`, error);
    return React.createElement(
      "div",
      {
        style: { padding: "1rem", color: "red" },
      },
      "Plugin failed to load",
    );
  }
};
```

#### Async Loading

```javascript
const AsyncComponent = ({ pluginId, api }) => {
  const [data, setData] = window.PluginSDK.hooks.useState(null);
  const [loading, setLoading] = window.PluginSDK.hooks.useState(true);

  window.PluginSDK.hooks.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get(`/api/plugins/${pluginId}/data`);
        const result = await response.json();
        setData(result);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [pluginId]);

  if (loading) {
    return React.createElement("div", {}, "Loading...");
  }

  return React.createElement("div", {}, JSON.stringify(data));
};
```

### 6. Best Practices

1. **Always check SDK availability**:

   ```javascript
   if (!window.PluginSDK) {
     console.error("PluginSDK not available");
     return null;
   }
   ```

2. **Handle errors gracefully**:

   ```javascript
   try {
     await api.saveConfig(pluginId, config);
   } catch (error) {
     utils.toast({
       title: "Error",
       description: error.message,
       variant: "destructive",
     });
   }
   ```

3. **Use provided components for consistency**:

   ```javascript
   // Good: Uses provided components
   React.createElement(components.Button, {}, 'Click me');

   // Avoid: Custom styling that breaks consistency
   React.createElement('button', { style: { ... } }, 'Click me');
   ```

4. **Respect the context**:
   ```javascript
   const PaymentComponent = ({ context }) => {
     const { cartTotal, onPaymentComplete } = context;
     // Use the provided context data and callbacks
   };
   ```

## Migration from Old System

If you have an existing plugin using the old bundling system:

### Before (Old System)

```javascript
// Had to bundle environment variables and auth
const API_URL = process.env.NEXT_PUBLIC_API_URL; // ❌ Not available
const session = useSession(); // ❌ Not available
```

### After (New SDK System)

```javascript
// Environment and auth provided via SDK
const { env, auth, api } = window.PluginSDK;
const API_URL = env.API_URL; // ✅ Available
const session = auth.session; // ✅ Available
const authenticatedApi = api; // ✅ Pre-configured with auth
```

This new approach eliminates the need for complex bundling and provides a clean, consistent development experience.
