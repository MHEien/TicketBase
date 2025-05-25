Create a comprehensive NestJS backend for a ticket sales platform with plugin system integration. This API server will act as the central routing system and transaction handler for the entire platform.

## Authentication & Authorization

### Integration with NextAuth.js
- Implement JWT validation middleware in NestJS
  ```typescript
  // auth.middleware.ts
  @Injectable()
  export class JwtAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException();
      }
      
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.NEXTAUTH_SECRET
        });
        req['user'] = payload;
        next();
      } catch {
        throw new UnauthorizedException();
      }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  ```

- Create shared JWT secret between NextAuth and NestJS
  - Use the same `NEXTAUTH_SECRET` for both applications
  - Configure JWT options in both systems to ensure compatibility

- Support NextAuth session endpoints
  - Implement session validation endpoint `/api/auth/session`
  - Add CSRF protection compatible with NextAuth

- User synchronization
  - Create/update user records in PostgreSQL when authentication happens via NextAuth
  - Store extended user profile data beyond what NextAuth provides

- API endpoints for NextAuth providers
  - Implement user lookup by email
  - Support credential provider authentication
  - Add refresh token rotation

### Role-Based Access Control
- Implement Guards in NestJS to validate permissions from NextAuth JWT
  ```typescript
  @Injectable()
  export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
      if (!requiredPermissions) {
        return true;
      }
      
      const { user } = context.switchToHttp().getRequest();
      return requiredPermissions.every(permission => user.permissions.includes(permission));
    }
  }
  ```

- Custom decorators for permission checks
  ```typescript
  export const RequirePermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
  ```

### Two-Factor Authentication
- Implement TOTP (Time-based One-Time Password) for 2FA
- Support 2FA challenge endpoints consumed by NextAuth
- QR code generation for authenticator app setup

### Session Management
- Track active sessions in database
- Provide API endpoints for session revocation
- Handle session expiration and refresh

## Database Configuration

### Primary Database: PostgreSQL
- Set up TypeORM with PostgreSQL driver
- Configure database connection in `app.module.ts`:
  ```typescript
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ticketing',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development', // Set to false in production
    migrations: ['dist/migrations/**/*{.ts,.js}'],
    migrationsRun: true,
  })
  ```
- Create database migrations for schema management
- Implement repository pattern for data access

### Supporting Databases
- MongoDB integration for unstructured plugin data
- Redis for caching and temporary data storage

### Storage
- MinIO client integration for:
  - Event images
  - Plugin bundles
  - Ticket QR codes
  - Other media assets

## Core Requirements

1. **Authentication & Authorization** ✅
   - Implement JWT-based authentication with refresh tokens
   - Role-based access control (Admin, Organizer, User)
   - Permission-based actions (events:create, events:edit, tickets:manage, etc.)
   - Session management with ability to revoke sessions
   - Two-factor authentication support

2. **Event Management** ✅
   - CRUD operations for events with comprehensive validation
   - Support for physical, virtual, and hybrid events
   - Event categories, search, and filtering
   - Event status tracking (draft, published, cancelled, completed)
   - Image upload and management for event galleries
   
   Implementation details:
   ```typescript
   // Event entity with robust fields and relationships
   @Entity()
   export class Event {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column()
     title: string;
     
     @Column('text')
     description: string;
     
     @Column({
       type: 'enum',
       enum: EventStatus,
       default: EventStatus.DRAFT
     })
     status: EventStatus;
     
     // Many other fields for comprehensive event management
   }
   
   // Event Service provides business logic
   @Injectable()
   export class EventsService {
     async create(organizationId: string, userId: string, createEventDto: CreateEventDto): Promise<Event> {
       // Implementation
     }
   
     async findAll(organizationId: string, options?: {}): Promise<Event[]> {
       // Implementation with filtering
     }
   
     async publish(id: string, organizationId: string, userId: string): Promise<Event> {
       // Special operation
     }
   }
   ```

