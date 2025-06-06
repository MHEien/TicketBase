import { configureApi } from "@ticketsmonorepo/api-sdk";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create and configure API client
export const setupApiClient = () => {
  return configureApi({
    baseURL: apiBaseUrl,
  });
};

// Export the configured client
export const apiClient = setupApiClient();

// Debug logging function
function debugLog(label: string, data: any) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API Client] ${label}:`, data);
  }
}

// Add request interceptor for debug logging
apiClient.interceptors.request.use(
  async (config) => {
    debugLog("Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
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
