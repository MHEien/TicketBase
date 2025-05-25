# Database Schema for PostgreSQL

The following entity models will be implemented using TypeORM with PostgreSQL as the primary database. These models include proper column types, indexes, and relationships optimized for PostgreSQL.

## Implementation Notes

- Use UUID as primary key type for all entities
- Add appropriate indexes for frequently queried fields
- Implement proper foreign key constraints with CASCADE/SET NULL options as needed
- Use PostgreSQL-specific features like JSONB for metadata fields and complex configurations
- Implement soft deletion with timestamp fields where appropriate
- Add database-level validation constraints

## Core Entities

### User ✅ (Implemented)
```typescript
export class User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed
  avatar?: string;
  role: UserRole; // "owner" | "admin" | "manager" | "support" | "analyst"
  permissions: string[];
  organizationId: string;
  createdAt: Date;
  lastActive: Date;
  status: "active" | "inactive" | "pending";
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  sessions?: UserSession[];
}

export class UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  device: string;
  ip: string;
  location: string;
  lastActive: Date;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
}
```

### Organization (Tenant) ✅ (Implemented)
```typescript
export class Organization {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  email: string;
  phone?: string;
  website?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  plan: "free" | "basic" | "pro" | "enterprise";
  settings: OrganizationSettings;
  subscriptionId?: string; // Reference to payment subscription
  customDomain?: string;
}

export class OrganizationSettings {
  id: string;
  organizationId: string;
  defaultCurrency: string;
  emailNotifications: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  allowGuestCheckout: boolean;
  serviceFeePercentage: number;
  serviceFeeFixed: number;
  ticketTransfersEnabled: boolean;
  refundPolicy?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}
```

### Event ✅ (Implemented)
```typescript
export class Event {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeZone: string;
  locationType: "physical" | "virtual" | "hybrid";
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  virtualEventUrl?: string;
  featuredImage?: string;
  galleryImages?: string[];
  status: "draft" | "published" | "cancelled" | "completed";
  visibility: "public" | "private" | "unlisted";
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  updatedBy: string; // User ID
  ticketTypes: TicketType[];
  salesStartDate?: Date;
  salesEndDate?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  totalTicketsSold: number;
  totalRevenue: number;
  capacity: number;
}

export class TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  minPerOrder?: number;
  maxPerOrder?: number;
  salesStartDate?: Date;
  salesEndDate?: Date;
  isHidden: boolean;
  isFree: boolean;
  requiresApproval: boolean;
  sortOrder: number;
  availableQuantity: number; // Calculated field (quantity - sold)
  metadata?: Record<string, any>;
}
```

### Cart and Orders
```typescript
export class Cart {
  id: string;
  organizationId: string;
  eventId: string;
  userId?: string; // Optional for guest checkout
  sessionId: string;
  items: CartItem[];
  customer?: Customer;
  subtotal: number;
  fees: number;
  taxes: number;
  total: number;
  currency: string;
  discountCode?: string;
  discountAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  status: "active" | "abandoned" | "converted" | "expired";
}

export class CartItem {
  id: string;
  cartId: string;
  ticketTypeId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  type: 'ticket' | 'merchandise' | 'fee';
  metadata?: Record<string, any>;
}

export class Order {
  id: string;
  organizationId: string;
  eventId: string;
  userId?: string; // Optional for guest checkout
  cartId: string; // Cart that was converted to order
  orderNumber: string; // Human-readable order ID
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  fees: number;
  taxes: number;
  total: number;
  currency: string;
  discountCode?: string;
  discountAmount?: number;
  status: "pending" | "confirmed" | "cancelled" | "refunded" | "partial_refund";
  paymentId: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partial_refund";
  createdAt: Date;
  updatedAt: Date;
  refundedAmount?: number;
  notes?: string;
}

export class OrderItem {
  id: string;
  orderId: string;
  ticketTypeId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  type: 'ticket' | 'merchandise' | 'fee';
  tickets?: Ticket[]; // For ticket items, individual tickets
  metadata?: Record<string, any>;
}

export class Customer {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  marketing?: boolean; // Marketing consent
}
```

