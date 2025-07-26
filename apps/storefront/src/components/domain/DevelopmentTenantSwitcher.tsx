import React, { useState, useEffect } from "react";
import { organizationsApi } from "../../lib/api/organizations";
import { Organization } from "../../lib/api/organizations";
import { setTenantServerFn, clearTenantServerFn, getTenantFromClientCookie } from "../../lib/tenant";

interface DevelopmentTenantSwitcherProps {
  className?: string;
}

export const DevelopmentTenantSwitcher: React.FC<
  DevelopmentTenantSwitcherProps
> = ({ className = "" }) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualSlug, setManualSlug] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  // Only show in development
  if (import.meta.env.DEV !== true) {
    console.log("DevelopmentTenantSwitcher is not in development mode");
    return null;
  }

  // Get current organization from tenant cookie on component mount
  useEffect(() => {
    const tenantData = getTenantFromClientCookie();
    if (tenantData && tenantData.organizationSlug) {
      organizationsApi.getBySlug(tenantData.organizationSlug)
        .then(org => setCurrentOrganization(org))
        .catch(() => setCurrentOrganization(null));
    }
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    console.log("[DevTenantSwitcher] Fetching organizations...");
    
    try {
      // Try to fetch all organizations for development
      console.log("[DevTenantSwitcher] Trying organizationsApi.getAll()...");
      const orgs = await organizationsApi.getAll();
      console.log("[DevTenantSwitcher] Successfully fetched", orgs.length, "organizations:", orgs.map(o => o.slug));
      setOrganizations(orgs);
      return;
    } catch (err) {
      console.warn("[DevTenantSwitcher] Could not fetch organizations list, trying fallback:", err);

      // Fallback: try to get organizations by common slugs
      const commonSlugs = [
        "demo", "test", "sample", "thunderstorm", "events", 
        "default", "admin", "example", "dev", "local"
      ];
      const orgs = [];
      
      console.log("[DevTenantSwitcher] Trying fallback with slugs:", commonSlugs);
      
      for (const slug of commonSlugs) {
        try {
          console.log("[DevTenantSwitcher] Trying slug:", slug);
          const org = await organizationsApi.getBySlug(slug);
          if (org) {
            console.log("[DevTenantSwitcher] Found organization:", org.name, "(", org.slug, ")");
            orgs.push(org);
          }
        } catch (e) {
          // Ignore missing organizations
          console.debug("[DevTenantSwitcher] Slug not found:", slug);
        }
      }
      
      setOrganizations(orgs);
      console.log("[DevTenantSwitcher] Fallback found", orgs.length, "organizations");

      if (orgs.length === 0) {
        const errorMsg = "No organizations found. Make sure your backend is running and has organizations created.";
        console.error("[DevTenantSwitcher]", errorMsg);
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToOrganization = async (org: Organization | null) => {
    try {
      if (org) {
        // Store selected organization in localStorage
        localStorage.setItem("dev_selected_org_slug", org.slug);

        // Update URL with organization parameter
        const url = new URL(window.location.href);
        url.searchParams.set("org", org.slug);
        window.history.replaceState({}, "", url.toString());

        // Set tenant cookie for the new organization
        await setTenantServerFn({
          data: {
            organizationId: org.id,
            organizationSlug: org.slug,
            domain: window.location.hostname,
          },
        });
      } else {
        // Clear organization selection
        localStorage.removeItem("dev_selected_org_slug");

        // Remove org parameter from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("org");
        url.searchParams.delete("organization");
        window.history.replaceState({}, "", url.toString());

        // Clear tenant cookie
        await clearTenantServerFn();
      }

      // Trigger page reload to apply new tenant
      window.location.reload();
      setIsOpen(false);
    } catch (err) {
      console.error("Error switching organization:", err);
      setError("Failed to switch organization");
    }
  };

  const clearSelection = () => {
    switchToOrganization(null);
  };

  const tryManualSlug = async () => {
    if (!manualSlug.trim()) return;
    
    setLoading(true);
    try {
      console.log("[DevTenantSwitcher] Trying manual slug:", manualSlug);
      const org = await organizationsApi.getBySlug(manualSlug.trim());
      if (org) {
        console.log("[DevTenantSwitcher] Manual slug found:", org.name);
        await switchToOrganization(org);
      }
    } catch (err) {
      console.error("[DevTenantSwitcher] Manual slug failed:", err);
      setError(`Organization '${manualSlug}' not found`);
    } finally {
      setLoading(false);
      setManualSlug("");
      setShowManualInput(false);
    }
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
        🏢 {currentOrganization?.name || "No Org"}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg min-w-64 max-w-80 z-50">
          <div className="p-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm">
            Development Tenant Switcher
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Switch between organizations for testing
          </p>
          {currentOrganization && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              <div className="font-medium text-blue-900">Current: {currentOrganization.name}</div>
              <div className="text-blue-700">Slug: {currentOrganization.slug}</div>
              {currentOrganization.customDomain && (
                <div className="text-blue-700">Domain: {currentOrganization.customDomain}</div>
              )}
            </div>
          )}
        </div>

          <div className="max-h-64 overflow-y-auto">
            {loading && (
              <div className="p-3 text-center text-gray-500 text-xs">
                Loading organizations...
              </div>
            )}

            {error && (
              <div className="p-3 text-center text-red-600 text-xs">
                <div className="mb-2">{error}</div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={fetchOrganizations}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-green-600 hover:text-green-800 underline"
                  >
                    Manual Input
                  </button>
                </div>
              </div>
            )}

            {/* Manual Slug Input */}
            {showManualInput && (
              <div className="p-3 border-b border-gray-100">
                <div className="text-xs text-gray-600 mb-2">Enter organization slug manually:</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualSlug}
                    onChange={(e) => setManualSlug(e.target.value)}
                    placeholder="e.g. thunderstorm"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    onKeyPress={(e) => e.key === 'Enter' && tryManualSlug()}
                  />
                  <button
                    onClick={tryManualSlug}
                    disabled={!manualSlug.trim() || loading}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Try
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Clear Selection */}
                <button
                  onClick={clearSelection}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-100 ${
                    !currentOrganization
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
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
                      currentOrganization?.id === org.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="font-medium">{org.name}</div>
                    <div className="text-gray-500 text-xs">
                      Slug: {org.slug}
                      {org.customDomain && (
                        <span className="ml-2">
                          • Domain: {org.customDomain}
                          {org.domainVerified && (
                            <span className="text-green-600"> ✓</span>
                          )}
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
            <div className="flex gap-2">
              <button
                onClick={fetchOrganizations}
                disabled={loading}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="text-xs text-green-600 hover:text-green-800"
              >
                ✏️ Manual
              </button>
            </div>
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
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
