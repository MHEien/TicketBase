# @ticketsmonorepo/api-sdk

A strongly-typed SDK for interacting with the Tickets API, built with React Query and Axios.

## Features

- 🔒 Built-in authentication handling
- 🔄 Automatic token refresh
- 📝 Full TypeScript support
- 🎣 React Query hooks for all API endpoints
- 🌳 Tree-shakeable
- 📦 Modern build setup

## Installation

```bash
bun add @ticketsmonorepo/api-sdk
```

## Configuration

Before using the SDK, you need to configure it with your API settings:

```typescript
import { configureApi } from '@ticketsmonorepo/api-sdk';

configureApi({
  baseURL: 'http://localhost:4000',
  getAccessToken: () => localStorage.getItem('accessToken'),
  onUnauthorized: () => {
    // Handle unauthorized errors (e.g., redirect to login)
  },
});
```

## Usage

### Authentication

```typescript
import { useLoginMutation } from '@ticketsmonorepo/api-sdk';

function LoginComponent() {
  const loginMutation = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };
}
```

### Events

```typescript
import { useEventsQuery, useCreateEventMutation } from '@ticketsmonorepo/api-sdk';

function EventsComponent() {
  // Get all events
  const eventsQuery = useEventsQuery();

  // Create a new event
  const createEventMutation = useCreateEventMutation();

  if (eventsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {eventsQuery.data?.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
}
```

## Development

To update the API client from the latest OpenAPI spec:

```bash
bun run generate
```

To build the SDK:

```bash
bun run build
```

To run in development mode with watch:

```bash
bun run dev
```

## License

Private 