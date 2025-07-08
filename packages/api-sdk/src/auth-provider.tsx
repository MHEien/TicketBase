import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ApiClient } from './api-client';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  organizationId?: string;
  departmentId?: string;
  permissions?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  organizationName?: string;
}

export interface AuthProviderProps {
  children: ReactNode;
  apiClient?: ApiClient;
  storageKey?: string;
  autoRefresh?: boolean;
  refreshThreshold?: number; // Minutes before expiry to refresh
}

// Token storage interface
interface TokenStorage {
  getTokens: () => AuthTokens | null;
  setTokens: (tokens: AuthTokens | null) => void;
  removeTokens: () => void;
}

// Browser storage implementation
class BrowserTokenStorage implements TokenStorage {
  constructor(private storageKey: string) {}

  getTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  setTokens(tokens: AuthTokens | null): void {
    if (tokens) {
      localStorage.setItem(this.storageKey, JSON.stringify(tokens));
    } else {
      this.removeTokens();
    }
  }

  removeTokens(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// Server-side storage implementation (no-op)
class ServerTokenStorage implements TokenStorage {
  getTokens(): AuthTokens | null {
    return null;
  }

  setTokens(): void {
    // No-op on server
  }

  removeTokens(): void {
    // No-op on server
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  apiClient,
  storageKey = 'auth_tokens',
  autoRefresh = true,
  refreshThreshold = 5,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize storage based on environment
  const storage = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return new BrowserTokenStorage(storageKey);
    }
    return new ServerTokenStorage();
  }, [storageKey]);

  // Initialize API client with token getter
  const client = React.useMemo(() => {
    if (apiClient) {
      apiClient.updateConfig({
        getAccessToken: () => state.tokens?.accessToken || null,
        onTokenExpired: () => {
          if (autoRefresh && state.tokens?.refreshToken) {
            refreshAuth();
          } else {
            logout();
          }
        },
        onUnauthorized: () => {
          setState(prev => ({ 
            ...prev, 
            error: 'Authentication failed. Please log in again.' 
          }));
        },
      });
      return apiClient;
    }
    return new ApiClient({
      getAccessToken: () => state.tokens?.accessToken || null,
      onTokenExpired: () => {
        if (autoRefresh && state.tokens?.refreshToken) {
          refreshAuth();
        } else {
          logout();
        }
      },
      onUnauthorized: () => {
        setState(prev => ({ 
          ...prev, 
          error: 'Authentication failed. Please log in again.' 
        }));
      },
    });
  }, [apiClient, state.tokens, autoRefresh]);

  // Check if tokens are expired or about to expire
  const areTokensExpired = useCallback((tokens: AuthTokens): boolean => {
    if (!tokens.expiresAt) return false;
    const now = Date.now();
    const threshold = refreshThreshold * 60 * 1000; // Convert to milliseconds
    return tokens.expiresAt <= now + threshold;
  }, [refreshThreshold]);

  // Load stored tokens on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedTokens = storage.getTokens();
        
        if (storedTokens) {
          if (areTokensExpired(storedTokens)) {
            if (autoRefresh && storedTokens.refreshToken) {
              await refreshTokens(storedTokens.refreshToken);
            } else {
              storage.removeTokens();
              setState(prev => ({ ...prev, isLoading: false }));
            }
          } else {
            setState(prev => ({
              ...prev,
              tokens: storedTokens,
              isAuthenticated: true,
              isLoading: false,
            }));
            
            // Fetch user info
            await fetchUserInfo();
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to load stored auth:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Failed to restore authentication state'
        }));
      }
    };

    loadStoredAuth();
  }, []);

  // Auto-refresh tokens
  useEffect(() => {
    if (!autoRefresh || !state.tokens || !state.isAuthenticated) return;

    const checkAndRefresh = () => {
      if (areTokensExpired(state.tokens!)) {
        refreshAuth();
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, state.tokens, state.isAuthenticated, areTokensExpired]);

  const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
    const response = await client.post<{ accessToken: string; refreshToken: string; expiresIn: number }>('/api/auth/refresh', {
      refreshToken,
    });

    const tokens: AuthTokens = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: Date.now() + (response.expiresIn * 1000),
    };

    storage.setTokens(tokens);
    setState(prev => ({ ...prev, tokens, isAuthenticated: true }));
    
    return tokens;
  };

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const user = await client.get<User>('/api/auth/session');
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await client.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>('/api/auth/login', { email, password });

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + (response.expiresIn * 1000),
      };

      storage.setTokens(tokens);
      setState({
        user: response.user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await client.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>('/api/auth/register', data);

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + (response.expiresIn * 1000),
      };

      storage.setTokens(tokens);
      setState({
        user: response.user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (state.tokens?.accessToken) {
        await client.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      storage.removeTokens();
      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const refreshAuth = async (): Promise<void> => {
    if (!state.tokens?.refreshToken) {
      await logout();
      return;
    }

    try {
      await refreshTokens(state.tokens.refreshToken);
      await fetchUserInfo();
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const updateUser = (userData: Partial<User>): void => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  };

  const contextValue: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for getting access token (useful for server-side)
export const useAccessToken = (): string | null => {
  const { tokens } = useAuth();
  return tokens?.accessToken || null;
};

// HOC for protected routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div>Loading...</div>; // You can customize this loading component
    }
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>; // You can customize this
    }
    
    return <Component {...props} />;
  };
}; 