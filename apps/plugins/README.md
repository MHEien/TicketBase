# Plugin Server for Event Ticketing Platform

This NestJS-based plugin server provides the infrastructure for a dynamic import-based plugin system. It enables real-time installation and configuration of plugins for tenants in your event ticketing platform, without requiring rebuilds.

## Features

- Multi-tenant plugin management
- Plugin marketplace for discovery
- Asset management for plugin files via MinIO
- Plugin bundle generation and serving
- API proxying for plugin-specific endpoints
- Plugin compatibility verification
- Inter-plugin communication via event bus
- Webhook handling for plugin integrations

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB
- MinIO for object storage

### Setup

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd tickets-plugin-server
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Create a `.env` file in the project root (see `.env.example` for reference):

   ```
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/plugin-server

   # Server Configuration
   PORT=4000
   PLATFORM_VERSION=1.0.0
   PLUGIN_SERVER_URL=http://localhost:4000

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

   # Storage Configuration (MinIO)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=minioadmin     # Default MinIO access key
   AWS_SECRET_ACCESS_KEY=minioadmin # Default MinIO secret key
   S3_ENDPOINT=http://localhost:9000  # MinIO server URL
   S3_PORT=9000
   S3_USE_SSL=false
   PLUGIN_ASSETS_BUCKET=plugin-bundles
   ```

4. Set up MinIO:

   ```bash
   # Using Docker
   docker run -p 9000:9000 -p 9001:9001 --name minio \
     -v ~/minio/data:/data \
     -e "MINIO_ROOT_USER=minioadmin" \
     -e "MINIO_ROOT_PASSWORD=minioadmin" \
     minio/minio server /data --console-address ":9001"
   ```

   Then access the MinIO Console at http://localhost:9001 and create a bucket named `plugin-bundles`.

5. Start the development server:
   ```bash
   npm run start:dev
   # or
   bun run start:dev
   ```

## Authentication with Next Auth

This server uses JWT authentication that integrates with Next Auth in your Next.js application.

### Setting up Next Auth in your Next.js app

1. Install Next Auth in your Next.js application:

   ```bash
   npm install next-auth
   ```

2. Configure Next Auth in your Next.js app:

   ```typescript
   // app/api/auth/[...nextauth]/route.ts
   import NextAuth, { NextAuthOptions } from 'next-auth';
   import CredentialsProvider from 'next-auth/providers/credentials';
   import { JWT } from 'next-auth/jwt';

   export const authOptions: NextAuthOptions = {
     providers: [
       CredentialsProvider({
         name: 'Credentials',
         credentials: {
           email: { label: 'Email', type: 'email' },
           password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
           // Call your authentication API here
           const response = await fetch('YOUR_AUTH_API', {
             method: 'POST',
             body: JSON.stringify(credentials),
             headers: { 'Content-Type': 'application/json' },
           });

           const user = await response.json();

           if (response.ok && user) {
             return user;
           }
           return null;
         },
       }),
     ],
     callbacks: {
       async jwt({ token, user }) {
         // Add tenantId and role to the token
         if (user) {
           token.tenantId = user.tenantId;
           token.role = user.role;
         }
         return token;
       },
       async session({ session, token }) {
         // Add tenantId and role to the session
         if (token) {
           session.user.tenantId = token.tenantId;
           session.user.role = token.role;
         }
         return session;
       },
     },
     session: {
       strategy: 'jwt',
     },
     jwt: {
       // Make sure this matches the JWT_SECRET in your plugin server
       secret: process.env.JWT_SECRET,
     },
   };

   const handler = NextAuth(authOptions);
   export { handler as GET, handler as POST };
   ```

3. Create a custom API client that adds the JWT token to requests:

   ```typescript
   // lib/api-client.ts
   import { getSession, signOut } from 'next-auth/react';

   export async function apiClient(
     endpoint: string,
     options: RequestInit = {},
   ) {
     const session = await getSession();

     if (!session?.accessToken) {
       // Handle unauthenticated state
       return null;
     }

     const headers = {
       'Content-Type': 'application/json',
       Authorization: `Bearer ${session.accessToken}`,
       ...(options.headers || {}),
     };

     const response = await fetch(`/api/plugins/${endpoint}`, {
       ...options,
       headers,
     });

     if (response.status === 401) {
       // Token expired or invalid
       signOut();
       return null;
     }

     return response;
   }
   ```

### Plugin Server Integration

The plugin server now:

1. Validates JWT tokens issued by Next Auth
2. Extracts tenant information from the tokens
3. Applies role-based access control
4. Provides public/private route configuration

To test the integration, you can:

1. Generate a token in your Next.js application using Next Auth
2. Send requests to the plugin server with the token in the Authorization header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## API Endpoints

### Plugin Management

- `GET /plugins/available` - List all available plugins
- `GET /plugins/installed` - List all installed plugins for a tenant
- `POST /plugins/install` - Install a plugin for a tenant
- `POST /plugins/uninstall` - Uninstall a plugin for a tenant
- `PUT /plugins/:id/config` - Update plugin configuration
- `PUT /plugins/:id/status` - Enable/disable a plugin
- `POST /plugins` - Create a new plugin (admin only)
- `PUT /plugins/:id` - Update an existing plugin (admin only)
- `GET /plugins/by-extension-point?point=extension-point-name` - Get plugins that support a specific extension point

