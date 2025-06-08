import { redirect } from "@tanstack/react-router";
import { validateSession } from "@repo/api-sdk";
import { DashboardLayout } from "@/components/admin/dashboard-layout";

export const Route = createFileRoute({
  beforeLoad: async () => {
    const { user, isValid, error } = await validateSession(undefined, "admin");

    if (!isValid) {
      throw redirect({
        to: "/login",
        search: {
          error:
            error === "unauthorized"
              ? "session_expired"
              : (error as "session_expired" | "auth_error"),
        },
      });
    }

    return { user };
  },
  component: DashboardLayout,
});
