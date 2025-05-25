import { NextRequest, NextResponse } from 'next/server';

// Mock plugins data - this would come from your NestJS plugin service
const availablePlugins = [
  {
    id: 'stripe-payment',
    name: 'Stripe Payment Gateway',
    version: '1.0.0',
    description: 'Process payments with Stripe for your events',
    category: 'payment',
    bundleUrl: 'https://plugin-cdn.example.com/stripe/remoteEntry.js',
    scope: 'stripe',
    adminComponents: {
      settings: './StripeSettings',
      eventCreation: './StripeEventOptions',
    },
    storefrontComponents: {
      checkout: './StripeCheckout',
      widgets: {
        'payment-methods': './StripePaymentMethods',
      }
    }
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp Integration',
    version: '1.0.0',
    description: 'Sync attendee data with your Mailchimp lists',
    category: 'marketing',
    bundleUrl: 'https://plugin-cdn.example.com/mailchimp/remoteEntry.js',
    scope: 'mailchimp',
    adminComponents: {
      settings: './MailchimpSettings',
    },
    storefrontComponents: {
      widgets: {
        'checkout-newsletter': './MailchimpSignup',
      }
    }
  },
  {
    id: 'seating-manager',
    name: 'Seating Manager',
    version: '1.0.0',
    description: 'Create and manage seat maps for your events',
    category: 'seating',
    bundleUrl: 'https://plugin-cdn.example.com/seating/remoteEntry.js',
    scope: 'seating',
    adminComponents: {
      settings: './SeatingSettings',
      eventCreation: './SeatingOptions',
      dashboard: './SeatingDashboard',
    },
    storefrontComponents: {
      eventDetail: './SeatingMap',
      ticketSelection: './SeatSelector',
      widgets: {
        'ticket-options': './SeatingWidget',
      }
    }
  },
];

// In-memory store for installed plugins - in production this would be in a database
let installedPlugins: any[] = [];

// GET /api/plugins/available - List all available plugins
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Check which endpoint we're hitting
  if (path.endsWith('/available')) {
    // Return all available plugins
    return NextResponse.json(availablePlugins);
  } 
  else if (path.endsWith('/installed')) {
    // Return installed plugins for current tenant
    return NextResponse.json(installedPlugins);
  }
  
  // Default response for base route
  return NextResponse.json({ message: 'Plugin API endpoints' });
}

// POST /api/plugins/install - Install a plugin
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  if (path.endsWith('/install')) {
    // Install a plugin
    const body = await request.json();
    const { pluginId } = body;
    
    // Find the plugin in available plugins
    const pluginToInstall = availablePlugins.find(p => p.id === pluginId);
    
    if (!pluginToInstall) {
      return NextResponse.json(
        { error: `Plugin ${pluginId} not found` },
        { status: 404 }
      );
    }
    
    // Check if already installed
    const existing = installedPlugins.find(p => p.id === pluginId);
    
    if (existing) {
      return NextResponse.json(
        { error: `Plugin ${pluginId} is already installed` },
        { status: 409 }
      );
    }
    
    // Add to installed plugins
    const installedPlugin = {
      ...pluginToInstall,
      enabled: true,
      tenantId: 'demo-tenant', // In production, this would be the actual tenant ID
      configuration: {},
      installedAt: new Date(),
      updatedAt: new Date()
    };
    
    installedPlugins.push(installedPlugin);
    
    return NextResponse.json(installedPlugin);
  } 
  else if (path.endsWith('/uninstall')) {
    // Uninstall a plugin
    const body = await request.json();
    const { pluginId } = body;
    
    // Check if plugin is installed
    const index = installedPlugins.findIndex(p => p.id === pluginId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: `Plugin ${pluginId} is not installed` },
        { status: 404 }
      );
    }
    
    // Remove from installed plugins
    installedPlugins.splice(index, 1);
    
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json(
    { error: 'Invalid endpoint' },
    { status: 404 }
  );
}

// PUT /api/plugins/:id/config - Update plugin configuration
export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  const match = path.match(/\/api\/plugins\/(.+)\/config$/);
  
  if (match) {
    const pluginId = match[1];
    const body = await request.json();
    
    // Find the plugin
    const index = installedPlugins.findIndex(p => p.id === pluginId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: `Plugin ${pluginId} is not installed` },
        { status: 404 }
      );
    }
    
    // Update configuration
    installedPlugins[index] = {
      ...installedPlugins[index],
      configuration: body,
      updatedAt: new Date()
    };
    
    return NextResponse.json(installedPlugins[index]);
  }
  
  const statusMatch = path.match(/\/api\/plugins\/(.+)\/status$/);
  
  if (statusMatch) {
    const pluginId = statusMatch[1];
    const body = await request.json();
    const { enabled } = body;
    
    // Find the plugin
    const index = installedPlugins.findIndex(p => p.id === pluginId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: `Plugin ${pluginId} is not installed` },
        { status: 404 }
      );
    }
    
    // Update enabled status
    installedPlugins[index] = {
      ...installedPlugins[index],
      enabled,
      updatedAt: new Date()
    };
    
    return NextResponse.json(installedPlugins[index]);
  }
  
  return NextResponse.json(
    { error: 'Invalid endpoint' },
    { status: 404 }
  );
} 