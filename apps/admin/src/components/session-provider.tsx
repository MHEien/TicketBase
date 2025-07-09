"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Session {
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    permissions?: string[];
    organizationId?: string;
  };
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
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const updateSession = async () => {
    try {
      setStatus("loading");
      const sessionData = await authClient.getSession();
      
      if (sessionData.data && sessionData.data.session) {
        setSession({
          user: sessionData.data.user,
          accessToken: sessionData.data.session.token,
          // Store additional session metadata if needed
          expiresAt: sessionData.data.session.expiresAt instanceof Date 
            ? Math.floor(sessionData.data.session.expiresAt.getTime() / 1000)
            : sessionData.data.session.expiresAt,
        });
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
  };

  useEffect(() => {
    updateSession();
  }, []);

  const contextValue: SessionContextType = {
    data: session,
    status,
    update: updateSession,
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