### Plugin Bundle Serving

- `GET /plugins/bundles/:pluginId/v:version/:filename` - Serve a specific plugin bundle file
- `GET /plugins/bundles/:objectKey` - Serve a plugin bundle with a legacy path format

### Plugin Marketplace

- `GET /marketplace` - List all plugins in the marketplace
- `GET /marketplace/categories` - List all plugin categories
- `GET /marketplace/:id` - Get details for a specific plugin
- `POST /marketplace` - Publish a new plugin (admin only)
- `DELETE /marketplace/:id` - Remove a plugin (admin only)

### Plugin API Proxy

- `ANY /api/plugin-proxy/:pluginId/*` - Proxy requests to plugin-specific APIs

### Webhooks

- `POST /webhooks/plugins/:pluginId` - Handle webhook events for plugins

## Next.js App Router Integration

To use this plugin server with your Next.js App Router application, create an API client:

```typescript
// lib/plugin-server-api.ts
import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_PLUGIN_SERVER_URL || 'http://localhost:4000';

export const pluginApi = {
  // Get available plugins
  getAvailablePlugins: async () => {
    const response = await axios.get(`${API_BASE_URL}/plugins/available`);
    return response.data;
  },

  // Get installed plugins for a tenant
  getInstalledPlugins: async (tenantId: string) => {
    const response = await axios.get(`${API_BASE_URL}/plugins/installed`, {
      headers: { 'x-tenant-id': tenantId },
    });
    return response.data;
  },

  // Install a plugin
  installPlugin: async (tenantId: string, pluginId: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/plugins/install`,
      { pluginId },
      { headers: { 'x-tenant-id': tenantId } },
    );
    return response.data;
  },

  // Get plugins by extension point
  getPluginsByExtensionPoint: async (extensionPoint: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/plugins/by-extension-point?point=${extensionPoint}`,
    );
    return response.data;
  },
};
```

And create a client-side utility for loading plugins:

```typescript
// lib/plugin-loader.ts
import { lazy } from 'react';

export interface PluginData {
  id: string;
  name: string;
  bundleUrl: string;
  extensionPoints: string[];
  enabled: boolean;
  configuration: Record<string, any>;
}

export async function loadPlugin(bundleUrl: string) {
  try {
    // Dynamically import the bundle
    const module = await import(/* @vite-ignore */ bundleUrl);
    return module.default;
  } catch (error) {
    console.error(`Failed to load plugin from ${bundleUrl}:`, error);
    return null;
  }
}

export function createPluginComponent(
  bundleUrl: string,
  extensionPoint: string,
) {
  return lazy(async () => {
    const plugin = await loadPlugin(bundleUrl);
    if (!plugin || !plugin.extensionPoints[extensionPoint]) {
      throw new Error(
        `Plugin doesn't support extension point: ${extensionPoint}`,
      );
    }

    const Component = plugin.extensionPoints[extensionPoint];
    return { default: Component };
  });
}
```

## Creating Plugins

Plugins should be created using the SDK pattern. Example plugin structure:

```typescript
// my-payment-plugin/src/index.ts
import { definePlugin, registerExtensionPoint } from '@ticketing/plugin-sdk';

// Payment Method Component
const PaymentMethodComponent = ({ onPaymentComplete, amount, currency, ...props }) => {
  // Plugin implementation here
  return (
    <div className="payment-method-container">
      {/* UI implementation */}
    </div>
  );
};

// Admin Settings Component
const AdminSettingsComponent = ({ config, onConfigChange, ...props }) => {
  // Settings UI implementation
  return (
    <div className="admin-settings">
      {/* Settings UI */}
    </div>
  );
};

export default definePlugin({
  name: 'Credit Card Payments',
  version: '1.0.0',
  description: 'Process credit card payments via Stripe',
  category: 'payment',
  metadata: {
    author: 'Payment Solutions Inc',
    priority: 10,
    displayName: 'Credit Card',
    iconUrl: 'https://example.com/credit-card-icon.svg'
  },
  extensionPoints: {
    'payment-methods': PaymentMethodComponent,
    'admin-settings': AdminSettingsComponent,
  }
});
```

## Plugin Bundle Serving

This server provides optimized plugin bundle serving:

1. **Bundle Generation**: Source code is transpiled and bundled using esbuild
2. **Bundle Storage**: Bundles are stored in MinIO with immutable filenames
3. **Versioned URLs**: Bundle URLs include version info for proper caching
4. **Cache Headers**: Appropriate cache headers ensure optimal performance
5. **Streaming Responses**: Bundles are streamed directly from storage

For more information, see the [MinIO Setup Guide](MINIO_SETUP.md).

## Production Considerations

For production use, ensure you:

1. Configure proper authentication for all endpoints
2. Implement robust error handling and logging
3. Set up monitoring and alerting
4. Configure database connection pooling
5. Add rate limiting for API endpoints
6. Use a production-ready MongoDB instance
7. Secure your MinIO instance with proper access policies
8. Deploy with Docker or a similar containerization tool
9. Consider using nginx as a reverse proxy for serving assets

## License

[MIT](LICENSE)
