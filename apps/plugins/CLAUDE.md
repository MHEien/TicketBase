# Plugin Server - NestJS Plugin Management System

## 🎯 Purpose
NestJS backend service responsible for plugin lifecycle management: bundling TypeScript/JavaScript plugins, storing in MinIO, managing metadata in MongoDB, and serving bundles dynamically to the platform.

## 🏗️ Architecture
- **Framework**: NestJS with TypeScript
- **Storage**: MinIO for plugin bundles, MongoDB for metadata
- **Bundling**: Dynamic JavaScript/TypeScript compilation and optimization
- **Serving**: CDN-like bundle serving with caching and optimization
- **Security**: Plugin validation, sandboxing, and permission management

## 📁 Key Directories & Files
- **src/plugins/**: Core plugin management system
  - `plugins.service.ts`: Main plugin business logic
  - `plugins.controller.ts`: HTTP API endpoints
  - `bundle.controller.ts`: Bundle serving endpoints
  - `schemas/`: MongoDB schemas for plugin data
  - `services/`: Specialized services (bundling, storage, compatibility)

## 🔧 Core Services

### PluginsService (`src/plugins/plugins.service.ts`)
**Primary plugin management service**
- Plugin creation, updating, deletion
- Metadata validation and storage
- Plugin status management (pending, approved, rejected)
- Integration with bundle generation

### BundleService (`src/plugins/services/bundle.service.ts`)
**Plugin bundling and compilation**
- TypeScript/JavaScript compilation
- Webpack-based bundling for browser compatibility
- Code optimization and minification
- Source map generation for debugging
- Bundle size optimization

### PluginStorageService (`src/plugins/services/plugin-storage.service.ts`)
**MinIO integration for bundle storage**
- Bundle upload and retrieval
- CDN-like serving with caching headers
- Version management for plugin bundles
- Storage optimization and cleanup

### CompatibilityService (`src/plugins/services/compatibility.service.ts`)
**Plugin compatibility and validation**
- Platform version compatibility checks
- Dependency validation
- Security scanning and validation
- Extension point compatibility verification

## 🗄️ Database Schemas

### Plugin Schema (`schemas/plugin.schema.ts`)
```typescript
{
  id: string;                    // Unique plugin identifier
  name: string;                 // Human-readable name
  version: string;              // Semantic version (1.0.0)
  description: string;          // Plugin description
  category: PluginCategory;     // payment, marketing, analytics, etc.
  bundleUrl: string;           // MinIO URL to compiled bundle
  extensionPoints: string[];    // Extension points implemented
  metadata: object;            // Additional plugin metadata
  status: PluginStatus;        // pending, approved, rejected
  requiredPermissions: string[]; // Required platform permissions
  createdAt: Date;
  updatedAt: Date;
}
```

### InstalledPlugin Schema (`schemas/installed-plugin.schema.ts`)
```typescript
{
  pluginId: string;            // Reference to Plugin
  tenantId: string;           // Multi-tenant isolation
  enabled: boolean;           // Plugin activation status
  configuration: object;      // Tenant-specific plugin config
  installedAt: Date;
  updatedAt: Date;
}
```

## 🔄 Plugin Lifecycle

### 1. Plugin Submission
- Developer uploads plugin source code (ZIP or individual files)
- Metadata extraction from plugin.json
- Initial validation and security scanning
- Status set to "pending" for review

### 2. Bundle Generation
- TypeScript/JavaScript compilation
- Webpack bundling for browser compatibility
- Code optimization and minification
- Upload to MinIO with versioned URLs
- Bundle URL stored in plugin metadata

### 3. Plugin Review
- Automated security and compatibility checks
- Manual code review (if required)
- Status update to "approved" or "rejected"
- Notification to plugin developer

### 4. Marketplace Publication
- Approved plugins appear in marketplace
- Available for tenant installation
- Version management for updates

### 5. Tenant Installation
- Plugin installed for specific tenant
- Configuration interface provided
- Plugin bundle served dynamically when activated

## 🌐 API Endpoints

### Plugin Management
- `POST /plugins`: Create new plugin
- `GET /plugins`: List all plugins with filtering
- `GET /plugins/:id`: Get specific plugin details
- `PUT /plugins/:id`: Update plugin metadata
- `DELETE /plugins/:id`: Remove plugin

### Bundle Serving
- `GET /plugins/bundles/:pluginId/v:version/bundle.js`: Serve plugin bundle
- Headers include caching directives and CORS
- CDN-optimized delivery

### Tenant Plugin Management
- `POST /plugins/install`: Install plugin for tenant
- `PUT /plugins/:pluginId/configure`: Update plugin configuration
- `POST /plugins/:pluginId/enable`: Enable/disable plugin
- `GET /tenants/:tenantId/plugins`: List tenant's installed plugins

## 🔐 Security & Validation

### Plugin Security
- Source code scanning for malicious patterns
- Dependency vulnerability checking
- Runtime sandboxing preparation
- Permission validation against platform capabilities

### Bundle Security
- Code obfuscation for intellectual property protection
- Integrity checking with checksums
- Secure serving with appropriate headers
- Access control for tenant-specific bundles

## 🚀 Performance Optimizations

### Bundle Optimization
- Tree shaking for unused code elimination
- Code splitting for large plugins
- Compression (gzip/brotli) for faster delivery
- Browser caching with long expiration times

### Storage Optimization
- MinIO bucket organization by plugin and version
- Automatic cleanup of old bundle versions
- CDN integration for global distribution
- Bandwidth monitoring and optimization

## 🔌 Integration Points

### Admin App Integration
- Plugin marketplace UI data
- Installation status and configuration
- Plugin management interface
- Analytics and usage reporting

### Storefront Integration
- Runtime plugin loading via bundle URLs
- Extension point rendering
- Plugin configuration application
- Performance monitoring

### 🎯 Critical Integration: Puck Editor
**Current Challenge**: Plugin widgets need to be available in Puck editor when activated

**Required Development**:
1. **Dynamic Puck Config Updates**: Modify Puck configuration when plugins are activated
2. **Component Registration API**: Endpoint to register plugin components for Puck
3. **Real-time Synchronization**: WebSocket or polling for instant availability
4. **Field Mapping**: Convert plugin field definitions to Puck-compatible formats

## 🛠️ Development Commands
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run test`: Run unit and integration tests
- `npm run lint`: Code linting and formatting
- `npm run migration:create`: Create database migration

## 🌍 Environment Configuration
- **MongoDB**: Plugin metadata and installation tracking
- **MinIO**: Plugin bundle storage with CDN-like serving
- **JWT**: Authentication integration with main API
- **CORS**: Configured for cross-origin bundle loading

## 📊 Monitoring & Analytics
- Plugin installation and usage metrics
- Bundle download performance monitoring
- Error tracking and reporting
- Security incident logging

## 🔮 Future Enhancements
1. **Plugin Analytics**: Usage tracking and performance metrics
2. **A/B Testing**: Plugin configuration testing support
3. **Dependency Management**: Shared plugin dependencies
4. **Hot Updates**: Runtime plugin updates without page refresh
5. **Plugin Collaboration**: Multi-developer plugin development support

This plugin server represents the backbone of the TicketBase extensibility system, enabling a thriving marketplace while maintaining security and performance standards.