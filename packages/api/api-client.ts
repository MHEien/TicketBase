import axios from "axios";

// Configuration interface for the API client
export interface ApiClientConfig {
  baseURL: string;
  getAuthToken?: () => Promise<string | null> | string | null;
  onAuthError?: (error: any) => void;
  debug?: boolean;
}

// Default configuration
export let apiConfig: ApiClientConfig = {
  baseURL: "http://localhost:4000",
  debug: false,
};

// Function to configure the API client
export function configureApiClient(config: Partial<ApiClientConfig>) {
  apiConfig = { ...apiConfig, ...config };
  
  // Update the axios instance base URL
  apiClient.defaults.baseURL = apiConfig.baseURL;
}

// Helper function to get the API base URL from configuration
function getApiBaseUrl(): string {
  return apiConfig.baseURL;
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

// Helper function to get auth headers using the configured auth provider
async function getAuthHeaders(): Promise<{ Authorization?: string }> {
  if (!apiConfig.getAuthToken) {
    return {};
  }

  try {
    const accessToken = await apiConfig.getAuthToken();
    
    if (apiConfig.debug) {
      debugLog("Auth Token Retrieved", {
        hasToken: !!accessToken,
        tokenLength: accessToken?.length,
      });
    }

    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  } catch (error) {
    if (apiConfig.debug) {
      console.error("Error getting auth token:", error);
    }
    return {};
  }
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
      shouldRedirect &&
      typeof window !== "undefined" // Only handle redirects on client-side
    ) {
      if (apiConfig.debug) {
        debugLog("Auth Error", {
          shouldRedirect,
          requestPath,
          responseData: error.response?.data,
          environment: "client",
        });
      }

      // Call the configured auth error handler if available
      if (apiConfig.onAuthError) {
        await apiConfig.onAuthError(error);
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
