import { createServerFn } from "@tanstack/react-start";
import { getCookie, getWebRequest } from "@tanstack/react-start/server";
import { Organization, organizationsApi } from "./api/organizations";
import { getTenantServerFn } from "./tenant";
import { DomainMiddleware } from "./middleware/domain-middleware";

/**
 * Server-side utility to get the current organization
 * Uses tenant cookie first, then falls back to domain detection
 */
export const getCurrentOrganizationServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    // First, try to get organization from tenant cookie
    const tenantData = await getTenantServerFn();
    if (tenantData?.organizationSlug) {
      try {
        const organization = await organizationsApi.getBySlug(
          tenantData.organizationSlug,
        );
        if (organization) {
          return organization;
        }
      } catch (error) {
        console.warn(
          `Could not load organization from tenant cookie: ${tenantData.organizationSlug}`,
          error,
        );
      }
    }

    // Fallback to domain detection
    const request = getWebRequest();
    const hostname = request.headers.get("host")?.split(":")[0] || "localhost";

    const detectionResult = await DomainMiddleware.detectOrganization(hostname);
    return detectionResult.organization;
  } catch (error) {
    console.error("Error getting current organization:", error);
    return null;
  }
});

/**
 * Server-side utility to get organization ID for API calls
 * Returns the organization ID or null if no organization is found
 */
export const getCurrentOrganizationIdServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const organization = await getCurrentOrganizationServerFn();
  return organization?.id || null;
});

/**
 * Server-side utility to get organization slug for API calls
 * Returns the organization slug or null if no organization is found
 */
export const getCurrentOrganizationSlugServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const organization = await getCurrentOrganizationServerFn();
  return organization?.slug || null;
});

// Note: Complex generic higher-order functions removed due to TanStack Start serialization constraints
// Use the direct utility functions or create specific server functions as shown in examples below

// Example usage patterns:

/**
 * Example: Server function to fetch all events for current organization
 */
export const getOrganizationEventsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const organization = await getCurrentOrganizationServerFn();
  if (!organization) {
    throw new Error("No organization found");
  }

  // Here you would call your events API with the organization ID
  // For example: return eventsApi.getByOrganization(organization.id);

  // Placeholder - replace with your actual events API call
  console.log(
    `Fetching events for organization: ${organization.name} (${organization.id})`,
  );
  return {
    organizationId: organization.id,
    organizationName: organization.name,
    events: [], // Your events would go here
  };
});

/**
 * Example: Organization-aware server function for getting stats
 */
export const getOrganizationStatsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const organization = await getCurrentOrganizationServerFn();
  if (!organization) {
    throw new Error("No organization found");
  }

  console.log(`Getting stats for: ${organization.name}`);

  return {
    organizationId: organization.id,
    name: organization.name,
    // Add your stats logic here
    totalEvents: 0,
    totalTicketsSold: 0,
  };
});

/**
 * Direct utility function (non-server function) for use in other server contexts
 * Use this when you're already in a server context and don't need a server function
 */
export async function getCurrentOrganization(): Promise<Organization | null> {
  try {
    // Try tenant cookie first
    const tenantCookieValue = getCookie("storefront_tenant");
    if (tenantCookieValue) {
      try {
        const decoded = Buffer.from(tenantCookieValue, "base64").toString(
          "utf-8",
        );
        const tenantData = JSON.parse(decoded);

        if (tenantData.organizationSlug) {
          const organization = await organizationsApi.getBySlug(
            tenantData.organizationSlug,
          );
          if (organization) {
            return organization;
          }
        }
      } catch (error) {
        console.warn("Could not parse tenant cookie:", error);
      }
    }

    // Fallback to domain detection
    const request = getWebRequest();
    const hostname = request.headers.get("host")?.split(":")[0] || "localhost";

    const detectionResult = await DomainMiddleware.detectOrganization(hostname);
    return detectionResult.organization;
  } catch (error) {
    console.error("Error getting current organization:", error);
    return null;
  }
}
