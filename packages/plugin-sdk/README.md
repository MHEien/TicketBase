# @ticketsplatform/plugin-sdk

TypeScript SDK for developing Tickets Platform plugins with full type safety and modern React hooks.

## 🚀 Features

- **🔷 Full TypeScript Support** - Complete type definitions for all APIs
- **⚛️ React Hooks** - Modern hooks for plugin configuration and platform integration
- **🎨 UI Components** - Pre-built components matching platform design
- **🔌 Extension Points** - Type-safe extension point system
- **🛡️ Type Safety** - Comprehensive interfaces for contexts and metadata
- **📦 Modern Build** - ESM and CJS support with proper tree-shaking

## 📦 Installation

```bash
npm install @ticketsplatform/plugin-sdk
# or
bun add @ticketsplatform/plugin-sdk
# or
yarn add @ticketsplatform/plugin-sdk
```

## 🎯 Quick Start

### 1. Create Your Plugin

```typescript
import {
  definePlugin,
  createExtensionPoint,
  usePluginConfig,
  AdminSettingsContext,
  PaymentMethodContext,
  PluginMetadata
} from '@ticketsplatform/plugin-sdk';

// Plugin configuration interface
interface MyPluginConfig {
  apiKey: string;
  enabled: boolean;
}

// Admin settings component
const AdminSettings = createExtensionPoint<AdminSettingsContext>(({ context, sdk }) => {
  const { pluginId } = context;
  const { config, saveConfig } = usePluginConfig<MyPluginConfig>(pluginId);

  return (
    <sdk.components.Card>
      <sdk.components.CardHeader>
        <sdk.components.CardTitle>My Plugin Settings</sdk.components.CardTitle>
      </sdk.components.CardHeader>
      <sdk.components.CardContent>
        {/* Your settings UI */}
      </sdk.components.CardContent>
    </sdk.components.Card>
  );
});

// Plugin metadata
const metadata: PluginMetadata = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'A sample plugin',
  author: 'Your Name',
  category: 'utility',
  displayName: 'My Plugin',
  requiredPermissions: [],
  priority: 100
};

// Export plugin
export default definePlugin({
  metadata,
  extensionPoints: {
    'admin-settings': AdminSettings
  }
});
```

### 2. Plugin Manifest (plugin.json)

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "A sample plugin for the Tickets Platform",
  "author": "Your Name",
  "category": "utility",
  "displayName": "My Plugin",
  "main": "src/index.tsx",
  "extensionPoints": ["admin-settings"],
  "requiredPermissions": []
}
```

## 🔌 Extension Points

The platform supports various extension points where your plugin can integrate:

### **Admin Settings**

Configure your plugin in the admin dashboard.

```typescript
import {
  AdminSettingsContext,
  createExtensionPoint,
} from "@ticketsplatform/plugin-sdk";

const AdminSettings = createExtensionPoint<AdminSettingsContext>(
  ({ context, sdk }) => {
    const { pluginId, user } = context;
    // Your admin UI here
  },
);
```

### **Payment Methods**

Add custom payment processors.

```typescript
import {
  PaymentMethodContext,
  createExtensionPoint,
} from "@ticketsplatform/plugin-sdk";

const PaymentMethod = createExtensionPoint<PaymentMethodContext>(
  ({ context, sdk }) => {
    const { cart, onSuccess, onError } = context;
    // Your payment UI here
  },
);
```

### **Checkout Confirmation**

Display custom confirmation messages.

```typescript
import {
  CheckoutConfirmationContext,
  createExtensionPoint,
} from "@ticketsplatform/plugin-sdk";

const CheckoutConfirmation = createExtensionPoint<CheckoutConfirmationContext>(
  ({ context, sdk }) => {
    const { paymentDetails } = context;
    // Your confirmation UI here
  },
);
```

## 🪝 Hooks

### usePluginConfig

Manage plugin configuration with automatic loading and saving.

```typescript
import { usePluginConfig } from "@ticketsplatform/plugin-sdk";

function MyComponent({ pluginId }: { pluginId: string }) {
  const { config, loading, error, saveConfig } =
    usePluginConfig<MyConfig>(pluginId);

  const handleSave = async (newConfig: MyConfig) => {
    await saveConfig(newConfig);
  };
}
```

### usePaymentProcessor

Process payments through the platform.

```typescript
import { usePaymentProcessor } from "@ticketsplatform/plugin-sdk";

function PaymentComponent({ pluginId }: { pluginId: string }) {
  const { processPayment, processing, error } = usePaymentProcessor(pluginId);

  const handlePayment = async (paymentData: PaymentData) => {
    await processPayment(paymentData, (paymentId, metadata) => {
      // Success callback
    });
  };
}
```

### usePlatformSDK

Access platform APIs and utilities.

```typescript
import { usePlatformSDK } from "@ticketsplatform/plugin-sdk";

function MyComponent() {
  const { api, auth, components, utils } = usePlatformSDK();

  // Use platform APIs
  const events = await api.getEvents();

  // Format currency
  const formatted = utils.formatCurrency(1000, "USD");
}
```

## 🎨 Components

Access platform UI components for consistent design:

```typescript
function MyComponent({ sdk }) {
  return (
    <sdk.components.Card>
      <sdk.components.CardHeader>
        <sdk.components.CardTitle>Title</sdk.components.CardTitle>
      </sdk.components.CardHeader>
      <sdk.components.CardContent>
        <sdk.components.Button onClick={handleClick}>
          Click me
        </sdk.components.Button>
      </sdk.components.CardContent>
    </sdk.components.Card>
  );
}
```

Available components:

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button`, `Input`, `Label`, `Switch`
- `Alert`, `AlertDescription`
- And many more...

## 📝 TypeScript Support

The SDK provides full TypeScript support with comprehensive type definitions:

```typescript
import type {
  PluginMetadata,
  AdminSettingsContext,
  PaymentMethodContext,
  CheckoutConfirmationContext,
  PluginConfig,
  PaymentData,
  PlatformSDK,
} from "@ticketsplatform/plugin-sdk";
```

## 🏗️ Development Workflow

1. **Create Plugin**: Use TypeScript with full type safety
2. **Test Locally**: Develop with hot reload
3. **Package**: ZIP your source code (src/, plugin.json, package.json)
4. **Upload**: Use the platform's upload interface
5. **Deploy**: Platform handles TypeScript compilation and optimization

## 📚 Examples

Check out example plugins in the [repository](https://github.com/your-org/ticketsmonorepo/tree/main/apps/admin/examples):

- **Stripe Payment Plugin** - Complete payment processor integration
- **Analytics Plugin** - Event tracking and reporting
- **Custom Layout Plugin** - UI customization example

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/your-org/ticketsmonorepo/blob/main/CONTRIBUTING.md).

## 📄 License

MIT © [Tickets Platform Team](https://github.com/your-org/ticketsmonorepo)

---

**Need help?** Join our [Discord](https://discord.gg/ticketsplatform) or [open an issue](https://github.com/your-org/ticketsmonorepo/issues).
