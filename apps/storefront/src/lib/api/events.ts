import { apiClient } from '../api-client';

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
  locationType: 'physical' | 'virtual' | 'hybrid';
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  virtualEventUrl?: string;
  featuredImage?: string;
  galleryImages?: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  visibility: 'public' | 'private' | 'unlisted';
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
  // Get all public events (no auth required)
  async getPublicEvents(filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const queryString = params.toString();
    const url = `/events${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Event[]>(url);
  },

  // Get single public event by ID
  async getPublicEvent(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  },

  // Get events by organization (for custom domains)
  async getEventsByOrganization(organizationId: string, filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const queryString = params.toString();
    const url = `/events${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Event[]>(url);
  },

  // Get event categories
  async getEventCategories(): Promise<string[]> {
    // For now, return static categories - this could be enhanced with a backend endpoint
    return Promise.resolve(['Music', 'Conference', 'Sports', 'Arts', 'Food', 'Technology', 'Business', 'Community']);
  },

  // Get upcoming events
  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    const params = new URLSearchParams();
    params.append('upcoming', 'true');
    if (limit) params.append('limit', limit.toString());
    
    return apiClient.get<Event[]>(`/events?${params.toString()}`);
  },

  // Get featured events
  async getFeaturedEvents(limit?: number): Promise<Event[]> {
    const params = new URLSearchParams();
    params.append('featured', 'true');
    if (limit) params.append('limit', limit.toString());
    
    return apiClient.get<Event[]>(`/events?${params.toString()}`);
  },

  // Search events
  async searchEvents(query: string, filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    params.append('search', query);
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    return apiClient.get<Event[]>(`/events?${params.toString()}`);
  },
}; 