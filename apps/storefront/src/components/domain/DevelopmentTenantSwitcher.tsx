import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { organizationsApi } from '../../lib/api/organizations';
import { Organization } from '../../lib/api/organizations';

interface DevelopmentTenantSwitcherProps {
  className?: string;
}

export const DevelopmentTenantSwitcher: React.FC<DevelopmentTenantSwitcherProps> = ({ 
  className = "" 
}) => {
  const { organization, refetch } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show in development
  if (import.meta.env.NODE_ENV !== 'development') {
    return null;
  }

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch all organizations for development
      const orgs = await organizationsApi.getAll();
      setOrganizations(orgs);
    } catch (err) {
      console.warn('Could not fetch organizations list, trying fallback:', err);
      
      // Fallback: try to get a few organizations by common slugs
      const commonSlugs = ['demo', 'test', 'sample', 'thunderstorm', 'events'];
      const orgs = [];
      for (const slug of commonSlugs) {
        try {
          const org = await organizationsApi.getBySlug(slug);
          if (org) orgs.push(org);
        } catch (e) {
          // Ignore missing organizations
        }
      }
      setOrganizations(orgs);
      
      if (orgs.length === 0) {
        setError('No organizations found');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToOrganization = async (org: Organization | null) => {
    try {
      if (org) {
        // Store selected organization in localStorage
        localStorage.setItem('dev_selected_org_slug', org.slug);
        
        // Update URL with organization parameter
        const url = new URL(window.location.href);
        url.searchParams.set('org', org.slug);
        window.history.replaceState({}, '', url.toString());
      } else {
        // Clear organization selection
        localStorage.removeItem('dev_selected_org_slug');
        
        // Remove org parameter from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('org');
        url.searchParams.delete('organization');
        window.history.replaceState({}, '', url.toString());
      }

      // Trigger organization refetch
      await refetch();
      setIsOpen(false);
    } catch (err) {
      console.error('Error switching organization:', err);
      setError('Failed to switch organization');
    }
  };

  const clearSelection = () => {
    switchToOrganization(null);
  };

  useEffect(() => {
    if (isOpen && organizations.length === 0) {
      fetchOrganizations();
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
        title="Switch Development Tenant"
      >
        🏢 {organization?.name || 'No Org'}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg min-w-64 max-w-80 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm">Development Tenant Switcher</h3>
            <p className="text-xs text-gray-600 mt-1">Switch between organizations for testing</p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading && (
              <div className="p-3 text-center text-gray-500 text-xs">
                Loading organizations...
              </div>
            )}

            {error && (
              <div className="p-3 text-center text-red-600 text-xs">
                {error}
                <button 
                  onClick={fetchOrganizations}
                  className="block mt-1 text-blue-600 hover:text-blue-800 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Clear Selection */}
                <button
                  onClick={clearSelection}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 ${
                    !organization ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">No Organization</div>
                  <div className="text-gray-500 text-xs">Clear selection</div>
                </button>

                {/* Organization List */}
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => switchToOrganization(org)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 ${
                      organization?.id === org.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{org.name}</div>
                    <div className="text-gray-500 text-xs">
                      Slug: {org.slug}
                      {org.customDomain && (
                        <span className="ml-2">
                          • Domain: {org.customDomain}
                          {org.domainVerified && <span className="text-green-600"> ✓</span>}
                        </span>
                      )}
                    </div>
                  </button>
                ))}

                {organizations.length === 0 && !loading && (
                  <div className="p-3 text-center text-gray-500 text-xs">
                    No organizations found
                    <button 
                      onClick={fetchOrganizations}
                      className="block mt-1 text-blue-600 hover:text-blue-800 underline"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={fetchOrganizations}
              disabled={loading}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}; 