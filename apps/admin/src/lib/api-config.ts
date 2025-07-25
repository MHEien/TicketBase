// Configure the external API package to use our admin app's authentication
import { configureApiClient } from "@ticketbase/api";
import { getSession } from "@/lib/auth-client";
import { getAuthFromClientCookie } from "@/lib/auth-cookies";

// Function to get auth token for the API client
async function getAuthToken(): Promise<string | null> {
  try {
    // Try to get session from auth client first
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken;
    }

    // Fallback to client cookie
    const tokenFromCookie = getAuthFromClientCookie();
    return tokenFromCookie;
  } catch (error) {
    console.error("Error getting auth token for API client:", error);
    return null;
  }
}

// Configure the API client with our authentication
export function initializeApiClient() {
  configureApiClient({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    getAuthToken,
    debug: import.meta.env.DEV, // Enable debug in development
    onAuthError: (error) => {
      console.error("API Authentication Error:", error);
      // Could redirect to login page here if needed
    },
  });
}

// Call this function to initialize the API client
initializeApiClient();
