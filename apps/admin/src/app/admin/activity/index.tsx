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
import {
  useActivity,
  Activity,
  ActivityType,
  ActivitySeverity,
} from "@/hooks/use-activity";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/activity/")({
  component: ActivityPage,
});

// Activity type configurations
const ACTIVITY_TYPES: Record<
  ActivityType,
  {
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  [ActivityType.FINANCIAL]: {
    label: "Financial",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  [ActivityType.EVENT_MANAGEMENT]: {
    label: "Event Management",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  [ActivityType.USER_MANAGEMENT]: {
    label: "User Management",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  [ActivityType.ADMINISTRATIVE]: {
    label: "Administrative",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  [ActivityType.SECURITY]: {
    label: "Security",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  [ActivityType.MARKETING]: {
    label: "Marketing",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
};

const ACTIVITY_SEVERITY: Record<
  ActivitySeverity,
  {
    label: string;
    icon: any;
    color: string;
  }
> = {
  [ActivitySeverity.LOW]: {
    label: "Low",
    icon: CheckCircle,
    color: "text-green-600",
  },
  [ActivitySeverity.MEDIUM]: {
    label: "Medium",
    icon: AlertTriangle,
    color: "text-yellow-600",
  },
  [ActivitySeverity.HIGH]: {
    label: "High",
    icon: XCircle,
    color: "text-red-600",
  },
};

function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const [activeTab, setActiveTab] = useState("all");

  // Map tab values to activity types
  const tabToActivityType: Record<string, ActivityType> = {
    financial: ActivityType.FINANCIAL,
    event_management: ActivityType.EVENT_MANAGEMENT,
    user_management: ActivityType.USER_MANAGEMENT,
    security: ActivityType.SECURITY,
  };

  const {
    activities,
    activityCounts,
    total,
    loading,
    error,
    refresh,
    exportActivities,
  } = useActivity({
    search: searchQuery,
    type: activeTab === "all" ? undefined : tabToActivityType[activeTab],
    severity:
      selectedSeverity === "all"
        ? undefined
        : (selectedSeverity as ActivitySeverity),
    dateRange,
    limit: 50,
    offset: 0,
    autoRefresh: true,
    refreshInterval: 30000,
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - activityDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return activityDate.toLocaleDateString();
  };

  const getActivityIcon = (type: ActivityType, severity: ActivitySeverity) => {
    const typeConfig = ACTIVITY_TYPES[type];
    const severityConfig = ACTIVITY_SEVERITY[severity];

    if (severity === ActivitySeverity.HIGH) {
      return severityConfig.icon;
    }
    return typeConfig?.icon || Settings;
  };

  const getActivityColor = (type: ActivityType, severity: ActivitySeverity) => {
    if (severity === ActivitySeverity.HIGH) {
      return ACTIVITY_SEVERITY.HIGH.color;
    }
    const typeConfig = ACTIVITY_TYPES[type];
    return typeConfig?.color || "text-gray-600";
  };

  // Use the activities directly from the hook (already filtered by the API)
  const filteredActivities = activities;

  // Use activity counts from the API
  const displayedActivityCounts = activityCounts
    ? {
        all: activityCounts.total,
        financial: activityCounts.financial,
        eventManagement: activityCounts.eventManagement,
        userManagement: activityCounts.userManagement,
        security: activityCounts.security,
      }
    : {
        all: 0,
        financial: 0,
        eventManagement: 0,
        userManagement: 0,
        security: 0,
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
                  {Object.entries(ACTIVITY_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {Object.entries(ACTIVITY_SEVERITY).map(([key, config]) => (
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
                {displayedActivityCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="flex items-center gap-2 px-4"
            >
              <DollarSign className="h-4 w-4" />
              <span>Financial</span>
              <Badge variant="secondary" className="text-xs">
                {displayedActivityCounts.financial}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="event_management"
              className="flex items-center gap-2 px-4"
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
              <Badge variant="secondary" className="text-xs">
                {displayedActivityCounts.eventManagement}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="user_management"
              className="flex items-center gap-2 px-4"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
              <Badge variant="secondary" className="text-xs">
                {displayedActivityCounts.userManagement}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 px-4"
            >
              <Shield className="h-4 w-4" />
              <span>Security</span>
              <Badge variant="secondary" className="text-xs">
                {displayedActivityCounts.security}
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
              {loading ? (
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
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{error}</p>
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
                  {filteredActivities.map((activity: Activity) => {
                    const ActivityIcon = getActivityIcon(
                      activity.type,
                      activity.severity,
                    );
                    const iconColor = getActivityColor(
                      activity.type,
                      activity.severity,
                    );
                    const typeConfig = ACTIVITY_TYPES[activity.type];

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${typeConfig?.bgColor} ${typeConfig?.borderColor} border`}
                        >
                          <ActivityIcon className={`h-5 w-5 ${iconColor}`} />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={activity.user.avatar}
                                    alt={activity.user.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {activity.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">
                                  {activity.user.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {typeConfig?.label}
                                </Badge>
                                {activity.severity ===
                                  ActivitySeverity.HIGH && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    High Priority
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.description}
                              </p>
                              {activity.metadata && (
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

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(activity.createdAt)}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Copy ID</DropdownMenuItem>
                                  {activity.relatedEntityName && (
                                    <DropdownMenuItem>
                                      Go to {activity.relatedEntityType}
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
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
