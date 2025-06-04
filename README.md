# 🎫 TicketBase - Next-Generation Event Ticketing Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**A comprehensive, enterprise-grade event ticketing platform built with modern technologies and microservices architecture.**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🏗️ Architecture](#️-architecture) • [🔌 Plugin System](#-plugin-system) • [🌟 Features](#-features)

</div>

---

## 🌟 Features

### 🎯 **Core Event Management**

- **Multi-format Events**: Physical, virtual, and hybrid event support
- **Advanced Scheduling**: Timezone-aware event scheduling with flexible date/time management
- **Venue Management**: Comprehensive location handling with address validation
- **Event Categories**: Organized event classification and tagging system
- **SEO Optimization**: Built-in SEO tools for better event discoverability

### 🎫 **Sophisticated Ticketing System**

- **Multiple Ticket Types**: General admission, VIP, early bird, and custom ticket categories
- **Dynamic Pricing**: Time-based and demand-based pricing strategies
- **Capacity Management**: Real-time availability tracking and overselling prevention
- **Sales Windows**: Configurable sales start/end dates with automated controls

### 💳 **Enterprise Payment Processing**

- **Multi-Provider Support**: Pluggable payment gateway architecture
- **Global Currency Support**: Multi-currency transactions with real-time conversion
- **Advanced Fee Management**: Configurable gateway and platform fees
- **Refund Processing**: Automated and manual refund capabilities
- **Transaction Analytics**: Comprehensive payment tracking and reporting

### 🛒 **Smart Cart & Checkout**

- **Session Persistence**: Cross-device cart synchronization
- **Inventory Locking**: Temporary ticket reservations during checkout
- **Guest Checkout**: Streamlined purchase flow for non-registered users
- **Order Management**: Complete order lifecycle tracking

### 📊 **Advanced Analytics & Reporting**

- **Real-time Dashboards**: Live event performance metrics
- **Sales Analytics**: Revenue tracking, conversion rates, and sales trends
- **Attendee Insights**: Demographics and behavior analysis
- **Custom Reports**: Exportable data in multiple formats

### 🔌 **Extensible Plugin System**

- **Marketplace**: Centralized plugin discovery and installation
- **Payment Plugins**: Easy integration with new payment providers
- **Analytics Plugins**: Custom reporting and data visualization tools
- **Notification Plugins**: Multi-channel communication systems
- **Bundle Management**: Secure plugin packaging and distribution

### 👥 **Multi-tenant Architecture**

- **Organization Isolation**: Complete data separation between tenants
- **Role-based Access Control**: Granular permission management
- **White-label Support**: Customizable branding per organization
- **API Rate Limiting**: Per-tenant resource management

### 🔐 **Enterprise Security**

- **JWT Authentication**: Secure token-based authentication
- **NextAuth.js Integration**: Social login and OAuth support
- **RBAC**: Role-based access control with fine-grained permissions
- **Data Encryption**: End-to-end data protection
- **CORS Protection**: Configurable cross-origin resource sharing

---

## 🏗️ Architecture

### **Microservices Design**

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Admin Dashboard<br/>Next.js + React]
        B[Customer Portal<br/>Next.js + React]
    end

    subgraph "API Gateway Layer"
        C[Main API Server<br/>NestJS + PostgreSQL<br/>Port 4000]
    end

    subgraph "Microservices"
        D[Plugin Server<br/>NestJS + MongoDB<br/>Port 5000]
        E[Analytics Service<br/>Real-time Processing]
        F[Notification Service<br/>Multi-channel Delivery]
    end

    subgraph "Storage Layer"
        G[(PostgreSQL<br/>Core Data)]
        H[(MongoDB<br/>Plugin Data)]
        I[MinIO<br/>File Storage]
        J[(Redis<br/>Caching)]
    end

    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    D --> H
    D --> I
    C --> J
