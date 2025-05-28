import { apiClient } from "./api-client";

// Types matching the backend
export enum ActivityType {
  FINANCIAL = "FINANCIAL",
  EVENT_MANAGEMENT = "EVENT_MANAGEMENT",
  USER_MANAGEMENT = "USER_MANAGEMENT",
  ADMINISTRATIVE = "ADMINISTRATIVE",
  SECURITY = "SECURITY",
  MARKETING = "MARKETING",
}

export enum ActivitySeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface ActivityUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface ActivityMetadata {
  [key: string]: string | number | boolean;
}

export interface RelatedEntity {
  id: string;
  type: string;
  name: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  severity: ActivitySeverity;
  description: string;
  createdAt: string;
  user: ActivityUser;
  metadata?: ActivityMetadata;
  relatedEntityId?: string;
  relatedEntityType?: string;
  relatedEntityName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface GetActivitiesParams {
  search?: string;
  type?: ActivityType;
  severity?: ActivitySeverity;
  dateRange?: string;
  limit?: number;
  offset?: number;
}

export interface GetActivitiesResponse {
  activities: Activity[];
  total: number;
}

export interface ActivityCounts {
  total: number;
  financial: number;
  eventManagement: number;
  userManagement: number;
  administrative: number;
  security: number;
  marketing: number;
}

export interface CreateActivityDto {
  type: ActivityType;
  severity?: ActivitySeverity;
  description: string;
  metadata?: ActivityMetadata;
  relatedEntityId?: string;
  relatedEntityType?: string;
  relatedEntityName?: string;
}

export const activityApi = {
  // Get activities with filtering and pagination
  async getActivities(params: GetActivitiesParams = {}): Promise<GetActivitiesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.severity) searchParams.append('severity', params.severity);
    if (params.dateRange) searchParams.append('dateRange', params.dateRange);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const response = await apiClient.get(
      `/api/activities?${searchParams.toString()}`
    );
    return response.data;
  },

  // Get activity counts by type
  async getActivityCounts(dateRange?: string): Promise<ActivityCounts> {
    const searchParams = new URLSearchParams();
    if (dateRange) searchParams.append('dateRange', dateRange);

    const response = await apiClient.get(
      `/api/activities/counts?${searchParams.toString()}`
    );
    return response.data;
  },

  // Get recent activities
  async getRecentActivities(limit?: number): Promise<Activity[]> {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append('limit', limit.toString());

    const response = await apiClient.get(
      `/api/activities/recent?${searchParams.toString()}`
    );
    return response.data;
  },

  // Get activity by ID
  async getActivityById(id: string): Promise<Activity> {
    const response = await apiClient.get(`/api/activities/${id}`);
    return response.data;
  },

  // Create new activity
  async createActivity(activity: CreateActivityDto): Promise<Activity> {
    const response = await apiClient.post('/api/activities', activity);
    return response.data;
  },

  // Delete activity
  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`/api/activities/${id}`);
  },

  // Helper method to log activities from other parts of the app
  async logActivity(
    type: ActivityType,
    description: string,
    options?: {
      severity?: ActivitySeverity;
      metadata?: ActivityMetadata;
      relatedEntityId?: string;
      relatedEntityType?: string;
      relatedEntityName?: string;
    }
  ): Promise<Activity> {
    return this.createActivity({
      type,
      description,
      severity: options?.severity || ActivitySeverity.LOW,
      metadata: options?.metadata,
      relatedEntityId: options?.relatedEntityId,
      relatedEntityType: options?.relatedEntityType,
      relatedEntityName: options?.relatedEntityName,
    });
  },
}; 