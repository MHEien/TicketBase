import axios from "axios";
import { getSession } from "next-auth/react";
import { handleTokenRefreshFailure, isTokenRefreshError } from "../auth-utils";

// Create axios instance with base URL from environment variable
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
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

// Debug logging helper
function debugLog(operation: string, details: any) {
  console.group(`🌐 API Client Debug: ${operation}`);
  console.log("Timestamp:", new Date().toISOString());
  console.log("Details:", details);
  console.groupEnd();
}

// Add request interceptor to include auth token and debug logging
apiClient.interceptors.request.use(
  async (config) => {
    // Debug log the request
    debugLog("Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        // Don't log the actual auth token for security
        Authorization: config.headers.Authorization ? "[REDACTED]" : undefined,
      },
      data: config.data,
    });

    // Try to get the session
    const session = await getSession();

    debugLog("Session Check", {
      sessionExists: !!session,
      sessionKeys: session ? Object.keys(session) : [],
      hasAccessToken: !!(session?.accessToken),
      accessTokenLength: session?.accessToken?.length,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      } : null,
    });

    // If we have a session with an access token, add it to the headers
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;

      debugLog("Auth Token Added", {
        hasToken: true,
        tokenLength: session.accessToken.length,
        tokenPreview: session.accessToken.substring(0, 20) + "...",
      });
    } else {
      debugLog("Auth Token Missing", {
        hasToken: false,
        sessionExists: !!session,
        sessionData: session ? {
          keys: Object.keys(session),
          hasUser: !!session.user,
          hasAccessToken: !!session.accessToken,
        } : null,
      });
    }

    return config;
  },
  (error) => {
    debugLog("Request Error", {
      error: error.message,
      config: error.config,
    });
    return Promise.reject(error);
  },
);

// Add response interceptor to handle token refresh errors and debug logging
apiClient.interceptors.response.use(
  (response) => {
    // Debug log successful responses
    debugLog("Response Success", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data)
        ? response.data.length
        : undefined,
      headers: response.headers,
    });

    return response;
  },
  async (error) => {
    // Debug log error responses
    debugLog("Response Error", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      errorMessage: error.message,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
    });

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
      debugLog("Token Refresh Error", {
        shouldRedirect,
        requestPath,
        responseData: error.response?.data,
      });

      // Handle token refresh failure by logging out and redirecting
      if (typeof window !== "undefined") {
        await handleTokenRefreshFailure(error);
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
