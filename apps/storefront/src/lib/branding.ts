import { createServerFn } from "@tanstack/react-start";
import { getCurrentOrganizationServerFn } from "./server-organization";
import { Organization } from "./api/organizations";

export interface BrandingSettings {
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

/**
 * Server function to get branding settings for current organization
 */
export const getBrandingServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const organization = await getCurrentOrganizationServerFn();

    if (!organization) {
      return null;
    }

    const branding: BrandingSettings = {
      primaryColor: organization.settings.primaryColor,
      secondaryColor: organization.settings.secondaryColor,
      buttonStyle: organization.settings.buttonStyle,
      fontFamily: organization.settings.fontFamily,
      headerStyle: organization.settings.headerStyle,
      customStylesheet: organization.settings.customStylesheet,
      customHeadHtml: organization.settings.customHeadHtml,
      customScripts: organization.settings.customScripts,
      themeName: organization.settings.themeName,
      logo: organization.logo,
      favicon: organization.favicon,
      footerLinks: organization.settings.footerLinks,
      socialLinks: organization.settings.socialLinks,
      privacyPolicyUrl: organization.settings.privacyPolicyUrl,
      termsOfServiceUrl: organization.settings.termsOfServiceUrl,
    };

    return branding;
  },
);

/**
 * Server function to get organization and branding data together
 */
export const getOrganizationWithBrandingServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const organization = await getCurrentOrganizationServerFn();

  if (!organization) {
    return null;
  }

  const branding = await getBrandingServerFn();

  return {
    organization,
    branding,
  };
});

/**
 * Client-side utility to apply branding to document
 * This replaces the OrganizationProvider's applyBrandingToDocument method
 */
export function applyBrandingToDocument(
  branding: BrandingSettings,
  organization: Organization,
): void {
  if (typeof document === "undefined") {
    return; // Server-side, skip DOM manipulation
  }

  const root = document.documentElement;

  // Apply CSS custom properties for colors
  if (branding.primaryColor) {
    root.style.setProperty("--primary-color", branding.primaryColor);
    root.style.setProperty(
      "--primary-color-dark",
      adjustColor(branding.primaryColor, -20),
    );
    root.style.setProperty(
      "--primary-color-light",
      adjustColor(branding.primaryColor, 20),
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
      adjustColor(branding.secondaryColor, 20),
    );
  }

  // Apply font family
  if (branding.fontFamily) {
    root.style.setProperty("--font-family", branding.fontFamily);
    root.style.setProperty("--heading-font-family", branding.fontFamily);
  }

  // Apply button style
  if (branding.buttonStyle) {
    const borderRadius = {
      rounded: "0.375rem",
      square: "0",
      pill: "9999px",
    }[branding.buttonStyle];
    root.style.setProperty("--border-radius", borderRadius);
  }

  // Apply theme
  if (branding.themeName) {
    root.setAttribute("data-theme", branding.themeName);
  }

  // Apply favicon
  if (branding.favicon) {
    const existingFavicon = document.querySelector(
      'link[rel="icon"]',
    ) as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = branding.favicon;
    } else {
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.href = branding.favicon;
      document.head.appendChild(favicon);
    }
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
  if (organization.name) {
    document.title = `${organization.name} - Events`;
  }
}

/**
 * Client-side utility to apply default branding
 * This replaces the OrganizationProvider's applyDefaultBranding method
 */
export function applyDefaultBranding(): void {
  if (typeof document === "undefined") {
    return; // Server-side, skip DOM manipulation
  }

  const root = document.documentElement;

  // Apply default branding
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
}

/**
 * Helper function to adjust color brightness
 */
function adjustColor(color: string, percent: number): string {
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
}

/**
 * Hook-like function to get organization and branding data
 * This can be used in components that need organization data
 */
export async function useOrganizationData() {
  return await getOrganizationWithBrandingServerFn();
}

/**
 * Query options for React Query to cache organization and branding data
 */
export const organizationBrandingQueryOptions = () => ({
  queryKey: ["organization-branding"],
  queryFn: () => getOrganizationWithBrandingServerFn(),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
