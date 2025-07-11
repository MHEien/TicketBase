import { apiClient } from "./api-client";
import { diagnosticClient } from "./diagnostic-client";

/**
 * Checks the status of a refresh token
 */
export async function checkRefreshToken(refreshToken: string): Promise<any> {
  try {
    const response = await diagnosticClient.post("/auth/check-token", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking refresh token:", error);
    throw error;
  }
}

/**
 * Gets diagnostic information about the current session
 */
export async function getSessionDiagnostics(): Promise<any> {
  try {
    // This is a simple route to get session diagnostics
    const response = await diagnosticClient.get("/auth/session-info");
    return response.data;
  } catch (error) {
    console.error("Error getting session diagnostics:", error);
    throw error;
  }
}

/**
 * Cleans up expired or abandoned sessions
 */
export async function cleanupSessions(): Promise<any> {
  try {
    const response = await diagnosticClient.post("/auth/cleanup-sessions");
    return response.data;
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    throw error;
  }
}

/**
 * Saves a backup of refresh token for debugging in dev mode only
 * (This is only for diagnostic purposes and should not be used in production)
 */
export function saveRefreshTokenBackup(refreshToken: string): void {
  if (
    import.meta.env.NODE_ENV !== "production" &&
    typeof window !== "undefined"
  ) {
    localStorage.setItem("debug_refresh_token", refreshToken);
    console.log("Debug: Saved refresh token backup");
  }
}

/**
 * Gets the backup refresh token if available
 * (This is only for diagnostic purposes and should not be used in production)
 */
export function getRefreshTokenBackup(): string | null {
  if (
    import.meta.env.NODE_ENV !== "production" &&
    typeof window !== "undefined"
  ) {
    return localStorage.getItem("debug_refresh_token");
  }
  return null;
}
