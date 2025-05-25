# Plugin System Documentation

This document describes the plugin system for the Events Platform, which allows third-party developers to extend the platform with custom functionality.

## Architecture Overview

The plugin system uses a dynamic runtime component loading approach, which loads plugin code at runtime and renders components at designated extension points. This approach is compatible with Next.js App Router, unlike module federation.

### Key Components

1. **Extension Points**: Pre-defined locations in the application where plugins can render custom UI components
2. **Plugin SDK**: A set of utilities and type definitions for plugin developers
3. **Plugin Registry**: A central registry for managing installed plugins
4. **Plugin Loader**: Dynamically loads plugin modules and components at runtime

## Creating a Plugin

### Plugin Structure

A plugin consists of:
- Metadata (name, version, description, etc.)
- One or more components that implement extension points
- Configuration options

### Example Plugin

```tsx
import { definePlugin, registerExtensionPoint } from '@/lib/plugin-sdk';

// Define a component for the payment methods extension point
const PaymentMethodComponent = registerExtensionPoint(({ context, configuration }) => {
  const { cart } = context;
  const { apiKey } = configuration;
  
  return (
    <CustomPaymentForm 
      amount={cart.total} 
      apiKey={apiKey}
      onSuccess={context.onSuccess}
    />
  );
});

// Export the plugin definition
export default definePlugin({
  name: 'My Payment Plugin',
  version: '1.0.0',
  description: 'Custom payment processing',
  category: 'payment',
  metadata: {
    author: 'Your Company',
    priority: 10 // Higher priority plugins are rendered first
  },
  extensionPoints: {
    'payment-methods': PaymentMethodComponent,
    'admin-settings': AdminSettingsComponent
  }
});
```

## Extension Points

The platform provides several extension points where plugins can render custom UI:

### Admin Extension Points

- `admin-settings`: Plugin configuration UI in the admin panel
- `event-creation`: Custom fields and options during event creation
- `dashboard`: Custom widgets for the admin dashboard

### Storefront Extension Points

- `payment-methods`: Custom payment methods during checkout
- `checkout-confirmation`: Custom UI on the checkout confirmation page
- `ticket-selection`: Custom UI for ticket selection
- Various widget areas: sidebar, event header, footer, etc.

## Plugin SDK

The SDK provides utilities for plugin development:

### Core Functions

- `definePlugin()`: Defines a plugin with its metadata and components
- `registerExtensionPoint()`: Registers a component for an extension point

### Hooks

- `useExtensionContext()`: Access the context data passed to the extension point
- `useConfiguration()`: Access the plugin configuration
- `usePlugin()`: Access plugin metadata

## Plugin Installation

Plugins are installed through the admin interface:

1. Browse available plugins in the marketplace
2. Install a plugin for your tenant
3. Configure plugin settings
4. Enable the plugin

## Security Considerations

- Plugins run in the browser context and are isolated via React's error boundaries
- Plugin code should be reviewed before being published to the marketplace
- Plugins have limited access to the platform's API through defined interfaces

## Development Guide

To develop a plugin:

1. Use the SDK to define your plugin and its components
2. Test your plugin locally
3. Package your plugin for distribution
4. Submit to the marketplace for review

See the [Plugin Development Guide](plugin-development.md) for detailed instructions. 