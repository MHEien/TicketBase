# Plugin System Setup Guide

This guide explains how to set up the plugin system with proper MongoDB and MinIO storage integration.

## Architecture Overview

The plugin system consists of three main components:

1. **Admin App** (Next.js) - Port 3000

   - Plugin submission form
   - Plugin management interface
   - Proxies uploads to plugin server

2. **API Backend** (NestJS) - Port 4000

   - Main application API
   - Proxies plugin requests to plugin server
   - Handles authentication and authorization

3. **Plugin Server** (NestJS) - Port 5000
   - Plugin storage and management
   - MongoDB for plugin metadata
   - MinIO for plugin bundle storage
   - Plugin marketplace API

## Prerequisites

- Node.js v20+
- Docker and Docker Compose
- MongoDB
- MinIO

## Setup Instructions

### 1. Start Infrastructure Services

```bash
# Start MongoDB and MinIO using Docker Compose
docker-compose up -d mongo minio
```

This will start:

- MongoDB on port 27017
- MinIO on port 9000 (API) and 9001 (Console)

### 2. Configure MinIO

1. Access MinIO Console at http://localhost:9001
2. Login with credentials: `minioadmin` / `minioadmin`
3. Create a bucket named `plugin-bundles`
4. Set the bucket policy to allow public read access for plugin bundles

Alternatively, use the MinIO client:

```bash
# Install MinIO client
# See: https://min.io/docs/minio/linux/reference/minio-mc.html

# Configure MinIO client
mc alias set myminio http://localhost:9000 minioadmin minioadmin

# Create bucket
mc mb myminio/plugin-bundles

# Set public read policy
mc anonymous set download myminio/plugin-bundles
```

### 3. Configure Plugin Server

Create a `.env` file in `apps/plugins/`:

```env
# MongoDB Configuration
MONGODB_URI="mongodb://root:example@localhost:27017/plugin-server?authSource=admin"

# Server Configuration
PLUGIN_SERVER_URL=http://localhost:5000
PORT=5000

# Storage Configuration (MinIO)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000
S3_PORT=9000
S3_USE_SSL=false
PLUGIN_ASSETS_BUCKET=plugin-bundles

# JWT Configuration (optional - for authentication)
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
```

Or run the setup script:

```bash
cd apps/plugins
chmod +x setup-env.sh
./setup-env.sh
```

### 4. Configure API Backend

Create a `.env` file in `apps/api/`:

```env
# Server Configuration
PORT=4000

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ticketing

# Plugin Server Configuration
PLUGIN_SERVER_URL=http://localhost:5000

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=900
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=604800

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 5. Configure Admin App

Create a `.env.local` file in `apps/admin/`:

```env
# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000

# Plugin Server Configuration
NEXT_PUBLIC_PLUGIN_SERVER_URL=http://localhost:5000
PLUGIN_SERVER_URL=http://localhost:5000
PLUGIN_SERVER_API_KEY=your-plugin-server-api-key
```

### 6. Install Dependencies and Start Services

```bash
# Install dependencies for all apps
npm install

# Start the plugin server
cd apps/plugins
npm run dev

# In another terminal, start the API backend
cd apps/api
npm run dev

# In another terminal, start the admin app
cd apps/admin
npm run dev
```

## How It Works

### Plugin Submission Flow

1. **User uploads plugin bundle** via admin interface
2. **Admin app** receives file and forwards to plugin server
3. **Plugin server** stores bundle in MinIO and returns URL
4. **User fills out plugin details** and submits form
5. **Admin app** sends complete plugin data to plugin server
6. **Plugin server** saves metadata to MongoDB with status "pending"

### Plugin Storage

- **Plugin bundles**: Stored in MinIO at `plugin-bundles` bucket
- **Plugin metadata**: Stored in MongoDB `plugins` collection
- **Plugin submissions**: Include author info, status, and timestamps

### API Endpoints

#### Plugin Server (Port 5000)

- `POST /plugins/upload` - Upload plugin bundle
- `POST /marketplace` - Submit plugin to marketplace
- `GET /marketplace` - List marketplace plugins
- `GET /plugins/bundles/:path` - Serve plugin bundles

#### API Backend (Port 4000)

- `GET /api/plugins` - List available plugins (proxied)
- `POST /api/plugins/install` - Install plugin for organization
- `GET /api/plugins/installed` - List installed plugins

#### Admin App (Port 3000)

- `POST /api/plugins/upload` - Upload plugin file (proxies to plugin server)
- `POST /api/plugins/submit` - Submit plugin (proxies to plugin server)

## Troubleshooting

### Common Issues

1. **MinIO connection errors**

   - Ensure MinIO is running on port 9000
   - Check bucket exists and has correct permissions
   - Verify AWS credentials in environment

2. **MongoDB connection errors**

   - Ensure MongoDB is running on port 27017
   - Check connection string format
   - Verify database authentication

3. **Plugin upload failures**

   - Check file size limits (5MB max)
   - Verify file extensions (.js, .mjs only)
   - Ensure plugin server is accessible

4. **Port conflicts**
   - Plugin Server: 5000
   - API Backend: 4000
   - Admin App: 3000
   - MongoDB: 27017
   - MinIO: 9000/9001

### Logs and Debugging

- Plugin server logs: Check console output for MinIO and MongoDB connection status
- API backend logs: Check plugin server connectivity
- Admin app logs: Check browser console for upload errors

## Security Considerations

- Use proper JWT secrets in production
- Configure MinIO with proper access policies
- Implement plugin validation and sandboxing
- Use HTTPS in production environments
- Restrict plugin upload permissions to authorized users

## Production Deployment

1. Use environment-specific configuration
2. Set up proper MongoDB replica sets
3. Configure MinIO with proper SSL/TLS
4. Implement proper authentication and authorization
5. Set up monitoring and logging
6. Configure proper CORS policies
7. Use CDN for plugin bundle delivery
