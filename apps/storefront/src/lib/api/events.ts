import { apiClient } from "../api-client";

export interface Event {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  locationType: "physical" | "virtual" | "hybrid";
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  virtualEventUrl?: string;
  featuredImage?: string;
  galleryImages?: string[];
  status: "draft" | "published" | "cancelled" | "completed";
  visibility: "public" | "private" | "unlisted";
  salesStartDate?: string;
  salesEndDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  totalTicketsSold: number;
  totalRevenue: number;
  capacity: number;
  ticketTypes: TicketType[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  salesStartDate?: string;
  salesEndDate?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  category?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export const eventsApi = {
  // Get events by organization - the main function for fetching public events
  async getEventsByOrganization(
    organizationId: string,
    filters?: EventFilters,
  ): Promise<Event[]> {
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const params = new URLSearchParams();
    params.append("organizationId", organizationId);

    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());

    return apiClient.get<Event[]>(
      `/api/public/events/by-organization?${params.toString()}`,
    );
  },

  // Get single public event by ID for an organization
  async getPublicEvent(id: string, organizationId: string): Promise<Event> {
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const params = new URLSearchParams();
    params.append("organizationId", organizationId);

    return apiClient.get<Event>(
      `/api/public/events/by-organization/${id}?${params.toString()}`,
    );
  },

  // Get event categories
  async getEventCategories(): Promise<string[]> {
    // Use the new public categories endpoint
    return apiClient.get<string[]>("/api/public/events/categories");
  },

  // Get upcoming events for an organization
  async getUpcomingEvents(
    organizationId: string,
    limit?: number,
  ): Promise<Event[]> {
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const params = new URLSearchParams();
    params.append("organizationId", organizationId);
    params.append("upcoming", "true");
    if (limit) params.append("limit", limit.toString());

    return apiClient.get<Event[]>(
      `/api/public/events/by-organization?${params.toString()}`,
    );
  },

  // Get featured events for an organization
  async getFeaturedEvents(
    organizationId: string,
    limit?: number,
  ): Promise<Event[]> {
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const params = new URLSearchParams();
    params.append("organizationId", organizationId);
    params.append("featured", "true");
    if (limit) params.append("limit", limit.toString());

    return apiClient.get<Event[]>(
      `/api/public/events/by-organization?${params.toString()}`,
    );
  },

  // Search events for an organization
  async searchEvents(
    organizationId: string,
    query: string,
    filters?: EventFilters,
  ): Promise<Event[]> {
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const params = new URLSearchParams();
    params.append("organizationId", organizationId);
    params.append("search", query);

    if (filters?.category) params.append("category", filters.category);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());

    return apiClient.get<Event[]>(
      `/api/public/events/by-organization?${params.toString()}`,
    );
  },
};
