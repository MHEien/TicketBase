import React, { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthProviderProps } from './auth-provider';
import { ApiClient, ApiClientConfig } from './api-client';
import { setGlobalApiClient } from './mutator-instance';

export interface ApiProviderConfig extends ApiClientConfig {
  // React Query configuration
  queryClient?: QueryClient;
  defaultOptions?: {
    queries?: {
      staleTime?: number;
      gcTime?: number; // Renamed from cacheTime in React Query v5
      retry?: boolean | number;
      refetchOnWindowFocus?: boolean;
      refetchOnMount?: boolean;
    };
    mutations?: {
      retry?: boolean | number;
    };
  };
  
  // Auth configuration
  auth?: Omit<AuthProviderProps, 'children' | 'apiClient'>;
  
  // Environment detection
  isServer?: boolean;
}

export interface ApiProviderProps extends ApiProviderConfig {
  children: ReactNode;
}

// Default query client configuration
const createDefaultQueryClient = (options?: ApiProviderConfig['defaultOptions']) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors except for 408, 429
          if (error?.status && error.status >= 400 && error.status < 500) {
            return error.status === 408 || error.status === 429;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        ...options?.queries,
      },
      mutations: {
        retry: (failureCount, error: any) => {
          // Don't retry mutations on 4xx errors
          if (error?.status && error.status >= 400 && error.status < 500) {
            return false;
          }
          // Retry up to 2 times for 5xx errors
          return failureCount < 2;
        },
        ...options?.mutations,
      },
    },
  });
};

// Server-side safe QueryClient
const createServerQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity, // Renamed from cacheTime
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

export const ApiProvider: React.FC<ApiProviderProps> = ({
  children,
  queryClient: providedQueryClient,
  defaultOptions,
  auth,
  isServer = typeof window === 'undefined',
  ...apiClientConfig
}) => {
  // Create API client instance
  const apiClient = useMemo(() => {
    const client = new ApiClient(apiClientConfig);
    // Set as global instance for the generated API hooks
    setGlobalApiClient(client);
    return client;
  }, [apiClientConfig]);

  // Create or use provided query client
  const queryClient = useMemo(() => {
    if (providedQueryClient) {
      return providedQueryClient;
    }
    
    if (isServer) {
      return createServerQueryClient();
    }
    
    return createDefaultQueryClient(defaultOptions);
  }, [providedQueryClient, defaultOptions, isServer]);

  // If server-side, don't include auth provider
  if (isServer) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  // Client-side with full functionality
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider 
        apiClient={apiClient}
        {...auth}
      >
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Hook to get the current API client from context
export const useApiClient = (): ApiClient => {
  // This will return the globally set API client
  const { getGlobalApiClient } = require('./mutator-instance');
  return getGlobalApiClient();
};

// Server-side utility for creating an API client with a token
export const createServerApiClient = (accessToken?: string, config?: ApiClientConfig): ApiClient => {
  return new ApiClient({
    ...config,
    getAccessToken: () => accessToken || null,
  });
};

// Utility for creating a query client for server-side rendering
export const createSSRQueryClient = (): QueryClient => {
  return createServerQueryClient();
};

// Type exports for convenience
export type { ApiClient, ApiClientConfig } from './api-client';
export type { 
  AuthContextValue, 
  User, 
  AuthTokens, 
  AuthState,
  RegisterData 
} from './auth-provider'; 