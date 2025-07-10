import { useOrganization } from '../contexts/OrganizationContext';
import { DomainMiddleware } from '../lib/middleware/domain-middleware';
import { Organization } from '../lib/api/organizations';

export const useDomainRouting = () => {
  const { organization, domainInfo, currentDomain } = useOrganization();

  /**
   * Generate URL for a given path within the current organization's domain
   */
  const generateUrl = (path: string = '') => {
    if (!organization) {
      return path;
    }

    return DomainMiddleware.getOrganizationUrl(organization, path);
  };

  /**
   * Check if we're on a custom domain
   */
  const isCustomDomain = () => {
    return domainInfo?.isCustomDomain || false;
  };

  /**
   * Check if we're in development mode
   */
  const isDevelopmentMode = () => {
    return domainInfo?.fallbackMode === 'development';
  };

  /**
   * Get the current organization's domain info
   */
  const getDomainInfo = () => {
    return domainInfo;
  };

  /**
   * Check if current domain belongs to the organization
   */
  const isOrganizationDomain = (org?: Organization) => {
    const targetOrg = org || organization;
    if (!targetOrg) return false;
    
    return DomainMiddleware.isOrganizationDomain(targetOrg, currentDomain || undefined);
  };

  /**
   * Get the canonical URL for sharing
   */
  const getCanonicalUrl = (path: string = '') => {
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
      window.history.pushState(null, '', path);
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
        title: 'Events Platform',
        description: 'Find and book amazing events',
        siteName: 'Events Platform',
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
    domainInfo,
    
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