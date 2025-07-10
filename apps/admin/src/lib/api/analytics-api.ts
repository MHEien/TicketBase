import { apiClient } from "./api-client";

// Types for analytics data
export interface DashboardMetrics {
  totalRevenue: number;
  ticketsSold: number;
  activeEvents: number;
  newUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  userRetention: number;
  pluginUsage: number;
  changes: {
    revenue: string;
    tickets: string;
    activeEvents: string;
    newUsers: string;
    conversionRate: string;
    averageOrderValue: string;
    userRetention: string;
    pluginUsage: string;
  };
}

export interface SalesData {
  date: string;
  revenue: number;
  tickets: number;
  sales: number;
}

export interface EventAnalytics {
  id: string;
  eventId: string;
  organizationId: string;
  date: Date;
  totalViews: number;
  uniqueViews: number;
  totalSales: number;
  ticketsSold: number;
  conversionRate: number;
  revenue: number;
  ticketTypeBreakdown: Record<string, { quantity: number; revenue: number }>;
  refunds: number;
  referrers: Record<string, number>;
  createdAt: Date;
}

export interface SalesAnalytics {
  id: string;
  organizationId: string;
  dateRange: "daily" | "weekly" | "monthly";
  date: Date;
  totalSales: number;
  totalRevenue: number;
  ticketsSold: number;
  averageOrderValue: number;
  refundAmount: number;
  feesCollected: number;
  eventBreakdown: Record<
    string,
    { sales: number; revenue: number; tickets: number }
  >;
  paymentMethodBreakdown: Record<string, { sales: number; revenue: number }>;
  createdAt: Date;
}

export interface RecentActivity {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  description: string;
  time: string;
  type: string;
  entityType?: string;
  entityName?: string;
  status: "success" | "failed" | "pending";
  metadata?: Record<string, any>;
}

export interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  tickets: number;
  sold: number;
  revenue: number;
}

export interface PerformanceMetric {
  name: string;
  value: string;
  change: string;
  icon: string;
}

export interface PopularPlugin {
  id: string;
  name: string;
  description: string;
  installs: number;
  rating: number;
  category: string;
  icon: string;
  version: string;
  author: string;
  rank: number;
}

// API functions
export const analyticsApi = {
  // Get dashboard overview metrics
  async getDashboardMetrics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<DashboardMetrics> {
    const params = new URLSearchParams();
    if (startDate) params.append("start", startDate.toISOString());
    if (endDate) params.append("end", endDate.toISOString());

    const response = await apiClient.get(`/api/analytics/dashboard?${params}`);
    return response.data;
  },

  // Get sales analytics for charts
  async getSalesAnalytics(
    startDate: Date,
    endDate: Date,
  ): Promise<SalesAnalytics[]> {
    const params = new URLSearchParams({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });

    const response = await apiClient.get(`/api/analytics/sales?${params}`);
    return response.data;
  },

  // Get event analytics
  async getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    const response = await apiClient.get(`/api/analytics/event/${eventId}`);
    return response.data;
  },

  // Get recent activity (this might come from a different endpoint)
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const response = await apiClient.get(
      `/api/analytics/activity?limit=${limit}`,
    );
    return response.data;
  },

  // Get upcoming events with sales data
  async getUpcomingEvents(limit: number = 5): Promise<UpcomingEvent[]> {
    const response = await apiClient.get(
      `/api/events?upcoming=true&limit=${limit}&include=sales`,
    );
    return response.data;
  },

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    const response = await apiClient.get("/api/analytics/performance");
    return response.data;
  },

  // Get revenue chart data
  async getRevenueChartData(
    startDate: Date,
    endDate: Date,
    granularity: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<SalesData[]> {
    const params = new URLSearchParams({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      granularity,
    });

    const response = await apiClient.get(
      `/api/analytics/revenue-chart?${params}`,
    );
    return response.data;
  },

  // Get audience demographics data
  async getAudienceData(): Promise<any> {
    const response = await apiClient.get("/api/analytics/audience");
    return response.data;
  },

  // Get geographic distribution data
  async getGeographicData(): Promise<any> {
    const response = await apiClient.get("/api/analytics/geographic");
    return response.data;
  },

  async getPopularPlugins(): Promise<PopularPlugin[]> {
    const response = await apiClient.get("/api/analytics/popular-plugins");
    return response.data;
  },
};
