import { Organization } from "./api/organizations";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "event";
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, any>;
}

export interface EventSEOData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
  image?: string;
  price?: {
    currency: string;
    value: number;
  };
  organizer?: {
    name: string;
    url?: string;
  };
  url: string;
}

export class SEOManager {
  private organization: Organization | null = null;
  private baseUrl: string = "";
  private currentDomain: string = "";

  constructor(
    organization: Organization | null = null,
    baseUrl: string = "",
    currentDomain: string = "",
  ) {
    this.organization = organization;
    this.baseUrl = baseUrl;
    this.currentDomain = currentDomain;
  }

  /**
   * Generate base SEO configuration for the organization
   */
  getBaseSEO(): SEOConfig {
    const orgName = this.organization?.name || "Events Platform";
    const description =
      this.organization?.checkoutMessage ||
      "Discover and book tickets for amazing events. From concerts to conferences, find your next unforgettable experience.";

    return {
      title: `${orgName} - Premium Events`,
      description,
      keywords: [
        "events",
        "tickets",
        "booking",
        "entertainment",
        orgName.toLowerCase(),
      ],
      canonical: this.baseUrl,
      ogType: "website",
      ogImage: this.organization?.logo || `${this.baseUrl}/og-image.jpg`,
      twitterCard: "summary_large_image",
      structuredData: this.getOrganizationStructuredData(),
    };
  }

  /**
   * Generate SEO for event pages
   */
  getEventSEO(event: EventSEOData): SEOConfig {
    const orgName = this.organization?.name || "Events Platform";
    const title = `${event.name} - ${orgName}`;
    const description =
      event.description.length > 160
        ? `${event.description.substring(0, 157)}...`
        : event.description;

    return {
      title,
      description,
      keywords: [
        "event",
        "tickets",
        event.name.toLowerCase(),
        orgName.toLowerCase(),
      ],
      canonical: event.url,
      ogType: "event",
      ogImage:
        event.image ||
        this.organization?.logo ||
        `${this.baseUrl}/og-image.jpg`,
      twitterCard: "summary_large_image",
      structuredData: this.getEventStructuredData(event),
    };
  }

  /**
   * Generate SEO for category pages
   */
  getCategorySEO(categoryName: string, eventCount: number): SEOConfig {
    const orgName = this.organization?.name || "Events Platform";
    const title = `${categoryName} Events - ${orgName}`;
    const description = `Discover ${eventCount} amazing ${categoryName.toLowerCase()} events. Book tickets now for the best experiences.`;

    return {
      title,
      description,
      keywords: [
        categoryName.toLowerCase(),
        "events",
        "tickets",
        orgName.toLowerCase(),
      ],
      canonical: `${this.baseUrl}/categories/${categoryName.toLowerCase().replace(/\s+/g, "-")}`,
      ogType: "website",
      ogImage: this.organization?.logo || `${this.baseUrl}/og-image.jpg`,
      twitterCard: "summary",
    };
  }

  /**
   * Generate SEO for search results
   */
  getSearchSEO(query: string, resultCount: number): SEOConfig {
    const orgName = this.organization?.name || "Events Platform";
    const title = `Search: "${query}" - ${orgName}`;
    const description = `Found ${resultCount} events matching "${query}". Discover and book tickets for your next experience.`;

    return {
      title,
      description,
      canonical: `${this.baseUrl}/search?q=${encodeURIComponent(query)}`,
      ogType: "website",
      noIndex: true, // Don't index search results
      structuredData: this.getSearchResultsStructuredData(query, resultCount),
    };
  }

  /**
   * Generate Organization structured data
   */
  private getOrganizationStructuredData(): Record<string, any> {
    if (!this.organization) return {};

    const structuredData: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: this.organization.name,
      url: this.organization.website || this.baseUrl,
      description:
        this.organization.checkoutMessage || "Premium events platform",
    };

    if (this.organization.logo) {
      structuredData.logo = this.organization.logo;
    }

    if (this.organization.email) {
      structuredData.email = this.organization.email;
    }

    if (this.organization.phone) {
      structuredData.telephone = this.organization.phone;
    }

    // TODO: Add address support when available in Organization interface
    // if (this.organization.address) {
    //   structuredData.address = {
    //     '@type': 'PostalAddress',
    //     streetAddress: this.organization.address.line1,
    //     addressLocality: this.organization.address.city,
    //     addressRegion: this.organization.address.state,
    //     postalCode: this.organization.address.postalCode,
    //     addressCountry: this.organization.address.country,
    //   };
    // }

