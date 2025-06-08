"use client";

import { useEffect, useState } from "react";
import { useSession } from "@repo/api-sdk";

interface Organization {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  favicon?: string;
  checkoutMessage?: string;
  customDomain?: string;
  settings?: {
    primaryColor: string;
    secondaryColor?: string;
    buttonStyle: "rounded" | "square" | "pill";
    fontFamily?: string;
    headerStyle: "centered" | "left" | "right" | "full-width";
    allowGuestCheckout: boolean;
    defaultCurrency: string;
    customStylesheet?: string;
    customHeadHtml?: string;
  };
}

export function useOrganization() {
  const { user } = useSession();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      if (!user?.organizationId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/organizations/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch organization settings");
        }

        const data = await response.json();
        setOrganization(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [user?.organizationId]);

  return { organization, loading, error };
} 