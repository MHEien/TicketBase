"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Layers,
  Ticket,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SalesChart } from "@/components/sales-chart";
import { DashboardLoading } from "@/components/dashboard-loading";
import { useDashboard } from "@/hooks/use-dashboard";
import { useEvents } from "@/hooks/use-events";
import { useRecentActivity } from "@/hooks/use-activity";
import { useRouter } from "next/navigation";

export function WidgetDashboard() {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const { data, loading, error, refresh } = useDashboard();
  const { events, loading: eventsLoading } = useEvents();
  const { activities: recentActivities, loading: activitiesLoading } =
    useRecentActivity(5);
  const router = useRouter();

  const handleWidgetClick = (widgetId: string) => {
    setActiveWidget(activeWidget === widgetId ? null : widgetId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  // Show loading state
  if (loading) {
    return <DashboardLoading />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Get upcoming events from the events hook
  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 3);

  // Prepare metrics with real percentage changes
  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.metrics?.totalRevenue || 0),
      change: data.metrics?.changes?.revenue || "0%",
      trend: data.metrics?.changes?.revenue?.startsWith("+") ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Tickets Sold",
      value: formatNumber(data.metrics?.ticketsSold || 0),
      change: data.metrics?.changes?.tickets || "0%",
      trend: data.metrics?.changes?.tickets?.startsWith("+") ? "up" : "down",
      icon: Ticket,
    },
    {
      title: "Active Events",
      value: formatNumber(data.metrics?.activeEvents || 0),
      change: data.metrics?.changes?.activeEvents || "0%",
      trend: data.metrics?.changes?.activeEvents?.startsWith("+")
        ? "up"
        : "down",
      icon: Calendar,
    },
    {
      title: "New Users",
      value: formatNumber(data.metrics?.newUsers || 0),
      change: data.metrics?.changes?.newUsers || "0%",
      trend: data.metrics?.changes?.newUsers?.startsWith("+") ? "up" : "down",
      icon: Users,
    },
  ];

  const keyMetrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: formatCurrency(data.metrics?.totalRevenue || 0),
      change: data.metrics?.changes?.revenue || "0%",
      icon: DollarSign,
      trend: data.metrics?.changes?.revenue?.startsWith("+") ? "up" : "down",
    },
    {
      id: "tickets",
      title: "Tickets Sold",
      value: formatNumber(data.metrics?.ticketsSold || 0),
      change: data.metrics?.changes?.tickets || "0%",
      icon: Ticket,
      trend: data.metrics?.changes?.tickets?.startsWith("+") ? "up" : "down",
    },
    {
      id: "events",
      title: "Active Events",
      value: formatNumber(data.metrics?.activeEvents || 0),
      change: data.metrics?.changes?.activeEvents || "0%",
      icon: Calendar,
      trend: data.metrics?.changes?.activeEvents?.startsWith("+")
        ? "up"
        : "down",
    },
    {
      id: "users",
      title: "New Users",
      value: formatNumber(data.metrics?.newUsers || 0),
      change: data.metrics?.changes?.newUsers || "0%",
      icon: Users,
      trend: data.metrics?.changes?.newUsers?.startsWith("+") ? "up" : "down",
    },
  ];

  const performanceMetrics = [
    {
      name: "Conversion Rate",
      value: formatPercentage(data.metrics?.conversionRate || 0),
      change: data.metrics?.changes?.conversionRate || "0%",
      icon: TrendingUp,
    },
    {
      name: "Avg. Order Value",
      value: formatCurrency(data.metrics?.averageOrderValue || 0),
      change: data.metrics?.changes?.averageOrderValue || "$0",
      icon: Ticket,
    },
    {
      name: "User Retention",
      value: formatPercentage(data.metrics?.userRetention || 0),
      change: data.metrics?.changes?.userRetention || "0%",
      icon: Users,
    },
    {
      name: "Plugin Usage",
      value: `${data.metrics?.pluginUsage || 0} active`,
      change: data.metrics?.changes?.pluginUsage || "+0",
      icon: Layers,
    },
  ];

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </Button>
          <Button variant="outline" size="icon" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric) => (
          <motion.div
            key={metric.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group"
          >
            <Card className="border-transparent bg-background/60 transition-all duration-300 hover:border-primary/20 hover:bg-background/80 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">{metric.value}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-rose-500" />
                      )}
                      <span
                        className={
                          metric.trend === "up"
                            ? "text-xs text-emerald-500"
                            : "text-xs text-rose-500"
                        }
                      >
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full border border-primary/10 bg-background p-2 shadow-sm">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Chart Widget - Spans 2 columns */}
        <motion.div
          className="lg:col-span-2"
          layoutId="sales-chart"
          onClick={() => handleWidgetClick("sales-chart")}
        >
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "sales-chart" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Daily ticket sales and revenue
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Last 30 days
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <SalesChart data={data.salesData} />
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-primary/30"></div>
                  <span className="text-xs text-muted-foreground">Tickets</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View Details</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          layoutId="upcoming-events"
          onClick={() => handleWidgetClick("upcoming-events")}
        >
          <Card
            className={`h-full cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "upcoming-events" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      <div className="h-2 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium">
                          {formatCurrency(event.totalRevenue)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          (event.totalRevenue / 10000) * 100,
                          100,
                        )}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-1">
                <Calendar className="h-4 w-4" />
                <span>View All Events</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row Widgets */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          layoutId="recent-activity"
          onClick={() => handleWidgetClick("recent-activity")}
        >
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "recent-activity" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activitiesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={activity.user.avatar || "/placeholder.svg"}
                        alt={activity.user.name}
                      />
                      <AvatarFallback>
                        {activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {activity.user.name}
                        </span>{" "}
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => router.push("/activity")}
              >
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Popular Plugins */}
        <motion.div
          layoutId="popular-plugins"
          onClick={() => handleWidgetClick("popular-plugins")}
        >
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "popular-plugins" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Popular Plugins</CardTitle>
              <CardDescription>Most installed extensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.popularPlugins.length > 0 ? (
                data.popularPlugins.map((plugin, i) => (
                  <div
                    key={plugin.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <img
                          src={plugin.icon}
                          alt={plugin.name}
                          className="h-5 w-5 rounded"
                          onError={(e) => {
                            // Fallback to a default icon if image fails to load
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                        <Layers className="h-5 w-5 text-primary hidden" />
                      </div>
                      <div>
                        <p className="font-medium">{plugin.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(plugin.installs)} installs
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full"
                    >
                      Install
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No plugins available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                <Layers className="h-4 w-4" />
                <span>Browse Plugin Gallery</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          layoutId="performance-metrics"
          onClick={() => handleWidgetClick("performance-metrics")}
        >
          <Card
            className={`cursor-pointer border-transparent transition-all duration-300 hover:border-primary/20 hover:shadow-md ${activeWidget === "performance-metrics" ? "border-primary/20 shadow-md" : ""}`}
          >
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key indicators for your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceMetrics.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <Badge variant="outline" className="gap-1 rounded-full">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-500">
                        {metric.change}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>View Detailed Analytics</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
