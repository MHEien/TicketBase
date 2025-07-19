# Development Guide

This guide provides instructions for setting up the development environment and running the TicketBase platform locally.

## Prerequisites

Make sure you have the following software installed on your system:

-   **Node.js**: Version 18 or higher.
-   **Docker & Docker Compose**: For running backend services.
-   **Bun**: As the primary package manager and runtime.

## Environment Setup

1.  **Clone the Repository**: `git clone <repository-url>`
2.  **Install Dependencies**: From the root of the monorepo, run:
    ```bash
    bun install
    ```
3.  **Environment Variables**: The platform uses `.env` files for configuration. You will need to create a `.env` file in the root of the following packages/apps based on their `.env.example` files:
    -   `apps/api`
    -   `apps/plugins`

    These files contain critical variables such as database connection strings and JWT secrets.

## Running the Platform

The platform is composed of several services and applications that need to be run concurrently.

### 1. Start Backend Services

All stateful services (PostgreSQL, MongoDB, Redis, MinIO) are managed with Docker Compose.

```bash
docker-compose up -d
```

This will start the services in the background. You can view their logs with `docker-compose logs -f`.

### 2. Run Applications

The entire suite of applications can be run in development mode using Turborepo from the root of the project.

```bash
# Run all apps (api, admin, storefront, etc.)
bun dev
```

To run a specific application, use the `--filter` flag:

```bash
# Run only the admin dashboard
bun dev --filter=admin

# Run only the API server
bun dev --filter=api
```

## Code Quality & Conventions

-   **Linting**: We use ESLint for code quality. Run `bun lint` to check for issues.
-   **Formatting**: We use Prettier for code formatting. It is recommended to set up your editor to format on save.
-   **Type Checking**: Run `bun typecheck` to validate TypeScript types across the entire monorepo.

## Creating a Plugin: A Step-by-Step Tutorial

This tutorial walks you through creating a simple "Hello World" plugin. It will teach you the fundamental concepts of the plugin architecture, including creating a settings page and executing secure backend logic.

### Step 1: Scaffold Your Plugin

First, create a new directory for your plugin. A good practice is to place it within the `apps` directory.

```bash
# From the monorepo root
mkdir apps/hello-world-plugin
cd apps/hello-world-plugin
```

Inside this directory, create the following basic file structure:

```
hello-world-plugin/
├── package.json
├── plugin.json
├── tsconfig.json
└── src/
    └── index.tsx
```

### Step 2: Define the Manifest (`plugin.json`)

This file is the identity card for your plugin. It tells the platform what your plugin is, where it should appear, and what configuration it needs.

**`plugin.json`**
```json
{
  "id": "hello-world-plugin",
  "name": "Hello World Plugin",
  "version": "1.0.0",
  "description": "A simple example plugin.",
  "author": "Your Name",
  "extensionPoints": [
    "admin-settings"
  ],
  "configSchema": {
    "type": "object",
    "properties": {
      "greeting": {
        "type": "string",
        "title": "Custom Greeting",
        "description": "The greeting to display.",
        "default": "Hello"
      }
    },
    "required": ["greeting"]
  }
}
```

### Step 3: Create the Frontend (`src/index.tsx`)

This file contains the React components for your `extensionPoints`. We will also define our secure backend logic here.

**`src/index.tsx`**
```tsx
import React, { useState } from 'react';
import { useAction } from '@ticketsplatform/plugin-sdk'; // Assuming SDK provides this

// --- Frontend Component for the 'admin-settings' Extension Point ---
const AdminSettingsComponent = (props) => {
  const { configuration, onSave, saving } = props;
  const [greeting, setGreeting] = useState(configuration.greeting || 'Hello');

  // Hook to call our backend action
  const { execute: sayHello, loading, error, data } = useAction('say-hello');

  const handleSave = () => {
    onSave({ greeting });
  };

  const handleSayHello = async () => {
    await sayHello({ name: 'World' });
  };

  return (
    <div>
      <h2>Hello World Plugin Settings</h2>
      <div>
        <label>Greeting:</label>
        <input 
          type="text" 
          value={greeting} 
          onChange={(e) => setGreeting(e.target.value)} 
        />
      </div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>

      <hr style={{ margin: '20px 0' }} />

      <h3>Test Backend Action</h3>
      <button onClick={handleSayHello} disabled={loading}>
        {loading ? 'Pinging...' : 'Ping Backend'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && <p style={{ color: 'green' }}>Backend says: {data.message}</p>}
    </div>
  );
};

// --- Exported Components for Extension Points ---
export const extensionPoints = {
  'admin-settings': AdminSettingsComponent,
};

// --- Exported Secure Backend Logic ---
export const backendActions = {
  'say-hello': async (params, config) => {
    // This code runs on the secure plugin server
    // 'config' is the saved, decrypted configuration
    const message = `${config.greeting}, ${params.name}! The time is ${new Date().toLocaleTimeString()}`;
    return { message };
  },
};
```

### Step 4: Configure the Plugin Package (`package.json`)

Create a minimal `package.json` to identify your plugin as a workspace package.

**`package.json`**
```json
{
  "name": "@my-plugins/hello-world",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.tsx",
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

### Step 5: Run the Platform

Because we are in a monorepo managed by Turborepo, you don't need to do anything else. Simply start the development server from the root of the project.

```bash
# From the monorepo root
bun dev
```

Turborepo will detect the new `hello-world-plugin` package and include it in the build. Navigate to your admin dashboard, find the settings for the "Hello World Plugin", and you should see your component rendered!

## Testing

*Instructions on how to run the test suite for different parts of the application will be added here.*

## API Development

*Guidelines for creating and modifying API endpoints will be included here.*

## Frontend Development

*Information on the frontend architecture, state management, and component design patterns will be added here.*

## Debugging

*Tips and techniques for debugging different services will be provided here.*
