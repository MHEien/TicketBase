"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "@/components/sales-chart";
import { RevenueChart } from "@/components/revenue-chart";

import { AudienceChart } from "@/components/audience-chart";
import { useDashboard } from "@/hooks/use-dashboard";

// Utility functions for formatting numbers and currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

const formatPercentage = (num: number) => {
  return `${num.toFixed(1)}%`;
};

export function DataVisualization() {
  const [timeRange, setTimeRange] = useState("30d");

  // Dashboard data hook
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refresh,
  } = useDashboard({
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
  });

  // Calculate date range display
  const getDateRangeDisplay = () => {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into your ticket sales and events.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>{getDateRangeDisplay()}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={dashboardLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${dashboardLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-20 animate-pulse rounded bg-muted"></div>
                      </div>
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : dashboardError ? (
              <Card className="col-span-full">
                <CardContent className="p-6">
                  <p className="text-sm text-destructive">
                    Failed to load metrics
                  </p>
                </CardContent>
              </Card>
            ) : (
              // Real data metrics
              [
                {
                  title: "Total Revenue",
                  value: formatCurrency(
                    dashboardData.metrics?.totalRevenue || 0,
                  ),
                  change: dashboardData.metrics?.changes.revenue || "0%",
                  icon: BarChart3,
                },
                {
                  title: "Tickets Sold",
                  value: formatNumber(dashboardData.metrics?.ticketsSold || 0),
                  change: dashboardData.metrics?.changes.tickets || "0%",
                  icon: Calendar,
                },
                {
                  title: "Conversion Rate",
                  value: formatPercentage(
                    dashboardData.metrics?.conversionRate || 0,
                  ),
                  change: dashboardData.metrics?.changes.conversionRate || "0%",
                  icon: BarChart3,
                },
                {
                  title: "Avg. Order Value",
                  value: formatCurrency(
                    dashboardData.metrics?.averageOrderValue || 0,
                  ),
                  change:
                    dashboardData.metrics?.changes.averageOrderValue || "0%",
                  icon: BarChart3,
                },
              ].map((metric, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">
                          {metric.value}
                        </h3>
                        <p
                          className={`mt-1 text-xs ${
                            metric.change.startsWith("+")
                              ? "text-emerald-500"
                              : metric.change.startsWith("-")
                                ? "text-red-500"
                                : "text-muted-foreground"
                          }`}
                        >
                          {metric.change} vs last period
                        </p>
                      </div>
                      <div className="rounded-full border border-primary/10 bg-primary/5 p-2">
                        <metric.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Daily revenue from ticket sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <RevenueChart
                    data={dashboardData.salesData?.map((item) => ({
                      name: new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      revenue: item.revenue || 0,
                      projected: undefined, // Remove projected data for now as we don't have it
                    }))}
                    loading={dashboardLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {dashboardLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                        <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-20 animate-pulse rounded bg-muted"></div>
                      </div>
                    ))
                  ) : dashboardError ? (
                    <div className="col-span-2 text-sm text-destructive">
                      Failed to load metrics
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Active Events
                        </p>
                        <p className="text-2xl font-bold">
                          {formatNumber(
                            dashboardData.metrics?.activeEvents || 0,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.activeEvents} vs last
                          period
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          User Retention
                        </p>
                        <p className="text-2xl font-bold">
                          {formatPercentage(
                            dashboardData.metrics?.userRetention || 0,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.userRetention} vs last
                          period
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Plugin Usage
                        </p>
                        <p className="text-2xl font-bold">
                          {formatNumber(
                            dashboardData.metrics?.pluginUsage || 0,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.pluginUsage} vs last
                          period
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          New Users
                        </p>
                        <p className="text-2xl font-bold">
                          {formatNumber(dashboardData.metrics?.newUsers || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.newUsers} vs last
                          period
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>
                  Age and interests of your attendees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <AudienceChart
                    ageGroups={undefined}
                    interests={undefined}
                    loading={dashboardLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Detailed breakdown of ticket sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <SalesChart
                  data={dashboardData.salesData?.map((item) => ({
                    date: new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    }),
                    revenue: item.revenue || 0,
                    tickets: item.tickets || 0,
                    sales: item.sales,
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>
                Performance overview of your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {dashboardLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                        <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-20 animate-pulse rounded bg-muted"></div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Active Events
                        </p>
                        <p className="text-3xl font-bold">
                          {formatNumber(
                            dashboardData.metrics?.activeEvents || 0,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.activeEvents} vs last
                          period
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(
                            dashboardData.metrics?.totalRevenue || 0,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.revenue} vs last
                          period
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Tickets Sold
                        </p>
                        <p className="text-3xl font-bold">
                          {formatNumber(
                            dashboardData.metrics?.ticketsSold || 0,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.metrics?.changes.tickets} vs last
                          period
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="h-[300px]">
                  <SalesChart
                    data={dashboardData.salesData?.map((item) => ({
                      date: new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                      revenue: item.revenue || 0,
                      tickets: item.tickets || 0,
                      sales: item.sales,
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>
                Demographics and behavior of your attendees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <AudienceChart
                  ageGroups={undefined}
                  interests={undefined}
                  loading={dashboardLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
