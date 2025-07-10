"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Search,
  Users,
  Settings,
  Shield,
  Ticket,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecentActivity } from "@/hooks/use-activity";
import { analyticsApi, RecentActivity } from "@/lib/api/analytics-api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/activity/")({
  component: ActivityPage,
});

// Real activity type configurations that match our backend
const ACTIVITY_TYPE_CONFIGS: Record<
  string,
  {
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  CREATE: {
    label: "Create",
    icon: Plus,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  UPDATE: {
    label: "Update",
    icon: Edit,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  DELETE: {
    label: "Delete",
    icon: Trash2,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  LOGIN: {
    label: "Login",
    icon: LogIn,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  LOGOUT: {
    label: "Logout",
    icon: LogOut,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  PUBLISH: {
    label: "Publish",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  VIEW: {
    label: "View",
    icon: Eye,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  PERMISSION_CHANGE: {
    label: "Permission Change",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
};

// Status configurations
const STATUS_CONFIGS: Record<
  string,
  {
    label: string;
    icon: any;
    color: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  success: {
    label: "Success",
    icon: CheckCircle,
    color: "text-green-600",
    variant: "default",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-600",
    variant: "destructive",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
    variant: "secondary",
  },
};

function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const [activeTab, setActiveTab] = useState("all");
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use analytics API for comprehensive activity data
  const {
    activities: recentActivities,
    loading: recentLoading,
    error: recentError,
    refresh,
  } = useRecentActivity(100); // Get more activities for the admin page

  // Simulate activity counts based on real data
  const activityCounts = {
    total: recentActivities.length,
    events: recentActivities.filter((a) => a.entityType === "event").length,
    users: recentActivities.filter(
      (a) =>
        a.type === "LOGIN" || a.type === "LOGOUT" || a.entityType === "user",
    ).length,
    security: recentActivities.filter((a) => a.type === "PERMISSION_CHANGE")
      .length,
    administrative: recentActivities.filter(
      (a) => !["event", "user"].includes(a.entityType || ""),
    ).length,
  };

  // Filter activities based on current filters
  const filteredActivities = recentActivities.filter((activity) => {
    // Search filter
    if (
      searchQuery &&
      !activity.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !activity.user.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (selectedType !== "all" && activity.type !== selectedType) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && activity.status !== selectedStatus) {
      return false;
    }

    // Tab filter
    if (activeTab === "events" && activity.entityType !== "event") {
      return false;
    }
    if (
      activeTab === "users" &&
      activity.type !== "LOGIN" &&
      activity.type !== "LOGOUT" &&
      activity.entityType !== "user"
    ) {
      return false;
    }
    if (activeTab === "security" && activity.type !== "PERMISSION_CHANGE") {
      return false;
    }

    return true;
  });

  const exportActivities = async () => {
    try {
      // Simple CSV export of filtered activities
      const headers = ["Time", "User", "Action", "Type", "Status", "Entity"];
      const csvContent = [
        headers.join(","),
        ...filteredActivities.map((activity) =>
          [
            activity.time,
            `"${activity.user}"`,
            `"${activity.action}"`,
            activity.type,
            activity.status,
            activity.entityType || "N/A",
          ].join(","),
        ),
      ].join("\n");

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
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const getActivityIcon = (type: string) => {
    const config = ACTIVITY_TYPE_CONFIGS[type];
    return config?.icon || Settings;
  };

  const getActivityColor = (type: string) => {
    const config = ACTIVITY_TYPE_CONFIGS[type];
    return config?.color || "text-gray-600";
  };

  const getActivityBgConfig = (type: string) => {
    const config = ACTIVITY_TYPE_CONFIGS[type];
    return {
      bgColor: config?.bgColor || "bg-gray-50",
      borderColor: config?.borderColor || "border-gray-200",
    };
  };

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground">
            Monitor all activities and events across your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportActivities}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="icon" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(ACTIVITY_TYPE_CONFIGS).map(
                    ([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(STATUS_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-5 w-fit">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4">
              <span>All</span>
              <Badge variant="secondary" className="text-xs">
                {activityCounts.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex items-center gap-2 px-4"
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
              <Badge variant="secondary" className="text-xs">
                {activityCounts.events}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 px-4">
              <Users className="h-4 w-4" />
              <span>Users</span>
              <Badge variant="secondary" className="text-xs">
                {activityCounts.users}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 px-4"
            >
              <Shield className="h-4 w-4" />
              <span>Security</span>
              <Badge variant="secondary" className="text-xs">
                {activityCounts.security}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="administrative"
              className="flex items-center gap-2 px-4"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
              <Badge variant="secondary" className="text-xs">
                {activityCounts.administrative}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>
                {filteredActivities.length} activities found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentError ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{recentError}</p>
                  <Button variant="outline" onClick={refresh} className="mt-4">
                    Try Again
                  </Button>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No activities found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActivities.map((activity: RecentActivity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    const iconColor = getActivityColor(activity.type);
                    const { bgColor, borderColor } = getActivityBgConfig(
                      activity.type,
                    );
                    const statusConfig = STATUS_CONFIGS[activity.status];

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} ${borderColor} border`}
                        >
                          <ActivityIcon className={`h-5 w-5 ${iconColor}`} />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={activity.userAvatar}
                                    alt={activity.user}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {activity.user.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">
                                  {activity.user}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {ACTIVITY_TYPE_CONFIGS[activity.type]
                                    ?.label || activity.type}
                                </Badge>
                                {activity.status &&
                                  activity.status !== "success" && (
                                    <Badge
                                      variant={
                                        statusConfig?.variant || "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {statusConfig?.label || activity.status}
                                    </Badge>
                                  )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.action}
                              </p>
                              {activity.entityType && activity.entityName && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  <span className="font-medium">Entity:</span>{" "}
                                  {activity.entityType} - {activity.entityName}
                                </div>
                              )}
                              {activity.metadata &&
                                Object.keys(activity.metadata).length > 0 && (
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    {Object.entries(activity.metadata).map(
                                      ([key, value]) => (
                                        <span key={key} className="mr-4">
                                          <span className="font-medium">
                                            {key}:
                                          </span>{" "}
                                          {String(value)}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-xs text-muted-foreground">
                                {activity.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
