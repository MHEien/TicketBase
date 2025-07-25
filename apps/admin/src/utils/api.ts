import { configureApiClient } from "@ticketbase/api";
import { getAuthFromClientCookie } from "../lib/auth-cookies";

export const client = configureApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  getAuthToken: async () => {
    // Get auth token from secure cookies
    return getAuthFromClientCookie();
  },
  onAuthError: async (error) => {
    // Handle auth errors (e.g., redirect to login)
    console.error('Auth error:', error);
    // Clear auth cookie on error
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    window.location.href = '/login';
  },
  debug: import.meta.env.DEV
});
