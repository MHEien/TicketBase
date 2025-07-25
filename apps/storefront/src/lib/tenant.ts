import { createServerFn } from "@tanstack/react-start";
import { setCookie, getCookie } from "@tanstack/react-start/server";

export type TenantData = {
  organizationId: string;
  organizationSlug: string;
  domain: string;
  timestamp: number;
};

const TENANT_COOKIE_NAME = "storefront_tenant";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Server function to set tenant cookie
 */
export const setTenantServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      organizationId: string;
      organizationSlug: string;
      domain: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const tenantData: TenantData = {
      organizationId: data.organizationId,
      organizationSlug: data.organizationSlug,
      domain: data.domain,
      timestamp: Date.now(),
    };

    // Encode the tenant data
    const cookieValue = Buffer.from(JSON.stringify(tenantData)).toString(
      "base64",
    );

    // Set cookie with appropriate options
    setCookie(TENANT_COOKIE_NAME, cookieValue, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      // Set domain for custom domains in production
      ...(isDevelopmentDomain(data.domain) ? {} : { domain: data.domain }),
    });

    return { success: true };
  });

/**
 * Server function to get tenant cookie
 */
export const getTenantServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const cookieValue = getCookie(TENANT_COOKIE_NAME);

    if (!cookieValue) {
      return null;
    }

    try {
      const decoded = Buffer.from(cookieValue, "base64").toString("utf-8");
      const tenantData: TenantData = JSON.parse(decoded);

      // Validate the structure and check if not expired
      if (
        tenantData.organizationId &&
        tenantData.organizationSlug &&
        tenantData.domain &&
        tenantData.timestamp
      ) {
        // Check if cookie is not too old (30 days)
        const ageInSeconds = (Date.now() - tenantData.timestamp) / 1000;
        if (ageInSeconds < COOKIE_MAX_AGE) {
          return tenantData;
        }
      }
    } catch (error) {
      console.warn("Invalid tenant cookie format:", error);
    }

    return null;
  },
);

/**
 * Server function to clear tenant cookie
 */
export const clearTenantServerFn = createServerFn({ method: "POST" }).handler(
  async () => {
    setCookie(TENANT_COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
    });

    return { success: true };
  },
);

/**
 * Client-side utility to get tenant data from cookie
 * This is for client-side usage when server functions aren't available
 */
export function getTenantFromClientCookie(): TenantData | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  const tenantCookie = cookies
    .find((cookie) => cookie.trim().startsWith(`${TENANT_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!tenantCookie) {
    return null;
  }

  try {
    const decoded = atob(tenantCookie);
    const tenantData: TenantData = JSON.parse(decoded);

    if (
      tenantData.organizationId &&
      tenantData.organizationSlug &&
      tenantData.domain &&
      tenantData.timestamp
    ) {
      // Check if cookie is not too old
      const ageInSeconds = (Date.now() - tenantData.timestamp) / 1000;
      if (ageInSeconds < COOKIE_MAX_AGE) {
        return tenantData;
      }
    }
  } catch (error) {
    console.warn("Invalid tenant cookie format:", error);
  }

  return null;
}

/**
 * Helper function to check if domain is a development domain
 */
function isDevelopmentDomain(domain: string): boolean {
  const devDomains = ["localhost", "127.0.0.1", "0.0.0.0"];

  return (
    devDomains.includes(domain) ||
    domain.endsWith(".local") ||
    domain.endsWith(".localhost") ||
    domain.includes("localhost:") ||
    domain.includes("127.0.0.1:") ||
    domain.includes("0.0.0.0:") ||
    domain.endsWith(".vercel.app") ||
    domain.endsWith(".netlify.app") ||
    domain.endsWith(".dev")
  );
}

/**
 * Utility to determine if we should set a tenant cookie for the current domain
 */
export function shouldSetTenantCookie(
  domain: string,
  organizationDomain?: string,
): boolean {
  // Always set cookie in development
  if (isDevelopmentDomain(domain)) {
    return true;
  }

  // In production, only set cookie if we're on the organization's custom domain
  return organizationDomain === domain;
}
