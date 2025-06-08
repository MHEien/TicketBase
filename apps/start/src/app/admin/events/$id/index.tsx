"use client";

import React from "react";
import { useEffect, useState, Suspense, use } from "react";
import { useRouter } from "@tanstack/react-router";
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
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Progress } from "@repo/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { EventsControllerQuery, type EventResponseDto, type UpdateEventDto } from "@repo/api-sdk";
import { useToast } from "@/hooks/use-toast";
import { PluginWidgetArea } from "@/components/plugin-widget-area";
import { usePlugins } from "@/lib/plugins/plugin-context";
import type {
  ExtensionPointComponent,
  ExtensionPointContext,
  PlatformSDK,
} from "ticketsplatform-plugin-sdk";

interface EventDetailsContext extends ExtensionPointContext {
  event: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    venue: {
      id: string;
      name: string;
      address: string;
    };
    capacity: number;
    ticketTypes: Array<{
      id: string;
      name: string;
      price: number;
      available: number;
    }>;
    metadata?: Record<string, any>;
  };
  onUpdate: (eventData: Partial<EventDetailsContext["event"]>) => Promise<void>;
}

interface SeatingMapContext extends ExtensionPointContext {
  event: {
    id: string;
    name: string;
    venue: {
      id: string;
      name: string;
      capacity: number;
    };
  };
  seats: Array<{
    id: string;
    row: string;
    number: string;
    section: string;
    status: "available" | "reserved" | "sold" | "blocked";
    price: number;
    ticketType?: string;
  }>;
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  selectedSeats: string[];
}

interface CustomerFieldsContext extends ExtensionPointContext {
  customer: {
    id: string;
    email: string;
    name?: string;
    metadata?: Record<string, any>;
  };
  onUpdate: (data: Partial<CustomerFieldsContext["customer"]>) => Promise<void>;
}

interface TicketCustomizationContext extends ExtensionPointContext {
  ticket: {
    id: string;
    eventId: string;
    ticketType: string;
    holderName: string;
    qrCode: string;
    barcode: string;
    metadata?: Record<string, any>;
  };
  onCustomize: (customizations: Record<string, any>) => Promise<void>;
}

interface EventActionsContext extends ExtensionPointContext {
  event: {
    id: string;
    name: string;
    status: "draft" | "published" | "cancelled" | "completed";
  };
  onAction: (action: string, data?: any) => Promise<void>;
}

