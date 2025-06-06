# Ticket sales platform

_Automatically synced with your [v0.dev](https://v0.dev) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mheiens-projects/v0-ticket-sales-platform)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/thdPxNm00Zp)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/mheiens-projects/v0-ticket-sales-platform](https://vercel.com/mheiens-projects/v0-ticket-sales-platform)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/thdPxNm00Zp](https://v0.dev/chat/projects/thdPxNm00Zp)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Plugin Server Integration

The platform integrates with a separate plugin server for plugin management. To connect to the plugin server:

1. Create a `.env.local` file with the following configuration:

   ```
   # Plugin Server Configuration
   PLUGIN_SERVER_URL=http://localhost:4000
   PLUGIN_SERVER_API_KEY=your-api-key-here

   # Tenant ID for multi-tenant environments
   DEFAULT_TENANT_ID=tenant-001
   ```

2. The plugin submission and upload features will attempt to:
   - Upload plugin bundles to the plugin server's storage
   - Publish plugin metadata to the plugin marketplace
   - Fall back to local storage if the plugin server is not available

The API integration points include:

- Plugin upload: `POST ${PLUGIN_SERVER_URL}/plugins/bundles/upload`
- Plugin publication: `POST ${PLUGIN_SERVER_URL}/marketplace`
- Plugin installation: `POST ${PLUGIN_SERVER_URL}/plugins/install`

For development without a plugin server, the system will save uploads to the local `public/plugins` directory and store submission metadata in `data/plugin-submissions`.
