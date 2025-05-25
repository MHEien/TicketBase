# Plugin Development Guide

This guide explains how to create plugins for our Events Platform using the new dynamic component loading system.

## Plugin Structure

A plugin consists of:
1. Plugin metadata (name, version, description, etc.)
2. Components for various extension points
3. Configuration options

## Getting Started

### 1. Set Up Your Project

```bash
# Create a new plugin project
mkdir my-plugin
cd my-plugin
npm init -y

# Install dependencies
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-transform-runtime typescript ts-node style-loader css-loader postcss-loader terser-webpack-plugin
npm install --save react react-dom

# Install our plugin SDK (This would be published as an npm package in a real scenario)
# npm install --save @events-platform/plugin-sdk
```

### 2. Create TypeScript Configuration

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### 3. Create Webpack Configuration

Create a `webpack.config.js` file (you can use our template from `docs/plugin-build-template.js`).

### 4. Create Plugin Entry Point

Create a `src/index.tsx` file:

```tsx
import { definePlugin, registerExtensionPoint } from '@/lib/plugin-sdk';

// Import your components
import PaymentMethodComponent from './components/PaymentMethod';
import AdminSettingsComponent from './components/AdminSettings';

// Define your payment method component
const TypedPaymentMethodComponent = registerExtensionPoint(
  ({ context, configuration, plugin }) => {
    // Access context data passed from the host application
    const { cart } = context;
    
    // Access your plugin's configuration
    const { apiKey } = configuration;
    
    // Render your component
    return (
      <PaymentMethodComponent
        apiKey={apiKey}
        amount={cart?.total || 0}
        currency={cart?.currency || 'USD'}
        onSuccess={context.onSuccess}
      />
    );
  }
);

// Define your admin settings component
const TypedAdminSettingsComponent = registerExtensionPoint(
  ({ configuration, plugin }) => {
    return (
      <AdminSettingsComponent
        initialConfig={configuration}
        pluginId={plugin.id}
      />
    );
  }
);

// Export your plugin definition
export default definePlugin({
  name: 'My Payment Plugin',
  version: '1.0.0',
  description: 'Custom payment processing for the Events Platform',
  category: 'payment', // Options: payment, marketing, analytics, social, ticketing, layout, seating
  metadata: {
    author: 'Your Company',
    priority: 10, // Higher priority plugins are rendered first
    displayName: 'My Payment Solution'
  },
  extensionPoints: {
    // Register components for each extension point you want to implement
    'payment-methods': TypedPaymentMethodComponent,
    'admin-settings': TypedAdminSettingsComponent
  }
});
```

### 5. Create Your Components

Create components for each extension point you want to implement.

#### PaymentMethod.tsx Example:

```tsx
import React, { useState } from 'react';

interface PaymentMethodProps {
  apiKey: string;
  amount: number;
  currency: string;
  onSuccess?: (paymentId: string) => void;
}

export default function PaymentMethodComponent({
  apiKey,
  amount,
  currency,
  onSuccess
}: PaymentMethodProps) {
  const [processing, setProcessing] = useState(false);
  
  const handlePayment = async () => {
    setProcessing(true);
    
    // Process payment logic here
    
    // On success
    if (onSuccess) {
      onSuccess('payment-123');
    }
    
    setProcessing(false);
  };
  
  return (
    <div className="p-4 border rounded">
      <h3>My Payment Method</h3>
      <div>Amount: {amount} {currency}</div>
      <button 
        onClick={handlePayment}
        disabled={processing}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
```

#### AdminSettings.tsx Example:

```tsx
import React, { useState } from 'react';

interface AdminSettingsProps {
  initialConfig: {
    apiKey?: string;
    webhookUrl?: string;
  };
  pluginId: string;
}

export default function AdminSettingsComponent({ 
  initialConfig, 
  pluginId 
}: AdminSettingsProps) {
  const [config, setConfig] = useState(initialConfig);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save config logic here
    console.log('Saving config for plugin', pluginId, config);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            API Key
          </label>
          <input
            name="apiKey"
            value={config.apiKey || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">
            Webhook URL
          </label>
          <input
            name="webhookUrl"
            value={config.webhookUrl || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
}
```

### 6. Build Your Plugin

Add these scripts to your `package.json`:

```json
"scripts": {
  "build": "webpack --config webpack.config.js",
  "dev": "webpack --config webpack.config.js --watch --mode=development"
}
```

Then build your plugin:

```bash
npm run build
```

This will create a bundle in the `dist` folder.

### 7. Publish Your Plugin

Upload your plugin bundle to the platform's plugin registry:

1. Package your bundle: `zip -r my-plugin.zip dist/`
2. Upload to the plugin marketplace
3. Set configuration options and metadata

## Available Extension Points

The platform provides several extension points where your plugin can render content:

### Admin Extension Points:
- `admin-settings`: Settings UI for your plugin
- `event-creation`: Custom fields for event setup
- `dashboard`: Add widgets to the admin dashboard

### Storefront Extension Points:
- `payment-methods`: Custom payment options during checkout
- `checkout-confirmation`: UI shown after successful checkout
- `ticket-selection`: Custom UI for ticket selection
- Various widget areas: `event-header`, `event-sidebar`, etc.

## Plugin Context

Each extension point receives context data:

```typescript
interface ExtensionComponentProps {
  context: Record<string, any>; // Context data specific to the extension point
  configuration: Record<string, any>; // Plugin configuration values
  plugin: {
    id: string;
    name: string;
    version: string;
    enabled: boolean;
    // ...other plugin metadata
  };
}
```

## Helper Hooks

Our plugin SDK provides several hooks to make plugin development easier:

```typescript
// Access extension point context
const { cart } = useExtensionContext<{ cart: Cart }>();

// Access plugin configuration
const { apiKey } = useConfiguration<{ apiKey: string }>();

// Access plugin metadata
const { id, name } = usePlugin();
```

## Testing Your Plugin

To test your plugin locally:

1. Start your plugin in dev mode: `npm run dev`
2. In the platform, add a local plugin with URL pointing to your dev server
3. Install and enable the plugin for your tenant

## Publishing Guidelines

When submitting plugins to our marketplace:

1. Ensure proper error handling and fallbacks
2. Follow our design system guidelines
3. Include clear documentation
4. Test all extension points thoroughly
5. Use TypeScript for type safety

## Need Help?

If you need any assistance, contact our developer support at developers@events-platform.example.com. 