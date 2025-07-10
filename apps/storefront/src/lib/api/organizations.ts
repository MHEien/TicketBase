import { apiClient } from '../api-client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  favicon?: string;
  customDomain?: string;
  domainVerified?: boolean;
  settings: {
    defaultCurrency?: string;
    emailNotifications?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill';
    fontFamily?: string;
    headerStyle?: 'centered' | 'left' | 'right' | 'full-width';
    footerLinks?: {
      text: string;
      url: string;
    }[];
    socialLinks?: {
      platform: string;
      url: string;
    }[];
    allowGuestCheckout?: boolean;
    serviceFeePercentage?: number;
    serviceFeeFixed?: number;
    ticketTransfersEnabled?: boolean;
    refundPolicy?: string;
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
    customStylesheet?: string;
    customHeadHtml?: string;
    customScripts?: string[];
    themeName?: string;
  };
  checkoutMessage?: string;
  emailTemplate?: string;
  createdAt: string;
  updatedAt: string;
}

export const organizationsApi = {
  // Get organization by domain (for multi-tenant support)
  async getByDomain(domain: string): Promise<Organization> {
    // Use public endpoint that doesn't require authentication
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/public/organizations/by-domain?domain=${encodeURIComponent(domain)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Organization not found for this domain');
      }
      throw new Error('Failed to fetch organization');
    }

    return response.json();
  },

  // Get organization by slug (fallback method)
  async getBySlug(slug: string): Promise<Organization> {
    return apiClient.get<Organization>(`/organizations/by-slug/${slug}`);
  },

  // Detect organization based on current domain
  async detectCurrentOrganization(): Promise<Organization | null> {
    try {
      // Get current domain from window.location
      const currentDomain = window.location.hostname;
      
      // Skip localhost and common development domains
      if (
        currentDomain === 'localhost' || 
        currentDomain === '127.0.0.1' ||
        currentDomain.endsWith('.local') ||
        currentDomain.endsWith('.localhost') ||
        currentDomain.includes('localhost:') ||
        currentDomain.includes('127.0.0.1:')
      ) {
        // For development, try to get organization from environment or use default
        const defaultOrgSlug = import.meta.env.VITE_DEFAULT_ORG_SLUG;
        if (defaultOrgSlug) {
          return await this.getBySlug(defaultOrgSlug);
        }
        return null;
      }

      // Try to get organization by custom domain
      return await this.getByDomain(currentDomain);
    } catch (error) {
      console.warn('Could not detect organization from domain:', error);
      return null;
    }
  },

  // Get organization public settings (cached version for performance)
  async getPublicSettings(domain: string): Promise<Organization> {
    // This endpoint could be cached more aggressively since it's public data
    return this.getByDomain(domain);
  },

  // Check if a domain is available for use
  async checkDomainAvailability(domain: string): Promise<{ available: boolean; organization?: string }> {
    try {
      const org = await this.getByDomain(domain);
      return {
        available: false,
        organization: org.name,
      };
    } catch (error) {
      return {
        available: true,
      };
    }
  },
}; 