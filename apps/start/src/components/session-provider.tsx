"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  return <>{children}</>;
}
