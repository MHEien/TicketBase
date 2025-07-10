import React, { createContext, useContext, useEffect, useState } from 'react';
import { Organization, organizationsApi } from '../lib/api/organizations';

interface BrandingSettings {
  primaryColor?: string;
  secondaryColor?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  fontFamily?: string;
  headerStyle?: 'centered' | 'left' | 'right' | 'full-width';
  customStylesheet?: string;
  customHeadHtml?: string;
  logo?: string;
  favicon?: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  branding: BrandingSettings | null;
  currentDomain: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
  organizationId?: string; // Optional: for when we know the organization ID
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ 
  children, 
  organizationId 
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);

      let org: Organization | null = null;

      if (organizationId) {
        // If we have a specific organization ID, get by slug
        org = await organizationsApi.getBySlug(organizationId);
      } else {
        // Otherwise, try to detect from domain
        org = await organizationsApi.detectCurrentOrganization();
      }

      if (org) {
        setOrganization(org);
        setCurrentDomain(window.location.hostname);
        
        // Extract branding from organization settings
        const orgBranding: BrandingSettings = {
          primaryColor: org.settings.primaryColor,
          secondaryColor: org.settings.secondaryColor,
          buttonStyle: org.settings.buttonStyle,
          fontFamily: org.settings.fontFamily,
          headerStyle: org.settings.headerStyle,
          customStylesheet: org.settings.customStylesheet,
          customHeadHtml: org.settings.customHeadHtml,
          logo: org.logo,
          favicon: org.favicon,
        };
        
        setBranding(orgBranding);
        
        // Apply branding to document
        applyBrandingToDocument(orgBranding, org);
      } else {
        // No organization found, use default branding
        setOrganization(null);
        setBranding(null);
        setCurrentDomain(null);
        applyDefaultBranding();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization');
      console.error('Error fetching organization:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyBrandingToDocument = (branding: BrandingSettings, org: Organization) => {
    // Apply favicon
    if (branding.favicon) {
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (favicon) {
        favicon.href = branding.favicon;
      }
    }

    // Apply custom CSS variables
    const root = document.documentElement;
    
    if (branding.primaryColor) {
      root.style.setProperty('--primary-color', branding.primaryColor);
    }
    
    if (branding.secondaryColor) {
      root.style.setProperty('--secondary-color', branding.secondaryColor);
    }
    
    if (branding.fontFamily) {
      root.style.setProperty('--font-family', branding.fontFamily);
    }

    // Apply custom stylesheet
    if (branding.customStylesheet) {
      const existingCustomStyle = document.getElementById('custom-organization-styles');
      if (existingCustomStyle) {
        existingCustomStyle.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'custom-organization-styles';
      style.textContent = branding.customStylesheet;
      document.head.appendChild(style);
    }

    // Apply custom head HTML
    if (branding.customHeadHtml) {
      const existingCustomHead = document.getElementById('custom-organization-head');
      if (existingCustomHead) {
        existingCustomHead.remove();
      }
      
      const div = document.createElement('div');
      div.id = 'custom-organization-head';
      div.innerHTML = branding.customHeadHtml;
      document.head.appendChild(div);
    }

    // Update page title
    if (org.name) {
      document.title = `${org.name} - Events`;
    }
  };

  const applyDefaultBranding = () => {
    // Apply default branding
    const root = document.documentElement;
    root.style.setProperty('--primary-color', '#3b82f6');
    root.style.setProperty('--secondary-color', '#64748b');
    root.style.setProperty('--font-family', 'Inter, system-ui, sans-serif');
    
    // Remove custom styles
    const existingCustomStyle = document.getElementById('custom-organization-styles');
    if (existingCustomStyle) {
      existingCustomStyle.remove();
    }
    
    const existingCustomHead = document.getElementById('custom-organization-head');
    if (existingCustomHead) {
      existingCustomHead.remove();
    }
    
    document.title = 'Events Platform';
  };

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  const contextValue: OrganizationContextType = {
    organization,
    branding,
    currentDomain,
    loading,
    error,
    refetch: fetchOrganization,
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}; 