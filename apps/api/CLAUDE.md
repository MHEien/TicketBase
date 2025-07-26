# API Server - NestJS Core Primary Backend

## 🎯 Purpose
Primary NestJS Core backend API server for the TicketBase multi-tenant SaaS platform. This is the central hub that handles all business logic, authentication, data management, and serves as the routing layer for the entire platform ecosystem.

## 🏗️ Architecture
- **Framework**: NestJS
- **Database**: PostgreSQL for primary data storage
- **Authentication**: JWT-based multi-tenant authentication system
- **Multi-tenancy**: Organization-based tenant isolation with row-level security
- **Plugin Integration**: Forwards plugin requests to NestJS plugin server
- **API Design**: RESTful API with comprehensive Swagger/OpenAPI documentation

## 🌐 Central Routing Hub
This API server acts as the **primary gateway** for all platform operations:

### Request Flow
1. **Admin App** → API Server → Business Logic + Database
2. **Storefront App** → API Server → Business Logic + Database  
3. **Plugin Requests** → API Server → Forward to Plugin Server (NestJS)
4. **Authentication** → API Server → JWT validation and session management

### Integration Points
- **Plugin Server Integration**: Proxy plugin management requests to NestJS server
- **File Storage**: Integration with MinIO for asset management
- **Real-time Features**: SignalR for real-time notifications and updates
- **Email Services**: Integrated email delivery for transactional messages

## 🏢 Multi-Tenant Architecture

### Tenant Isolation Strategy
- **Organization-based Tenancy**: Each tenant is an organization
- **Row-Level Security**: Database-level tenant data isolation
- **Subdomain Support**: Custom domains and subdomain routing
- **Per-tenant Configuration**: Customizable settings and branding

### Authentication & Authorization
- **JWT Token Management**: Secure token generation and validation
- **Role-Based Access Control**: Owner, Admin, Manager, Support, Analyst roles
- **Permission System**: Granular permission management
- **Session Management**: Multi-device session handling with refresh tokens

## 📊 Core Domain Models

### Organization Management
- **Organizations**: Tenant entities with settings and configuration
- **Users**: Multi-role user system with department assignment
- **Departments**: Hierarchical department structure for user organization
- **Subscriptions**: Plan management and billing integration

### Event & Ticketing System
- **Events**: Core event entities with complex metadata
- **Tickets**: Ticket types, pricing tiers, and availability management
- **Orders**: Transaction management and payment processing
- **Attendees**: Attendee management and check-in systems

### Content Management
- **Pages**: Custom page content for tenant storefronts (Puck editor integration)
- **Assets**: File and media management integration
- **Email Templates**: Customizable transactional email templates
- **Analytics**: Event and platform usage analytics

## 🔌 Plugin System Integration

### Plugin Request Routing
The API server acts as a **proxy layer** for plugin operations:
- **Plugin Management**: Forward CRUD operations to plugin server
- **Bundle Serving**: Coordinate with plugin server for bundle delivery
- **Configuration**: Manage tenant-specific plugin configurations
- **Authorization**: Ensure plugin access permissions per tenant

### Plugin Data Flow
```
Admin App → API Server → Plugin Server (NestJS) → MinIO + MongoDB
```

### Plugin API Endpoints
- `POST /api/plugins/proxy/*` - Proxy all plugin requests to NestJS server
- `GET /api/plugins/installed/{tenantId}` - Get tenant's installed plugins
- `PUT /api/plugins/configure/{pluginId}` - Update plugin configuration
- `POST /api/plugins/activate/{pluginId}` - Activate/deactivate plugins

## 🔐 Security & Compliance

### Authentication Security
- **JWT Implementation**: Secure token generation with expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **Session Management**: Secure session handling with refresh tokens
- **Rate Limiting**: API rate limiting to prevent abuse

### Data Protection
- **Encryption at Rest**: Sensitive data encryption in database
- **Encryption in Transit**: HTTPS/TLS for all communications
- **PII Protection**: GDPR-compliant personal data handling
- **Audit Logging**: Comprehensive activity and security logging

### Multi-tenant Security
- **Data Isolation**: Strict tenant data separation
- **Access Control**: Organization-scoped API access
- **Resource Limits**: Per-tenant resource usage limits
- **Security Headers**: CORS, CSP, and security header management

## 🚀 Performance & Scalability

