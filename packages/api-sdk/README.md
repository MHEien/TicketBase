# API SDK

A comprehensive, type-safe API SDK for the eTickets platform with built-in authentication, error handling, and React Query integration.

## Features

- **🔒 Built-in Authentication** - Automatic token management, refresh, and storage
- **⚡ React Query Integration** - Optimized caching, background updates, and synchronization
- **🔄 Automatic Retries** - Smart retry logic for network failures and server errors
- **🛡️ Type Safety** - Full TypeScript support with auto-generated types
- **🌐 Universal** - Works in both client-side and server-side environments
- **🧪 MSW Integration** - Built-in mocking support for testing
- **📦 Tree Shakeable** - Import only what you need

## Installation

The SDK is already installed as part of the monorepo. For external projects:

```bash
npm install @repo/api-sdk
```

## Quick Start

### Client-Side Setup (React)

```tsx
import { ApiProvider, setupApiSdk } from '@repo/api-sdk/client';
import { useAuth, useEventsControllerFindAll } from '@repo/api-sdk/client';

function App() {
  return (
    <ApiProvider {...setupApiSdk({ baseURL: 'https://api.example.com' })}>
      <Dashboard />
    </ApiProvider>
  );
}

function Dashboard() {
  const { isAuthenticated, login, user } = useAuth();
  const { data: events, isLoading } = useEventsControllerFindAll({});

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {isLoading ? (
        <div>Loading events...</div>
      ) : (
        <EventsList events={events} />
      )}
    </div>
  );
}
```

### Server-Side Setup (Next.js API Routes)

```ts
import { setupServerSdk } from '@repo/api-sdk/client';

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const { apiClient } = setupServerSdk(token);
  
  try {
    const events = await apiClient.get('/api/events');
    return Response.json(events);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
```

## Authentication

### Login

```tsx
import { useAuth } from '@repo/api-sdk/client';

function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // User is now authenticated
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
    </form>
  );
}
```

### Protected Routes

```tsx
import { withAuth } from '@repo/api-sdk/client';

const ProtectedComponent = withAuth(({ data }) => {
  return <div>This content requires authentication</div>;
});

// Or using the hook
function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Protected content</div>;
}
```

### Logout

```tsx
import { useAuth } from '@repo/api-sdk/client';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

## API Usage

### Using Generated Hooks

```tsx
import { 
  useEventsControllerFindAll,
  useEventsControllerCreate,
  useAuthControllerLogin 
} from '@repo/api-sdk/client';

function EventsManager() {
  const { 
    data: events, 
    isLoading, 
    error,
    refetch 
  } = useEventsControllerFindAll({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  });

  const createEventMutation = useEventsControllerCreate({
    mutation: {
      onSuccess: () => {
        refetch(); // Refresh the events list
      },
    },
  });

  const handleCreateEvent = (eventData) => {
    createEventMutation.mutate({ data: eventData });
  };

  return (
    <div>
      {isLoading && <div>Loading events...</div>}
      {error && <div>Error: {error.message}</div>}
      {events && (
        <div>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      <CreateEventForm onSubmit={handleCreateEvent} />
    </div>
  );
}
```

### Using the API Client Directly

```tsx
import { useApiClient } from '@repo/api-sdk/client';

function CustomDataFetcher() {
  const apiClient = useApiClient();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get('/api/custom-endpoint');
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [apiClient]);

  return <div>{/* Render data */}</div>;
}
```

## Configuration

### Provider Configuration

```tsx
import { ApiProvider } from '@repo/api-sdk/client';

<ApiProvider
  baseURL="https://api.example.com"
  enableRetry={true}
  maxRetries={3}
  retryDelay={1000}
  auth={{
    autoRefresh: true,
    storageKey: 'custom_auth_key',
    refreshThreshold: 5, // Minutes before expiry to refresh
  }}
  defaultOptions={{
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  }}
>
  <App />
</ApiProvider>
```

### Environment Variables

```env
# Client-side
NEXT_PUBLIC_API_URL=https://api.example.com

# Server-side
API_URL=http://localhost:4000
```

## Error Handling

### Global Error Handling

```tsx
import { ApiProvider } from '@repo/api-sdk/client';

<ApiProvider
  onNetworkError={(error) => {
    console.error('Network error:', error);
    toast.error('Network connection failed');
  }}
  onUnauthorized={(error) => {
    console.error('Unauthorized:', error);
    // Redirect to login page
  }}
>
  <App />
</ApiProvider>
```

### Component-Level Error Handling

```tsx
import { useEventsControllerFindAll } from '@repo/api-sdk/client';

function EventsList() {
  const { data, error, isError } = useEventsControllerFindAll({
    query: {
      onError: (error) => {
        console.error('Failed to load events:', error);
      },
    },
  });

  if (isError) {
    return <div>Error loading events: {error.message}</div>;
  }

  return <div>{/* Events list */}</div>;
}
```

## Testing

### MSW Integration

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/events', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test Event' }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Testing with React Testing Library

```tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventsList } from './EventsList';

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

test('renders events list', async () => {
  renderWithProviders(<EventsList />);
  
  expect(await screen.findByText('Test Event')).toBeInTheDocument();
});
```

## Advanced Usage

### Custom Query Keys

```tsx
import { queryKeys } from '@repo/api-sdk/client';

// Use consistent query keys
const { data } = useQuery({
  queryKey: queryKeys.events.detail('123'),
  queryFn: () => apiClient.get(`/api/events/123`),
});
```

### Server-Side Rendering (Next.js)

```tsx
import { GetServerSideProps } from 'next';
import { setupServerSdk, queryKeys } from '@repo/api-sdk/client';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { apiClient, queryClient } = setupServerSdk();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.events.all(),
    queryFn: () => apiClient.get('/api/events'),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
```

### Custom API Client

```tsx
import { ApiClient, ApiProvider } from '@repo/api-sdk/client';

const customApiClient = new ApiClient({
  baseURL: 'https://api.example.com',
  onTokenExpired: async () => {
    // Custom token refresh logic
  },
  onNetworkError: (error) => {
    // Custom error handling
  },
});

<ApiProvider apiClient={customApiClient}>
  <App />
</ApiProvider>
```

## TypeScript Support

The SDK provides full TypeScript support with auto-generated types:

```tsx
import type { 
  Event, 
  CreateEventDto, 
  EventResponseDto,
  User,
  AuthContextValue 
} from '@repo/api-sdk/client';

function EventForm({ onSubmit }: { onSubmit: (data: CreateEventDto) => void }) {
  // Fully typed form handling
}
```

## Migration from Direct Axios Usage

### Before
```tsx
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000' });

useEffect(() => {
  api.get('/api/events').then(response => {
    setEvents(response.data);
  });
}, []);
```

### After
```tsx
import { useEventsControllerFindAll } from '@repo/api-sdk/client';

const { data: events } = useEventsControllerFindAll({});
```

## Troubleshooting

### Common Issues

1. **Token not being sent**: Make sure `ApiProvider` wraps your components
2. **CORS errors**: Check your API server CORS configuration
3. **TypeScript errors**: Run `npm run generate` to update types
4. **Stale data**: Adjust `staleTime` in query options

### Debug Mode

```tsx
import { ApiProvider } from '@repo/api-sdk/client';

<ApiProvider
  enableRetry={true}
  // Add request/response logging in development
  onNetworkError={(error) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('API Error:', error);
    }
  }}
>
  <App />
</ApiProvider>
```

## Contributing

When adding new endpoints to the API:

1. Update the OpenAPI specification
2. Run `npm run generate` to update the SDK
3. Test the new endpoints
4. Update documentation if needed

## License

MIT
