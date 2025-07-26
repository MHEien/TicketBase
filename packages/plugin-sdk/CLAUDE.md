# @ticketsplatform/plugin-sdk - TypeScript Plugin Development SDK

## 🎯 Purpose
Comprehensive TypeScript SDK for developing TicketBase platform plugins with full type safety, minimal configuration, and seamless integration with the platform's component systems.

## 🏗️ Architecture
- **Core Exports**: `src/index.ts` - Main SDK exports with full TypeScript definitions
- **Type Definitions**: Complete interfaces for extension points, contexts, and metadata
- **React Hooks**: Modern hooks for plugin configuration and platform integration
- **Component Helpers**: Type-safe extension point component creation utilities

## 🔌 Extension Point System

### Available Extension Points
- **admin-settings**: Plugin configuration UI in admin dashboard
- **payment-methods**: Custom payment processors for checkout
- **checkout-confirmation**: Custom confirmation messages and UI
- **event-creation**: Custom fields during event creation flow
- **dashboard**: Custom widgets for admin dashboard
- **storefront-widgets**: Custom widgets for storefront pages

### 🎯 CRITICAL INTEGRATION GOAL: Puck Editor Compatibility
**Plugin widgets need to be compatible with our @measured/puck editor system**
- Plugin components should follow Puck component configuration patterns
- Need field definitions compatible with our responsive design system
- Must integrate with our glassmorphism and animation patterns
- Should be instantly available in Puck when plugin is activated

## 🪝 Core SDK Hooks

### usePluginConfig\<T\>(pluginId)
Manages plugin configuration with automatic loading and saving
- **Returns**: `{ config, loading, error, saveConfig }`
- **Type Safety**: Full TypeScript support for configuration objects
- **Auto-persist**: Configurations saved to platform storage
- **Error Handling**: Comprehensive error management with user feedback

### usePlatformSDK()
Access to platform APIs and utilities
- **Returns**: Complete SDK interface with components, API clients, utilities
- **Runtime Injection**: SDK injected by platform at runtime
- **Type Safety**: Full TypeScript definitions for all platform features

### usePaymentProcessor(pluginId)
Process payments through the platform
- **Returns**: `{ processPayment, processing, error }`
- **Security**: Handles authentication and compliance automatically
- **Callbacks**: Success/error callbacks with payment metadata

## 🎨 Component Development Patterns

### Standard Extension Point Component
```typescript
import { createExtensionPoint, AdminSettingsContext } from '@ticketsplatform/plugin-sdk';

const AdminSettings = createExtensionPoint<AdminSettingsContext>(({ context, sdk }) => {
  const { pluginId, user } = context;
  const { config, saveConfig } = usePluginConfig<MyConfig>(pluginId);
  
  return (
    <sdk.components.Card>
      {/* Component implementation */}
    </sdk.components.Card>
  );
});
```

### 🎯 Puck-Compatible Widget Component (TARGET INTEGRATION)
```typescript
// This is the integration pattern we need to develop
const PuckCompatibleWidget = createPuckWidget({
  fields: {
    title: { type: 'text' },
    backgroundColor: { type: 'custom', render: ColorPickerField },
    spacing: { type: 'custom', render: SpacingField }
  },
  defaultProps: {
    title: 'Default Title',
    backgroundColor: '#3B82F6',
    spacing: { top: 16, bottom: 16 }
  },
  render: ({ title, backgroundColor, spacing }) => {
    // Widget implementation following our design patterns
  }
});
```

## 🛡️ Type Safety Architecture

### Context Types
- **AdminSettingsContext**: Plugin configuration interface context
- **PaymentMethodContext**: Payment processing context with cart and callbacks
- **CheckoutConfirmationContext**: Post-payment confirmation context
- **ExtensionPointContext**: Base context for all extension points

### Plugin Metadata Interface
```typescript
interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: PluginCategory;
  displayName: string;
  requiredPermissions: string[];
  priority: number;
  // Puck integration metadata (NEW)
  puckComponents?: PuckComponentDefinition[];
}
```

### Platform SDK Interface
Comprehensive interface providing:
- **React Components**: Full component library matching platform design
- **API Clients**: Type-safe API access with authentication
- **Utilities**: Toast notifications, date formatting, validation helpers
- **Theme System**: Access to platform theme and design tokens

## 🔧 Development Workflow

### Plugin Development Steps
1. **Install SDK**: `npm install @ticketsplatform/plugin-sdk`
2. **Define Metadata**: Create plugin.json with extension points
3. **Implement Components**: Use createExtensionPoint for type safety
4. **Configure Fields**: Add plugin configuration interface
5. **Test Integration**: Use platform development tools
6. **Build & Package**: Bundle for marketplace submission

### Plugin Structure Requirements
```
my-plugin/
├── src/
│   └── index.tsx          # Main plugin exports
├── package.json           # Dependencies and scripts
├── plugin.json           # Plugin metadata
├── tsconfig.json         # TypeScript configuration
└── README.md            # Documentation
```

## 🎯 Integration Challenges & Solutions

### Current Challenge: Puck Editor Integration
The platform has two sophisticated systems that need to merge:
1. **Plugin Extension Points**: Dynamic runtime component loading
2. **Puck Editor Components**: Configuration-based component system

### Integration Requirements
1. **Dynamic Registration**: Plugin widgets appear in Puck component library when activated
2. **Field Compatibility**: Plugin fields work with our responsive field system
3. **Design Consistency**: Plugin widgets follow glassmorphism patterns
4. **Type Safety**: Full TypeScript support throughout integration
5. **Real-time Updates**: Instant availability when plugin status changes

### Proposed Solution Architecture
- **Plugin Registry Enhancement**: Extend to register Puck-compatible components
- **Field Mapping System**: Convert plugin fields to Puck field definitions
- **Design Pattern Enforcement**: Provide templates for glassmorphism compliance
- **Runtime Integration**: Dynamic Puck config updates when plugins activate/deactivate

## 📦 Dependencies
- **React 19**: Modern React patterns and hooks
- **TypeScript 5.7**: Full type safety and modern language features
- **Platform UI Components**: Shared component library access
- **Platform API**: Type-safe API client integration

## 🛠️ SDK Capabilities

### Provided by Platform Runtime
- **Authentication**: Automatic user session management
- **API Access**: Authenticated API calls to platform services
- **Component Library**: Full access to platform design system
- **Theme Integration**: Automatic theme and branding application
- **Error Handling**: Platform-level error boundary integration

### Plugin Developer Experience
- **TypeScript IntelliSense**: Full autocomplete for all SDK features
- **Compile-time Validation**: Catch errors before runtime
- **Hot Reload**: Development mode with instant updates
- **Debugging Tools**: Platform provides debugging utilities
- **Documentation**: Comprehensive guides and examples

## 🚀 Future Enhancements

### Planned SDK Features
1. **Puck Integration Helpers**: Direct support for Puck component creation
2. **Advanced Animation Support**: Integration with our Framer Motion patterns
3. **Responsive Design Helpers**: Utilities for our breakpoint system
4. **State Management**: Plugin-specific state management utilities
5. **Performance Optimization**: Lazy loading and bundle splitting support

### Plugin Marketplace Evolution
- **Live Preview**: Preview plugins before installation
- **Dependency Management**: Automatic dependency resolution
- **Version Management**: Seamless plugin updates
- **A/B Testing**: Plugin configuration testing support

This SDK represents the foundation for a thriving plugin ecosystem that seamlessly integrates with our sophisticated page editor and design system.