### Database Optimization
- **Entity Framework Core**: ORM with optimized queries
- **Connection Pooling**: Efficient database connection management
- **Indexing Strategy**: Optimized indexes for multi-tenant queries
- **Query Optimization**: N+1 prevention and efficient data loading

### Caching Strategy
- **Response Caching**: API response caching for read-heavy operations
- **Distributed Caching**: Redis integration for session and data caching
- **CDN Integration**: Static asset delivery optimization
- **Database Caching**: Query result caching for frequently accessed data

### Monitoring & Observability
- **Application Insights**: Performance monitoring and diagnostics
- **Health Checks**: Comprehensive health check endpoints
- **Logging**: Structured logging with correlation IDs
- **Metrics**: Custom metrics for business and technical KPIs

## 🛠️ Development Patterns

### API Design Principles
- **RESTful Design**: Standard HTTP methods and status codes
- **Resource-based URLs**: Clear, hierarchical URL structure
- **Versioning**: API versioning strategy for backward compatibility
- **Error Handling**: Consistent error response format

### Code Organization
- **Domain-Driven Design**: Business logic organized by domain
- **Clean Architecture**: Separation of concerns with layers
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation

### Testing Strategy
- **Unit Tests**: Comprehensive business logic testing
- **Integration Tests**: API endpoint testing with test database
- **Performance Tests**: Load testing for scalability validation
- **Security Tests**: Authentication and authorization testing

## 📡 API Endpoints Structure

### Authentication Endpoints
- `POST /api/auth/login` - User login with JWT token generation
- `POST /api/auth/register` - New user/organization registration
- `POST /api/auth/refresh` - Refresh JWT tokens
- `POST /api/auth/logout` - Session termination

### Organization Management
- `GET /api/organizations` - List organizations (admin only)
- `GET /api/organizations/{id}` - Get organization details
- `PUT /api/organizations/{id}` - Update organization settings
- `GET /api/organizations/by-domain` - Get organization by domain

### User Management
- `GET /api/users` - List organization users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user details
- `DELETE /api/users/{id}` - Deactivate user

### Event Management
- `GET /api/events` - List organization events
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event details
- `GET /api/events/{slug}` - Get event by slug (public)

### Page Management (Puck Integration)
- `GET /api/pages` - List organization pages
- `POST /api/pages` - Create new page with Puck data
- `PUT /api/pages/{id}` - Update page content
- `GET /api/pages/{slug}` - Get page by slug (public)

## 🔮 Integration Goals

### Puck Editor Data Handling
- **Page Content Storage**: Store Puck editor data in structured JSON format
- **Asset Management**: Handle page assets through MinIO integration
- **Version Control**: Page version history and rollback capabilities
- **Performance**: Optimized page content delivery for storefront

### Plugin System Enhancement
- **Real-time Plugin Status**: WebSocket integration for live plugin status updates
- **Plugin Analytics**: Track plugin usage and performance metrics
- **Plugin Dependencies**: Manage plugin dependencies and compatibility
- **Plugin Security**: Validate and sandbox plugin configurations

## 🛠️ Development Commands
- `dotnet run`: Start development server
- `dotnet build`: Build the application
- `dotnet test`: Run unit and integration tests
- `dotnet ef migrations add`: Create database migration
- `dotnet ef database update`: Apply pending migrations

## 🌍 Environment Configuration
- **Database**: PostgreSQL connection with multi-tenant support
- **JWT**: Token signing and validation configuration
- **Plugin Server**: NestJS server integration endpoints
- **Storage**: MinIO integration for asset management
- **Email**: SMTP configuration for transactional emails

## 📊 Monitoring & Analytics
- **Business Metrics**: Event sales, user engagement, revenue tracking
- **Technical Metrics**: API performance, database performance, error rates
- **Security Monitoring**: Failed login attempts, suspicious activity
- **Plugin Metrics**: Plugin usage, performance, and error tracking

## 🔮 Future Enhancements
1. **GraphQL Integration**: GraphQL endpoint for complex data fetching
2. **Microservices Migration**: Gradual migration to microservices architecture
3. **Advanced Analytics**: Enhanced business intelligence and reporting
4. **Real-time Collaboration**: Real-time editing capabilities for admin users
5. **Advanced Plugin Capabilities**: Enhanced plugin API and capabilities

This API server represents the backbone of the TicketBase platform, providing robust, scalable, and secure foundation for the multi-tenant SaaS ticket sales platform with sophisticated plugin integration capabilities.