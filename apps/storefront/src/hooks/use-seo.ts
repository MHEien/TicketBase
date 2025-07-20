import { useEffect, useMemo, useState } from "react";
import { getOrganizationWithBrandingServerFn } from "../utils/branding";
import { SEOManager, SEOConfig, EventSEOData } from "../lib/seo";

interface UseSEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  eventData?: EventSEOData;
  categoryName?: string;
  eventCount?: number;
  searchQuery?: string;
  searchResultCount?: number;
}

export function useSEO(options: UseSEOOptions = {}) {
  const [organization, setOrganization] = useState(null);
  const [currentDomain, setCurrentDomain] = useState(null);

  useEffect(() => {
    getOrganizationWithBrandingServerFn().then(({ organization, branding }) => {
      setOrganization(organization);
      setCurrentDomain(branding?.currentDomain);
    });
  }, []);

  // Create SEO manager instance
  const seoManager = useMemo(() => {
    const baseUrl = currentDomain
      ? `https://${currentDomain}`
      : typeof window !== "undefined"
        ? window.location.origin
        : "https://localhost:3000";
    return new SEOManager(organization, baseUrl, currentDomain || "");
  }, [organization, currentDomain]);

  // Generate SEO config based on options
  const seoConfig = useMemo(() => {
    let config: SEOConfig;

    if (options.eventData) {
      // Event page SEO
      config = seoManager.getEventSEO(options.eventData);
    } else if (options.categoryName && options.eventCount !== undefined) {
      // Category page SEO
      config = seoManager.getCategorySEO(
        options.categoryName,
        options.eventCount,
      );
    } else if (options.searchQuery && options.searchResultCount !== undefined) {
      // Search results SEO
      config = seoManager.getSearchSEO(
        options.searchQuery,
        options.searchResultCount,
      );
    } else {
      // Default/base SEO
      config = seoManager.getBaseSEO();
    }

    // Override with custom options
    if (options.title) config.title = options.title;
    if (options.description) config.description = options.description;
    if (options.keywords) config.keywords = options.keywords;
    if (options.ogImage) config.ogImage = options.ogImage;
    if (options.noIndex !== undefined) config.noIndex = options.noIndex;
    if (options.noFollow !== undefined) config.noFollow = options.noFollow;

    return config;
  }, [seoManager, options]);

  // Apply SEO configuration to document
  useEffect(() => {
    if (seoConfig) {
      SEOManager.applySEO(seoConfig);
    }
  }, [seoConfig]);

  // Return SEO utilities
  return {
    seoManager,
    seoConfig,
    applySEO: (config: SEOConfig) => SEOManager.applySEO(config),
    generateSitemap: (events: EventSEOData[] = []) =>
      seoManager.generateSitemap(events),
  };
}

// Specialized hooks for different page types
export function useEventSEO(eventData: EventSEOData) {
  return useSEO({ eventData });
}

export function useCategorySEO(categoryName: string, eventCount: number) {
  return useSEO({ categoryName, eventCount });
}

export function useSearchSEO(query: string, resultCount: number) {
  return useSEO({ searchQuery: query, searchResultCount: resultCount });
}

export function useBaseSEO(
  customOptions: Omit<
    UseSEOOptions,
    | "eventData"
    | "categoryName"
    | "eventCount"
    | "searchQuery"
    | "searchResultCount"
  > = {},
) {
  return useSEO(customOptions);
}
