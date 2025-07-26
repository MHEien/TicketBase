// Example usage of the updated API client that works on both server and client

import { apiClient } from "./api-client";

/**
 * Example function that works on both server and client
 * The API client will automatically handle authentication for both environments
 */
export async function fetchUserProfile(userId: string) {
  try {
    // This will work on both server and client:
    // - Server: Uses server cookie auth via getAuthServerFn()
    // - Client: Uses session auth via getSession() with fallbacks
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}

/**
 * Example server route usage
 */
export async function exampleServerRoute() {
  // When called from a server route, the API client will:
  // 1. Use process.env.API_URL for the base URL
  // 2. Get auth token from server cookie via getAuthServerFn()
  // 3. Not trigger client-side redirects on auth errors
  
  const users = await apiClient.get("/users");
  return users.data;
}

/**
 * Example client component usage
 */
export async function exampleClientUsage() {
  // When called from client code, the API client will:
  // 1. Use import.meta.env.VITE_API_URL for the base URL
  // 2. Get auth token from session via getSession()
  // 3. Fall back to client cookies if session is unavailable
  // 4. Handle auth errors with redirects
  
  const profile = await apiClient.get("/auth/session");
  return profile.data;
} 