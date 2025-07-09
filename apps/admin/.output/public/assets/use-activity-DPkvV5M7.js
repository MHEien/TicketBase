import {
  c as createLucideIcon,
  a0 as apiClient,
  r as reactExports,
} from "./main-D54NVj6U.js";
import { u as useToast } from "./use-toast-nfgjIcjL.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const RefreshCw = createLucideIcon("RefreshCw", [
  [
    "path",
    { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" },
  ],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  [
    "path",
    { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" },
  ],
  ["path", { d: "M8 16H3v5", key: "1cv678" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const TrendingUp = createLucideIcon("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }],
]);

var ActivityType = /* @__PURE__ */ ((ActivityType2) => {
  ActivityType2["FINANCIAL"] = "FINANCIAL";
  ActivityType2["EVENT_MANAGEMENT"] = "EVENT_MANAGEMENT";
  ActivityType2["USER_MANAGEMENT"] = "USER_MANAGEMENT";
  ActivityType2["ADMINISTRATIVE"] = "ADMINISTRATIVE";
  ActivityType2["SECURITY"] = "SECURITY";
  ActivityType2["MARKETING"] = "MARKETING";
  return ActivityType2;
})(ActivityType || {});
var ActivitySeverity = /* @__PURE__ */ ((ActivitySeverity2) => {
  ActivitySeverity2["LOW"] = "LOW";
  ActivitySeverity2["MEDIUM"] = "MEDIUM";
  ActivitySeverity2["HIGH"] = "HIGH";
  return ActivitySeverity2;
})(ActivitySeverity || {});
const activityApi = {
  // Get activities with filtering and pagination
  async getActivities(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append("search", params.search);
    if (params.type) searchParams.append("type", params.type);
    if (params.severity) searchParams.append("severity", params.severity);
    if (params.dateRange) searchParams.append("dateRange", params.dateRange);
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.offset) searchParams.append("offset", params.offset.toString());
    const response = await apiClient.get(
      `/api/activities?${searchParams.toString()}`,
    );
    return response.data;
  },
  // Get activity counts by type
  async getActivityCounts(dateRange) {
    const searchParams = new URLSearchParams();
    if (dateRange) searchParams.append("dateRange", dateRange);
    const response = await apiClient.get(
      `/api/activities/counts?${searchParams.toString()}`,
    );
    return response.data;
  },
  // Get recent activities
  async getRecentActivities(limit) {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append("limit", limit.toString());
    const response = await apiClient.get(
      `/api/activities/recent?${searchParams.toString()}`,
    );
    return response.data;
  },
  // Get activity by ID
  async getActivityById(id) {
    const response = await apiClient.get(`/api/activities/${id}`);
    return response.data;
  },
  // Create new activity
  async createActivity(activity) {
    const response = await apiClient.post("/api/activities", activity);
    return response.data;
  },
  // Delete activity
  async deleteActivity(id) {
    await apiClient.delete(`/api/activities/${id}`);
  },
  // Helper method to log activities from other parts of the app
  async logActivity(type, description, options) {
    return this.createActivity({
      type,
      description,
      severity: options?.severity || "LOW" /* LOW */,
      metadata: options?.metadata,
      relatedEntityId: options?.relatedEntityId,
      relatedEntityType: options?.relatedEntityType,
      relatedEntityName: options?.relatedEntityName,
    });
  },
};

function useActivity(options = {}) {
  const [activities, setActivities] = reactExports.useState([]);
  const [activityCounts, setActivityCounts] = reactExports.useState(null);
  const [total, setTotal] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const { toast } = useToast();
  const {
    search,
    type,
    severity,
    dateRange = "7d",
    limit = 50,
    offset = 0,
    autoRefresh = false,
    refreshInterval = 3e4,
    // 30 seconds
  } = options;
  const fetchActivities = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        search,
        type,
        severity,
        dateRange,
        limit,
        offset,
      };
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
  const refresh = reactExports.useCallback(async () => {
    await fetchActivities();
  }, [fetchActivities]);
  const exportActivities = reactExports.useCallback(async () => {
    try {
      const params = {
        search,
        type,
        severity,
        dateRange,
        limit: 1e4,
        // Large limit for export
        offset: 0,
      };
      const response = await activityApi.getActivities(params);
      const activities2 = response.activities;
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
        ...activities2.map((activity) =>
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
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `activities-${/* @__PURE__ */ new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Export Successful",
        description: `Exported ${activities2.length} activities to CSV`,
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
  reactExports.useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);
  reactExports.useEffect(() => {
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
function useRecentActivity(limit = 10) {
  const [activities, setActivities] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchRecentActivities = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const recentActivities = await activityApi.getRecentActivities(limit);
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
  reactExports.useEffect(() => {
    fetchRecentActivities();
  }, [fetchRecentActivities]);
  return {
    activities,
    loading,
    error,
    refresh: fetchRecentActivities,
  };
}

export {
  ActivityType as A,
  RefreshCw as R,
  TrendingUp as T,
  useActivity as a,
  ActivitySeverity as b,
  useRecentActivity as u,
};
