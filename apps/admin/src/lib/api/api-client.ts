import axios from "axios";
import { getSession } from "@/lib/auth-client";
import { handleTokenRefreshFailure, isTokenRefreshError } from "../auth-utils";
import { getAuthServerFn, getAuthFromClientCookie } from "../auth-cookies";

// Helper function to get the correct API base URL for the environment
function getApiBaseUrl(): string {
  // For server-side, use environment variable or default
  if (typeof window === "undefined") {
    return process.env.VITE_API_URL || process.env.API_URL || "http://localhost:4000";
  }
  // For client-side, use Vite environment variable
  return import.meta.env.VITE_API_URL || "http://localhost:4000";
}

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
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
  console.log("Environment:", typeof window === "undefined" ? "server" : "client");
  console.log("Details:", details);
  console.groupEnd();
}

// Helper function to get auth headers for both server and client environments
async function getAuthHeaders(): Promise<{ Authorization?: string }> {
  let accessToken: string | null = null;

  // Server-side: Try to get auth from server cookie first
  if (typeof window === "undefined") {
    try {
      const authData = await getAuthServerFn();
      accessToken = authData?.accessToken || null;
      
      debugLog("Server Auth Check", {
        hasAuthData: !!authData,
        hasAccessToken: !!authData?.accessToken,
        userId: authData?.userId,
        tokenLength: authData?.accessToken?.length,
      });
    } catch (error) {
      console.error("Error getting auth from server cookie:", error);
    }
  } else {
    // Client-side: Try to get session from existing auth client
    try {
      const session = await getSession();
      accessToken = session?.accessToken || null;

      debugLog("Client Auth Check", {
        sessionExists: !!session,
        hasAccessToken: !!session?.accessToken,
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
            }
          : null,
      });

      // Fallback to client cookie if session doesn't have token
      if (!accessToken) {
        accessToken = getAuthFromClientCookie();
        
        debugLog("Client Cookie Fallback", {
          hasToken: !!accessToken,
          tokenLength: accessToken?.length,
        });
      }
    } catch (error) {
      console.error("Error getting auth from client session:", error);
      
      // Final fallback to client cookie
      try {
        accessToken = getAuthFromClientCookie();
        
        debugLog("Client Cookie Final Fallback", {
          hasToken: !!accessToken,
          tokenLength: accessToken?.length,
        });
      } catch (cookieError) {
        console.error("Error getting auth from client cookie:", cookieError);
      }
    }
  }

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
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
      environment: typeof window === "undefined" ? "server" : "client",
    });

    // Get auth headers for the current environment
    const authHeaders = await getAuthHeaders();

    // Add auth headers if available
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;

      debugLog("Auth Token Added", {
        hasToken: true,
        tokenPreview: authHeaders.Authorization.substring(0, 20) + "...",
        environment: typeof window === "undefined" ? "server" : "client",
      });
    } else {
      debugLog("Auth Token Missing", {
        hasToken: false,
        environment: typeof window === "undefined" ? "server" : "client",
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
      environment: typeof window === "undefined" ? "server" : "client",
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
      environment: typeof window === "undefined" ? "server" : "client",
    });

    // Check if the request URL is in the noRedirectPaths list
    const requestPath = error.config?.url;
    const shouldRedirect = !noRedirectPaths.some(
      (path) => requestPath && requestPath.includes(path),
    );

    // Check if this is a token refresh error (only handle on client-side)
    if (
      error.response?.status === 401 &&
      isTokenRefreshError(error.response?.data) &&
      shouldRedirect &&
      typeof window !== "undefined" // Only handle redirects on client-side
    ) {
      debugLog("Token Refresh Error", {
        shouldRedirect,
        requestPath,
        responseData: error.response?.data,
        environment: "client",
      });

      // Handle token refresh failure by logging out and redirecting
      await handleTokenRefreshFailure(error);
    }
    return Promise.reject(error);
  },
);

export { apiClient };