export const Route = createFileRoute({
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = Route.useParams();
  const { data, isLoading, error } = EventsControllerQuery.useFindOneQuery({
    id: id,
  });
  const { getExtensionPoint } = usePlugins();

  // Get all event details extension point components
  const eventDetailsComponents = getExtensionPoint("event-details");

  const handleEditEvent = () => {
    router.navigate({ to: `/admin/events/${id}/edit` });
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
      await EventsControllerQuery.useRemoveMutation(id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      router.navigate({ to: "/admin/events" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateEvent = () => {
    router.navigate({ to: `/admin/events/new?duplicate=${id}` });
  };

  const handlePublishEvent = async () => {
    try {
      await EventsControllerQuery.usePublishMutation(id);
      toast({
        title: "Success",
        description: "Event published successfully",
      });
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
      await EventsControllerQuery.useCancelMutation(id);
      toast({
        title: "Success",
        description: "Event cancelled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel event",
        variant: "destructive",
      });
    }
  };

  const handleShareEvent = () => {
    const eventUrl = `${window.location.origin}/events/${id}`;
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
    toast({
      title: "Coming Soon",
      description: "Attendee export functionality will be available soon",
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading event details...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error loading event details</p>
        <Button
          onClick={() => router.navigate({ to: "/admin/events" })}
          className="mt-4"
        >
          Back to Events
        </Button>
      </div>
    );
  }

  const totalTickets = data?.ticketTypes.reduce(
    (sum: number, ticket: any) => sum + Number(ticket.quantity),
    0,
  );
  const ticketsSoldPercentage =
    Math.round((Number(data?.totalTicketsSold) / totalTickets) * 100) || 0;
  const isPast = data?.endDate ? new Date(data?.endDate) < new Date() : false;

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.navigate({ to: "/admin/events" })}
      >
        ← Back to Events
      </Button>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{data?.title}</h1>
          {data?.status === "draft" && <Badge variant="outline">Draft</Badge>}
          {isPast && <Badge variant="outline">Past</Badge>}
        </div>

        <div className="flex gap-2">
          {data?.status === "draft" && (
            <Button onClick={handlePublishEvent} className="gap-2">
              Publish Event
            </Button>
          )}

          {data?.status === "published" && (
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

          {/* Event Actions Extension Point */}
          <div className="flex gap-2">
            {getExtensionPoint("event-actions").map((Component, index) => (
              <Suspense
                key={index}
                fallback={
                  <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
                }
              >
                <Component
                  context={{
                    event: {
                      id: data?.id,
                      name: data?.title,
                      status: data?.status as
                        | "draft"
                        | "published"
                        | "cancelled"
                        | "completed",
                    },
                    onAction: async (action: string, data?: any) => {
                      try {
                        // Handle different plugin actions
                        switch (action) {
                          case "publish":
                            await handlePublishEvent();
                            break;
                          case "cancel":
                            await handleCancelEvent();
                            break;
                          case "delete":
                            await handleDeleteEvent();
                            break;
                          default:
                            // Call your custom action API here
                            console.log("Custom action:", action, data);
                            toast({
                              title: "Success",
                              description: `Action "${action}" completed successfully`,
                            });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: `Failed to perform action "${action}"`,
                          variant: "destructive",
                        });
                      }
                    },
                  }}
                  sdk={window.PluginSDK as unknown as PlatformSDK}
                />
              </Suspense>
            ))}
          </div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-video w-full bg-muted">
              <img
                src={data?.featuredImage || "/placeholder.svg"}
                alt={data?.title}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap gap-3">
                <Badge variant="secondary">
                  {data?.category.charAt(0).toUpperCase() +
                    data?.category.slice(1)}
                </Badge>

                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {data?.startDate
                      ? format(new Date(data?.startDate), "MMM d, yyyy")
                      : "No start date"}
                    {data?.startDate &&
                      data?.endDate &&
                      format(new Date(data?.startDate), "MMM d, yyyy") !==
                        format(new Date(data?.endDate), "MMM d, yyyy") &&
                      ` - ${format(new Date(data?.endDate), "MMM d, yyyy")}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {data?.startTime} - {data?.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                  {data?.locationType === "virtual" ? (
                    <>
                      <Globe className="h-4 w-4 text-primary" />
                      <span>Virtual Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>
                        {data?.venueName}, {data?.city}, {data?.country}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About This Event</h2>
                <p className="text-muted-foreground">{data?.description}</p>
              </div>

              {/* Event Details Extension Point */}
              <div className="mt-6">
                {eventDetailsComponents.map((Component, index) => (
                  <Suspense
                    key={index}
                    fallback={
                      <div className="h-20 animate-pulse rounded-lg bg-muted" />
                    }
                  >
                    <div className="mb-4">
                      <Component
                        context={{
                          event: {
                            id: data?.id,
                            endDate: data?.endDate,
                            venue: {
                              id: data?.id, // Using event ID as venue ID since we don't have a separate venue ID
                              name: data?.venueName || "",
                              address: data?.address || "",
                            },
                            capacity: totalTickets,
                            ticketTypes: data?.ticketTypes.map((ticket) => ({
                              id: ticket.id,
                              name: ticket.name,
                              price: ticket.price,
                              available: ticket.availableQuantity || 0,
                            })),
                            metadata: {}, // Empty metadata object since we don't have it in the event type
                          },
                          onUpdate: async (
                            eventData: Partial<EventDetailsContext["event"]>,
                          ) => {
                            try {
                              const updateData: UpdateEventDto = {
                                ...(eventData.name && {
                                  title: eventData.name,
                                }),
                                ...(eventData.description && {
                                  description: eventData.description,
                                }),
                                init: () => {},
                                toJSON: () => ({}),
                              };

                              await EventsControllerQuery.useUpdateMutation(data?.id, {
                                ...updateData,
                              });
                              toast({
                                title: "Success",
                                description: "Event updated successfully",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to update event",
                                variant: "destructive",
                              });
                            }
                          },
                        }}
                        sdk={window.PluginSDK as unknown as PlatformSDK}
                      />
                    </div>
                  </Suspense>
                ))}
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
                    eventData={data}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tickets" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="seating">Seating</TabsTrigger>
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
                  {data?.ticketTypes.map((ticket: any, index: number) => {
                    const soldQuantity =
                      Number(ticket.quantity) -
                      (Number(ticket.availableQuantity) ||
                        Number(ticket.quantity));
                    const soldPercentage =
                      Math.round(
                        (soldQuantity / Number(ticket.quantity)) * 100,
                      ) || 0;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${ticket.price} · {soldQuantity} sold
                            </p>
                          </div>
                          <Badge variant="outline">
                            {ticket.availableQuantity} left
                          </Badge>
                        </div>
                        <Progress value={soldPercentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Ticket Customization Extension Point */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Customization</CardTitle>
                  <CardDescription>
                    Customize the appearance and content of your tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getExtensionPoint("ticket-customization").map(
                      (Component, index) => (
                        <Suspense
                          key={index}
                          fallback={
                            <div className="h-20 animate-pulse rounded-lg bg-muted" />
                          }
                        >
                          <div className="mb-4">
                            <Component
                              context={{
                                ticket: {
                                  id: "sample-ticket-id", // This should be a real ticket ID
                                  eventId: data?.id,
                                  ticketType:
                                    data?.ticketTypes[0]?.name ||
                                    "General Admission",
                                  holderName: "Sample Attendee",
                                  qrCode: "https://example.com/qr/sample",
                                  barcode: "123456789",
                                  metadata: {}, // This should be populated from your ticket API
                                },
                                onCustomize: async (
                                  customizations: Record<string, any>,
                                ) => {
                                  try {
                                    // Call your ticket customization API here
                                    console.log(
                                      "Applying ticket customizations:",
                                      customizations,
                                    );
                                    toast({
                                      title: "Success",
                                      description:
                                        "Ticket customization saved successfully",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description:
                                        "Failed to save ticket customization",
                                      variant: "destructive",
                                    });
                                  }
                                },
                              }}
                              sdk={window.PluginSDK as unknown as PlatformSDK}
                            />
                          </div>
                        </Suspense>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seating" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seating Map</CardTitle>
                  <CardDescription>
                    Configure and manage event seating layout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Seating Map Extension Point */}
                  <div className="mt-6">
                    {getExtensionPoint("seating-map").map(
                      (Component, index) => (
                        <Suspense
                          key={index}
                          fallback={
                            <div className="h-20 animate-pulse rounded-lg bg-muted" />
                          }
                        >
                          <div className="mb-4">
                            <Component
                              context={{
                                event: {
                                  id: data?.id,
                                  name: data?.title,
                                  venue: {
                                    id: data?.id,
                                    name: data?.venueName || "",
                                    capacity: totalTickets,
                                  },
                                },
                                seats: [], // This should be populated from your seats API
                                onSeatSelect: (seatId: string) => {
                                  // Handle seat selection
                                  console.log("Selected seat:", seatId);
                                },
                                onSeatDeselect: (seatId: string) => {
                                  // Handle seat deselection
                                  console.log("Deselected seat:", seatId);
                                },
                                selectedSeats: [], // This should be managed by your state
                              }}
                              sdk={window.PluginSDK as unknown as PlatformSDK}
                            />
                          </div>
                        </Suspense>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendees" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendees</CardTitle>
                  <CardDescription>
                    View and manage event attendees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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

                    {/* Customer Fields Extension Point */}
                    <div className="mt-8">
                      <h3 className="mb-4 text-lg font-medium">
                        Custom Attendee Fields
                      </h3>
                      <div className="space-y-4">
                        {getExtensionPoint("customer-fields").map(
                          (Component, index) => (
                            <Suspense
                              key={index}
                              fallback={
                                <div className="h-20 animate-pulse rounded-lg bg-muted" />
                              }
                            >
                              <Card>
                                <CardContent className="p-4">
                                  <Component
                                    context={{
                                      customer: {
                                        id: "placeholder-id", // This should be the actual customer ID
                                        email: "placeholder@example.com", // This should be the actual customer email
                                        name: "John Doe", // This should be the actual customer name
                                        metadata: {}, // This should be populated from your customer API
                                      },
                                      onUpdate: async (
                                        data: Partial<
                                          CustomerFieldsContext["customer"]
                                        >,
                                      ) => {
                                        try {
                                          // Call your customer update API here
                                          console.log(
                                            "Updating customer data:",
                                            data,
                                          );
                                          toast({
                                            title: "Success",
                                            description:
                                              "Customer data updated successfully",
                                          });
                                        } catch (error) {
                                          toast({
                                            title: "Error",
                                            description:
                                              "Failed to update customer data",
                                            variant: "destructive",
                                          });
                                        }
                                      },
                                    }}
                                    sdk={
                                      window.PluginSDK as unknown as PlatformSDK
                                    }
                                  />
                                </CardContent>
                              </Card>
                            </Suspense>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
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
                  variant={data?.status === "published" ? "default" : "outline"}
                >
                  {data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(data?.createdAt), "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{format(new Date(data?.updatedAt), "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ticket Types</span>
                <span>{data?.ticketTypes.length}</span>
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
              eventData={data}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
