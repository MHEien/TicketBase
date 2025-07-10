import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import {
  activityApi,
  Activity,
  ActivityType,
  ActivitySeverity,
  GetActivitiesParams,
  ActivityCounts,
} from "@/lib/api/activity-api";
import { analyticsApi, RecentActivity } from "@/lib/api/analytics-api";

// Re-export types for backward compatibility
export { ActivityType, ActivitySeverity };
export type { Activity };

// Legacy interfaces for backward compatibility
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

interface UseActivityReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  exportActivities: () => Promise<void>;
  activityCounts: ActivityCounts | null;
  total: number;
}

interface UseActivityOptions {
  search?: string;
  type?: ActivityType;
  severity?: ActivitySeverity;
  dateRange?: string;
  limit?: number;
  offset?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseRecentActivityReturn {
  activities: RecentActivity[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useActivity(
  options: UseActivityOptions = {},
): UseActivityReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityCounts, setActivityCounts] = useState<ActivityCounts | null>(
    null,
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    search,
    type,
    severity,
    dateRange = "7d",
    limit = 50,
    offset = 0,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetActivitiesParams = {
        search,
        type,
        severity,
        dateRange,
        limit,
        offset,
      };

      // Fetch activities and counts in parallel
      const [activitiesResponse, countsResponse] = await Promise.all([
        activityApi.getActivities(params),
        activityApi.getActivityCounts(dateRange),
      ]);

      setActivities(activitiesResponse.activities);
      setTotal(activitiesResponse.total);
      setActivityCounts(countsResponse);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch activities";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [search, type, severity, dateRange, limit, offset, toast]);

  const refresh = useCallback(async () => {
    await fetchActivities();
  }, [fetchActivities]);

  const exportActivities = useCallback(async () => {
    try {
      // Fetch all activities for export (no pagination)
      const params: GetActivitiesParams = {
        search,
        type,
        severity,
        dateRange,
        limit: 10000, // Large limit for export
        offset: 0,
      };

      const response = await activityApi.getActivities(params);
      const activities = response.activities;

      // Convert to CSV
      const headers = [
        "ID",
        "Type",
        "Severity",
        "Description",
        "User",
        "Email",
        "Date",
        "IP Address",
        "Related Entity",
      ];

      const csvContent = [
        headers.join(","),
        ...activities.map((activity) =>
          [
            activity.id,
            activity.type,
            activity.severity,
            `"${activity.description.replace(/"/g, '""')}"`,
            `"${activity.user.name.replace(/"/g, '""')}"`,
            activity.user.email,
            new Date(activity.createdAt).toISOString(),
            activity.ipAddress || "",
            activity.relatedEntityName || "",
          ].join(","),
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `activities-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${activities.length} activities to CSV`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export activities";
      toast({
        title: "Export Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [search, type, severity, dateRange, toast]);

  // Initial fetch
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchActivities();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchActivities]);

  return {
    activities,
    activityCounts,
    total,
    loading,
    error,
    refresh,
    exportActivities,
  };
}

// Enhanced helper hook for recent activities (used in dashboard)
// Now uses the analytics API for comprehensive activity data
export function useRecentActivity(limit: number = 10): UseRecentActivityReturn {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const recentActivities = await analyticsApi.getRecentActivity(limit);
      setActivities(recentActivities);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch recent activities";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentActivities();
  }, [fetchRecentActivities]);

  return {
    activities,
    loading,
    error,
    refresh: fetchRecentActivities,
  };
}
