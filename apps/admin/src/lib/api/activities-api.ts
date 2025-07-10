import { apiClient } from "./api-client";

export interface Activity {
  id: string;
  userId: string;
  organizationId: string;
  type: ActivityType;
  description: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  status: ActivityStatus;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export enum ActivityType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  VIEW = "view",
  EXPORT = "export",
  IMPORT = "import",
  PUBLISH = "publish",
  ARCHIVE = "archive",
  RESTORE = "restore",
  PERMISSION_CHANGE = "permission_change",
}

export enum ActivityStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
}

export interface ActivityQueryParams {
  type?: ActivityType;
  status?: ActivityStatus;
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedActivitiesResponse {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetch organization activities with filtering
 */
export async function fetchActivities(
  params?: ActivityQueryParams,
): Promise<PaginatedActivitiesResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.type) {
      queryParams.append("type", params.type);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.entityType) {
      queryParams.append("entityType", params.entityType);
    }
    if (params?.entityId) {
      queryParams.append("entityId", params.entityId);
    }
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `/activities${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiClient.get(url);

    // Transform date strings back to Date objects
    return {
      ...response.data,
      activities: response.data.activities.map((activity: any) => ({
        ...activity,
        createdAt: new Date(activity.createdAt),
      })),
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
}

/**
 * Fetch activities for a specific user
 */
export async function fetchUserActivities(
  userId: string,
  page: number = 1,
  limit: number = 50,
): Promise<PaginatedActivitiesResponse> {
  try {
    const response = await apiClient.get(
      `/activities/user/${userId}?page=${page}&limit=${limit}`,
    );

    // Transform date strings back to Date objects
    return {
      ...response.data,
      activities: response.data.activities.map((activity: any) => ({
        ...activity,
        createdAt: new Date(activity.createdAt),
      })),
    };
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw error;
  }
}

/**
 * Fetch activities for a specific entity
 */
export async function fetchEntityActivities(
  entityType: string,
  entityId: string,
  page: number = 1,
  limit: number = 50,
): Promise<PaginatedActivitiesResponse> {
  try {
    const response = await apiClient.get(
      `/activities/entity/${entityType}/${entityId}?page=${page}&limit=${limit}`,
    );

    // Transform date strings back to Date objects
    return {
      ...response.data,
      activities: response.data.activities.map((activity: any) => ({
        ...activity,
        createdAt: new Date(activity.createdAt),
      })),
    };
  } catch (error) {
    console.error("Error fetching entity activities:", error);
    throw error;
  }
}

/**
 * Get human-readable activity type label
 */
export function getActivityTypeLabel(type: ActivityType): string {
  switch (type) {
    case ActivityType.CREATE:
      return "Created";
    case ActivityType.UPDATE:
      return "Updated";
    case ActivityType.DELETE:
      return "Deleted";
    case ActivityType.LOGIN:
      return "Logged In";
    case ActivityType.LOGOUT:
      return "Logged Out";
    case ActivityType.VIEW:
      return "Viewed";
    case ActivityType.EXPORT:
      return "Exported";
    case ActivityType.IMPORT:
      return "Imported";
    case ActivityType.PUBLISH:
      return "Published";
    case ActivityType.ARCHIVE:
      return "Archived";
    case ActivityType.RESTORE:
      return "Restored";
    case ActivityType.PERMISSION_CHANGE:
      return "Changed Permissions";
    default:
      return type;
  }
}

/**
 * Get activity status badge variant
 */
export function getActivityStatusVariant(
  status: ActivityStatus,
): "default" | "success" | "destructive" | "warning" {
  switch (status) {
    case ActivityStatus.SUCCESS:
      return "success";
    case ActivityStatus.FAILED:
      return "destructive";
    case ActivityStatus.PENDING:
      return "warning";
    default:
      return "default";
  }
}
