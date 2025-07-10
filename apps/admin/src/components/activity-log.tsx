import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity as ActivityIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  fetchUserActivities,
  fetchEntityActivities,
  ActivityType,
  ActivityStatus,
  getActivityTypeLabel,
  getActivityStatusVariant,
  type Activity,
  type PaginatedActivitiesResponse,
} from "@/lib/api/activities-api";
import { useToast } from "@/hooks/use-toast";

interface ActivityLogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  entityType?: string;
  entityId?: string;
  title?: string;
}

export function ActivityLog({
  isOpen,
  onOpenChange,
  userId,
  entityType,
  entityId,
  title = "Activity Log",
}: ActivityLogProps) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<PaginatedActivitiesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const pageSize = 20;

  const loadActivities = async () => {
    if (!isOpen) return;

    try {
      setLoading(true);
      let response: PaginatedActivitiesResponse;

      if (userId) {
        response = await fetchUserActivities(userId, currentPage, pageSize);
      } else if (entityType && entityId) {
        response = await fetchEntityActivities(entityType, entityId, currentPage, pageSize);
      } else {
        throw new Error("Either userId or entityType/entityId must be provided");
      }

      // Apply filters (client-side for now, could be server-side)
      let filteredActivities = response.activities;

      if (typeFilter !== "all") {
        filteredActivities = filteredActivities.filter(
          (activity) => activity.type === typeFilter
        );
      }

      if (statusFilter !== "all") {
        filteredActivities = filteredActivities.filter(
          (activity) => activity.status === statusFilter
        );
      }

      if (startDate) {
        const start = new Date(startDate);
        filteredActivities = filteredActivities.filter(
          (activity) => activity.createdAt >= start
        );
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        filteredActivities = filteredActivities.filter(
          (activity) => activity.createdAt <= end
        );
      }

      setActivities({
        ...response,
        activities: filteredActivities,
        total: filteredActivities.length,
      });
    } catch (error) {
      console.error("Error loading activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activity log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadActivities();
    }
  }, [isOpen, currentPage, typeFilter, statusFilter, startDate, endDate]);

  const handleRefresh = () => {
    setCurrentPage(1);
    loadActivities();
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CREATE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case ActivityType.UPDATE:
        return <ActivityIcon className="h-4 w-4 text-blue-600" />;
      case ActivityType.DELETE:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case ActivityType.LOGIN:
        return <User className="h-4 w-4 text-green-600" />;
      case ActivityType.LOGOUT:
        return <User className="h-4 w-4 text-gray-600" />;
      case ActivityType.PERMISSION_CHANGE:
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatMetadata = (metadata: Record<string, any> | undefined) => {
    if (!metadata) return null;

    return (
      <div className="mt-2 text-xs text-muted-foreground">
        <details className="cursor-pointer">
          <summary className="hover:text-foreground">View details</summary>
          <pre className="mt-1 whitespace-pre-wrap rounded border bg-muted p-2">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            View detailed activity history and system events.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type-filter">Activity Type</Label>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value as ActivityType | "all")}
                >
                  <SelectTrigger id="type-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.values(ActivityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getActivityTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as ActivityStatus | "all")}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={ActivityStatus.SUCCESS}>Success</SelectItem>
                    <SelectItem value={ActivityStatus.FAILED}>Failed</SelectItem>
                    <SelectItem value={ActivityStatus.PENDING}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button
                onClick={() => {
                  setTypeFilter("all");
                  setStatusFilter("all");
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                variant="ghost"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {activities ? `${activities.total} activities found` : "Loading..."}
              </div>
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <ScrollArea className="h-[400px] w-full rounded-md border">
              <div className="p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading activities...</span>
                  </div>
                ) : activities?.activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <ActivityIcon className="h-8 w-8 mb-2" />
                    <p>No activities found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  activities?.activities.map((activity, index) => (
                    <div key={activity.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {activity.description}
                              </p>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span>{activity.user.name}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span title={format(activity.createdAt, "PPpp")}>
                                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                                  </span>
                                </div>
                                
                                {activity.ipAddress && (
                                  <div className="text-xs text-muted-foreground">
                                    IP: {activity.ipAddress}
                                  </div>
                                )}
                              </div>

                              {activity.entityType && activity.entityName && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Target: {activity.entityType} - {activity.entityName}
                                </div>
                              )}

                              {formatMetadata(activity.metadata)}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-2">
                              <Badge variant={getActivityStatusVariant(activity.status)} className="text-xs">
                                {activity.status}
                              </Badge>
                              
                              <Badge variant="outline" className="text-xs">
                                {getActivityTypeLabel(activity.type)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < (activities?.activities.length || 0) - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {activities && activities.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {activities.page} of {activities.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(activities.totalPages, currentPage + 1))}
                    disabled={currentPage === activities.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 