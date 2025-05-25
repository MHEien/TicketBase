# Ticket Platform Backend

A comprehensive NestJS backend for a ticket sales platform with event management, ticketing, and plugin system.

## Features

### Implemented ✅

- **Authentication & Authorization**
  - JWT-based authentication
  - Session management
  - NextAuth integration
  - Role-based permissions

- **User Management**
  - User profiles and accounts
  - Organization/tenant management
  - Team roles and permissions

- **Event Management**
  - CRUD operations for events
  - Support for physical, virtual, and hybrid events
  - Event categories and filtering
  - Event status workflow (draft, published, cancelled, completed)
  - Media management for event galleries

- **Ticket Management**
  - Multiple ticket types per event
  - Inventory management with available quantity tracking
  - Ticket generation with unique codes and QR codes
  - Ticket validation and check-in functionality

### Coming Soon

- Cart and order management
- Payment processing with Stripe
- Plugin system for extensibility
- Analytics and reporting

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- [Optional] Redis for caching

### Environment Setup

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required environment variables:

```
# App
PORT=3000
NODE_ENV=development

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ticketing

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ticket-backend.git
cd ticket-backend
```

2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npm run migration:run
```

4. Start the development server:

```bash
npm run start:dev
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

### Key Endpoints

#### Auth

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile

#### Events

- `GET /api/events` - List events with filtering options
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event details
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/publish` - Publish event
- `POST /api/events/:id/cancel` - Cancel event

#### Ticket Types

- `GET /api/events/:eventId/ticket-types` - List ticket types for an event
- `POST /api/events/:eventId/ticket-types` - Create a new ticket type
- `PATCH /api/events/:eventId/ticket-types/:id` - Update ticket type
- `DELETE /api/events/:eventId/ticket-types/:id` - Delete ticket type

#### Tickets

- `POST /api/tickets/generate` - Generate tickets (for demo purposes)
- `GET /api/tickets/validate/:code` - Validate a ticket
- `POST /api/tickets/check-in/:code` - Check in a ticket

## Development

### Project Structure

```
ticket-backend/
├── src/
│   ├── auth/             # Authentication and authorization
│   ├── users/            # User and organization management
│   ├── events/           # Event and ticket management
│   ├── config/           # Configuration files
│   ├── migrations/       # Database migrations
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── docs/                 # Documentation
└── dist/                 # Compiled output
```

### Running Tests

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database Schema

The application uses TypeORM with PostgreSQL. Key entities include:

- User
- Organization
- Event
- TicketType
- Ticket

For detailed data models, check `docs/DATA_MODELS.md`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
