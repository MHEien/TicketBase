# @ticketbase/api - TypeScript API Client Package

## 🎯 Purpose
Robust, production-ready TypeScript API client package that provides a unified interface for interacting with the TicketBase .NET API server across all React applications (admin, storefront) with full type safety and authentication management.

## 🏗️ Architecture
- **Universal Client**: Works in both browser and Node.js environments
- **Type Safety**: Comprehensive TypeScript definitions for all API operations
- **Authentication**: Flexible auth token management with multiple providers
- **Error Handling**: Consistent error handling with custom hooks
- **Environment Agnostic**: Configurable for different deployment environments

## 📁 Key Files Structure
- **README.md**: Comprehensive usage documentation and examples
- **api-client.ts**: Core API client configuration and axios instance
- **users-api.ts**: User management API methods with full typing
- **generated/**: Auto-generated API client code from OpenAPI spec
- **types/**: TypeScript definitions for all API entities

## 🔧 Core Features

### Universal Environment Support
The client automatically adapts to different runtime environments:

#### Browser Environment
- Uses `import.meta.env.VITE_API_URL` for API base URL
- Retrieves auth tokens from session storage or cookies
- Handles client-side redirects on authentication errors
- Supports real-time token refresh

#### Node.js/Server Environment  
- Uses `process.env.API_URL` for API base URL
- Retrieves auth tokens from server-side session management
- No client-side redirects (server-appropriate error handling)
- Server-side cookie integration

### Authentication Integration
**Flexible authentication providers support multiple auth systems:**

#### Session-Based Authentication
```typescript
configureApiClient({
  getAuthToken: async () => {
    const session = await getSession();
    return session?.accessToken || null;
  }
});
```

#### Cookie-Based Authentication
```typescript
configureApiClient({
  getAuthToken: async () => {
    return Cookies.get('auth_token') || null;
  }
});
```

#### Server-Side Authentication
```typescript
configureApiClient({
  getAuthToken: async () => {
    const authData = await getAuthServerFn();
    return authData?.accessToken || null;
  }
});
```

## 🎨 API Method Categories

### Authentication API
- **Login/Logout**: User authentication with JWT token management
- **Registration**: New user and organization registration
- **Token Management**: Refresh token handling and validation
- **Session Diagnostics**: Session debugging and validation tools

### User Management API
- **CRUD Operations**: Full user lifecycle management
- **Role Management**: User role assignment and permission handling
- **Department Assignment**: User-department relationship management
- **Status Management**: User activation, deactivation, and status tracking

### Organization API
- **Multi-tenant Support**: Organization-scoped API operations
- **Settings Management**: Organization configuration and customization
- **Domain Management**: Custom domain and subdomain handling
- **Subscription Integration**: Plan management and billing coordination

### Event Management API
- **Event CRUD**: Complete event lifecycle management
- **Slug-based Access**: SEO-friendly event URL handling
- **Public/Private Events**: Event visibility and access control
- **Event Analytics**: Performance metrics and usage tracking

### Page Management API (Puck Integration)
- **Page CRUD**: Custom page creation and management
- **Puck Data Storage**: Structured storage of Puck editor configurations
- **Slug-based Routing**: SEO-friendly page URL handling
- **Asset Integration**: Page asset management and optimization

### Department API
- **Hierarchical Structure**: Support for nested department organization
- **User Assignment**: Department-user relationship management
- **Permission Inheritance**: Department-based permission structures
- **Analytics**: Department performance and usage metrics

## 🔐 Security & Authentication

### Token Management
- **Automatic Refresh**: Transparent token refresh on expiration
- **Secure Storage**: Platform-appropriate token storage strategies
- **Error Recovery**: Graceful handling of authentication failures
- **Multi-device Support**: Session management across devices

### Request Security
- **HTTPS Enforcement**: Secure communication protocols
- **CORS Handling**: Cross-origin request management
- **Rate Limiting**: Client-side rate limiting and backoff strategies
- **Request Validation**: Input validation and sanitization

## 🚀 Advanced Features

### Error Handling System
```typescript
try {
  const users = await getUsers('org-123');
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized - automatic redirect or token refresh
  } else if (error.response?.status === 403) {
    // Handle forbidden - permission-based error handling
  } else if (error.response?.status === 429) {
    // Handle rate limiting - automatic retry with backoff
  }
}
```

### Debug Mode Integration
**Comprehensive debugging capabilities:**
- Request/response logging with correlation IDs
- Authentication token status and validation
- Performance metrics and timing data
- Error details with stack traces

### Type-Safe API Calls
**Full TypeScript integration:**
```typescript
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto,
  PaginatedResponse,
  ApiResponse 
} from '@ticketbase/api';

// Fully typed API calls
const users: PaginatedResponse<User> = await getUsers('org-123');
const newUser: User = await createUser(userData);
```

## 🔄 Integration Status & Migration

### Current State
- **Recently Extracted**: From admin app to standalone package
- **Partial Integration**: Not yet fully adopted across all applications
- **Generated Code**: Contains auto-generated API client from OpenAPI spec
- **Legacy Compatibility**: Maintains compatibility with existing implementations

### Migration Goals
1. **Complete Admin App Integration**: Replace existing API calls with package
2. **Storefront Integration**: Implement API client in storefront application
3. **Plugin Server Integration**: Coordinate with plugin server API calls
4. **Type Safety Enhancement**: Improve TypeScript coverage across platform

### Integration Challenges
- **Authentication Consistency**: Ensure consistent auth across all apps
- **Error Handling Standardization**: Unify error handling patterns
- **Environment Configuration**: Proper setup for different deployment environments
- **Legacy Code Migration**: Gradual migration from existing implementations

## 🛠️ Development Patterns

### Client Configuration Pattern
```typescript
// Environment-specific configuration
import { configureApiClient } from '@ticketbase/api';

configureApiClient({
  baseURL: getApiBaseUrl(),
  getAuthToken: getAuthTokenProvider(),
  onAuthError: handleAuthError,
  debug: isDevelopment()
});
```

### API Method Pattern
```typescript
// Consistent API method structure
export async function getUsers(
  organizationId: string,
  params?: UserQueryParams
): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get('/users', {
    params: { organizationId, ...params }
  });
  return response.data;
}
```

### Error Handling Pattern
```typescript
// Consistent error handling across all methods
export async function createUser(userData: CreateUserDto): Promise<User> {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    // Transform API errors to user-friendly messages
    throw transformApiError(error);
  }
}
```

## 📦 Package Dependencies

### Core Dependencies
- **Axios**: HTTP client with interceptors and request/response transformation
- **TypeScript**: Full type safety with strict mode enabled
- **Environment Detection**: Runtime environment detection and adaptation

### Development Dependencies
- **API Code Generation**: Tools for generating client code from OpenAPI spec
- **Testing Utilities**: Jest and testing library integration
- **Build Tools**: ESM/CJS dual build support with tree shaking

## 🎯 Integration Focus Areas

### Plugin System Integration
**Coordinate with plugin server for:**
- Plugin installation and configuration API calls
- Plugin status management and real-time updates
- Plugin marketplace data fetching
- Plugin authentication and authorization

### Puck Editor Integration
**Support advanced page management:**
- Structured Puck configuration storage and retrieval
- Page asset management and optimization
- Version control and rollback capabilities
- Real-time collaboration support (future)

### Multi-tenant Optimization
**Enhanced multi-tenant support:**
- Organization-scoped API request management
- Tenant-specific configuration and caching
- Cross-tenant security validation
- Performance optimization for large tenant bases

## 🚀 Future Enhancements

### Planned Features
1. **GraphQL Support**: GraphQL client integration for complex queries
2. **Real-time Capabilities**: WebSocket integration for live updates
3. **Offline Support**: Service worker integration for offline functionality
4. **Advanced Caching**: Intelligent caching strategies with invalidation
5. **Request Batching**: Batch API requests for performance optimization

### Developer Experience Improvements
- **IDE Integration**: Enhanced IntelliSense and autocomplete
- **Error Messages**: More descriptive and actionable error messages
- **Documentation**: Interactive API documentation with examples
- **Testing Utilities**: Mock API client for testing scenarios

## 🛠️ Development Commands
- `npm run build`: Build ESM and CJS packages with type definitions
- `npm run dev`: Development mode with file watching
- `npm run generate`: Generate API client code from OpenAPI specification
- `npm run typecheck`: TypeScript validation without compilation

This API client package serves as the foundation for all frontend-backend communication, providing type-safe, reliable, and performant API access across the entire TicketBase platform ecosystem.