3. **Ticket Management** ✅
   - Multiple ticket types per event with inventory management
   - Dynamic pricing strategies
   - QR code generation for tickets
   - Check-in functionality for physical events
   - Ticket transfer capabilities
   
   Implementation details:
   ```typescript
   // Ticket Type entity
   @Entity()
   export class TicketType {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column()
     name: string;
     
     @Column('decimal', { precision: 10, scale: 2 })
     price: number;
     
     @Column()
     quantity: number;
     
     @Column({ default: 0 })
     availableQuantity: number;
     
     // Other fields for ticket type configuration
   }
   
   // Ticket entity with status tracking
   @Entity()
   export class Ticket {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column({ unique: true })
     code: string;
     
     @Column()
     qrCode: string;
     
     @Column({
       type: 'enum',
       enum: TicketStatus,
       default: TicketStatus.VALID
     })
     status: TicketStatus;
     
     // Fields for tracking ticket usage
   }
   
   // Service for ticket management
   @Injectable()
   export class TicketsService {
     async generateTickets(
       organizationId: string,
       eventId: string,
       ticketTypeId: string, 
       quantity: number,
       // Other parameters
     ): Promise<Ticket[]> {
       // Implementation
     }
     
     async checkInTicket(organizationId: string, code: string, userId: string): Promise<Ticket> {
       // Implementation for validating and checking in tickets
     }
   }
   ```

4. **Transaction Processing**
   - Secure payment processing integration (Stripe)
   - Transaction records with detailed history
   - Refund processing
   - Discount/promo code support
   - Tax handling based on jurisdiction

5. **Plugin System Integration**
   - Proxy requests to the plugin server
   - Integrate plugin functionality into core platform
   - Manage plugin installation, configuration, and status
   - Marketplace for available plugins
   - Plugin categories: payments, marketing, analytics, social, ticketing, layout, seating

6. **User Management** ✅
   - User profiles with detailed information
   - Organization/tenant management
   - Team roles and permissions
   - Activity tracking

7. **Analytics & Reporting**
   - Sales reports and projections
   - Attendee demographics
   - Event performance metrics
   - Financial reconciliation

## Technical Requirements

1. **Architecture**
   - Implement modular monolith with domain-driven design
   - Use NestJS modules for clear separation of concerns
   - Implement CQRS pattern for complex operations
   - Set up middleware for authentication, logging, and error handling

2. **Database**
   - PostgreSQL as primary database with proper indexing
   - Redis for caching and rate limiting
   - Implement database migrations with TypeORM/Prisma
   - Design efficient data models with proper relationships

3. **API Design**
   - RESTful API with consistent error handling
   - OpenAPI documentation with Swagger
   - Rate limiting and throttling protection
   - Versioning strategy for API endpoints

4. **Security**
   - Input validation and sanitization
   - CSRF protection
   - CORS configuration
   - Request validation with class-validator
   - Data encryption for sensitive information
   - Helmet for HTTP security headers

5. **Deployment & DevOps**
   - Docker containerization
   - Environment configuration management
   - Health check endpoints
   - Logging strategy with correlation IDs
   - Metrics collection for performance monitoring
   - Integration with Traefik for routing and load balancing

6. **Testing**
   - Unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical flows
   - Test database setup with seeding

7. **Performance**
   - Implement caching strategy
   - Optimize database queries
   - Implement pagination for large result sets
   - Use WebSockets for real-time features (like ticket availability)

## Implementation Progress

### Completed Modules:

1. **Authentication** ✅
   - JWT authentication with guards
   - Session management
   - NextAuth integration

2. **User Management** ✅
   - User entities and relationships
   - Organization management
   - Role-based permissions

3. **Event Management** ✅
   - Event CRUD operations
   - Event status management (draft, published, cancelled)
   - Event filtering and search
   - Support for different event types (physical, virtual, hybrid)

4. **Ticket Management** ✅
   - Ticket type creation and management
   - Ticket inventory tracking
   - Ticket generation with unique codes and QR codes
   - Ticket validation and check-in functionality

### Next Implementation Steps:

1. **Cart and Order Management**
   - Shopping cart functionality
   - Order processing
   - Payment integration with Stripe
   - Refund handling

2. **Plugin System**
   - Plugin entity model
   - Plugin installation and configuration
   - Extension point system for plugin integration

3. **Analytics**
   - Event performance metrics
   - Sales reporting
   - Attendee statistics

## Integration with Traefik

Configure Traefik as reverse proxy for the entire platform:
- Handle routing between NextJS frontend, NestJS backend, and plugin server
- Manage SSL termination
- Implement rate limiting at network level
- Handle load balancing for horizontal scaling
- Provide service discovery for microservices architecture

This backend should be designed for high availability, scalability, and security to handle large volumes of ticket sales transactions while maintaining performance.

