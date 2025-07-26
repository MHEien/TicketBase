# @ticketbase/api

A robust, production-ready API client package for TicketBase applications. This package provides a unified interface for interacting with the TicketBase API across both admin and storefront applications.

## Features

- 🔧 **Configurable**: Easy setup with custom base URLs and auth providers
- 🔐 **Authentication**: Flexible auth token management
- 🌐 **Universal**: Works in both browser and Node.js environments
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🚀 **Production Ready**: Built for enterprise-grade applications
- 🔍 **Debug Support**: Optional debug logging for development

## Installation

```bash
npm install @ticketbase/api
# or
yarn add @ticketbase/api
# or
pnpm add @ticketbase/api
```

## Quick Start

### Basic Configuration

```typescript
import { configureApiClient, apiClient } from '@ticketbase/api';

// Configure the API client
configureApiClient({
  baseURL: 'https://api.yourapp.com',
  getAuthToken: async () => {
    // Return your auth token here
    return localStorage.getItem('authToken');
  },
  onAuthError: async (error) => {
    // Handle auth errors (e.g., redirect to login)
    console.error('Auth error:', error);
    window.location.href = '/login';
  },
  debug: process.env.NODE_ENV === 'development'
});
```

### Using API Methods

```typescript
import { 
  getDepartments, 
  getEvents, 
  getPages,
  createUser 
} from '@ticketbase/api';

// Get departments for an organization
const departments = await getDepartments('org-123');

// Get events
const events = await getEvents('org-123');

// Get pages
const pages = await getPages('org-123');

// Create a user
const newUser = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  organizationId: 'org-123'
});
```

## Configuration Options

### ApiClientConfig

```typescript
interface ApiClientConfig {
  baseURL: string;
  getAuthToken?: () => Promise<string | null> | string | null;
  onAuthError?: (error: any) => void;
  debug?: boolean;
}
```

- **baseURL**: The base URL for your API server
- **getAuthToken**: Function to retrieve the current auth token
- **onAuthError**: Callback for handling authentication errors
- **debug**: Enable debug logging (default: false)

## Available API Methods

### Authentication
- `checkRefreshToken(refreshToken: string)`
- `getSessionDiagnostics()`
- `cleanupSessions()`

### Users
- `getUsers(organizationId: string)`
- `getUserById(id: string)`
- `createUser(userData: CreateUserRequest)`
- `updateUser(id: string, userData: UpdateUserRequest)`
- `deleteUser(id: string)`

### Departments
- `getDepartments(organizationId: string)`
- `getDepartmentsWithUsers(organizationId: string)`
- `getDepartmentHierarchy(organizationId: string)`
- `createDepartment(department: CreateDepartmentRequest)`
- `updateDepartment(id: string, department: UpdateDepartmentRequest)`
- `deleteDepartment(id: string)`

### Events
- `getEvents(organizationId: string)`
- `getEventById(id: string)`
- `getEventBySlug(slug: string, organizationId: string)`
- `createEvent(event: CreateEventRequest)`
- `updateEvent(id: string, event: UpdateEventRequest)`
- `deleteEvent(id: string)`

### Pages
- `getPages(organizationId: string)`
- `getPageById(id: string)`
- `getPageBySlug(slug: string, organizationId: string)`
- `createPage(page: CreatePageDto)`
- `updatePage(id: string, page: UpdatePageDto)`
- `deletePage(id: string)`

### Activities
- `getActivities(organizationId: string)`
- `createActivity(activity: CreateActivityDto)`

### Analytics
- `getAnalytics(query: AnalyticsQuery)`

## Environment-Specific Setup

### Next.js App Router (Storefront)

```typescript
// lib/api-config.ts
import { configureApiClient } from '@ticketbase/api';
import { getAuthServerFn } from './auth-cookies';

configureApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  getAuthToken: async () => {
    // Server-side: use server function
    if (typeof window === 'undefined') {
      const authData = await getAuthServerFn();
      return authData?.accessToken || null;
    }
    // Client-side: use localStorage or cookies
    return localStorage.getItem('authToken');
  },
  onAuthError: async (error) => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
  debug: process.env.NODE_ENV === 'development'
});
```

### React Admin App

```typescript
// lib/api-config.ts
import { configureApiClient } from '@ticketbase/api';
import { getSession } from './auth-client';

configureApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  getAuthToken: async () => {
    const session = await getSession();
    return session?.accessToken || null;
  },
  onAuthError: async (error) => {
    // Handle logout and redirect
    await logout();
    window.location.href = '/login';
  },
  debug: import.meta.env.DEV
});
```

## TypeScript Support

The package includes comprehensive TypeScript definitions for all API methods and data types:

```typescript
import type { 
  User, 
  Department, 
  Event, 
  Page,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse 
} from '@ticketbase/api';
```

## Error Handling

The package automatically handles common API errors and provides hooks for custom error handling:

```typescript
import { apiClient } from '@ticketbase/api';

try {
  const users = await getUsers('org-123');
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 403) {
    // Handle forbidden
  } else {
    // Handle other errors
  }
}
```

## Debug Mode

Enable debug mode to see detailed logging of API requests and responses:

```typescript
configureApiClient({
  // ... other config
  debug: true
});
```

This will log:
- Request details (URL, method, headers)
- Response details (status, data)
- Auth token retrieval
- Error information

## Contributing

This package is part of the TicketBase monorepo. For development and contribution guidelines, see the main repository documentation.

## License

MIT
