"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}