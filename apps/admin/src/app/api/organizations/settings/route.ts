import { createServerFileRoute } from "@tanstack/react-start/server";
import { getSession } from "@/lib/auth-client";

// Configure API URL based on environment
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Get organization settings
export const ServerRoute = createServerFileRoute(
  "/api/organizations/settings",
).methods({
  GET: async ({ request }) => {
    try {
      const session = await getSession();

      // Ensure the user is authenticated
      if (!session?.user || !session.accessToken) {
        return Response.json(
          { message: "Authentication required" },
          { status: 401 },
        );
      }

      // Get the user's organization ID from the session
      const userId = session.user.id;

      // First, get the user profile to find their organization
      const userResponse = await fetch(`${apiBaseUrl}/auth/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        return Response.json(
          { message: "Failed to fetch user data" },
          { status: userResponse.status },
        );
      }

      const userData = await userResponse.json();
      console.log(
        "🔍 Debug - User data from /auth/session:",
        JSON.stringify(userData, null, 2),
      );

      const organizationId = userData.organizationId;
      console.log("🔍 Debug - Organization ID extracted:", organizationId);

      if (!organizationId) {
        console.error("❌ Organization ID not found in user data:", userData);
        return Response.json(
          { message: "Organization ID not found", userData }, // Include userData for debugging
          { status: 400 },
        );
      }

      // Fetch organization details
      const response = await fetch(
        `${apiBaseUrl}/api/organizations/${organizationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      );

      if (!response.ok) {
        return Response.json(
          { message: "Failed to fetch organization settings" },
          { status: response.status },
        );
      }

      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error("Error fetching organization settings:", error);
      return Response.json(
        { message: "Failed to fetch organization settings" },
        { status: 500 },
      );
    }
  },
  PATCH: async ({ request }) => {
    try {
      const session = await getSession();

      // Ensure the user is authenticated
      if (!session?.user || !session.accessToken) {
        return Response.json(
          { message: "Authentication required" },
          { status: 401 },
        );
      }

      // Get request body
      const body = await request.json();

      // Get the user's organization ID from the session by fetching the user profile
      const userResponse = await fetch(`${apiBaseUrl}/auth/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        return Response.json(
          { message: "Failed to fetch user data" },
          { status: userResponse.status },
        );
      }

      const userData = await userResponse.json();
      console.log(
        "🔍 Debug PATCH - User data from /auth/session:",
        JSON.stringify(userData, null, 2),
      );

      const organizationId = userData.organizationId;
      console.log(
        "🔍 Debug PATCH - Organization ID extracted:",
        organizationId,
      );

      if (!organizationId) {
        console.error(
          "❌ PATCH - Organization ID not found in user data:",
          userData,
        );
        return Response.json(
          { message: "Organization ID not found", userData }, // Include userData for debugging
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
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            name: body.name,
            email: body.email,
            phone: body.phone,
            website: body.website,
            logo: body.logo,
            favicon: body.favicon,
            checkoutMessage: body.checkoutMessage,
          }),
        },
      );

      if (!response.ok) {
        return Response.json(
          { message: "Failed to update organization settings" },
          { status: response.status },
        );
      }

      const data = await response.json();
      return Response.json({
        message: "Organization settings updated successfully",
        data,
      });
    } catch (error) {
      console.error("Error updating organization settings:", error);
      return Response.json(
        { message: "Failed to update organization settings" },
        { status: 500 },
      );
    }
  },
});
