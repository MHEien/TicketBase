import { Organization, organizationsApi } from "../api/organizations";

export interface DomainDetectionResult {
  organization: Organization | null;
  domain: string;
  isCustomDomain: boolean;
  fallbackMode: "development" | "default" | null;
}

export class DomainMiddleware {
  private static organizationCache = new Map<
    string,
    { org: Organization | null; timestamp: number }
  >();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Detect organization from the current domain
   */
  static async detectOrganization(
    hostname?: string,
  ): Promise<DomainDetectionResult> {
    const domain =
      hostname ||
      (typeof window !== "undefined" ? window.location.hostname : "localhost");

    // Check cache first
    const cached = this.getCachedOrganization(domain);
    if (cached) {
      return {
        organization: cached,
        domain,
        isCustomDomain: !this.isDevelopmentDomain(domain),
        fallbackMode: this.getFallbackMode(domain),
      };
    }

    try {
      let organization: Organization | null = null;
      let fallbackMode: "development" | "default" | null = null;

      if (this.isDevelopmentDomain(domain)) {
        // Development environment handling
        fallbackMode = "development";
        organization = await this.handleDevelopmentDomain();
      } else {
        // Production: try to find organization by domain
        try {
          organization = await organizationsApi.getByDomain(domain);
        } catch (error) {
          console.warn(`No organization found for domain: ${domain}`, error);
          // Could implement fallback to default organization here
          fallbackMode = "default";
        }
      }

      // Cache the result
      this.setCachedOrganization(domain, organization);

      return {
        organization,
        domain,
        isCustomDomain: !this.isDevelopmentDomain(domain),
        fallbackMode,
      };
    } catch (error) {
      console.error("Error in domain detection:", error);
      return {
        organization: null,
        domain,
        isCustomDomain: false,
        fallbackMode: "default",
      };
    }
  }

  /**
   * Check if domain is a development domain
   */
  private static isDevelopmentDomain(domain: string): boolean {
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
   * Handle development domain organization detection
   */
  private static async handleDevelopmentDomain(): Promise<Organization | null> {
    // Priority order for development tenant selection:
    // 1. URL parameters (highest priority - for immediate switching)
    // 2. localStorage (persistent selection)
    // 3. Environment variable (fallback default)

    // Try URL parameters first (for immediate switching)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const orgParam = urlParams.get("org") || urlParams.get("organization");
      if (orgParam) {
        try {
          const org = await organizationsApi.getBySlug(orgParam);
          if (org) {
            // Save to localStorage for persistence
            localStorage.setItem("dev_selected_org_slug", orgParam);
            return org;
          }
        } catch (error) {
          console.warn(
            `Could not load organization from URL param: ${orgParam}`,
            error,
          );
        }
      }

      // Try localStorage for persistent selection
      const savedOrgSlug = localStorage.getItem("dev_selected_org_slug");
      if (savedOrgSlug && savedOrgSlug !== "null") {
        try {
          const org = await organizationsApi.getBySlug(savedOrgSlug);
          if (org) {
            return org;
          } else {
            // Clear invalid stored slug
            localStorage.removeItem("dev_selected_org_slug");
          }
        } catch (error) {
          console.warn(
            `Could not load saved organization: ${savedOrgSlug}`,
            error,
          );
          localStorage.removeItem("dev_selected_org_slug");
        }
      }
    }

    // Try environment variable as fallback
    const defaultOrgSlug = import.meta.env.VITE_DEFAULT_ORG_SLUG;
    if (defaultOrgSlug) {
      try {
        return await organizationsApi.getBySlug(defaultOrgSlug);
      } catch (error) {
        console.warn(
          `Could not load default organization: ${defaultOrgSlug}`,
          error,
        );
      }
    }

    return null;
  }

  /**
   * Get fallback mode for the domain
   */
  private static getFallbackMode(
    domain: string,
  ): "development" | "default" | null {
    if (this.isDevelopmentDomain(domain)) {
      return "development";
    }
    return null;
  }

  /**
   * Get cached organization
   */
  private static getCachedOrganization(domain: string): Organization | null {
    const cached = this.organizationCache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.org;
    }
    return null;
  }

  /**
   * Set cached organization
   */
  private static setCachedOrganization(
    domain: string,
    organization: Organization | null,
  ): void {
    this.organizationCache.set(domain, {
      org: organization,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache for a specific domain
   */
  static clearDomainCache(domain: string): void {
    this.organizationCache.delete(domain);
  }

  /**
   * Clear all cached organizations
   */
  static clearAllCache(): void {
    this.organizationCache.clear();
  }

  /**
   * Preload organization for a domain (useful for SSR)
   */
  static async preloadOrganization(
    domain: string,
  ): Promise<Organization | null> {
    const result = await this.detectOrganization(domain);
    return result.organization;
  }

  /**
   * Validate if a domain can be used for an organization
   */
  static async validateDomain(domain: string): Promise<{
    available: boolean;
    organization?: string;
    reason?: string;
  }> {
    if (this.isDevelopmentDomain(domain)) {
      return {
        available: false,
        reason: "Development domains cannot be used as custom domains",
      };
    }

    try {
      const org = await organizationsApi.getByDomain(domain);
      return {
        available: false,
        organization: org.name,
        reason: `Domain is already in use by ${org.name}`,
      };
    } catch (error) {
      return { available: true };
    }
  }

  /**
   * Get organization URL for a given domain
   */
  static getOrganizationUrl(
    organization: Organization,
    path: string = "",
  ): string {
    if (organization.customDomain && organization.domainVerified) {
      const protocol =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? "https:"
          : "http:";
      return `${protocol}//${organization.customDomain}${path}`;
    }

    // Fallback to platform domain with organization slug
    const baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:3000";
    return `${baseUrl}/${organization.slug}${path}`;
  }

  /**
   * Check if current request is for a specific organization's domain
   */
  static isOrganizationDomain(
    organization: Organization,
    domain?: string,
  ): boolean {
    const currentDomain =
      domain ||
      (typeof window !== "undefined" ? window.location.hostname : "localhost");
    return (
      organization.customDomain === currentDomain &&
      organization.domainVerified === true
    );
  }
}
