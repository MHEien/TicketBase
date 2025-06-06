import {
  AuthService,
  type AuthConfig,
  type AuthUser,
} from "@ticketsmonorepo/api-sdk";
import { useEffect, useState } from "react";
import { apiClient } from "./api/api-client";

// Create auth service instance with configuration
const authConfig: AuthConfig = {
  baseUrl: apiClient.defaults.baseURL?.replace("/api", "") || "",
  storageKeyPrefix: "auth_",
  useSecureCookies: process.env.NODE_ENV === "production",
  enableAutoRefresh: true,
  refreshBeforeExpiration: 60,
  onAuthStateChange: (state) => {
    // This will be used by the useSession hook
    console.debug("Auth state changed:", state);
  },
};

// Export the auth service instance
export const auth = new AuthService(authConfig);

// For backwards compatibility, export the methods as well
export const signUp = auth.register.bind(auth);
export const signIn = auth.login.bind(auth);
export const signOut = auth.logout.bind(auth);
export const getState = auth.getState.bind(auth);
export const getUser = auth.getUser.bind(auth);
export const hasPermission = auth.hasPermission.bind(auth);
export const hasRole = auth.hasRole.bind(auth);
export const isAuthenticated = auth.isAuthenticated.bind(auth);

// Export session methods
export async function getSession() {
  const state = auth.getState();
  if (!state.user || !state.tokens) return null;

  return {
    data: {
      user: {
        ...state.user,
        image: null,
      },
      session: {
        token: state.tokens.accessToken,
      },
    },
    user: {
      ...state.user,
      image: null,
    },
    accessToken: state.tokens.accessToken,
    refreshToken: state.tokens.refreshToken,
    error: state.error?.message,
  };
}

export function useSession() {
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof getSession>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await getSession();
        setSession(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Set up auth state change listener
    const originalOnChange = authConfig.onAuthStateChange;
    authConfig.onAuthStateChange = (state) => {
      originalOnChange?.(state);
      loadSession();
    };

    return () => {
      authConfig.onAuthStateChange = originalOnChange;
    };
  }, []);

  return { data: session, isLoading, error };
}

// Export types
export type { AuthUser as User };
