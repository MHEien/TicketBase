import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization, organizationsApi } from "../lib/api/organizations";
import {
  DomainMiddleware,
  DomainDetectionResult,
} from "../lib/middleware/domain-middleware";

interface BrandingSettings {
  primaryColor?: string;
  secondaryColor?: string;
  buttonStyle?: "rounded" | "square" | "pill";
  fontFamily?: string;
  headerStyle?: "centered" | "left" | "right" | "full-width";
  customStylesheet?: string;
  customHeadHtml?: string;
  customScripts?: string[];
  themeName?: string;
  logo?: string;
  favicon?: string;
  footerLinks?: Array<{ text: string; url: string }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  branding: BrandingSettings | null;
  currentDomain: string | null;
  domainInfo: DomainDetectionResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider",
    );
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
  organizationId?: string; // Optional: for when we know the organization ID
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
  children,
  organizationId,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [domainInfo, setDomainInfo] = useState<DomainDetectionResult | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);

      let detectionResult: DomainDetectionResult;
      let org: Organization | null = null;

      if (organizationId) {
        // If we have a specific organization ID, get by slug
        org = await organizationsApi.getBySlug(organizationId);
        detectionResult = {
          organization: org,
          domain: window.location.hostname,
          isCustomDomain: false,
          fallbackMode: "development",
        };
      } else {
        // Use domain middleware for detection
        detectionResult = await DomainMiddleware.detectOrganization();
        org = detectionResult.organization;
      }

      // Set domain info
      setDomainInfo(detectionResult);
      setCurrentDomain(detectionResult.domain);

      if (org) {
        setOrganization(org);

        // Extract branding from organization settings
        const orgBranding: BrandingSettings = {
          primaryColor: org.settings.primaryColor,
          secondaryColor: org.settings.secondaryColor,
          buttonStyle: org.settings.buttonStyle,
          fontFamily: org.settings.fontFamily,
          headerStyle: org.settings.headerStyle,
          customStylesheet: org.settings.customStylesheet,
          customHeadHtml: org.settings.customHeadHtml,
          customScripts: org.settings.customScripts,
          themeName: org.settings.themeName,
          logo: org.logo,
          favicon: org.favicon,
          footerLinks: org.settings.footerLinks,
          socialLinks: org.settings.socialLinks,
          privacyPolicyUrl: org.settings.privacyPolicyUrl,
          termsOfServiceUrl: org.settings.termsOfServiceUrl,
        };

        setBranding(orgBranding);

        // Apply branding to document
        applyBrandingToDocument(orgBranding, org);
      } else {
        // No organization found, use default branding
        setOrganization(null);
        setBranding(null);
        applyDefaultBranding();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load organization",
      );
      console.error("Error fetching organization:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyBrandingToDocument = (
    branding: BrandingSettings,
    org: Organization,
  ) => {
    // Apply favicon
    if (branding.favicon) {
      const favicon =
        document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (favicon) {
        favicon.href = branding.favicon;
      }
    }

    // Apply theme to document
    if (branding.themeName) {
      document.documentElement.setAttribute("data-theme", branding.themeName);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // Apply CSS custom properties
    const root = document.documentElement;

    if (branding.primaryColor) {
      root.style.setProperty("--primary-color", branding.primaryColor);
      // Generate darker and lighter variants
      root.style.setProperty(
        "--primary-color-dark",
        adjustColor(branding.primaryColor, -20),
      );
      root.style.setProperty(
        "--primary-color-light",
        adjustColor(branding.primaryColor, 40),
      );
    }

    if (branding.secondaryColor) {
      root.style.setProperty("--secondary-color", branding.secondaryColor);
      root.style.setProperty(
        "--secondary-color-dark",
        adjustColor(branding.secondaryColor, -20),
      );
      root.style.setProperty(
        "--secondary-color-light",
        adjustColor(branding.secondaryColor, 40),
      );
    }

    if (branding.fontFamily) {
      root.style.setProperty("--font-family", branding.fontFamily);
      root.style.setProperty("--heading-font-family", branding.fontFamily);
    }

    // Apply button style border radius
    if (branding.buttonStyle) {
      const borderRadius = {
        rounded: "0.375rem",
        square: "0rem",
        pill: "9999px",
      };
      root.style.setProperty(
        "--border-radius",
        borderRadius[branding.buttonStyle],
      );
    }

    // Apply custom stylesheet
    if (branding.customStylesheet) {
      const existingCustomStyle = document.getElementById(
        "custom-organization-styles",
      );
      if (existingCustomStyle) {
        existingCustomStyle.remove();
      }

      const style = document.createElement("style");
      style.id = "custom-organization-styles";
      style.textContent = branding.customStylesheet;
      document.head.appendChild(style);
    }

    // Apply custom head HTML
    if (branding.customHeadHtml) {
      const existingCustomHead = document.getElementById(
        "custom-organization-head",
      );
      if (existingCustomHead) {
        existingCustomHead.remove();
      }

      const div = document.createElement("div");
      div.id = "custom-organization-head";
      div.innerHTML = branding.customHeadHtml;
      document.head.appendChild(div);
    }

    // Apply custom scripts
    if (branding.customScripts && branding.customScripts.length > 0) {
      // Remove existing custom scripts
      const existingScripts = document.querySelectorAll(
        "script[data-organization-script]",
      );
      existingScripts.forEach((script) => script.remove());

      // Add new custom scripts
      branding.customScripts.forEach((scriptContent, index) => {
        const script = document.createElement("script");
        script.setAttribute("data-organization-script", index.toString());
        script.textContent = scriptContent;
        document.head.appendChild(script);
      });
    }

    // Update page title
    if (org.name) {
      document.title = `${org.name} - Events`;
    }
  };

  const applyDefaultBranding = () => {
    // Apply default branding
    const root = document.documentElement;
    root.style.setProperty("--primary-color", "#3b82f6");
    root.style.setProperty("--secondary-color", "#64748b");
    root.style.setProperty("--primary-color-dark", "#1e40af");
    root.style.setProperty("--primary-color-light", "#93c5fd");
    root.style.setProperty("--secondary-color-dark", "#475569");
    root.style.setProperty("--secondary-color-light", "#94a3b8");
    root.style.setProperty("--font-family", "Inter, system-ui, sans-serif");
    root.style.setProperty(
      "--heading-font-family",
      "Inter, system-ui, sans-serif",
    );
    root.style.setProperty("--border-radius", "0.375rem");

    // Remove theme attribute
    document.documentElement.removeAttribute("data-theme");

    // Remove custom styles
    const existingCustomStyle = document.getElementById(
      "custom-organization-styles",
    );
    if (existingCustomStyle) {
      existingCustomStyle.remove();
    }

    const existingCustomHead = document.getElementById(
      "custom-organization-head",
    );
    if (existingCustomHead) {
      existingCustomHead.remove();
    }

    // Remove custom scripts
    const existingScripts = document.querySelectorAll(
      "script[data-organization-script]",
    );
    existingScripts.forEach((script) => script.remove());

    document.title = "Events Platform";
  };

  // Helper function to adjust color brightness
  const adjustColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  const contextValue: OrganizationContextType = {
    organization,
    branding,
    currentDomain,
    domainInfo,
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
