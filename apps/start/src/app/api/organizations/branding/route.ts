import { getSession } from "@/lib/auth";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Update organization branding settings
export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    // Ensure the user is authenticated
    if (!session?.data?.user || !session.data?.session.token) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // Get request body
    const body = await request.json();

    // Get the user's organization ID
    const userId = session.data.user.id;

    // Update organization branding via user settings
    const response = await fetch(`${apiBaseUrl}/auth/user-settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.session.token}`,
      },
      body: JSON.stringify({
        organizationSettings: body.settings,
      }),
    });

    if (!response.ok) {
      return Response.json(
        { message: "Failed to update branding settings" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json({
      message: "Branding settings updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error updating branding settings:", error);
    return Response.json(
      { message: "Failed to update branding settings" },
      { status: 500 },
    );
  }
}
