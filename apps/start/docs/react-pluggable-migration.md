# React Pluggable Migration Guide

This guide explains how to migrate from our old bundling-based plugin system to the new React Pluggable architecture.

## Why Migrate?

The old system had several fundamental issues:

- **Bundling conflicts**: Next.js server code being bundled into browser-side plugins
- **Runtime errors**: `__dirname` not defined in browser contexts
- **Complex build setup**: Custom webpack configs and bundling scripts
- **Dependency resolution**: External dependencies causing size and compatibility issues
- **Security concerns**: Dynamic code execution from URLs
- **Performance issues**: Large bundle sizes and slow load times

React Pluggable solves all these issues with a clean, browser-native approach.

## Architecture Comparison

### Old System

```typescript
// Complex dynamic imports with bundling
const module = await loadPluginModule(plugin);
const Component = module.extensionPoints[extensionPoint];

// Required external bundling scripts
// Webpack configs to exclude Next.js dependencies
// Bundle URL management and validation
```

### New System

```typescript
// Clean plugin classes
class MyPlugin extends BaseExtensionPlugin {
  activate() {
    this.registerExtensionPoint("admin-settings", MyComponent);
  }
}

pluginStore.install(new MyPlugin());
```

## Migration Steps

### 1. Install React Pluggable

```bash
bun add react-pluggable
```

### 2. Update Plugin Definition

**Old plugin structure:**

```typescript
// plugin.tsx (external bundle)
export default {
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentComponent,
  },
};
```

**New plugin structure:**

```typescript
// plugins/my-plugin.tsx (local file)
import { BaseExtensionPlugin } from "@/lib/react-pluggable-system";

export class MyPlugin extends BaseExtensionPlugin {
  constructor() {
    super("MyPlugin");
  }

  getPluginName(): string {
    return "MyPlugin@1.0.0";
  }

  activate(): void {
    this.registerExtensionPoint("admin-settings", AdminSettingsComponent);
    this.registerExtensionPoint("payment-methods", PaymentComponent);

    // Register utility functions
    this.registerFunction("processPayment", this.processPayment);
  }

  private processPayment = async (amount: number) => {
    // Payment logic here
    return { success: true, transactionId: "tx-123" };
  };
}
```

### 3. Update Extension Points

**Old usage:**

```typescript
import { ExtensionPoint } from '@/components/extension-point';

<ExtensionPoint
  name="admin-settings"
  context={{ pluginId: 'test' }}
  fallback={<div>No plugins</div>}
/>
```

**New usage:**

```typescript
import { ExtensionPoint, PluginSystemProvider } from '@/lib/react-pluggable-system';

// Wrap your app with the provider
<PluginSystemProvider>
  <ExtensionPoint
    name="admin-settings"
    context={{ pluginId: 'test' }}
    fallback={<div>No plugins</div>}
  />
</PluginSystemProvider>
```

### 4. Initialize Plugin System

**Old initialization:**

```typescript
// Complex plugin registry with bundle URLs
const plugins = await loadPluginsFromConfig(pluginConfigs);
```

**New initialization:**

```typescript
// Clean plugin installation
import { pluginStore } from "@/lib/react-pluggable-system";
import { MyPlugin } from "@/plugins/my-plugin";

pluginStore.install(new MyPlugin());
```

### 5. Update Plugin Components

**Old component interface:**

```typescript
interface ExtensionComponentProps {
  context: Record<string, any>;
  configuration: Record<string, any>;
  plugin: InstalledPlugin;
}
```

**New component interface:**

```typescript
interface PluginComponentProps {
  context?: any;
  pluginId?: string;
}

const MyComponent: React.FC<PluginComponentProps> = ({ context, pluginId }) => {
  // Component logic
};
```

### 6. Access Plugin Functions

**Old function access:**

```typescript
// Functions were embedded in plugin modules
const result = await loadPluginModule(plugin).then((module) =>
  module.utilityFunction(params),
);
```

**New function access:**

```typescript
import { usePluginStoreAccess } from "@/lib/react-pluggable-system";

const MyComponent = () => {
  const pluginStore = usePluginStoreAccess();

  const handleAction = () => {
    const result = pluginStore.executeFunction("MyPlugin.processPayment", 100);
    console.log(result);
  };
};
```

## Benefits After Migration

### 1. No More Bundling Issues

- No webpack configurations needed
- No external dependency management
- No bundle URL validation
- No dynamic import failures

### 2. Better Developer Experience

- Type-safe plugin development
- Clear plugin lifecycle
- Built-in error handling
- Hot reload support

### 3. Improved Performance

- Smaller bundle sizes
- Faster load times
- No runtime compilation
- Better tree shaking

### 4. Enhanced Security

- No dynamic code execution
- No eval() usage
- Controlled plugin environment
- Built-in isolation

## Complete Example

Here's a complete migration example:

### Before (Old System)

```typescript
// external-plugin-bundle.js
window.devPlugin1 = {
  extensionPoints: {
    "admin-settings": ({ context, configuration }) => {
      return React.createElement("div", null, "Old plugin settings");
    },
  },
};
```

### After (New System)

```typescript
// plugins/example-plugin.tsx
import React from 'react';
import { BaseExtensionPlugin } from '@/lib/react-pluggable-system';

const AdminSettingsComponent: React.FC<{ context?: any; pluginId?: string }> = ({
  context,
  pluginId
}) => {
  return (
    <div className="space-y-4">
      <h3>Plugin Settings - {pluginId}</h3>
      {/* Your settings UI */}
    </div>
  );
};

export class ExamplePlugin extends BaseExtensionPlugin {
  constructor() {
    super('ExamplePlugin');
  }

  getPluginName(): string {
    return 'ExamplePlugin@1.0.0';
  }

  activate(): void {
    this.registerExtensionPoint('admin-settings', AdminSettingsComponent);
  }
}

// Installation
import { pluginStore } from '@/lib/react-pluggable-system';
pluginStore.install(new ExamplePlugin());
```

## Testing Your Migration

1. **Test the comparison page**: Visit `/plugin-comparison` to see both systems side by side
2. **Verify functionality**: Ensure all extension points work correctly
3. **Check console**: Look for any errors during plugin initialization
4. **Performance**: Monitor bundle sizes and load times

## Migration Checklist

- [ ] Install React Pluggable
- [ ] Convert plugin definitions to classes
- [ ] Update extension point usage
- [ ] Wrap app with PluginSystemProvider
- [ ] Remove old bundling scripts
- [ ] Update plugin component interfaces
- [ ] Test all extension points
- [ ] Update documentation
- [ ] Remove old plugin loader code

## Troubleshooting

### Plugin Not Loading

- Ensure plugin is installed: `pluginStore.install(new MyPlugin())`
- Check plugin name and version format
- Verify extension point names match

### Component Not Rendering

- Ensure component is properly registered in `activate()`
- Check extension point name spelling
- Verify PluginSystemProvider is wrapping the app

### Function Not Found

- Ensure function is registered with proper namespace: `MyPlugin.functionName`
- Check if plugin is activated
- Verify function name spelling

## Next Steps

After migration:

1. Remove old plugin loading code
2. Clean up webpack configurations
3. Delete bundling scripts
4. Update plugin documentation
5. Consider plugin marketplace integration

The new React Pluggable system provides a solid foundation for building a scalable plugin ecosystem without the complexity and issues of the old bundling approach.
