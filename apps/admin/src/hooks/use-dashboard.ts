import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { useDateRange } from "./use-date-range";
import {
  analyticsApi,
  DashboardMetrics,
  SalesData,
  RecentActivity,
  UpcomingEvent,
  PerformanceMetric,
  PopularPlugin,
} from "@/lib/api/analytics-api";

interface UseDashboardOptions {
  refreshInterval?: number; // in milliseconds
  autoRefresh?: boolean;
}

interface DashboardData {
  metrics: DashboardMetrics | null;
  salesData: SalesData[];
  recentActivity: RecentActivity[];
  upcomingEvents: UpcomingEvent[];
  performanceMetrics: PerformanceMetric[];
  popularPlugins: PopularPlugin[];
}

interface UseDashboardReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshSalesData: (startDate: Date, endDate: Date) => Promise<void>;
  refreshActivity: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  refreshPlugins: () => Promise<void>;
}

export function useDashboard(
  options: UseDashboardOptions = {},
): UseDashboardReturn {
  const { refreshInterval = 300000, autoRefresh = true } = options; // Default 5 minutes
  const { toast } = useToast();
  const { dateRange } = useDateRange();

  const [data, setData] = useState<DashboardData>({
    metrics: null,
    salesData: [],
    recentActivity: [],
    upcomingEvents: [],
    performanceMetrics: [],
    popularPlugins: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get date range from context
  const getDateRange = useCallback(() => {
    const startDate = dateRange.from || new Date();
    const endDate = dateRange.to || new Date();
    return { startDate, endDate };
  }, [dateRange]);

  // Refresh dashboard metrics
  const refreshMetrics = useCallback(async () => {
    try {
      const { startDate, endDate } = getDateRange();
      const metrics = await analyticsApi.getDashboardMetrics(
        startDate,
        endDate,
      );
      setData((prev) => ({ ...prev, metrics }));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch dashboard metrics";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [getDateRange, toast]);

  // Refresh sales data
  const refreshSalesData = useCallback(
    async (startDate?: Date, endDate?: Date) => {
      try {
        const dateRange =
          startDate && endDate ? { startDate, endDate } : getDateRange();
        const salesData = await analyticsApi.getRevenueChartData(
          dateRange.startDate,
          dateRange.endDate,
          "daily",
        );
        setData((prev) => ({ ...prev, salesData }));
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch sales data";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [getDateRange, toast],
  );

  // Refresh recent activity
  const refreshActivity = useCallback(async () => {
    try {
      const recentActivity = await analyticsApi.getRecentActivity(10);
      setData((prev) => ({ ...prev, recentActivity }));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch recent activity";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Refresh upcoming events
  const refreshEvents = useCallback(async () => {
    try {
      const upcomingEvents = await analyticsApi.getUpcomingEvents(5);
      setData((prev) => ({ ...prev, upcomingEvents }));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch upcoming events";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Refresh performance metrics
  const refreshPerformance = useCallback(async () => {
    try {
      const performanceMetrics = await analyticsApi.getPerformanceMetrics();
      setData((prev) => ({ ...prev, performanceMetrics }));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch performance metrics";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Refresh popular plugins
  const refreshPlugins = useCallback(async () => {
    try {
      const popularPlugins = await analyticsApi.getPopularPlugins();
      setData((prev) => ({ ...prev, popularPlugins }));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch popular plugins";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Refresh all data
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        refreshMetrics(),
        refreshSalesData(),
        refreshActivity(),
        refreshEvents(),
        refreshPerformance(),
        refreshPlugins(),
      ]);
    } catch (err) {
      // Individual errors are handled in each function
      console.error("Dashboard refresh error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    refreshMetrics,
    refreshSalesData,
    refreshActivity,
    refreshEvents,
    refreshPerformance,
    refreshPlugins,
  ]);

  // Initial data load and refresh when date range changes
  useEffect(() => {
    refresh();
  }, [refresh, dateRange]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    data,
    loading,
    error,
    refresh,
    refreshMetrics,
    refreshSalesData,
    refreshActivity,
    refreshEvents,
    refreshPerformance,
    refreshPlugins,
  };
}
