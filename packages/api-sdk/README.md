# API SDK

A powerful, type-safe SDK for interacting with the Tickets API. This SDK provides a seamless integration with the backend services, including authentication, automatic type generation, and React hooks.

## Features

- 🔐 **Built-in Authentication**

  - JWT token management with automatic refresh
  - Role-based and permission-based access control
  - Secure token storage and handling
  - React hooks for auth state management

- 🔄 **Auto-generated API Client**

  - Type-safe API client generated from OpenAPI/Swagger specs
  - Automatic updates when API changes
  - Full TypeScript support
  - React Query integration for data fetching

- ⚛️ **React Integration**

  - React hooks for all API operations
  - Authentication context provider
  - Automatic error handling
  - Loading states management

- 🛡️ **Type Safety**
  - Full TypeScript support
  - Auto-generated types from API specs
  - Runtime type checking
  - Comprehensive type definitions

## Installation

```bash
bun add @tickets/api-sdk
```

## Usage

### Authentication

1. Wrap your app with the `AuthProvider`:

```tsx
import { AuthProvider } from "@tickets/api-sdk";

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

2. Use authentication hooks in your components:

```tsx
import {
  useAuth,
  useIsAuthenticated,
  useHasPermission,
} from "@tickets/api-sdk";

// Login form
function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (credentials) => {
    await login(credentials);
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
}

// Protected component
function ProtectedComponent() {
  const isAuthenticated = useIsAuthenticated();
  const hasAccess = useHasPermission("events.create");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return <YourProtectedContent />;
}
```

### API Client Usage

The SDK provides auto-generated API clients and React hooks for all API endpoints:

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { EventsControllerClient } from "@tickets/api-sdk";

// Using the API client directly
async function fetchEvents() {
  const events = await EventsControllerClient.getEvents();
  return events;
}

// Using with React Query
function EventsList() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => EventsControllerClient.getEvents(),
  });

  if (isLoading) return <Loading />;

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.name}</li>
      ))}
    </ul>
  );
}
```

### Configuration

You can configure the SDK when initializing the `AuthProvider`:

```tsx
const config = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  storageKeyPrefix: "my-app",
  useSecureCookies: true,
  enableAutoRefresh: true,
  refreshBeforeExpiration: 60, // seconds
  onAuthStateChange: (state) => {
    console.log("Auth state changed:", state);
  },
  onError: (error) => {
    console.error("Auth error:", error);
  },
};

function App() {
  return (
    <AuthProvider config={config}>
      <YourApp />
    </AuthProvider>
  );
}
```

## API Reference

### Authentication Hooks

- `useAuth()`: Access the main auth context
- `useUser()`: Get the current user
- `useIsAuthenticated()`: Check if user is authenticated
- `useHasPermission(permission)`: Check if user has a specific permission
- `useHasRole(role)`: Check if user has a specific role

### Auth Service Methods

- `login(credentials)`: Log in a user
- `register(data)`: Register a new user
- `logout()`: Log out the current user
- `refreshTokens()`: Manually refresh auth tokens
- `hasPermission(permission)`: Check permission
- `hasRole(role)`: Check role

### Generated API Clients

The SDK includes auto-generated clients for all API endpoints. These are organized by controller:

- `EventsControllerClient`
- `AuthControllerClient`
- `UsersControllerClient`
- `OrdersControllerClient`
- etc.

Each client provides type-safe methods corresponding to API endpoints.

## Development

### Updating API Types

The SDK's API clients and types are automatically generated from the OpenAPI/Swagger specification. To update them:

1. Ensure the API is running and up-to-date
2. Run the generation script:

```bash
bun run generate
```

### Running Tests

```bash
bun test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
