import { apiClient } from "./api-client";

export interface Event {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  startDate: Date;
  endDate: Date;
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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  ticketTypes: TicketType[];
  salesStartDate?: Date;
  salesEndDate?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  totalTicketsSold: number;
  totalRevenue: number;
  capacity: number;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  minPerOrder?: number;
  maxPerOrder?: number;
  salesStartDate?: Date;
  salesEndDate?: Date;
  isHidden: boolean;
  isFree: boolean;
  requiresApproval: boolean;
  sortOrder: number;
  availableQuantity: number;
  metadata?: Record<string, any>;
}

export interface CreateEventDto {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  startDate: Date;
  endDate: Date;
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
  visibility?: "public" | "private" | "unlisted";
  salesStartDate?: Date;
  salesEndDate?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  capacity?: number;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface EventsQueryParams {
  status?: "draft" | "published" | "cancelled" | "completed";
  category?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Fetch all events for the current organization
 */
export async function fetchEvents(params?: EventsQueryParams): Promise<Event[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.category) {
      queryParams.append("category", params.category);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate.toISOString());
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate.toISOString());
    }

    const url = `/api/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiClient.get(url);
    
    // Transform date strings back to Date objects
    return response.data.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate ? new Date(event.salesStartDate) : undefined,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEvent(id: string): Promise<Event> {
  try {
    const response = await apiClient.get(`/api/events/${id}`);
    const event = response.data;
    
    // Transform date strings back to Date objects
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate ? new Date(event.salesStartDate) : undefined,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : undefined,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

/**
 * Create a new event
 */
export async function createEvent(eventData: CreateEventDto): Promise<Event> {
  try {
    const response = await apiClient.post("/api/events", eventData);
    const event = response.data;
    
    // Transform date strings back to Date objects
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate ? new Date(event.salesStartDate) : undefined,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : undefined,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(id: string, eventData: UpdateEventDto): Promise<Event> {
  try {
    const response = await apiClient.patch(`/api/events/${id}`, eventData);
    const event = response.data;
    
    // Transform date strings back to Date objects
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate ? new Date(event.salesStartDate) : undefined,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : undefined,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/events/${id}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

/**
 * Publish an event
 */
export async function publishEvent(id: string): Promise<Event> {
  try {
    const response = await apiClient.post(`/api/events/${id}/publish`);
    const event = response.data;
    
    // Transform date strings back to Date objects
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate ? new Date(event.salesStartDate) : undefined,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : undefined,
    };
  } catch (error) {
    console.error("Error publishing event:", error);
    throw error;
  }
}

/**
 * Cancel an event
 */
export async function cancelEvent(id: string): Promise<Event> {
  try {
    const response = await apiClient.post(`/api/events/${id}/cancel`);
    const event = response.data;
    
    // Transform date strings back to Date objects
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate ? new Date(event.salesStartDate) : undefined,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : undefined,
    };
  } catch (error) {
    console.error("Error cancelling event:", error);
    throw error;
  }
} 