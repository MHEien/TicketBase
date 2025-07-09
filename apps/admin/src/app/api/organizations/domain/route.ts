import { createServerFileRoute } from "@tanstack/react-start/server";
import { getSession } from "@/lib/auth-client";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Update organization domain settings
export const ServerRoute = createServerFileRoute("/api/organizations/domain").methods({
  PATCH: async ({ request }) => {
  try {
    const session = await getSession();

    // Ensure the user is authenticated
    if (!session?.user || !session.session.token) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // Get request body
    const body = await request.json();

    // Get the user's organization ID by fetching user profile
    const userResponse = await fetch(`${apiBaseUrl}/auth/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.session.token}`,
      },
    });

    if (!userResponse.ok) {
      return Response.json(
        { message: "Failed to fetch user data" },
        { status: userResponse.status },
      );
    }

    const userData = await userResponse.json();
    const organizationId = userData.organizationId;

    if (!organizationId) {
      return Response.json(
        { message: "Organization ID not found" },
        { status: 400 },
      );
    }

    // Update organization details via API
    const response = await fetch(
      `${apiBaseUrl}/api/organizations/${organizationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session.token}`,
        },
        body: JSON.stringify({
          customDomain: body.customDomain,
        }),
      },
    );

    if (!response.ok) {
      return Response.json(
        { message: "Failed to update domain settings" },
        { status: response.status },
      );
    }

    // Generate a domain verification token
    // In a real implementation, this might be done on the backend
    if (body.customDomain && body.customDomain !== "") {
      // If domain is set, generate a verification token and update it
      const verificationToken = crypto.randomUUID();

      const verifyResponse = await fetch(
        `${apiBaseUrl}/api/organizations/${organizationId}/domain-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.token}`,
          },
          body: JSON.stringify({
            domainVerificationToken: verificationToken,
          }),
        },
      );

      if (!verifyResponse.ok) {
        console.error("Failed to update domain verification token");
      }
    }

    const data = await response.json();
    return Response.json({
      message: "Domain settings updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error updating domain settings:", error);
    return Response.json(
      { message: "Failed to update domain settings" },
      { status: 500 },
    );
  }
}
});
