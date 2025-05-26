# Architecture Refactor: API and Plugins Server Separation

## Problem Statement

The original architecture had redundant code and database connections between the API server and Plugins server:

### Issues Found:

1. **Redundant Database Connections**: Both servers connected to MongoDB and MinIO
2. **Duplicated Plugin Management Logic**: Both had PluginsService, BundleService, and plugin entities
3. **Architectural Confusion**: API server was directly accessing plugin storage instead of proxying to Plugins server

## Solution Implemented

### 1. **Clear Separation of Responsibilities**

**API Server (Port 4000)**:

- Primary backend for ticketing platform
- Uses PostgreSQL for core business data
- **Proxies** all plugin-related requests to Plugins server
- No direct access to plugin storage or metadata

**Plugins Server (Port 4001)**:

- Dedicated plugin management system
- Uses MongoDB for plugin metadata
- Uses MinIO for plugin bundle storage
- Handles all plugin CRUD operations, installations, and bundle serving

### 2. **Changes Made to API Server**

#### Removed Direct Storage Access:

- Removed MinIO configuration from `apps/api/src/config/app.config.ts`
- Removed `minio` dependency from `apps/api/package.json`
- Removed TypeORM plugin entities from `apps/api/src/plugins/plugins.module.ts`

#### Converted to Proxy Pattern:

- **BundleService**: Now proxies bundle requests to Plugins server instead of accessing MinIO directly
- **PluginsService**: All methods now make HTTP calls to Plugins server endpoints
- **PluginsModule**: Removed TypeORM dependencies, only uses HttpModule for API calls

### 3. **Enhanced Plugins Server**

#### Added Missing Endpoints:

- Added `GET /api/plugins/:id/bundle` endpoint in PluginsController
- Enhanced bundle serving capabilities with proper error handling
- Maintained existing MinIO and MongoDB connections

### 4. **Configuration Updates**

#### API Server Config:

```typescript
plugins: {
  serverUrl: process.env.PLUGIN_SERVER_URL || 'http://localhost:4001',
  allowedOrigins: [...],
  // Removed: minioEndpoint, minioPort, minioBucket, etc.
}
```

#### Plugins Server Config:

- Maintains MongoDB connection for plugin metadata
- Maintains MinIO connection for bundle storage
- Handles all plugin-related database operations

## Benefits of This Architecture

### 1. **Clear Separation of Concerns**

- API server focuses on core ticketing business logic
- Plugins server is dedicated to plugin ecosystem management

### 2. **Scalability**

- Each server can be scaled independently
- Plugin server can be deployed on separate infrastructure
- Easier to distribute load across multiple servers

### 3. **Maintainability**

- No code duplication between servers
- Single source of truth for plugin data (Plugins server)
- Cleaner dependency management

### 4. **Security**

- API server doesn't need direct access to plugin storage credentials
- Plugin server can implement specialized security for plugin operations
- Better isolation of plugin-related operations

## API Flow Examples

### Before (Problematic):

```
Client → API Server → Direct MinIO Access
Client → API Server → Direct MongoDB Access
```

### After (Clean):

```
Client → API Server → HTTP Request → Plugins Server → MongoDB/MinIO
Client ← API Server ← HTTP Response ← Plugins Server ← MongoDB/MinIO
```

## Deployment Considerations

### Environment Variables:

- **API Server**: Only needs `PLUGIN_SERVER_URL`
- **Plugins Server**: Needs MongoDB and MinIO credentials

### Service Dependencies:

- API Server depends on Plugins Server being available
- Plugins Server depends on MongoDB and MinIO being available
- Consider implementing circuit breakers for resilience

## Future Improvements

1. **Caching**: Add Redis caching layer for frequently accessed plugin data
2. **Authentication**: Implement service-to-service authentication between API and Plugins servers
3. **Monitoring**: Add health checks and metrics for inter-service communication
4. **Error Handling**: Implement retry logic and fallback mechanisms

## Migration Notes

- No breaking changes to existing API contracts
- Plugin entities removed from API server database
- All plugin data now managed exclusively by Plugins server
- Bundle serving now properly proxied through API server
