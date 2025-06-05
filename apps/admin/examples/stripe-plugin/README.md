# Stripe Payment Plugin - Plugin SDK Context-Aware

This is an example Stripe payment plugin built using the **Plugin SDK Context-Aware** approach. This plugin demonstrates how to create a payment gateway plugin that integrates with your plugin system.

## 🚀 Current Architecture

Your plugin system uses:

### **✅ Context-Aware Plugin Loader**

- Loads plugins from bundle URLs (MinIO storage)
- Provides `window.PluginSDK` with authentication, components, API client
- Wraps components with proper context injection
- Caches loaded plugins for performance

### **✅ Plugin SDK Provider**

The admin app provides a global `window.PluginSDK` object containing:

```javascript
window.PluginSDK = {
  auth: {
    session: NextAuthSession,
    token: "Bearer abc123...",
    user: { email: "user@example.com" },
    isAuthenticated: true,
  },
  api: {
    get: (url) => authenticatedFetch(url),
    post: (url, data) => authenticatedFetch(url, data),
    saveConfig: (pluginId, config) => saveToBackend(pluginId, config),
    loadConfig: (pluginId) => loadFromBackend(pluginId),
  },
  components: {
    Button,
    Input,
    Card,
    Label,
    Switch,
    Alert, // ... all UI components
  },
  utils: {
    toast: (options) => showToast(options),
    formatCurrency: (amount) => "$1,234.56",
    formatDate: (date) => "January 15, 2024",
  },
  hooks: {
    useState: React.useState,
    useEffect: React.useEffect,
    // ... all React hooks
  },
};
```

### **✅ Bundle.js Structure**

The plugin is a self-contained JavaScript function that:

```javascript
(function () {
  // 1. Check SDK availability
  if (!window.PluginSDK) return;

  // 2. Extract SDK features
  const { components, hooks, api, auth, utils } = window.PluginSDK;

  // 3. Define components using SDK
  const AdminSettingsComponent = ({ pluginId, api, components }) => {
    // Use SDK features directly - no imports needed!
    const [config, setConfig] = hooks.useState({});

    return React.createElement(components.Card, {} /* UI */);
  };

  // 4. Register extension points
  window.PluginRegistry = window.PluginRegistry || [];
  window.PluginRegistry.push({
    id: "stripe-payment-plugin",
    extensionPoints: {
      "admin-settings": AdminSettingsComponent,
      "payment-methods": PaymentMethodComponent,
    },
  });
})();
```

## 📦 **Extension Points Implemented**

### **Admin Settings** (`admin-settings`)

Configuration interface for the plugin in admin panel:

- Load/save plugin configuration using `api.loadConfig()`/`api.saveConfig()`
- Display authenticated user info via `auth.user`
- Use consistent UI components from `components.*`
- Show success/error toasts with `utils.toast()`

### **Payment Methods** (`payment-methods`)

Payment processing interface during checkout:

- Load plugin configuration from saved settings
- Process payment with Stripe (demo implementation)
- Handle success/error states with proper user feedback
- Call `onSuccess` callback when payment completes

### **Checkout Confirmation** (`checkout-confirmation`)

Post-payment confirmation display:

- Show payment confirmation when provider is 'stripe'
- Display provider info and test mode status
- Handle different payment states

## 🎯 **Key Benefits**

### **For Plugin Developers:**

```javascript
// ✅ Clean SDK access
const { env, auth, api } = window.PluginSDK;
const API_URL = env.API_URL; // ✅ Available via SDK
const session = auth.session; // ✅ Available via SDK
const authenticatedApi = api; // ✅ Pre-configured with auth
```

### **For Admin App:**

- No bundling complexity for plugins
- Clean separation of concerns
- Consistent error handling
- Better security (no environment leaks)
- Type-safe plugin development via SDK

### **For Users:**

- Faster loading (cached components)
- Better error messages
- Consistent UI experience
- More reliable payment processing

## 🚢 **Deployment**

### **1. Upload to MinIO**

```bash
# Upload the bundle.js to your MinIO bucket
aws s3 cp bundle.js s3://your-plugin-bucket/stripe-payment-plugin/bundle.js
```

### **2. Register in Database**

```javascript
// Register the plugin in your database
{
  id: "stripe-payment-plugin",
  name: "Stripe Payment Gateway",
  version: "2.0.0",
  bundleUrl: "https://your-minio.com/stripe-payment-plugin/bundle.js",
  extensionPoints: ["admin-settings", "payment-methods", "checkout-confirmation"],
  enabled: true
}
```

### **3. Test in Admin**

1. Go to Admin → Settings → Plugins
2. Your Stripe plugin should appear with proper UI
3. Configure API keys using the context-aware form
4. Test payment processing with SDK utilities

## 🔍 **Development Tips**

### **Local Testing**

```javascript
// For local development, inject directly:
window.devPlugin1 = {
  extensionPoints: {
    "admin-settings": YourTestComponent,
  },
};
```

### **Debugging**

```javascript
// Plugin SDK provides debugging info:
console.log("SDK Available:", !!window.PluginSDK);
console.log("Auth Status:", window.PluginSDK?.auth?.isAuthenticated);
console.log(
  "Available Components:",
  Object.keys(window.PluginSDK?.components || {}),
);
```

### **Error Handling**

```javascript
// Always check SDK availability:
if (!window.PluginSDK) {
  console.error("PluginSDK not available");
  return null;
}

// Use SDK error handling:
try {
  await api.saveConfig(pluginId, config);
  utils.toast({ title: "Success", description: "Saved!" });
} catch (error) {
  utils.toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
}
```

## 📁 **Files in This Example**

- **`bundle.js`** - Main plugin implementation (✅ Current approach)
- **`package.json`** - Plugin metadata and dependencies
- **`README.md`** - This documentation
- **`components/`** - Component implementations (if needed for development)

## 📚 **Additional Resources**

- [Plugin SDK Context Guide](../lib/plugin-sdk-context.tsx) - Context provider implementation
- [Context-Aware Plugin Loader](../lib/context-aware-plugin-loader.ts) - Technical implementation
- [Plugin Types](../lib/plugin-types.ts) - TypeScript definitions

This approach provides a clean, reliable plugin system with excellent developer experience!
