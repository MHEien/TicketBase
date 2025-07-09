// Custom auth client implementation for NestJS backend integration
// Maintains API compatibility with Better Auth while working directly with backend

import {
  authClient as customAuthClient,
  signIn as customSignIn,
  signOut as customSignOut,
  getSession as customGetSession,
} from "./custom-auth";

// Export the custom auth client as the main authClient
export const authClient = customAuthClient;

// Export sign in function that matches NextAuth's signIn API
export const signIn = customSignIn;

// Export sign out function that matches NextAuth's signOut API
export const signOut = customSignOut;

// Export getSession function (equivalent to NextAuth's getSession)
export const getSession = customGetSession;

// Re-export useSession from the custom session provider
export { useSession } from "./custom-session-provider";

export { authClient as default };
