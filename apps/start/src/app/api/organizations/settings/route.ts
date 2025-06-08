import { ServerAuthService } from "@repo/api-sdk";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Initialize services
const authService = new ServerAuthService(apiBaseUrl);

// Get organization settings
export async function GET(request: Request) {
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

    // Fetch organization details
    const response = await fetch(
      `${apiBaseUrl}/api/organizations/${user.organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
}

// Update organization settings
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

    // Update organization details
    const response = await fetch(
      `${apiBaseUrl}/api/organizations/${user.organizationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
      }
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
}
