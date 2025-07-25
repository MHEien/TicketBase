import axios from "axios";
import { getSession } from "@/lib/auth-client";

/**
 * Special API client for diagnostics that doesn't redirect on auth failures
 */
const diagnosticClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
diagnosticClient.interceptors.request.use(
  async (config) => {
    // Try to get the session
    const session = await getSession();

    // If we have a session with an access token, add it to the headers
    if (session?.session.token) {
      config.headers.Authorization = `Bearer ${session.session.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// No response interceptor for redirects - just pass through errors

export { diagnosticClient };
