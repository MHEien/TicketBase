import { redirect, createFileRoute } from "@tanstack/react-router";
import { validateSession } from "@repo/api-sdk";
import { DashboardLayout } from "@/components/admin/dashboard-layout";
import { useAppSession } from "@/utils/session";

export const Route = createFileRoute("/admin")({
  /*
  beforeLoad: async () => {
    try {
      // Get the current session to retrieve the access token
      const session = await useAppSession();
      const accessToken = session.data?.accessToken;

      if (!accessToken) {
        throw redirect({
          to: "/login",
          search: {
            error: "session_expired",
          },
        });
      }

      // Call the API with the authorization header
      const response = await authControllerGetSession({
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.status === 401) {
        throw redirect({
          to: "/login",
          search: {
            error: "session_expired",
          },
        });
      }

      return { user: response.data };
    } catch (error) {
      console.error('Admin route auth error:', error);
      // Handle any network or other errors
      throw redirect({
        to: "/login",
        search: {
          error: "auth_error",
        },
      });
    }
  },
  component: DashboardLayout,
});
