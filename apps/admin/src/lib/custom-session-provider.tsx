"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authClient } from "./custom-auth";

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  organizationId?: string;
}

interface Session {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

interface SessionContextType {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  update: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: "loading",
  update: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const [updateCount, setUpdateCount] = useState(0);

  const updateSession = useCallback(async () => {
    try {
      setStatus("loading");

      // Get session from custom auth client
      const sessionResult = await authClient.getSession();
      const sessionData = sessionResult.data;

      if (sessionData && sessionData.user) {
        setSession(sessionData);
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Session update error:", error);
      setSession(null);
      setStatus("unauthenticated");
    }
  }, [updateCount]);

  // Initial session load
  useEffect(() => {
    updateSession();
  }, [updateSession]);

  // Set up periodic session refresh for long-running sessions
  useEffect(() => {
    if (status === "authenticated") {
      // Check session validity every 5 minutes
      const interval = setInterval(
        () => {
          updateSession();
        },
        5 * 60 * 1000,
      );

      return () => clearInterval(interval);
    }
  }, [status, updateSession]);

  // Force update function that triggers re-evaluation
  const forceUpdate = useCallback(async () => {
    setUpdateCount((prev) => prev + 1);
    await updateSession();
  }, [updateSession]);

  const contextValue: SessionContextType = {
    data: session,
    status,
    update: forceUpdate,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session (compatible with NextAuth's useSession)
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export type { Session, SessionContextType, User };
