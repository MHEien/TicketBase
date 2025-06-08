"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { ServerAuthService } from "./server-auth";
import type {
  AuthConfig,
  AuthContextValue,
  AuthState,
  AuthUser,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "./types";
import { Organization } from "../generated/api-client";

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_PREFIX = "auth_";

function getStoredTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}tokens`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredTokens(tokens: AuthTokens | null): void {
  if (typeof window === "undefined") return;

  if (tokens) {
    localStorage.setItem(`${STORAGE_PREFIX}tokens`, JSON.stringify(tokens));
  } else {
    localStorage.removeItem(`${STORAGE_PREFIX}tokens`);
  }
}

export interface AuthProviderProps {
  children: React.ReactNode;
  baseUrl: string;
}

export function AuthProvider({ children, baseUrl }: AuthProviderProps) {
  const serverAuth = useMemo(() => new ServerAuthService(baseUrl), [baseUrl]);

  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: getStoredTokens(),
    isLoading: false,
    error: null,
  });

  const updateState = useCallback((newState: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        updateState({ isLoading: true, error: null });
        const { user, tokens } = await serverAuth.login(credentials);
        setStoredTokens(tokens);
        updateState({ user, tokens, isLoading: false });
      } catch (error) {
        updateState({ error: error as Error, isLoading: false });
        throw error;
      }
    },
    [serverAuth],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      try {
        updateState({ isLoading: true, error: null });
        const { user, tokens } = await serverAuth.register(data);
        setStoredTokens(tokens);
        updateState({ user, tokens, isLoading: false });
      } catch (error) {
        updateState({ error: error as Error, isLoading: false });
        throw error;
      }
    },
    [serverAuth],
  );

  const logout = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      if (state.tokens?.accessToken) {
        await serverAuth.logout(state.tokens.accessToken);
      }
      setStoredTokens(null);
      updateState({ user: null, tokens: null, isLoading: false });
    } catch (error) {
      updateState({ error: error as Error, isLoading: false });
      throw error;
    }
  }, [serverAuth, state.tokens?.accessToken]);

  const refreshTokens = useCallback(async () => {
    try {
      if (!state.tokens?.refreshToken)
        throw new Error("No refresh token available");

      const newTokens = await serverAuth.refreshTokens(
        state.tokens.refreshToken,
      );
      setStoredTokens(newTokens);
      updateState({ tokens: newTokens });

      return newTokens;
    } catch (error) {
      setStoredTokens(null);
      updateState({ tokens: null, user: null });
      throw error;
    }
  }, [serverAuth, state.tokens?.refreshToken]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return state.user?.permissions?.includes(permission) ?? false;
    },
    [state.user?.permissions],
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return state.user?.role === role;
    },
    [state.user?.role],
  );

  // Initial auth state restoration
  useEffect(() => {
    const restoreAuth = async () => {
      const tokens = getStoredTokens();
      if (!tokens?.accessToken) {
        return;
      }

      try {
        updateState({ isLoading: true });
        const user = await serverAuth.getSession(tokens.accessToken);
        updateState({ user, isLoading: false });
      } catch (error) {
        setStoredTokens(null);
        updateState({ user: null, tokens: null, isLoading: false });
      }
    };

    restoreAuth();
  }, [serverAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      refreshTokens,
      hasPermission,
      hasRole,
    }),
    [state, login, register, logout, refreshTokens, hasPermission, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export hooks for common auth operations
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated() {
  const { user, tokens } = useAuth();
  return !!user && !!tokens?.accessToken;
}

export function useHasPermission(permission: string) {
  const auth = useAuth();
  return auth.hasPermission(permission);
}

export function useHasRole(role: string) {
  const auth = useAuth();
  return auth.hasRole(role);
}

export function useSession() {
  const { user, tokens } = useAuth();
  return { user, tokens };
}
