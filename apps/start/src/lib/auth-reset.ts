import { signOut } from "./auth";

/**
 * Completely resets the authentication state
 * This clears all tokens, sessions, and local storage
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

    // Sign out from NextAuth
    await signOut({
      query: {
        redirect: false,
        callbackUrl: "/login",
      },
    });

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
