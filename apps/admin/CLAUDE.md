# Admin App - Multi-Tenant SaaS Management Dashboard

## 🎯 Purpose
TanStack React Start based admin dashboard for the TicketBase multi-tenant SaaS platform, providing tenant management, plugin marketplace, and sophisticated page editing capabilities using the custom @repo/editor package.

## 🏗️ Architecture
- **Framework**: TanStack React Start
- **Editor Integration**: @repo/editor package with @measured/puck
- **Plugin System**: Dynamic plugin loading with extension points
- **Authentication**: Multi-tenant session management
- **UI**: @repo/ui components with custom admin-specific components

## 📁 Key Directories & Files

### Core Admin Features
- **src/app/**: TanStack React Start App based Router pages and layouts
- **src/components/**: Admin-specific React components
- **src/lib/**: Utilities, configs, and service integrations
- **docs/**: Comprehensive documentation for plugin system and development

### Plugin System Integration
- **src/lib/plugin-sdk-context.tsx**: Plugin SDK provider and context
- **src/lib/simple-plugin-system.tsx**: Plugin loading and management
- **src/components/plugin-extension-point.tsx**: Extension point rendering
- **src/lib/plugin-types.ts**: TypeScript definitions for plugin system

### Page Editor Integration
- **Editor Components**: Integration with @repo/editor for tenant page creation
- **Puck Configuration**: Custom Puck setup for admin use
- **Page Management**: CRUD operations for tenant pages

## 🔌 Plugin System Architecture

### Extension Point System
The admin app provides several extension points where plugins can render:

#### Available Extension Points
- **admin-settings**: Plugin configuration interfaces
- **event-creation**: Custom fields during event creation
- **dashboard**: Custom widgets for admin dashboard
- **tenant-management**: Custom tenant configuration options

### Plugin Loading Architecture
```typescript
// Dynamic plugin loading with runtime component registration
const PluginExtensionPoint = ({ name, context, fallback }) => {
  const [components, setComponents] = useState([]);
  
  // Load plugins for specific extension point
  // Render plugin components with proper context
  // Handle errors with fallbacks
};
```

### 🎯 CRITICAL INTEGRATION GOAL: Plugin-Puck Bridge
**Challenge**: Make plugin widgets instantly available in Puck editor when activated

**Current Separation**:
- Plugins use extension point system with predefined locations
- Puck editor has its own component configuration system
- Need to bridge these two systems for seamless integration

**Required Solution**:
1. **Dynamic Puck Config Updates**: Update Puck configuration when plugins are activated
2. **Plugin Component Mapping**: Convert plugin widgets to Puck-compatible components
3. **Real-time Availability**: Instant availability in editor when plugin status changes
4. **Design System Integration**: Ensure plugin widgets follow glassmorphism patterns

## 🎨 Page Editor Integration

### @repo/editor Package Usage
- **Page Creation**: Tenants can create custom storefront pages
- **Advanced Components**: Glassmorphism and animation components
- **Responsive Design**: Multi-breakpoint editing capabilities
- **Real-time Preview**: Live preview with different viewport sizes

### Puck Editor Configuration
- Custom component library with platform-specific components
- Integration with tenant branding and theming
- Advanced field controls for responsive design
- Plugin widget integration (TARGET DEVELOPMENT)

### Editor Workflow
1. **Tenant Access**: Multi-tenant isolation for page editing
2. **Component Selection**: Choose from available Puck components
3. **Configuration**: Advanced field controls for customization
4. **Preview**: Real-time preview across devices
5. **Publishing**: Deploy pages to storefront

## 🏢 Multi-Tenant Architecture

### Tenant Isolation
- **Session Management**: Tenant-scoped authentication
- **Data Isolation**: Tenant-specific data access patterns
- **Plugin Isolation**: Tenant-specific plugin installations
- **Customization**: Per-tenant branding and configuration

### Tenant Management Features
- **Tenant Creation**: New tenant onboarding
- **Subscription Management**: Plan management and billing integration
- **Feature Flags**: Tenant-specific feature enablement
- **Analytics**: Tenant usage and performance metrics

## 🛠️ Development Patterns

### Component Development
- **Admin-Specific**: Components built for admin interface needs
- **Plugin-Aware**: Components that can integrate with plugin system
- **Responsive**: Mobile-friendly admin interface
- **Accessible**: WCAG 2.1 AA compliance

### Plugin Integration Development
```typescript
// Example plugin integration in admin components
const AdminDashboard = () => {
  return (
    <div className="dashboard-grid">
      {/* Core dashboard widgets */}
      <MetricsWidget />
      <RecentActivity />
      
      {/* Plugin extension point for custom widgets */}
      <PluginExtensionPoint 
        name="dashboard" 
        context={{ tenantId, user }} 
        fallback={<DefaultWidget />}
      />
    </div>
  );
};
```

### Page Editor Development
```typescript
// Integration with @repo/editor package
import { PageEditor, config } from '@repo/editor';

