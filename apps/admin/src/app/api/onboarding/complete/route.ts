import { createServerFileRoute } from "@tanstack/react-start/server";
import { getSession } from "@/lib/auth-client";

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const ServerRoute = createServerFileRoute(
  "/api/onboarding/complete",
).methods({
  POST: async ({ request }) => {
    console.log("=== ONBOARDING COMPLETION STARTED ===");

    try {
      const session = await getSession();

      console.log("Session data:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasAccessToken: !!session?.session.token,
        userId: session?.user?.id,
        fullSession: session,
      });

      // Ensure the user is authenticated
      if (!session?.user || !session.session.token) {
        console.error("Authentication failed - missing session or token");
        return Response.json(
          { message: "Authentication required" },
          { status: 401 },
        );
      }

      const body = await request.json();

      // Get the user details - we already have the user ID from the session
      const userId = session.user.id;

      // Update user profile with the onboarding settings using new endpoint
      // This endpoint handles both user and organization settings
      const userUpdateResponse = await fetch(
        `${apiBaseUrl}/auth/user-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.token}`,
          },
          body: JSON.stringify({
            onboardingCompleted: true,
            onboardingCompletedAt: new Date().toISOString(),
            organizationSettings: {
              details: body.organizationDetails,
              brandSettings: body.brandSettings,
              eventPreferences: body.eventPreferences,
              paymentPreferences: body.paymentDetails,
            },
          }),
        },
      );

      if (!userUpdateResponse.ok) {
        const errorText = await userUpdateResponse.text();
        console.error("Backend error:", userUpdateResponse.status, errorText);
        return Response.json(
          { message: "Failed to update user settings", error: errorText },
          { status: userUpdateResponse.status },
        );
      }

      return Response.json({
        message: "Onboarding completed successfully",
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return Response.json(
        { message: "Failed to complete onboarding" },
        { status: 500 },
      );
    }
  },
});