```

### **Technology Stack**

| Layer              | Technology                       | Purpose                              |
| ------------------ | -------------------------------- | ------------------------------------ |
| **Frontend**       | Next.js 15, React 19, TypeScript | Modern, performant user interfaces   |
| **Backend**        | NestJS, TypeScript               | Scalable, maintainable API services  |
| **Databases**      | PostgreSQL, MongoDB              | Relational and document data storage |
| **Storage**        | MinIO                            | S3-compatible object storage         |
| **Caching**        | Redis                            | High-performance data caching        |
| **Authentication** | NextAuth.js, JWT                 | Secure user authentication           |
| **UI Components**  | Radix UI, Tailwind CSS           | Accessible, customizable components  |
| **Build System**   | Turborepo, Bun                   | Monorepo management and fast builds  |

---

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** v20+
- **Bun** v1.2.4+ (Package manager)
- **Docker** & **Docker Compose**
- **PostgreSQL** 16+
- **MongoDB** 7+

### **1. Clone & Install**

```bash
# Clone the repository
git clone https://github.com/your-org/ticketsmonorepo.git
cd ticketsmonorepo

# Install dependencies
bun install
```

### **2. Start Infrastructure**

```bash
# Start databases and storage services
docker-compose up -d

# Services will be available at:
# - PostgreSQL: localhost:5432
# - MongoDB: localhost:27017
# - MinIO: localhost:9000 (API), localhost:9001 (Console)
# - Adminer: localhost:8080
```

### **3. Configure Environment**

```bash
# API Server (.env in apps/api/)
PORT=4000
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ticketing
JWT_SECRET=your-super-secret-jwt-key
PLUGIN_SERVER_URL=http://localhost:5000

# Plugin Server (.env in apps/plugins/)
MONGODB_URI=mongodb://root:example@localhost:27017/plugin-server?authSource=admin
PORT=5000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000
PLUGIN_ASSETS_BUCKET=plugin-bundles

# Admin App (.env.local in apps/admin/)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
PLUGIN_SERVER_URL=http://localhost:5000
```

### **4. Launch Applications**

```bash
# Start all services in development mode
bun dev

# Or start individually:
# API Server
cd apps/api && bun dev

# Plugin Server
cd apps/plugins && bun dev

# Admin Dashboard
cd apps/admin && bun dev
```

### **5. Access Applications**

- **Admin Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:4000/api/docs
- **Plugin Server**: http://localhost:5000
- **MinIO Console**: http://localhost:9001

---

## 🔌 Plugin System

### **Architecture Overview**

The plugin system enables seamless extension of platform capabilities through a secure, sandboxed environment.

```typescript
// Plugin Interface Example
interface PaymentPlugin {
  id: string;
  name: string;
  version: string;
  category: PluginCategory.PAYMENT;

  // Plugin Methods
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  processRefund(paymentId: string, amount?: number): Promise<RefundResult>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
}
```

### **Plugin Categories**

- **💳 Payment Processors**: Stripe, PayPal, Square, custom gateways
- **📧 Notification Services**: Email, SMS, push notifications
- **📊 Analytics Tools**: Custom reporting, data visualization
- **🔗 Integrations**: CRM, marketing tools, social platforms
- **🎨 Themes**: Custom UI components and styling

### **Plugin Development**

```bash
# Create new plugin
npx create-ticket-plugin my-payment-plugin

# Plugin structure
my-payment-plugin/
├── src/
│   ├── index.ts          # Main plugin entry
│   ├── config.ts         # Configuration schema
│   └── handlers/         # Event handlers
├── package.json
├── plugin.manifest.json  # Plugin metadata
└── README.md
```

---

## 📊 API Documentation

### **Core Endpoints**

#### **Events Management**

```http
GET    /api/events              # List events with filtering
POST   /api/events              # Create new event
GET    /api/events/:id          # Get event details
PATCH  /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event
POST   /api/events/:id/publish  # Publish event
POST   /api/events/:id/cancel   # Cancel event
```

#### **Ticket Management**

```http
GET    /api/events/:id/tickets        # List ticket types
POST   /api/events/:id/tickets        # Create ticket type
PATCH  /api/tickets/:id               # Update ticket type
DELETE /api/tickets/:id               # Delete ticket type
```

#### **Order Processing**

```http
POST   /api/orders                    # Create order
GET    /api/orders/:id                # Get order details
PATCH  /api/orders/:id/status         # Update order status
POST   /api/orders/:id/refund         # Process refund
```

#### **Analytics**

```http
GET    /api/analytics/events/:id      # Event analytics
GET    /api/analytics/sales           # Sales analytics
GET    /api/analytics/dashboard       # Dashboard metrics
```

### **Query Parameters**

```typescript
// Event Filtering
interface EventQuery {
  status?: "draft" | "published" | "cancelled" | "completed";
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "date" | "title" | "revenue";
  sortOrder?: "asc" | "desc";
}
```

---

## 🛠️ Development

### **Workspace Structure**

```
ticketsmonorepo/
├── apps/
│   ├── admin/           # Admin dashboard (Next.js)
│   ├── api/             # Main API server (NestJS)
│   └── plugins/         # Plugin server (NestJS)
├── packages/
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # ESLint configurations
│   └── typescript-config/ # TypeScript configurations
├── docs/                # Documentation
└── docker-compose.yml   # Development infrastructure
```

### **Available Scripts**

```bash
# Development
bun dev              # Start all apps in development mode
bun build            # Build all apps for production
bun lint             # Lint all packages
bun format           # Format code with Prettier
bun check-types      # Type checking across workspace

