# Architecture

This document provides a detailed overview of the technical architecture of the TicketBase platform.

## System Overview

The platform is designed as a set of loosely coupled microservices that communicate with each other through a well-defined API gateway. This approach allows for independent development, deployment, and scaling of different parts of the system.

## Microservices

- **API Gateway**: The single entry point for all client requests.
- **Main API Server**: A NestJS application that handles core business logic, user management, and event data. It runs on port 4000 and connects to a PostgreSQL database using TypeORM. The application is highly modular, with specific business domains encapsulated in their own modules (e.g., `Auth`, `Users`, `Events`, `Payments`).
- **Plugin Server**: Manages the plugin ecosystem, allowing for third-party integrations. (Port 5000)

### Event Management Logic

The `EventsService` encapsulates the core business logic for event management. Its key responsibilities include:

- **Data Validation**: Enforcing business rules, such as preventing the deletion of events with sold tickets and requiring at least one ticket type before an event can be published.
- **Lifecycle Management**: Managing the status of events through a defined lifecycle (e.g., `DRAFT`, `PUBLISHED`, `CANCELLED`).
- **Activity Logging**: Recording all significant actions (create, update, delete, publish, cancel) in an activity log for auditing and tracking purposes.
- **Database Interaction**: Handling all database operations for events and their associated ticket types using TypeORM.

### Plugin System Architecture

The plugin system is a cornerstone of the TicketBase platform, designed for security, extensibility, and ease of development. It follows a sophisticated model that separates configuration, frontend presentation, and secure backend logic.

A plugin consists of three main parts:

1.  **Manifest (`plugin.json`)**: A JSON file that serves as the plugin's identity card. It declares:
    *   **Metadata**: `id`, `name`, `version`, `author`, etc.
    *   **Extension Points**: An array of strings indicating where the plugin injects itself into the platform UI (e.g., `admin-settings`, `payment-methods`).
    *   **Configuration Schema (`configSchema`)**: A JSON Schema object that defines the plugin's configuration options. The platform uses this schema to automatically generate a settings form in the admin panel, validate user input, and determine which fields require encryption.
    *   **Permissions**: The platform permissions the plugin requires (e.g., `read:orders`).
    *   **Build Information**: Entry points and output for the plugin's source code.

2.  **Frontend Components (React)**: The UI of the plugin, written in React. The plugin's entry point (e.g., `index.tsx`) exports a map of React components corresponding to the `extensionPoints` declared in the manifest. These components are dynamically rendered by the host application (e.g., the Admin Panel).

    The platform provides a rich context to these components via props and hooks, including:
    *   `configuration`: The plugin's saved configuration data.
    *   `onSave`: A function the plugin calls to save its configuration. The platform handles the actual saving, including encrypting any fields marked as `sensitive` in the `configSchema`.
    *   `executeAction`: A hook used to securely call backend logic.

3.  **Backend Actions (Node.js)**: For operations that require sensitive data or must be performed securely on a server, plugins can define a `backendActions` object. This object maps action names to `async` functions.

    *   **Execution Environment**: These functions run on the secure Plugin Server (a separate NestJS microservice), not in the user's browser.
    *   **Secure Configuration Access**: Backend actions receive the plugin's decrypted configuration as an argument, allowing them to use sensitive data like API keys.
    *   **Example**: A payment plugin's frontend might collect payment details, then call a `create-checkout-session` backend action. This action, running on the server, would use the secret Stripe API key to create a session and return a session ID to the frontend.

#### Communication Flow

The frontend and backend of a plugin do not communicate directly. The process is proxied and secured by the platform:

1.  A frontend component calls the `executeAction` hook with an action name and parameters.
2.  The platform sends a request to the main API server's `/plugins/:pluginId/actions` endpoint.
3.  The main API server validates the request and proxies it to the dedicated Plugin Server, passing along the user's JWT for authentication.
4.  The Plugin Server finds the plugin, retrieves its decrypted configuration, and executes the corresponding function from the `backendActions` object.
5.  The result is passed back through the proxy to the frontend component.

This architecture allows plugin developers to build powerful integrations without needing to manage backend infrastructure, authentication, or data encryption, as the platform handles these concerns.
- **Analytics Service**: Collects and processes data for reporting and insights.
- **Notification Service**: Manages and sends notifications to users (e.g., email, SMS).

## Plugin System

The plugin system is a cornerstone of the TicketBase platform, designed for maximum flexibility. Third-party integrations are managed as plugins, which can be developed and deployed independently. These plugins are stored in a secure object storage (MinIO) and are loaded by the Plugin Server at runtime.

## Database Schema

*Detailed diagrams and descriptions of the database schemas for PostgreSQL and MongoDB will be added here.*

## Security

The platform employs a robust, token-based authentication system built with Passport.js. The main API server uses JSON Web Tokens (JWT) to secure its endpoints.

### Authentication Flow

1.  **Local Strategy**: Users authenticate with their credentials (e.g., email and password) via a `/login` endpoint.
2.  **Token Issuance**: Upon successful authentication, the server issues two tokens: an `accessToken` and a `refreshToken`.
3.  **JWT Strategy**: The `accessToken` is short-lived and must be included in the `Authorization` header of subsequent requests to access protected resources.
4.  **Refresh Token Strategy**: When the `accessToken` expires, the client can use the long-lived `refreshToken` to obtain a new pair of tokens without requiring the user to log in again.
