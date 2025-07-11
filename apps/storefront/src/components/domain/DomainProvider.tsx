import React from 'react';
import { useDomainRouting } from '../../hooks/use-domain-routing';
import { DevelopmentTenantSwitcher } from './DevelopmentTenantSwitcher';

interface DomainProviderProps {
  children: React.ReactNode;
}

interface DomainAwareProps {
  children: React.ReactNode;
  customDomainOnly?: boolean;
  developmentOnly?: boolean;
  organizationRequired?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that provides domain-aware rendering capabilities
 */
export const DomainProvider: React.FC<DomainProviderProps> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Component that conditionally renders content based on domain context
 */
export const DomainAware: React.FC<DomainAwareProps> = ({
  children,
  customDomainOnly = false,
  developmentOnly = false,
  organizationRequired = false,
  fallback = null,
}) => {
  const {
    organization,
    isCustomDomain,
    isDevelopmentMode,
  } = useDomainRouting();

  // Check if organization is required
  if (organizationRequired && !organization) {
    return <>{fallback}</>;
  }

  // Check if custom domain is required
  if (customDomainOnly && !isCustomDomain()) {
    return <>{fallback}</>;
  }

  // Check if development mode is required
  if (developmentOnly && !isDevelopmentMode()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Component that shows content only on custom domains
 */
export const CustomDomainOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return (
    <DomainAware customDomainOnly fallback={fallback}>
      {children}
    </DomainAware>
  );
};

/**
 * Component that shows content only in development
 */
export const DevelopmentOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return (
    <DomainAware developmentOnly fallback={fallback}>
      {children}
    </DomainAware>
  );
};

/**
 * Component that shows content only when organization is available
 */
export const OrganizationRequired: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return (
    <DomainAware organizationRequired fallback={fallback}>
      {children}
    </DomainAware>
  );
};

/**
 * Component that shows organization-specific branding
 */
export const OrganizationBranding: React.FC = () => {
  const { getOrganizationMeta, organization } = useDomainRouting();
  const meta = getOrganizationMeta();

  React.useEffect(() => {
    // Update document title
    document.title = meta.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = meta.description;
      document.head.appendChild(newMeta);
    }

    // Update Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };

    updateOgTag('og:title', meta.title);
    updateOgTag('og:description', meta.description);
    updateOgTag('og:site_name', meta.siteName);
    
    if (meta.logo) {
      updateOgTag('og:image', meta.logo);
    }

    // Update favicon if organization has one
    if (meta.favicon) {
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (favicon) {
        favicon.href = meta.favicon;
      }
    }
  }, [meta, organization]);

  return null; // This component only updates document metadata
};

/**
 * Component that displays domain information for debugging and provides tenant switching
 */
export const DomainDebugInfo: React.FC = () => {
  const { domainInfo, currentDomain, organization } = useDomainRouting();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (import.meta.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {/* Tenant Switcher */}
      <DevelopmentTenantSwitcher />
      
      {/* Debug Info Panel */}
      <div className="bg-black bg-opacity-90 text-white text-xs rounded-lg max-w-xs">
        {/* Toggle Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-2 hover:bg-gray-700 rounded-t-lg flex items-center justify-between"
        >
          <span className="font-medium">Debug Info</span>
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="p-2 pt-0 border-t border-gray-600">
            <div className="space-y-1">
              <div><strong>Domain:</strong> {currentDomain}</div>
              <div><strong>Custom:</strong> {domainInfo?.isCustomDomain ? 'Yes' : 'No'}</div>
              <div><strong>Fallback:</strong> {domainInfo?.fallbackMode || 'None'}</div>
              <div><strong>Org:</strong> {organization?.name || 'None'}</div>
              {organization && (
                <>
                  <div><strong>Slug:</strong> {organization.slug}</div>
                  {organization.customDomain && (
                    <>
                      <div><strong>Custom Domain:</strong> {organization.customDomain}</div>
                      <div><strong>Verified:</strong> {organization.domainVerified ? 'Yes' : 'No'}</div>
                    </>
                  )}
                </>
              )}
              <div className="pt-1 border-t border-gray-600 mt-2">
                <div><strong>Env:</strong> {import.meta.env.MODE}</div>
                <div><strong>API:</strong> {import.meta.env.VITE_API_URL || 'localhost:4000'}</div>
                {typeof window !== 'undefined' && (
                  <div><strong>Storage:</strong> {localStorage.getItem('dev_selected_org_slug') || 'None'}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 