# Testing
bun test             # Run all tests
bun test:watch       # Run tests in watch mode
bun test:e2e         # Run end-to-end tests

# Database
bun db:migrate       # Run database migrations
bun db:seed          # Seed database with sample data
bun db:reset         # Reset database
```

### **Code Quality**

- **TypeScript**: Strict type checking across all packages
- **ESLint**: Consistent code style and best practices
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality assurance
- **Jest**: Comprehensive testing framework

---

## 🚀 Deployment

### **Production Environment**

```bash
# Build for production
bun build

# Start production servers
bun start

# Or use Docker
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment Variables**

<details>
<summary>📋 Complete Environment Configuration</summary>

#### **API Server**

```env
# Server
PORT=4000
NODE_ENV=production

# Database
DB_TYPE=postgres
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=ticketing
DB_SSL=true

# Authentication
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=900
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=604800
NEXTAUTH_SECRET=your-nextauth-secret

# External Services
PLUGIN_SERVER_URL=https://plugins.yourdomain.com
FRONTEND_URL=https://admin.yourdomain.com
```

#### **Plugin Server**

```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://username:password@your-mongo-host:27017/plugin-server

# Storage (MinIO/S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=https://your-minio-endpoint.com
PLUGIN_ASSETS_BUCKET=plugin-bundles

# Security
JWT_SECRET=your-plugin-jwt-secret
```

#### **Admin App**

```env
# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://admin.yourdomain.com

# API Endpoints
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
PLUGIN_SERVER_URL=https://plugins.yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

</details>

### **Infrastructure Requirements**

| Service           | Minimum          | Recommended          |
| ----------------- | ---------------- | -------------------- |
| **API Server**    | 1 CPU, 1GB RAM   | 2 CPU, 4GB RAM       |
| **Plugin Server** | 1 CPU, 512MB RAM | 2 CPU, 2GB RAM       |
| **Admin App**     | Static hosting   | CDN + Edge functions |
| **PostgreSQL**    | 1 CPU, 2GB RAM   | 2 CPU, 4GB RAM       |
| **MongoDB**       | 1 CPU, 1GB RAM   | 2 CPU, 2GB RAM       |
| **Redis**         | 512MB RAM        | 1GB RAM              |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Standards**

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages

---

## 📖 Documentation

- [🏗️ Architecture Guide](docs/ARCHITECTURE.md)
- [🔌 Plugin Development](docs/PLUGIN_DEVELOPMENT.md)
- [🚀 Deployment Guide](docs/DEPLOYMENT.md)
- [🔧 API Reference](docs/API_REFERENCE.md)
- [🎨 UI Components](docs/COMPONENTS.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS** - Progressive Node.js framework
- **Next.js** - React framework for production
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Turborepo** - High-performance build system

---

<div align="center">

**Built with ❤️ by the TicketsMonorepo Team**

[⭐ Star us on GitHub](https://github.com/your-org/ticketsmonorepo) • [🐛 Report Bug](https://github.com/your-org/ticketsmonorepo/issues) • [💡 Request Feature](https://github.com/your-org/ticketsmonorepo/issues)

</div>
