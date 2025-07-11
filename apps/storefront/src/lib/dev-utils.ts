/**
 * Development utilities for multi-tenant functionality
 * These utilities are only available in development mode
 */

export class DevTenantUtils {
  private static readonly DEV_ORG_KEY = 'dev_selected_org_slug';

  /**
   * Check if we're in development mode
   */
  static isDevelopmentMode(): boolean {
    return import.meta.env.NODE_ENV === 'development';
  }

  /**
   * Get the currently selected development organization slug
   */
  static getSelectedOrgSlug(): string | null {
    if (!this.isDevelopmentMode() || typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.DEV_ORG_KEY);
  }

  /**
   * Set the selected development organization slug
   */
  static setSelectedOrgSlug(slug: string | null): void {
    if (!this.isDevelopmentMode() || typeof window === 'undefined') {
      return;
    }

    if (slug) {
      localStorage.setItem(this.DEV_ORG_KEY, slug);
    } else {
      localStorage.removeItem(this.DEV_ORG_KEY);
    }
  }

  /**
   * Clear the selected development organization
   */
  static clearSelectedOrg(): void {
    this.setSelectedOrgSlug(null);
  }

  /**
   * Get organization slug from URL parameters
   */
  static getOrgFromUrl(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('org') || urlParams.get('organization');
  }

  /**
   * Set organization in URL without page reload
   */
  static setOrgInUrl(slug: string | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    const url = new URL(window.location.href);
    
    if (slug) {
      url.searchParams.set('org', slug);
    } else {
      url.searchParams.delete('org');
      url.searchParams.delete('organization');
    }
    
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Switch to an organization (updates both URL and localStorage)
   */
  static switchToOrganization(slug: string | null): void {
    this.setSelectedOrgSlug(slug);
    this.setOrgInUrl(slug);
  }

  /**
   * Get development configuration summary
   */
  static getDevConfig(): {
    selectedOrg: string | null;
    urlOrg: string | null;
    defaultOrg: string | null;
    apiUrl: string;
    mode: string;
  } {
    return {
      selectedOrg: this.getSelectedOrgSlug(),
      urlOrg: this.getOrgFromUrl(),
      defaultOrg: import.meta.env.VITE_DEFAULT_ORG_SLUG || null,
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
      mode: import.meta.env.MODE,
    };
  }

  /**
   * Print development configuration to console
   */
  static logDevConfig(): void {
    if (!this.isDevelopmentMode()) {
      return;
    }

    const config = this.getDevConfig();
    console.group('🏢 Development Tenant Configuration');
    console.log('Selected Organization:', config.selectedOrg || 'None');
    console.log('URL Parameter:', config.urlOrg || 'None');
    console.log('Default Organization:', config.defaultOrg || 'None');
    console.log('API URL:', config.apiUrl);
    console.log('Mode:', config.mode);
    console.groupEnd();
  }

  /**
   * Reset all development tenant settings
   */
  static resetDevSettings(): void {
    if (!this.isDevelopmentMode()) {
      return;
    }

    this.clearSelectedOrg();
    this.setOrgInUrl(null);
    
    console.log('🔄 Development tenant settings reset');
  }
}

/**
 * Quick access functions for console debugging
 * Available in development mode as window.devTenant
 */
if (typeof window !== 'undefined' && DevTenantUtils.isDevelopmentMode()) {
  (window as any).devTenant = {
    switch: DevTenantUtils.switchToOrganization,
    clear: DevTenantUtils.clearSelectedOrg,
    config: DevTenantUtils.getDevConfig,
    log: DevTenantUtils.logDevConfig,
    reset: DevTenantUtils.resetDevSettings,
  };

  console.log('🛠️ Development tenant utilities available at window.devTenant');
} 