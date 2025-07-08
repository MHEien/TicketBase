// Main Provider and Setup
export { 
  ApiProvider,
  useApiClient,
  createServerApiClient,
  createSSRQueryClient,
  type ApiProviderProps,
  type ApiProviderConfig
} from './api-provider';

// Authentication
export {
  AuthProvider,
  useAuth,
  useAccessToken,
  withAuth,
  type User,
  type AuthTokens,
  type AuthState,
  type AuthContextValue,
  type RegisterData,
  type AuthProviderProps
} from './auth-provider';

// API Client
export {
  ApiClient,
  defaultApiClient,
  type ApiClientConfig,
  type ApiError
} from './api-client';

// Generated API hooks and types - Re-export everything from the generated index
export * from './index';

// MSW mocks for testing
export * from './index.msw';

// Mutator utilities
export {
  customInstance,
  apiInstance,
  setGlobalApiClient,
  getGlobalApiClient,
  AXIOS_INSTANCE, // For backwards compatibility
  type ErrorType
} from './mutator-instance';

// React Query utilities
export {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseQueryResult,
  type UseMutationResult
} from '@tanstack/react-query';

// Common patterns and utilities

/**
 * Quick setup function for the most common use case
 * @param config Configuration options
 * @example
 * ```tsx
 * import { setupApiSdk } from '@repo/api-sdk/client';
 * 
 * function App() {
 *   return (
 *     <ApiProvider {...setupApiSdk({ baseURL: 'https://api.example.com' })}>
 *       <YourApp />
 *     </ApiProvider>
 *   );
 * }
 * ```
 */
export const setupApiSdk = (config?: {
  baseURL?: string;
  enableDevtools?: boolean;
  auth?: {
    autoRefresh?: boolean;
    storageKey?: string;
  };
}) => {
  return {
    baseURL: config?.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    enableRetry: true,
    maxRetries: 3,
    auth: {
      autoRefresh: true,
      storageKey: 'auth_tokens',
      ...config?.auth,
    },
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
      },
    },
  };
};

/**
 * Server-side setup for Next.js API routes or other server environments
 * @param accessToken Optional access token for authenticated requests
 * @param config Additional configuration
 * @example
 * ```ts
 * import { setupServerSdk } from '@repo/api-sdk/client';
 * 
 * export async function GET(request: Request) {
 *   const token = request.headers.get('authorization')?.replace('Bearer ', '');
 *   const { apiClient } = setupServerSdk(token);
 *   
 *   const data = await apiClient.get('/api/some-endpoint');
 *   return Response.json(data);
 * }
 * ```
 */
export const setupServerSdk = (accessToken?: string, config?: { baseURL?: string }) => {
  // Import dynamically to avoid module resolution issues
  const { createServerApiClient: createApiClient, createSSRQueryClient: createQueryClient } = require('./api-provider');
  
  const apiClient = createApiClient(accessToken, {
    baseURL: config?.baseURL || process.env.API_URL || 'http://localhost:4000',
  });
  
  const queryClient = createQueryClient();
  
  return {
    apiClient,
    queryClient,
  };
};

// Type definitions for common use cases
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
  details?: any;
}

// Common query key factories for consistency
export const queryKeys = {
  auth: {
    session: () => ['auth', 'session'] as const,
    user: () => ['auth', 'user'] as const,
  },
  events: {
    all: () => ['events'] as const,
    list: (filters?: any) => ['events', 'list', filters] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
  },
  tickets: {
    all: () => ['tickets'] as const,
    byEvent: (eventId: string) => ['tickets', 'event', eventId] as const,
  },
  analytics: {
    dashboard: () => ['analytics', 'dashboard'] as const,
    sales: (params?: any) => ['analytics', 'sales', params] as const,
  },
} as const; 