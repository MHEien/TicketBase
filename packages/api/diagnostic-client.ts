import axios from "axios";
import { apiConfig } from "./api-client";

/**
 * Special API client for diagnostics that doesn't redirect on auth failures
 */
const diagnosticClient = axios.create({
  baseURL: "http://localhost:4000", // Will be updated by configuration
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to configure the diagnostic client
export function configureDiagnosticClient(baseURL: string) {
  diagnosticClient.defaults.baseURL = baseURL;
}

// Add request interceptor to include auth token
diagnosticClient.interceptors.request.use(
  async (config) => {
    // Use the same auth token provider as the main API client
    if (apiConfig.getAuthToken) {
      try {
        const token = await apiConfig.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Silently fail for diagnostic client
        console.warn("Failed to get auth token for diagnostic client:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// No response interceptor for redirects - just pass through errors

export { diagnosticClient };