    // Add social media links
    if (this.organization.settings?.socialLinks?.length) {
      structuredData.sameAs = this.organization.settings.socialLinks.map(
        (link) => link.url,
      );
    }

    return structuredData;
  }

  /**
   * Generate Event structured data
   */
  private getEventStructuredData(event: EventSEOData): Record<string, any> {
    const structuredData: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      url: event.url,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    };

    if (event.endDate) {
      structuredData.endDate = event.endDate;
    }

    if (event.image) {
      structuredData.image = event.image;
    }

    if (event.location) {
      structuredData.location = {
        "@type": "Place",
        name: event.location.name,
      };

      if (event.location.address) {
        structuredData.location.address = {
          "@type": "PostalAddress",
          streetAddress: event.location.address,
          addressLocality: event.location.city,
          addressCountry: event.location.country,
        };
      }
    }

    if (event.organizer) {
      structuredData.organizer = {
        "@type": "Organization",
        name: event.organizer.name,
        url: event.organizer.url,
      };
    }

    if (event.price) {
      structuredData.offers = {
        "@type": "Offer",
        price: event.price.value,
        priceCurrency: event.price.currency,
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString(),
      };
    }

    return structuredData;
  }

  /**
   * Generate search results structured data
   */
  private getSearchResultsStructuredData(
    query: string,
    resultCount: number,
  ): Record<string, any> {
    return {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: resultCount,
        name: `Search results for "${query}"`,
      },
    };
  }

  /**
   * Apply SEO configuration to document
   */
  static applySEO(config: SEOConfig): void {
    // Update title
    document.title = config.title;

    // Update or create meta tags
    this.updateMetaTag("description", config.description);
    this.updateMetaTag("keywords", config.keywords?.join(", ") || "");

    // Canonical URL
    if (config.canonical) {
      this.updateLinkTag("canonical", config.canonical);
    }

    // Robots meta
    const robotsContent = [];
    if (config.noIndex) robotsContent.push("noindex");
    if (config.noFollow) robotsContent.push("nofollow");
    if (robotsContent.length > 0) {
      this.updateMetaTag("robots", robotsContent.join(", "));
    }

    // Open Graph tags
    this.updateMetaTag("og:title", config.title, "property");
    this.updateMetaTag("og:description", config.description, "property");
    this.updateMetaTag("og:type", config.ogType || "website", "property");
    if (config.ogImage) {
      this.updateMetaTag("og:image", config.ogImage, "property");
    }
    if (config.canonical) {
      this.updateMetaTag("og:url", config.canonical, "property");
    }

    // Twitter Card tags
    this.updateMetaTag("twitter:card", config.twitterCard || "summary", "name");
    this.updateMetaTag("twitter:title", config.title, "name");
    this.updateMetaTag("twitter:description", config.description, "name");
    if (config.ogImage) {
      this.updateMetaTag("twitter:image", config.ogImage, "name");
    }

    // Structured data
    if (config.structuredData) {
      this.updateStructuredData(config.structuredData);
    }
  }

  /**
   * Update or create meta tag
   */
  private static updateMetaTag(
    name: string,
    content: string,
    attribute: string = "name",
  ): void {
    if (!content) return;

    const selector = `meta[${attribute}="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  /**
   * Update or create link tag
   */
  private static updateLinkTag(rel: string, href: string): void {
    if (!href) return;

    const selector = `link[rel="${rel}"]`;
    let link = document.querySelector(selector) as HTMLLinkElement;

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }

    link.setAttribute("href", href);
  }

  /**
   * Update structured data
   */
  private static updateStructuredData(data: Record<string, any>): void {
    const existingScript = document.querySelector(
      'script[data-schema-type="seo"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-schema-type", "seo");
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Generate sitemap data
   */
  generateSitemap(events: EventSEOData[] = []): string {
    const urls = [
      {
        url: this.baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: `${this.baseUrl}/events`,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "0.9",
      },
      {
        url: `${this.baseUrl}/categories`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
      },
      {
        url: `${this.baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      },
    ];

    // Add event URLs
    events.forEach((event) => {
      urls.push({
        url: event.url,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "0.8",
      });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    return sitemap;
  }
}
