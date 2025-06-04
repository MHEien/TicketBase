"use client";

import type React from "react";

import { useEffect, useState, Suspense, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  BarChart,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Edit,
  Globe,
  MapPin,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvent } from "@/hooks/use-events";
import { type Event } from "@/lib/api/events-api";
import { useToast } from "@/hooks/use-toast";
import { PluginWidgetArea } from "@/components/plugin-widget-area";
import { deleteEvent, publishEvent, cancelEvent } from "@/lib/api/events-api";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { event, loading, error, refetch } = useEvent(resolvedParams.id);

  const handleEditEvent = () => {
    router.push(`/events/${resolvedParams.id}/edit`);
  };

  const handleDeleteEvent = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteEvent(resolvedParams.id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      router.push("/events");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateEvent = () => {
    // Navigate to create new event with duplicate parameter
    router.push(`/events/new?duplicate=${resolvedParams.id}`);
  };

  const handlePublishEvent = async () => {
    try {
      await publishEvent(resolvedParams.id);
      toast({
        title: "Success",
        description: "Event published successfully",
      });
      // Refetch to get updated data
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish event",
        variant: "destructive",
      });
    }
  };

  const handleCancelEvent = async () => {
    if (!confirm("Are you sure you want to cancel this event?")) {
      return;
    }

    try {
      await cancelEvent(resolvedParams.id);
      toast({
        title: "Success",
        description: "Event cancelled successfully",
      });
      // Refetch to get updated data
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel event",
        variant: "destructive",
      });
    }
  };

  const handleShareEvent = () => {
    // Copy event URL to clipboard
    const eventUrl = `${window.location.origin}/events/${resolvedParams.id}`;
    navigator.clipboard
      .writeText(eventUrl)
      .then(() => {
        toast({
          title: "Success",
          description: "Event URL copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy URL to clipboard",
          variant: "destructive",
        });
      });
  };

  const handleExportAttendees = () => {
    // TODO: Implement attendee export functionality
    toast({
      title: "Coming Soon",
      description: "Attendee export functionality will be available soon",
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading event details...</div>;
  }

  if (error || !event) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error loading event details</p>
        <Button onClick={() => router.push("/events")} className="mt-4">
          Back to Events
        </Button>
      </div>
    );
  }

  const totalTickets = event.ticketTypes.reduce(
    (sum: number, ticket: any) => sum + Number(ticket.quantity),
    0,
  );
  const ticketsSoldPercentage =
    Math.round((Number(event.totalTicketsSold) / totalTickets) * 100) || 0;
  const isPast = event.endDate ? new Date(event.endDate) < new Date() : false;

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/events")}
      >
        ← Back to Events
      </Button>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.status === "draft" && <Badge variant="outline">Draft</Badge>}
          {isPast && <Badge variant="outline">Past</Badge>}
        </div>

        <div className="flex gap-2">
          {event.status === "draft" && (
            <Button onClick={handlePublishEvent} className="gap-2">
              Publish Event
            </Button>
          )}

          {event.status === "published" && (
            <Button
              onClick={handleCancelEvent}
              variant="destructive"
              className="gap-2"
            >
              Cancel Event
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span>Actions</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditEvent}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicateEvent}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareEvent}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportAttendees}>
                <Download className="mr-2 h-4 w-4" />
                Export Attendees
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteEvent}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Plugin integrations */}
      <div className="mb-8">
        <Suspense
          fallback={<div className="h-20 animate-pulse rounded-lg bg-muted" />}
        >
          <PluginWidgetArea areaName="event-detail-header" eventData={event} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-video w-full bg-muted">
              <img
                src={event.featuredImage || "/placeholder.svg"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap gap-3">
                <Badge variant="secondary">
                  {event.category.charAt(0).toUpperCase() +
                    event.category.slice(1)}
                </Badge>

                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {event.startDate
                      ? format(new Date(event.startDate), "MMM d, yyyy")
                      : "No start date"}
                    {event.startDate &&
                      event.endDate &&
                      format(new Date(event.startDate), "MMM d, yyyy") !==
                        format(new Date(event.endDate), "MMM d, yyyy") &&
                      ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {event.startTime} - {event.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  {event.locationType === "virtual" ? (
                    <>
                      <Globe className="h-4 w-4 text-primary" />
                      <span>Virtual Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>
                        {event.venueName}, {event.city}, {event.country}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About This Event</h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>

              {/* Plugin integrations */}
              <div className="mt-6">
                <Suspense
                  fallback={
                    <div className="h-20 animate-pulse rounded-lg bg-muted" />
                  }
                >
                  <PluginWidgetArea
                    areaName="event-detail-main"
                    eventData={event}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tickets" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Types</CardTitle>
                  <CardDescription>
                    Manage your event's ticket types and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.ticketTypes.map((ticket: any, index: number) => {
                    const soldQuantity =
                      Number(ticket.quantity) -
                      (Number(ticket.availableQuantity) ||
                        Number(ticket.quantity));
                    const soldPercentage =
                      Math.round(
                        (soldQuantity / Number(ticket.quantity)) * 100,
                      ) || 0;

                    return (
                      <div key={ticket.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{ticket.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {ticket.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              ${Number(ticket.price).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {soldQuantity} sold / {ticket.quantity} total
                            </p>
                          </div>
                        </div>
                        <Progress value={soldPercentage} className="h-2" />
                      </div>
                    );
                  })}

                  {/* Plugin integrations for ticket types */}
                  <Suspense
                    fallback={
                      <div className="h-16 animate-pulse rounded-lg bg-muted" />
                    }
                  >
                    <PluginWidgetArea
                      areaName="ticket-options"
                      eventData={event}
                    />
                  </Suspense>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Ticket Types</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="attendees" className="mt-4">
              {/* Attendees tab content */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendees</CardTitle>
                  <CardDescription>
                    View and manage event attendees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-8 text-center">
                    <Users className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">
                      Attendee Management
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Detailed attendee management will be available here.
                      You'll be able to view, search, and export your attendee
                      list.
                    </p>
                    <Button variant="outline">Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              {/* Analytics tab content */}
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View detailed event analytics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border bg-muted/50 p-8 text-center">
                    <BarChart className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">
                      Analytics Dashboard
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Detailed analytics will be available here. You'll be able
                      to track ticket sales, revenue, and attendee demographics.
                    </p>
                    <Button variant="outline">Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Event summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={event.status === "published" ? "default" : "outline"}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(event.createdAt), "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{format(new Date(event.updatedAt), "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ticket Types</span>
                <span>{event.ticketTypes.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Widget area for plugin integrations in sidebar */}
          <Suspense
            fallback={
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            }
          >
            <PluginWidgetArea
              areaName="event-detail-sidebar"
              eventData={event}
            />
          </Suspense>

          {/* Sales summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Tickets Sold</span>
                  <span className="font-medium">
                    {event.totalTicketsSold} / {totalTickets}
                  </span>
                </div>
                <Progress value={ticketsSoldPercentage} className="h-2" />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {ticketsSoldPercentage}% sold
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="text-xl font-bold">
                  ${Number(event.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                <span>Export Sales Report</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
