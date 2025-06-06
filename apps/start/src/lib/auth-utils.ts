import { getSession, signOut } from "./auth";

// These functions are now provided directly by the auth service,
// but we'll keep this file as a central place for auth utilities
// and to maintain backward compatibility

export { hasPermission, hasRole, isAuthenticated } from "./auth";

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Completely resets the authentication state
 */
export async function resetAuthState(): Promise<void> {
  try {
    // Clear any debug tokens from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("debug_refresh_token");
      localStorage.removeItem("nextauth.message");

      // Clear any other auth-related items
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("auth") || key.includes("token")) {
          localStorage.removeItem(key);
        }
      });

      // Clear session storage as well
      sessionStorage.clear();
    }

    // Sign out
    await signOut();

    console.log("Authentication state reset successfully");

    // Force a page reload to ensure clean state
    if (typeof window !== "undefined") {
      window.location.href = "/login?reset=true";
    }
  } catch (error) {
    console.error("Error resetting auth state:", error);

    // Force reload even if there's an error
    if (typeof window !== "undefined") {
      window.location.href = "/login?reset=error";
    }
  }
}

/**
 * Checks if the current session has errors that require a reset
 */
export function shouldResetAuth(session: any): boolean {
  if (!session) return false;

  const errorStates = [
    "MaxRefreshAttemptsExceeded",
    "InvalidRefreshToken",
    "RefreshAccessTokenError",
  ];

  return errorStates.includes(session.error);
}

/**
 * Handles token refresh failures by clearing the session and redirecting to login
 * @param error The error message or object
 * @param redirectToLogin Whether to redirect to login page
 */
export async function handleTokenRefreshFailure(
  error: any,
  redirectToLogin = true,
): Promise<void> {
  console.error("Token refresh failed:", error);

  // Don't redirect on diagnostic pages
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/auth-diagnostics")) {
      console.log("On diagnostics page, not redirecting");
      return;
    }
  }

  // Clear the session
  await signOut();

  // Optionally redirect to login page
  if (redirectToLogin && typeof window !== "undefined") {
    window.location.href = "/login?error=session_expired";
  }
}

/**
 * Check if an error is a token refresh error
 */
export function isTokenRefreshError(error: any): boolean {
  if (!error) return false;

  const refreshErrors = [
    "MaxRefreshAttemptsExceeded",
    "InvalidRefreshToken",
    "RefreshAccessTokenError",
    "TokenExpiredError",
  ];

  return (
    refreshErrors.includes(error.code) ||
    refreshErrors.includes(error.name) ||
    (error.message && refreshErrors.some((e) => error.message.includes(e)))
  );
}
