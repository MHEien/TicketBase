import { auth } from "./auth";
import { signOut } from "next-auth/react";

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.permissions) {
    return false;
  }

  return session.user.permissions.includes(permission);
}

/**
 * Check if a user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.role) {
    return false;
  }

  return session.user.role === role;
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
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
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/auth-diagnostics')) {
      console.log('On diagnostics page, not redirecting');
      return;
    }
  }

  // Clear the session
  await signOut({ redirect: false });

  // Optionally redirect to login page
  if (redirectToLogin) {
    window.location.href = "/login?error=session_expired";
  }
}

/**
 * Check if the error is a token refresh error
 * @param error The error to check
 */
export function isTokenRefreshError(error: any): boolean {
  if (!error) return false;

  // Check different ways the error might be structured
  if (typeof error === "string") {
    return (
      error.includes("refresh token") ||
      error.includes("RefreshAccessTokenError") ||
      error.includes("401") ||
      error.includes("Unauthorized")
    );
  }

  if (error.message) {
    return isTokenRefreshError(error.message);
  }

  return false;
}
