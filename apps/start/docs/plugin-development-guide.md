# Plugin Development & Submission Guide

## 🚀 Creating a Plugin with React Pluggable

### Step 1: Create Your Plugin Class

Create a new file in `/plugins/` folder:

```typescript
// plugins/my-awesome-plugin.tsx
import React, { useState } from 'react';
import { BaseExtensionPlugin } from '../lib/react-pluggable-system';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Your plugin components
const MyAdminSettingsComponent: React.FC<{ context?: any; pluginId?: string }> = ({
  context = {},
  pluginId
}) => {
  const [config, setConfig] = useState({ apiKey: '', enabled: false });

  const handleSave = async () => {
    if (context.onSave) {
      await context.onSave(config);
    }
  };

  return (
    <div className="space-y-4">
      <h3>My Awesome Plugin Settings</h3>
      <Input
        placeholder="API Key"
        value={config.apiKey}
        onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
      />
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
};

const MyPaymentComponent: React.FC<{ context?: any; pluginId?: string }> = ({
  context = {},
  pluginId
}) => {
  const handlePayment = async () => {
    // Your payment logic
    if (context.onSuccess) {
      context.onSuccess('payment-' + Date.now());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handlePayment} className="w-full">
          Pay ${context.amount || 0}
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Plugin Class
export class MyAwesomePlugin extends BaseExtensionPlugin {
  constructor() {
    super('MyAwesomePlugin');
  }

  getPluginName(): string {
    return 'MyAwesomePlugin@1.0.0';
  }

  activate(): void {
    // Register your components
    this.registerExtensionPoint('admin-settings', MyAdminSettingsComponent);
    this.registerExtensionPoint('payment-methods', MyPaymentComponent);

    // Register utility functions
    this.registerFunction('processPayment', this.processPayment);
    this.registerFunction('validateConfig', this.validateConfig);
  }

  private processPayment = async (amount: number) => {
    // Your payment processing logic
    return { success: true, transactionId: 'tx-' + Date.now() };
  };

  private validateConfig = (config: any) => {
    return config.apiKey && config.apiKey.length > 10;
  };

  deactivate(): void {
    console.log('MyAwesomePlugin deactivated');
  }
}

export default MyAwesomePlugin;
```

### Step 2: Test Your Plugin Locally

```typescript
// Test in any component or page
import { pluginStore } from "@/lib/react-pluggable-system";
import { MyAwesomePlugin } from "@/plugins/my-awesome-plugin";

// Install for testing
pluginStore.install(new MyAwesomePlugin());
```

### Step 3: Create Plugin Metadata

```typescript
// plugins/my-awesome-plugin.meta.ts
export const pluginMetadata = {
  id: "my-awesome-plugin",
  name: "My Awesome Plugin",
  version: "1.0.0",
  description: "An awesome plugin that does amazing things",
  author: "Your Name",
  authorEmail: "your.email@example.com",
  category: "payment", // or 'marketing', 'analytics', etc.
  extensionPoints: ["admin-settings", "payment-methods"],
  requiredPermissions: ["payments", "user-data"],
  repository: "https://github.com/yourusername/my-awesome-plugin",
  documentation: "https://docs.yourplugin.com",
  icon: "CreditCard", // Lucide icon name
  screenshots: [
    "https://yoursite.com/screenshot1.png",
    "https://yoursite.com/screenshot2.png",
  ],
  pricing: {
    type: "free", // or 'paid', 'freemium'
    price: 0,
    currency: "USD",
  },
};
```

## 📤 Submitting Your Plugin

### Option 1: GitHub Integration (Recommended)

```bash
# 1. Create a repository
git init
git add .
git commit -m "Initial plugin commit"
git remote add origin https://github.com/yourusername/my-awesome-plugin
git push -u origin main

# 2. Submit via GitHub URL
# Visit /settings/plugins/submit and provide your GitHub repo URL
```

### Option 2: Direct Code Submission

```typescript
// Submit plugin code directly through the admin interface
const submission = {
  metadata: pluginMetadata,
  sourceCode: `
    // Your complete plugin source code
    export class MyAwesomePlugin extends BaseExtensionPlugin {
      // ... your plugin code
    }
  `,
  dependencies: [
    "@/lib/react-pluggable-system",
    "@repo/ui/button",
    // ... other dependencies
  ],
};
```

### Option 3: NPM Package (Advanced)

```bash
# 1. Publish as NPM package
npm publish

# 2. Submit package name
# Users can then install with: npm install your-plugin-name
```

## 🔍 Plugin Review Process

1. **Automated Validation**

   - Code syntax check
   - TypeScript compilation
   - Security scan
   - Dependency validation

2. **Manual Review**

   - Code quality assessment
   - Security review
   - User experience evaluation
   - Documentation completeness

3. **Testing**

   - Automated test suite
   - Manual testing in sandbox
   - Performance benchmarks

4. **Approval & Publishing**
   - Plugin added to marketplace
   - Available for installation
   - Notification sent to author

## 📋 Plugin Submission Checklist

### Code Quality

- [ ] TypeScript with proper types
- [ ] Error handling implemented
- [ ] No console.log statements
- [ ] Follows naming conventions
- [ ] Clean, readable code

### Functionality

- [ ] Plugin activates/deactivates cleanly
- [ ] All extension points work correctly
- [ ] No memory leaks
- [ ] Proper cleanup in deactivate()

### Documentation

- [ ] README.md with installation instructions
- [ ] API documentation for functions
- [ ] Screenshots/demo GIFs
- [ ] Configuration examples

### Security

- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] Proper error messages
- [ ] No XSS vulnerabilities

### Testing

- [ ] Unit tests for core functions
- [ ] Integration tests with extension points
- [ ] Manual testing completed
- [ ] Performance tested

## 🏪 Marketplace Features

Your submitted plugin will get:

- **Automatic installation** - One-click install for users
- **Version management** - Easy updates and rollbacks
- **Usage analytics** - Download counts, ratings
- **Revenue sharing** - For paid plugins
- **Support system** - User feedback and issues
- **Documentation hosting** - Auto-generated docs

## 🛠️ Development Tips

### Local Development

```bash
# Install in development mode
pluginStore.install(new YourPlugin(), { dev: true });

# Enable hot reload
pluginStore.enableHotReload('YourPlugin');

# Debug mode
pluginStore.setDebugMode(true);
```

### Testing Extension Points

```typescript
// Test admin settings
<ExtensionPoint
  name="admin-settings"
  context={{ pluginId: 'test', onSave: console.log }}
/>

// Test payment methods
<ExtensionPoint
  name="payment-methods"
  context={{ amount: 29.99, onSuccess: console.log }}
/>
```

### Common Patterns

```typescript
// Configuration management
const config = this.pluginStore.executeFunction(
  "ConfigManager.get",
  "MyPlugin",
);

// Event handling
this.pluginStore.addEventListener("user.login", this.handleUserLogin);

// API calls
const api = this.pluginStore.executeFunction(
  "ApiManager.create",
  "/my-endpoint",
);
```

## 🚀 Next Steps

1. **Start with the example**: Copy `example-admin-settings-plugin.tsx`
2. **Test locally**: Install and verify in `/plugin-test`
3. **Create repository**: Push to GitHub
4. **Submit for review**: Use the submission form
5. **Monitor status**: Track review progress in dashboard

Need help? Check out the [Plugin API Reference](./plugin-api-reference.md) or join our [Discord community](https://discord.gg/your-server).
