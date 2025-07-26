import { DomainMiddleware } from "../lib/middleware/domain-middleware";
import { Organization } from "../lib/api/organizations";
import { getTenantFromClientCookie } from "../lib/tenant";
import { organizationsApi } from "../lib/api/organizations";
import { useState, useEffect } from "react";

export const useDomainRouting = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const currentDomain = typeof window !== "undefined" ? window.location.hostname : null;

  // Get organization from tenant cookie
  useEffect(() => {
    const tenantData = getTenantFromClientCookie();
    if (tenantData && tenantData.organizationSlug) {
      organizationsApi.getBySlug(tenantData.organizationSlug)
        .then(org => setOrganization(org))
        .catch(() => setOrganization(null));
    }
  }, []);

  /**
   * Generate URL for a given path within the current organization's domain
   */
  const generateUrl = (path: string = "") => {
    if (!organization) {
      return path;
    }

    return DomainMiddleware.getOrganizationUrl(organization, path);
  };

  /**
   * Check if we're on a custom domain
   */
  const isCustomDomain = () => {
    if (!organization || !currentDomain) return false;
    return organization.customDomain === currentDomain && organization.domainVerified;
  };

  /**
   * Check if we're in development mode
   */
  const isDevelopmentMode = () => {
    if (!currentDomain) return false;
    const devDomains = ["localhost", "127.0.0.1", "0.0.0.0"];
    return (
      devDomains.includes(currentDomain) ||
      currentDomain.endsWith(".local") ||
      currentDomain.endsWith(".localhost") ||
      currentDomain.includes("localhost:") ||
      currentDomain.includes("127.0.0.1:") ||
      currentDomain.includes("0.0.0.0:") ||
      currentDomain.endsWith(".vercel.app") ||
      currentDomain.endsWith(".netlify.app") ||
      currentDomain.endsWith(".dev")
    );
  };

  /**
   * Get the current organization's domain info
   */
  const getDomainInfo = () => {
    return {
      domain: currentDomain,
      isCustomDomain: isCustomDomain(),
      fallbackMode: isDevelopmentMode() ? "development" as const : null,
    };
  };

  /**
   * Check if current domain belongs to the organization
   */
  const isOrganizationDomain = (org?: Organization) => {
    const targetOrg = org || organization;
    if (!targetOrg) return false;

    return DomainMiddleware.isOrganizationDomain(
      targetOrg,
      currentDomain || undefined,
    );
  };

  /**
   * Get the canonical URL for sharing
   */
  const getCanonicalUrl = (path: string = "") => {
    if (!organization) {
      return `${window.location.origin}${path}`;
    }

    // Prefer custom domain if verified
    if (organization.customDomain && organization.domainVerified) {
      const protocol = window.location.protocol;
      return `${protocol}//${organization.customDomain}${path}`;
    }

    // Fallback to current domain
    return `${window.location.origin}${path}`;
  };

  /**
   * Navigate to a path within the organization's domain
   */
  const navigateToOrganizationPath = (path: string) => {
    const url = generateUrl(path);

    // If we're already on the right domain, use pushState
    if (url.includes(window.location.hostname)) {
      window.history.pushState(null, "", path);
    } else {
      // Cross-domain navigation
      window.location.href = url;
    }
  };

  /**
   * Get the organization's primary domain (custom or platform)
   */
  const getPrimaryDomain = () => {
    if (!organization) return currentDomain;

    if (organization.customDomain && organization.domainVerified) {
      return organization.customDomain;
    }

    return currentDomain;
  };

  /**
   * Get SEO-friendly URLs for the organization
   */
  const getSeoUrls = () => {
    const baseUrl = getCanonicalUrl();

    return {
      home: baseUrl,
      events: `${baseUrl}/events`,
      categories: `${baseUrl}/categories`,
      search: `${baseUrl}/search`,
      about: baseUrl,
    };
  };

  /**
   * Check if we should show multi-tenant features
   */
  const shouldShowMultiTenantFeatures = () => {
    // Show multi-tenant features only if we have a verified organization
    return organization && (isCustomDomain() || isDevelopmentMode());
  };

  /**
   * Get organization-specific meta tags
   */
  const getOrganizationMeta = () => {
    if (!organization) {
      return {
        title: "Events Platform",
        description: "Find and book amazing events",
        siteName: "Events Platform",
      };
    }

    return {
      title: `${organization.name} - Events`,
      description: `Discover and book events from ${organization.name}`,
      siteName: organization.name,
      logo: organization.logo,
      favicon: organization.favicon,
    };
  };

  return {
    // Organization info
    organization,
    currentDomain,
    domainInfo: getDomainInfo(),

    // URL generation
    generateUrl,
    getCanonicalUrl,
    getSeoUrls,
    getPrimaryDomain,

    // Navigation
    navigateToOrganizationPath,

    // Checks
    isCustomDomain,
    isDevelopmentMode,
    isOrganizationDomain,
    shouldShowMultiTenantFeatures,

    // Utilities
    getDomainInfo,
    getOrganizationMeta,
  };
};
