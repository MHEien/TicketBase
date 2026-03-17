#!/usr/bin/env bun
// =============================================================================
// Seed script — populates dev databases with usable data.
//
// Usage:  bun run scripts/seed.ts
//         (or via package.json: bun run seed)
//
// Prerequisites:
//   docker compose -f docker-compose.dev.yml up -d
// =============================================================================

import { Client } from 'pg';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// Config — mirrors .env defaults
// ---------------------------------------------------------------------------
const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ticketing',
};

const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb://root:example@localhost:27017/plugin-server?authSource=admin';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function uuid(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

// ---------------------------------------------------------------------------
// PostgreSQL Seed
// ---------------------------------------------------------------------------
async function seedPostgres() {
  console.log('\n📦 Seeding PostgreSQL...');

  const pg = new Client(PG_CONFIG);
  await pg.connect();

  // Check if the database already has an org
  const existing = await pg.query('SELECT id FROM organizations LIMIT 1');
  if (existing.rows.length > 0) {
    console.log('   ⏭️  PostgreSQL already seeded (organizations exist). Skipping.');
    await pg.end();
    return;
  }

  // --- Organization ---
  const orgId = uuid();
  await pg.query(
    `INSERT INTO organizations (id, name, slug, email, plan, settings)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      orgId,
      'Demo Events Co.',
      'demo-events',
      'admin@demo-events.com',
      'pro',
      JSON.stringify({
        defaultCurrency: 'USD',
        emailNotifications: true,
        primaryColor: '#6366f1',
        secondaryColor: '#f59e0b',
        buttonStyle: 'rounded',
        allowGuestCheckout: true,
        serviceFeePercentage: 2.5,
        ticketTransfersEnabled: true,
      }),
    ],
  );
  console.log(`   ✅ Organization: "Demo Events Co." (${orgId})`);

  // --- Admin User (password: "admin123") ---
  const adminId = uuid();
  const adminHash = await hashPassword('admin123');
  await pg.query(
    `INSERT INTO users (id, name, email, password, role, permissions, "organizationId", status, "lastActive")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
    [
      adminId,
      'Admin User',
      'admin@demo-events.com',
      adminHash,
      'owner',
      'all',
      orgId,
      'active',
    ],
  );
  console.log(`   ✅ User: admin@demo-events.com / admin123 (${adminId})`);

  // --- Manager User (password: "manager123") ---
  const managerId = uuid();
  const managerHash = await hashPassword('manager123');
  await pg.query(
    `INSERT INTO users (id, name, email, password, role, permissions, "organizationId", status, "lastActive")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
    [
      managerId,
      'Event Manager',
      'manager@demo-events.com',
      managerHash,
      'manager',
      'read:events,write:events,read:orders,read:customers',
      orgId,
      'active',
    ],
  );
  console.log(`   ✅ User: manager@demo-events.com / manager123`);

  // --- Events ---
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthEnd = new Date(nextMonth);
  nextMonthEnd.setHours(nextMonthEnd.getHours() + 4);

  const twoMonths = new Date(now);
  twoMonths.setMonth(twoMonths.getMonth() + 2);
  const twoMonthsEnd = new Date(twoMonths);
  twoMonthsEnd.setHours(twoMonthsEnd.getHours() + 8);

  const event1Id = uuid();
  await pg.query(
    `INSERT INTO event (id, "organizationId", title, description, category,
      "startDate", "endDate", "startTime", "endTime", "timeZone",
      "locationType", "venueName", address, city, state, "zipCode", country,
      status, visibility, "createdBy", "updatedBy", capacity)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
    [
      event1Id, orgId,
      'Summer Music Festival 2026',
      'A weekend of live music featuring local and international artists across three stages.',
      'music',
      nextMonth.toISOString(), nextMonthEnd.toISOString(),
      '14:00', '23:00', 'America/New_York',
      'physical',
      'Central Park Amphitheater', '123 Park Ave', 'New York', 'NY', '10001', 'US',
      'published', 'public',
      adminId, adminId,
      5000,
    ],
  );
  console.log(`   ✅ Event: "Summer Music Festival 2026" (${event1Id})`);

  const event2Id = uuid();
  await pg.query(
    `INSERT INTO event (id, "organizationId", title, description, category,
      "startDate", "endDate", "startTime", "endTime", "timeZone",
      "locationType", "virtualEventUrl",
      status, visibility, "createdBy", "updatedBy", capacity)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      event2Id, orgId,
      'Tech Conference 2026',
      'Annual developer conference with workshops, keynotes, and networking sessions.',
      'conference',
      twoMonths.toISOString(), twoMonthsEnd.toISOString(),
      '09:00', '17:00', 'America/Los_Angeles',
      'hybrid',
      'https://stream.demo-events.com/tech-conf-2026',
      'published', 'public',
      adminId, adminId,
      2000,
    ],
  );
  console.log(`   ✅ Event: "Tech Conference 2026" (${event2Id})`);

  // --- Ticket Types ---
  for (const tt of [
    { eventId: event1Id, name: 'General Admission', price: 49.99, quantity: 3000, available: 3000, sort: 0 },
    { eventId: event1Id, name: 'VIP Pass', price: 149.99, quantity: 500, available: 500, sort: 1, description: 'Includes backstage access and complimentary drinks' },
    { eventId: event1Id, name: 'Early Bird', price: 29.99, quantity: 1000, available: 1000, sort: 2 },
    { eventId: event2Id, name: 'Standard Ticket', price: 199.00, quantity: 1500, available: 1500, sort: 0 },
    { eventId: event2Id, name: 'Workshop Pass', price: 349.00, quantity: 300, available: 300, sort: 1, description: 'Full conference + hands-on workshop access' },
    { eventId: event2Id, name: 'Virtual Only', price: 79.00, quantity: 1000, available: 1000, sort: 2 },
  ]) {
    await pg.query(
      `INSERT INTO ticket_type (id, "eventId", name, description, price, quantity, "availableQuantity", "sortOrder", "minPerOrder", "maxPerOrder")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [uuid(), tt.eventId, tt.name, tt.description || null, tt.price, tt.quantity, tt.available, tt.sort, 1, 10],
    );
  }
  console.log(`   ✅ 6 Ticket Types created`);

  // --- Sample Customers ---
  for (const c of [
    { first: 'Jane', last: 'Doe', email: 'jane.doe@example.com', phone: '+1-555-0123' },
    { first: 'John', last: 'Smith', email: 'john.smith@example.com', phone: '+1-555-0456' },
  ]) {
    await pg.query(
      `INSERT INTO customers (id, "firstName", "lastName", email, phone)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuid(), c.first, c.last, c.email, c.phone],
    );
  }
  console.log(`   ✅ 2 Customers created`);

  await pg.end();
  console.log('   📦 PostgreSQL seeding complete.');
}

// ---------------------------------------------------------------------------
// MongoDB Seed
// ---------------------------------------------------------------------------
async function seedMongo() {
  console.log('\n🍃 Seeding MongoDB...');

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(); // uses the db from the URI (plugin-server)

  // Check if already seeded
  const existingPlugins = await db.collection('plugins').countDocuments();
  if (existingPlugins > 0) {
    console.log('   ⏭️  MongoDB already seeded (plugins exist). Skipping.');
    await client.close();
    return;
  }

  // --- Stripe Payments Plugin ---
  await db.collection('plugins').insertOne({
    id: 'stripe-payments',
    name: 'Stripe Payments',
    version: '3.0.0',
    description: 'Accept credit card and other payments via Stripe. Includes checkout, webhooks, refunds, and revenue dashboards.',
    category: 'payment',
    extensionPoints: ['admin-settings', 'payment-methods', 'checkout-confirmation', 'dashboard-widget'],
    requiredPermissions: ['read:orders', 'write:orders', 'read:customers', 'write:transactions'],
    backendEntryPoint: 'dist/backend.js',
    backendRoutes: [
      { method: 'POST', path: '/checkout/create-session', handler: 'createCheckoutSession' },
      { method: 'POST', path: '/checkout/verify', handler: 'verifyPayment' },
      { method: 'POST', path: '/webhooks/stripe', handler: 'handleWebhook' },
      { method: 'POST', path: '/refunds', handler: 'createRefund' },
      { method: 'GET',  path: '/revenue/summary', handler: 'getRevenueSummary' },
    ],
    backendHooks: [
      { event: 'order.created', handler: 'onOrderCreated' },
      { event: 'order.cancelled', handler: 'onOrderCancelled' },
    ],
    requiredSecrets: ['secretKey', 'webhookSecret'],
    bundleUrl: '', // Will be set when the bundle is uploaded to MinIO
    metadata: {
      author: 'Tickets Platform Team',
      displayName: 'Stripe Payments',
      iconUrl: 'https://images.stripe.com/newsroom/2021/stripe_rebrand/Stripe_icon_-_square.svg',
      installCount: 0,
      rating: null,
      reviewCount: 0,
      lastUpdated: new Date().toISOString(),
      status: 'published',
      configSchema: {
        type: 'object',
        properties: {
          secretKey: { type: 'string', title: 'Stripe Secret Key' },
          publishableKey: { type: 'string', title: 'Stripe Publishable Key' },
          webhookSecret: { type: 'string', title: 'Webhook Signing Secret' },
          testMode: { type: 'boolean', title: 'Test Mode', default: true },
        },
        required: ['secretKey', 'publishableKey'],
        sensitiveFields: ['secretKey', 'webhookSecret'],
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('   ✅ Plugin: stripe-payments (v3.0.0)');

  // --- Sample Analytics Plugin (stub) ---
  await db.collection('plugins').insertOne({
    id: 'basic-analytics',
    name: 'Basic Analytics',
    version: '1.0.0',
    description: 'Simple event analytics dashboard showing ticket sales, revenue trends, and attendee demographics.',
    category: 'analytics',
    extensionPoints: ['dashboard-widget', 'admin-settings'],
    requiredPermissions: ['read:events', 'read:orders', 'read:customers'],
    backendEntryPoint: '',
    backendRoutes: [],
    backendHooks: [],
    requiredSecrets: [],
    bundleUrl: '',
    metadata: {
      author: 'Tickets Platform Team',
      displayName: 'Basic Analytics',
      installCount: 0,
      rating: null,
      reviewCount: 0,
      lastUpdated: new Date().toISOString(),
      status: 'published',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('   ✅ Plugin: basic-analytics (v1.0.0)');

  // --- Sample Email Plugin (stub) ---
  await db.collection('plugins').insertOne({
    id: 'email-notifications',
    name: 'Email Notifications',
    version: '1.0.0',
    description: 'Send transactional emails for order confirmations, ticket delivery, and event reminders via SendGrid.',
    category: 'communication',
    extensionPoints: ['admin-settings'],
    requiredPermissions: ['read:orders', 'read:events', 'read:customers'],
    backendEntryPoint: 'dist/backend.js',
    backendRoutes: [
      { method: 'POST', path: '/send', handler: 'sendEmail' },
    ],
    backendHooks: [
      { event: 'order.created', handler: 'onOrderCreated' },
      { event: 'ticket.transferred', handler: 'onTicketTransferred' },
    ],
    requiredSecrets: ['sendgridApiKey'],
    bundleUrl: '',
    metadata: {
      author: 'Tickets Platform Team',
      displayName: 'Email Notifications',
      installCount: 0,
      rating: null,
      reviewCount: 0,
      lastUpdated: new Date().toISOString(),
      status: 'published',
      configSchema: {
        type: 'object',
        properties: {
          sendgridApiKey: { type: 'string', title: 'SendGrid API Key' },
          fromEmail: { type: 'string', title: 'From Email Address' },
          fromName: { type: 'string', title: 'From Name' },
        },
        required: ['sendgridApiKey', 'fromEmail'],
        sensitiveFields: ['sendgridApiKey'],
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('   ✅ Plugin: email-notifications (v1.0.0)');

  // Create indexes
  await db.collection('plugins').createIndex({ id: 1 }, { unique: true });
  await db.collection('installedplugins').createIndex(
    { tenantId: 1, pluginId: 1 },
    { unique: true },
  );
  await db.collection('pluginstorages').createIndex(
    { tenantId: 1, pluginId: 1, key: 1 },
    { unique: true },
  );
  console.log('   ✅ MongoDB indexes created');

  await client.close();
  console.log('   🍃 MongoDB seeding complete.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🌱 Starting database seed...');

  try {
    await seedPostgres();
  } catch (err: any) {
    if (err.message?.includes('ECONNREFUSED') || err.message?.includes('does not exist')) {
      console.error(`   ❌ PostgreSQL not ready: ${err.message}`);
      console.error('   💡 Make sure "docker compose -f docker-compose.dev.yml up -d" is running');
      console.error('   💡 Then start the API server once (bun run --filter api dev) so TypeORM creates the tables, then re-run seed.');
    } else {
      console.error('   ❌ PostgreSQL seed failed:', err.message);
    }
  }

  try {
    await seedMongo();
  } catch (err: any) {
    if (err.message?.includes('ECONNREFUSED')) {
      console.error(`   ❌ MongoDB not ready: ${err.message}`);
      console.error('   💡 Make sure "docker compose -f docker-compose.dev.yml up -d" is running');
    } else {
      console.error('   ❌ MongoDB seed failed:', err.message);
    }
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('Next steps:');
  console.log('  1. Start the API server:     cd apps/api && bun run start:dev');
  console.log('  2. Start the Plugin server:  cd apps/plugins && bun run start:dev');
  console.log('  3. Login with:               admin@demo-events.com / admin123');
  console.log('  4. Adminer (Postgres UI):    http://localhost:8080');
  console.log('  5. MinIO Console:            http://localhost:9001  (minioadmin / minioadmin)');
}

main().catch(console.error);
