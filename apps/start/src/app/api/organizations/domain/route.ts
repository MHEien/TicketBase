import { ServerAuthService } from "@repo/api-sdk";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Initialize services
const authService = new ServerAuthService(apiBaseUrl);

// Update organization domain settings
export async function PATCH(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // Extract and validate access token
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return Response.json(
        { message: "Invalid authorization token" },
        { status: 401 },
      );
    }

    // Get the user session
    const user = await authService.getSession(accessToken);

    // Ensure the user has an organization
    if (!user.organizationId) {
      return Response.json(
        { message: "Organization ID not found" },
        { status: 400 },
      );
    }

    // Get request body
    const body = await request.json();

    // Update organization details via API
    const response = await fetch(
      `${apiBaseUrl}/api/organizations/${user.organizationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

    // If domain is set, generate and update verification token
    if (body.customDomain && body.customDomain !== "") {
      const verificationToken = generateVerificationToken();

      const verifyResponse = await fetch(
        `${apiBaseUrl}/api/organizations/${user.organizationId}/domain-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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

// Helper function to generate a verification token
function generateVerificationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
