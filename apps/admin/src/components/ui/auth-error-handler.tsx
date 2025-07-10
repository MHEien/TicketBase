"use client";

import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useSession } from "@/components/session-provider";
import { signOut } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

export function AuthErrorHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a token refresh error in the session
    if (
      session?.error === "RefreshAccessTokenError" ||
      status === "unauthenticated"
    ) {
      console.error("Session expired. Please sign in again.");

      // Sign out and redirect to login
      signOut({ redirect: false }).then(() => {
        router.navigate({ to: "/login", search: { error: "session_expired" } });
      });
    }
  }, [session, status, router]);

  // Only render something if there's an error
  if (session?.error === "RefreshAccessTokenError") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="mt-2">
            Your session has expired or is invalid. Please sign in again.
          </AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={() =>
                router.navigate({
                  to: "/login",
                  search: { error: "session_expired" },
                })
              }
            >
              Sign in again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return null;
}
