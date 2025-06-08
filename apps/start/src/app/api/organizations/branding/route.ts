import { ServerAuthService, AuthControllerClient } from "@repo/api-sdk";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Initialize services
const authService = new ServerAuthService(apiBaseUrl);

// Update organization branding settings
export async function PATCH(request: Request) {
  try {
    // Get request body
    const body = await request.json();

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
        { message: "No organization found" },
        { status: 404 },
      );
    }

    // Update organization branding via user settings
    await AuthControllerClient.updateUserSettings({
      data: {
        organizationSettings: body.settings,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return Response.json({
      message: "Branding settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating branding settings:", error);
    return Response.json(
      { message: "Failed to update branding settings" },
      { status: 500 },
    );
  }
}