### Tickets ✅ (Implemented)
```typescript
export class Ticket {
  id: string;
  organizationId: string;
  eventId: string;
  ticketTypeId: string;
  orderId: string;
  orderItemId: string;
  code: string; // Unique ticket code
  qrCode: string; // Generated QR code data
  status: "valid" | "used" | "cancelled" | "refunded";
  attendeeInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    additionalFields?: Record<string, any>;
  };
  checkedInAt?: Date;
  checkedInBy?: string; // User ID
  transferredAt?: Date;
  transferredFrom?: string; // User ID
  transferredTo?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

### Transactions
```typescript
export class Transaction {
  id: string;
  organizationId: string;
  orderId?: string;
  userId?: string; // Optional for guest checkout
  type: "purchase" | "refund" | "chargeback" | "payout";
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodId: string; // ID from payment provider
  paymentIntentId?: string; // ID from payment provider
  status: "pending" | "completed" | "failed" | "cancelled";
  gatewayFee?: number;
  platformFee?: number;
  metadata?: Record<string, any>;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Plugin System

### Plugin
```typescript
export class Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'payment' | 'marketing' | 'analytics' | 'social' | 'ticketing' | 'layout' | 'seating';
  bundleUrl: string; // URL to the plugin bundle
  extensionPoints: string[]; // List of extension points this plugin implements
  adminComponents: {
    settings?: string; // Component name for admin settings
    eventCreation?: string; // Component for event creation flow
    dashboard?: string; // Component for dashboard widgets
  };
  storefrontComponents: {
    checkout?: string; // Component for checkout process
    eventDetail?: string; // Component for event detail page
    ticketSelection?: string; // Component for ticket selection
    widgets?: Record<string, string>; // Named widget components for placement
  };
  metadata: {
    priority?: number; // Priority for rendering when multiple plugins implement the same extension point
    displayName?: string; // Human-readable name for display
    author?: string; // Plugin author/developer
  };
  requiredPermissions?: string[];
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "deprecated" | "removed";
}

export class InstalledPlugin {
  id: string;
  pluginId: string;
  organizationId: string;
  enabled: boolean;
  configuration: Record<string, any>;
  installedAt: Date;
  updatedAt: Date;
  installedBy: string; // User ID
  version: string;
}
```

## Analytics Entities

### EventAnalytics
```typescript
export class EventAnalytics {
  id: string;
  eventId: string;
  organizationId: string;
  date: Date;
  totalViews: number;
  uniqueViews: number;
  totalSales: number;
  ticketsSold: number;
  conversionRate: number;
  revenue: number;
  ticketTypeBreakdown: Record<string, {
    quantity: number;
    revenue: number;
  }>;
  refunds: number;
  referrers: Record<string, number>; // Source of traffic
}
```

### SalesAnalytics
```typescript
export class SalesAnalytics {
  id: string;
  organizationId: string;
  dateRange: "daily" | "weekly" | "monthly";
  date: Date;
  totalSales: number;
  totalRevenue: number;
  ticketsSold: number;
  averageOrderValue: number;
  refundAmount: number;
  feesCollected: number;
  eventBreakdown: Record<string, {
    sales: number;
    revenue: number;
    tickets: number;
  }>;
  paymentMethodBreakdown: Record<string, {
    sales: number;
    revenue: number;
  }>;
}
```

## Integration with Traefik

### TraefikRoute
```typescript
export class TraefikRoute {
  id: string;
  name: string;
  rule: string; // Traefik routing rule
  service: string; // Service name to route to
  priority: number;
  entryPoints: string[];
  middlewares: string[];
  tls: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### TraefikMiddleware
```typescript
export class TraefikMiddleware {
  id: string;
  name: string;
  type: "rateLimit" | "ipWhitelist" | "basicAuth" | "stripPrefix" | "headers" | "compress";
  configuration: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Relationships and Foreign Keys

- **User** belongs to **Organization** (many-to-one)
- **Organization** has many **OrganizationSettings** (one-to-one)
- **Organization** has many **Events** (one-to-many)
- **Event** has many **TicketTypes** (one-to-many)
- **Event** belongs to **Organization** (many-to-one)
- **TicketType** belongs to **Event** (many-to-one)
- **Cart** belongs to **Organization** (many-to-one)
- **Cart** belongs to **Event** (many-to-one)
- **Cart** has many **CartItems** (one-to-many)
- **Order** belongs to **Organization** (many-to-one)
- **Order** belongs to **Event** (many-to-one)
- **Order** has many **OrderItems** (one-to-many)
- **OrderItem** has many **Tickets** (one-to-many)
- **OrderItem** belongs to **Order** (many-to-one)
- **Ticket** belongs to **Event** (many-to-one)
- **Ticket** belongs to **TicketType** (many-to-one)
- **Ticket** belongs to **OrderItem** (many-to-one)
- **Transaction** belongs to **Organization** (many-to-one)
- **Transaction** may belong to **Order** (many-to-one)
- **InstalledPlugin** belongs to **Organization** (many-to-one)
- **InstalledPlugin** references **Plugin** (many-to-one)
- **EventAnalytics** belongs to **Event** (many-to-one)
- **EventAnalytics** belongs to **Organization** (many-to-one)
- **SalesAnalytics** belongs to **Organization** (many-to-one)

## Implementation Status

### Implemented Entities ✅
- User and User Sessions
- Organization and Organization Settings
- Event
- TicketType
- Ticket

### Next Entities to Implement
- Cart and CartItem
- Order and OrderItem
- Customer
- Transaction
- Plugin and InstalledPlugin
- Analytics Entities

This comprehensive data model covers all the necessary entities for your ticket sales platform backend, including the core event and ticket management, user authentication, plugin system, transaction processing, and analytics.
