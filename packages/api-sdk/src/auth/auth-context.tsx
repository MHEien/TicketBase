import React, { createContext, useContext, useEffect, useMemo } from "react";
import { AuthService } from "./auth-service";
import type { AuthConfig, AuthContextValue } from "./types";

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
  config?: AuthConfig;
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const auth = useMemo(() => new AuthService(config), []);

  useEffect(() => {
    // Attempt to restore auth state on mount
    auth.restoreAuthState().catch(console.error);
  }, [auth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth.getState(),
      login: auth.login.bind(auth),
      register: auth.register.bind(auth),
      logout: auth.logout.bind(auth),
      refreshTokens: auth.refreshTokens.bind(auth),
      hasPermission: auth.hasPermission.bind(auth),
      hasRole: auth.hasRole.bind(auth),
      restoreAuthState: auth.restoreAuthState.bind(auth),
    }),
    [auth],
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

// Export a hook to get the auth service instance directly
export function useAuthService() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthService must be used within an AuthProvider");
  }
  return context;
}
