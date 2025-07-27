import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/lib/auth-client";

/**
 * Server-side utility to get the current organization ID from the authenticated user
 * This is used in the admin app where organization is determined by user authentication
 */
export const getCurrentOrganizationIdServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    console.log("🏢 Server: Getting current organization ID...");
    const session = await getSession();
    console.log("🏢 Server: Session data:", session);
    console.log("🏢 Server: User data:", session?.user);
    console.log("🏢 Server: Organization ID:", session?.user?.organizationId);
    return session?.user?.organizationId || null;
  } catch (error) {
    console.error("🏢 Server: Error getting current organization ID:", error);
    return null;
  }
});

/**
 * Server-side utility to get the current organization from the authenticated user
 * Returns the full organization data or null if no organization is found
 */
export const getCurrentOrganizationServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const session = await getSession();
    if (!session?.user?.organizationId) {
      return null;
    }

    // If you need the full organization object, you would fetch it here
    // For now, return minimal organization data from the session
    return {
      id: session.user.organizationId,
      // Add other organization fields as needed
    };
  } catch (error) {
    console.error("Error getting current organization:", error);
    return null;
  }
});

/**
 * Direct utility function (non-server function) for use in other server contexts
 * Use this when you're already in a server context and don't need a server function
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.user?.organizationId || null;
  } catch (error) {
    console.error("Error getting current organization ID:", error);
    return null;
  }
}