const PageEditorPage = () => {
  return (
    <PageEditor 
      config={adminPuckConfig}
      // TODO: Add plugin components to config dynamically
      data={pageData}
      onSave={handleSave}
    />
  );
};
```

## 🔐 Security & Authentication

### Multi-Tenant Security
- **Session Isolation**: Tenant-scoped user sessions
- **Data Access Control**: Row-level security for tenant data
- **Plugin Permissions**: Tenant-specific plugin access control
- **Audit Logging**: Comprehensive activity logging

### Plugin Security
- **Sandboxed Execution**: Plugin code runs in controlled environment
- **Permission System**: Granular plugin permission management
- **Error Boundaries**: Isolate plugin failures from core system
- **Content Security Policy**: Restrict plugin resource access

## 📊 Plugin Marketplace Integration

### Marketplace Features
- **Plugin Discovery**: Browse available plugins by category
- **Installation Management**: One-click plugin installation
- **Configuration UI**: Plugin-specific configuration interfaces
- **Usage Analytics**: Plugin performance and usage metrics

### Plugin Management UI
- **Installed Plugins**: View and manage tenant's installed plugins
- **Plugin Configuration**: Edit plugin settings with dynamic forms
- **Plugin Status**: Enable/disable plugins with real-time effects
- **Plugin Updates**: Manage plugin version updates

## 🎯 Critical Development Focus

### Plugin-Puck Integration (HIGH PRIORITY)
**Objective**: When tenant installs a countdown widget plugin, it should immediately appear in the Puck editor component library.

**Technical Requirements**:
1. **Dynamic Config Updates**: Modify Puck configuration when plugins change status
2. **Component Registration**: Register plugin widgets as Puck components
3. **Field Mapping**: Convert plugin field definitions to Puck format
4. **Real-time Sync**: Update editor without page refresh
5. **Design Compliance**: Ensure plugin widgets follow design system

**Implementation Steps**:
1. Extend plugin loading system to register Puck components
2. Create plugin-to-Puck component adapter
3. Implement real-time config updates (WebSocket or polling)
4. Add plugin widget design system compliance validation
5. Test end-to-end plugin installation → editor availability flow

## 🛠️ Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run type-check`: TypeScript validation
- `npm run lint`: Code linting and formatting

## 📦 Key Dependencies
- **@repo/editor**: Custom Puck-based page editor
- **@repo/ui**: Shared component library
- **@ticketbase/api**: API client for backend communication
- **@measured/puck**: Core page building framework
- **@tanstack/react-start**: React framework with App Router similar to NextJS
- **Tailwind CSS**: Styling system

## 🔮 Future Enhancements
1. **Advanced Plugin Analytics**: Deep plugin usage insights
2. **Plugin A/B Testing**: Test plugin configurations
3. **Collaborative Editing**: Multi-user page editing
4. **Advanced Tenant Customization**: White-label capabilities
5. **Plugin Development Tools**: In-browser plugin development

This admin app serves as the central hub for platform management, bringing together sophisticated page editing capabilities with a flexible plugin marketplace system.