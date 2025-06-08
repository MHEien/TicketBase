"use client";

import { useState, useEffect } from "react";
import { useSession } from "@repo/api-sdk";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  return <>{children}</>;
}
