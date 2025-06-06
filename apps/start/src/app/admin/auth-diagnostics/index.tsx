import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth";
import { resetAuthState, shouldResetAuth } from "@/lib/auth-reset";

export const Route = createFileRoute({
  component: AuthDiagnosticsPage,
});

function AuthDiagnosticsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we need to auto-reset due to auth errors
    if (session && shouldResetAuth(session)) {
      console.log("Auto-resetting auth due to error state:", session.error);
      setError(
        `Authentication error detected: ${session.error}. Auto-resetting...`,
      );
      setTimeout(() => {
        resetAuthState();
      }, 3000);
    }
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Auth Diagnostics</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Information</h2>
        {session ? (
          <div>
            <p>
              <strong>User ID:</strong> {session.user?.id || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {session.user?.email || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {session.user?.name || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {session.user?.role || "N/A"}
            </p>
            <p>
              <strong>Has Access Token:</strong>{" "}
              {session.accessToken ? "Yes" : "No"}
            </p>
            <p>
              <strong>Has Refresh Token:</strong>{" "}
              {session.refreshToken ? "Yes" : "No"}
            </p>
            {session.error && (
              <p className="text-red-600">
                <strong>Session Error:</strong> {session.error}
              </p>
            )}
          </div>
        ) : (
          <p>No active session</p>
        )}
      </div>
    </div>
  );
}
