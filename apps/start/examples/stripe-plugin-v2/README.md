# Stripe Payment Plugin v2.0 - TypeScript SDK

This is an example of a modern TypeScript-based plugin for the Tickets Platform, built with the new Plugin SDK approach.

## 🚀 **What's New in v2.0**

### **✅ TypeScript First**

- Full TypeScript support with strict typing
- IntelliSense and autocomplete for all SDK features
- Compile-time error checking
- Type-safe extension point development

### **✅ Plugin SDK**

- Clean, documented API surface
- Pre-built hooks for common operations
- Consistent error handling and loading states
- Direct access to platform components and utilities

### **✅ Modern Developer Experience**

- Standard npm/bun package structure
- Familiar React development patterns
- Hot reload during development
- Automated building and packaging

### **✅ Platform-Managed Build Pipeline**

- Upload source code (zip file)
- Platform handles TypeScript compilation
- Automatic dependency resolution
- Optimized browser-compatible bundles
- Deployed to CDN automatically

## 📁 **Project Structure**

```
stripe-plugin-v2/
├── 
│   └── index.tsx          # Main plugin implementation
├── package.json           # Dependencies and scripts
├── plugin.json           # Plugin metadata and configuration
├── tsconfig.json         # TypeScript configuration
├── README.md            # This file
└── dist/               # Built output (generated)
    └── plugin.js       # Final plugin bundle
```

## 🛠️ **Development Workflow**

### **1. Install Dependencies**

```bash
bun install
```

### **2. Develop with TypeScript**

```bash
# Type checking and compilation
bun run dev

# Lint your code
bun run lint

# Type check without compilation
bun run type-check
```

### **3. Build for Production**

```bash
# Build TypeScript and bundle
bun run build

# Package for upload
bun run package
# Creates plugin.zip ready for platform upload
```

### **4. Upload to Platform**

- Create `plugin.zip` using `bun run package`
- Upload via Admin → Plugins → Upload Plugin
- Platform will:
  - Extract and validate your plugin
  - Install dependencies
  - Compile TypeScript to JavaScript
  - Bundle for browser compatibility
  - Deploy to CDN storage
  - Register in plugin system

## 📦 **Plugin SDK Features**

### **Type-Safe Extension Points**

```typescript
const AdminSettingsComponent = createExtensionPoint<AdminSettingsContext>(({ context, sdk }) => {
  const { pluginId, user } = context;  // ✅ Fully typed
  const { config, saveConfig } = usePluginConfig<StripeConfig>(pluginId);

  // TypeScript knows exactly what's available
  return (
    <sdk.components.Card>
      <sdk.components.CardHeader>
        <sdk.components.CardTitle>Settings</sdk.components.CardTitle>
      </sdk.components.CardHeader>
    </sdk.components.Card>
  );
});
```

### **Built-in Hooks**

```typescript
// Configuration management with loading states
const { config, loading, error, saveConfig } =
  usePluginConfig<MyConfig>(pluginId);

// Payment processing with error handling
const { processPayment, processing, error } = usePaymentProcessor(pluginId);

// Direct SDK access
const sdk = usePlatformSDK();
```

### **Platform Integration**

```typescript
// Pre-authenticated API client
const response = await sdk.api.post('/api/payments/process', paymentData);

// Toast notifications
sdk.utils.toast({
  title: 'Success',
  description: 'Payment processed successfully',
  variant: 'success'
});

// UI components (shadcn/ui)
<sdk.components.Button onClick={handleSubmit}>
  Save Configuration
</sdk.components.Button>
```

## 🔧 **Extension Points Implemented**

### **Admin Settings** (`admin-settings`)

- **Context**: `AdminSettingsContext`
- **Purpose**: Plugin configuration interface
- **Features**:
  - Form validation and error handling
  - Loading states during save operations
  - User authentication display
  - Type-safe configuration management

### **Payment Methods** (`payment-methods`)

- **Context**: `PaymentMethodContext`
- **Purpose**: Credit card payment processing
- **Features**:
  - Cart integration with totals and customer data
  - Real-time form validation
  - Payment processing with loading states
  - Error handling with user feedback

### **Checkout Confirmation** (`checkout-confirmation`)

- **Context**: `CheckoutConfirmationContext`
- **Purpose**: Post-payment confirmation display
- **Features**:
  - Provider-specific confirmation messages
  - Test mode indicators
  - Payment status handling

## 🚀 **Plugin Upload Options**

The platform supports multiple upload methods:

### **Option 1: Source Code Upload (Recommended)**

```bash
# Package your TypeScript source
bun run package
# Upload plugin.zip via admin interface
```

**Pros:**

- Platform handles all building and optimization
- Always uses latest build tools and dependencies
- Automatic security scanning
- Consistent deployment process

### **Option 2: Pre-built Upload**

```bash
# Build locally first
bun run build
# Upload just the dist/ folder
```

**Pros:**

- Faster upload process
- Full control over build process
- Good for complex build requirements

### **Option 3: GitHub Integration (Future)**

```yaml
# .github/workflows/deploy-plugin.yml
name: Deploy Plugin
on:
  push:
    tags: ["v*"]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Tickets Platform
        uses: ticketsplatform/deploy-plugin@v1
        with:
          api-key: ${{ secrets.TICKETS_API_KEY }}
          plugin-path: ./
```

## 🔐 **Configuration Schema**

The `plugin.json` file defines the configuration schema:

```json
{
  "configSchema": {
    "type": "object",
    "properties": {
      "apiKey": {
        "type": "string",
        "title": "Stripe Secret API Key",
        "pattern": "^sk_(test_|live_)",
        "minLength": 20
      }
    },
    "required": ["apiKey"]
  }
}
```

This generates:

- ✅ **Type-safe configuration interfaces**
- ✅ **Automatic form generation in admin**
- ✅ **Runtime validation**
- ✅ **Error messaging**

## 🌍 **Environment Support**

### **Development**

- TypeScript with hot reload
- Type checking and linting
- Local testing environment

### **Production**

- Optimized browser bundles
- CDN deployment
- Caching and performance optimization
- Error tracking and monitoring

## 📝 **Migration from v1.0**

### **Before (bundle.js approach):**

```javascript
// ❌ Manual ES5 compatible code
var AdminSettingsComponent = function (props) {
  var useState = window.PluginSDK.hooks.useState;
  // ... complex manual implementation
};
```

### **After (TypeScript SDK approach):**

```typescript
// ✅ Modern TypeScript with full intellisense
const AdminSettingsComponent = createExtensionPoint<AdminSettingsContext>(
  ({ context, sdk }) => {
    const { config, saveConfig } = usePluginConfig<StripeConfig>(pluginId);
    // ... clean, type-safe implementation
  },
);
```

## 🎯 **Benefits**

### **For Plugin Developers**

- **Familiar development experience** with TypeScript and React
- **Rich IDE support** with autocomplete and error checking
- **Reduced boilerplate** with pre-built hooks and utilities
- **Built-in best practices** for error handling and loading states

### **For Platform Operators**

- **Consistent plugin quality** through TypeScript validation
- **Automated security scanning** during build process
- **Performance optimization** with platform-managed bundling
- **Easy debugging** with source maps and error tracking

### **For End Users**

- **Faster loading** with optimized bundles and CDN delivery
- **Better reliability** through type-safe development
- **Consistent UX** using platform component library
- **Enhanced security** through platform validation

This new approach eliminates all the complexity of the old system while providing a much better development experience for plugin creators!
