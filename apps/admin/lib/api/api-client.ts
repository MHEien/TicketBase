import axios from "axios";
import { getSession } from "next-auth/react";
import { handleTokenRefreshFailure, isTokenRefreshError } from "../auth-utils";

// Create axios instance with base URL from environment variable
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Paths that should not trigger auto-redirect on auth failure
const noRedirectPaths = [
  "/auth/check-token",
  "/auth/session-info",
  "/auth/cleanup-sessions",
];

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Try to get the session
    const session = await getSession();

    // If we have a session with an access token, add it to the headers
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle token refresh errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Check if the request URL is in the noRedirectPaths list
    const requestPath = error.config?.url;
    const shouldRedirect = !noRedirectPaths.some(
      (path) => requestPath && requestPath.includes(path),
    );

    // Check if this is a token refresh error
    if (
      error.response?.status === 401 &&
      isTokenRefreshError(error.response?.data) &&
      shouldRedirect
    ) {
      // Handle token refresh failure by logging out and redirecting
      if (typeof window !== "undefined") {
        await handleTokenRefreshFailure(error);
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
