# API Reference

This document provides a detailed reference for the REST APIs used in the TicketBase platform.

## Main API (Port 4000)

The main API is responsible for core functionalities. All routes are prefixed with `/api`.

### API Documentation

A comprehensive OpenAPI (Swagger) documentation is automatically generated and available at the `/api/docs` endpoint. This interactive documentation provides a full list of endpoints, request/response models, and allows for direct API testing.

### Authentication

Authentication is handled using JSON Web Tokens (JWT). To access protected endpoints, you must first obtain an `accessToken` and a `refreshToken` by authenticating through the login endpoint.

### Using the Access Token

The `accessToken` must be sent in the `Authorization` header with the `Bearer` scheme for every request to a secured endpoint:

```
Authorization: Bearer <accessToken>
```

### Token Expiration and Refresh

The `accessToken` has a short lifespan. Once it expires, you must use the `refreshToken` to request a new `accessToken` and `refreshToken` pair from the token refresh endpoint. This allows for persistent sessions without storing user credentials on the client-side.

### Endpoints

This section details the available API endpoints. All endpoints are prefixed with `/api`.

#### Authentication Endpoints

The following endpoints are available under the `/auth` route for handling user authentication.

**`POST /auth/register`**

Registers a new user and creates an associated organization.

- **Request Body**: `RegisterDto`
  - `name` (string, required): User's full name.
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password (min 6 characters).
  - `organizationName` (string, required): Name of the organization.
- **Success Response**: `201 Created` with a `TokenResponseDto` containing `accessToken`, `refreshToken`, and `expiresIn`.

**`POST /auth/login`**

Authenticates a user and returns a `LoginResponseDto` which includes user details and tokens.

- **Request Body**: `LoginDto`
  - `email` (string, required): User's email.
  - `password` (string, required): User's password.
- **Success Response**: `200 OK` with a `LoginResponseDto` containing user info and tokens.

**`POST /auth/refresh`**

Issues a new pair of access and refresh tokens.

- **Request Body**: `RefreshTokenDto`
  - `refreshToken` (string, required): The refresh token issued during login.
- **Success Response**: `200 OK` with a `TokenPair` containing a new `accessToken` and `refreshToken`.

**`POST /auth/logout`**

Invalidates the user's current session by logging them out.

- **Authentication**: Requires a valid `accessToken`.
- **Success Response**: `204 No Content`.

**`GET /auth/session`**

Retrieves the session information for the currently authenticated user.

- **Authentication**: Requires a valid `accessToken`.
- **Success Response**: `200 OK` with the `User` object.

#### Event Management Endpoints

These endpoints are protected and require authentication. They are used for managing events within an organization.

**`POST /events`**

Creates a new event for the user's organization.

- **Authentication**: Requires `accessToken`.
- **Request Body**: `CreateEventDto`.
- **Success Response**: `201 Created` with the newly created `Event` object.

**`GET /events`**

Retrieves a list of events for the user's organization. Supports filtering via query parameters.

- **Authentication**: Requires `accessToken`.
- **Query Parameters**: `status`, `category`, `search`, `startDate`, `endDate`, `upcoming`, `limit`.
- **Success Response**: `200 OK` with an array of `Event` objects.

**`GET /events/:id`**

Retrieves a single event by its ID.

- **Authentication**: Requires `accessToken`.
- **Success Response**: `200 OK` with the `Event` object.

**`PATCH /events/:id`**

Updates an existing event.

- **Authentication**: Requires `accessToken`.
- **Request Body**: `UpdateEventDto`.
- **Success Response**: `200 OK` with the updated `Event` object.

**`POST /events/:id/publish`**

Publishes an event, making it visible to the public.

- **Authentication**: Requires `accessToken`.
- **Success Response**: `200 OK` with the updated `Event` object.

**`POST /events/:id/upload-image`**

Uploads a featured image for an event.

- **Authentication**: Requires `accessToken`.
- **Request Body**: `multipart/form-data` with an `image` file.
- **Success Response**: `201 Created` with the URL of the uploaded image.

#### Public Event Endpoints

These endpoints are public and do not require authentication. They are used by storefronts and other public-facing applications.

**`GET /public/events/by-organization`**

Retrieves all published events for a given organization.

- **Query Parameters**: `organizationId` (required), `category`, `search`, `upcoming`, `featured`, `limit`, `offset`.
- **Success Response**: `200 OK` with an array of `PublicEventDto` objects.

**`GET /public/events/by-organization/:id`**

Retrieves a single published event by its ID for a given organization.

- **Query Parameters**: `organizationId` (required).
- **Success Response**: `200 OK` with a `PublicEventDto` object.

**`GET /public/events/categories`**

Returns a list of available event categories.

- **Success Response**: `200 OK` with an array of strings.

## Plugin Management API (Admin)

The Plugin Management API, served from the `/plugins` endpoint, provides authenticated endpoints for administrators to manage the entire plugin lifecycle. All endpoints require a valid JWT Bearer token.

### Plugin Lifecycle

- `POST /plugins`: Creates a new plugin in the system.
- `POST /plugins/payment`: A specialized endpoint to register a new payment plugin.
- `PATCH /plugins/:id`: Updates an existing plugin's details.
- `PATCH /plugins/:id/deprecate`: Marks a plugin as deprecated.
- `DELETE /plugins/:id`: Removes a plugin from the system.

### Plugin Discovery (Admin)

- `GET /plugins`: Retrieves a list of all plugins, with an optional status filter.
- `GET /plugins/:id`: Retrieves a single plugin by its ID.
- `GET /plugins/category/:category`: Finds plugins by their category.
- `GET /plugins/extension-point/:extensionPoint`: Finds plugins by the extension points they implement.

### Plugin Installation & Configuration (Per-Organization)

- `POST /plugins/install`: Installs a plugin for the authenticated user's organization.
- `DELETE /plugins/:id/uninstall`: Uninstalls a plugin from the organization.
- `PATCH /plugins/:id/enable`: Enables an installed plugin for the organization.
- `PATCH /plugins/:id/disable`: Disables an installed plugin.
- `POST /plugins/:id/configure`: Sets the configuration for an installed plugin.
- `GET /plugins/:id/configure`: Retrieves the configuration for an installed plugin.

### Plugin Storage

- `POST /plugins/storage/upload`: Uploads a plugin bundle to the storage server (e.g., MinIO).

## Public Plugin API

The Public Plugin API, served from the `/public/plugins` endpoint, provides unauthenticated access to plugin information required by the storefront and other public clients.

- `GET /public/plugins/available`: Retrieves a list of all active plugins available for installation, similar to a marketplace listing.
- `GET /public/plugins/organizations/:organizationId/enabled`: Retrieves the enabled plugins for a specific organization. This is crucial for the storefront to know which plugins to render.
- `GET /public/plugins/organizations/:organizationId/payment`: Retrieves the enabled payment plugins for an organization, used during the checkout process.
- `GET /public/plugins/:pluginId/bundle`: Retrieves the bundle URL for a specific plugin, allowing the frontend to load the plugin's code.
- `POST /public/plugins/:pluginId/actions`: Executes a secure backend action for a plugin on behalf of an authenticated user. This is the primary mechanism for the frontend to interact with a plugin's backend logic, for example, to create a payment session.
