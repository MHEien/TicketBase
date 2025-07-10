"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  Clock,
  Edit,
  Filter,
  Globe,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/hooks/use-events";
import { type Event } from "@/lib/api/events-api";
import { EventsLoading } from "@/components/ui/loading-skeleton";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/events/")({
  component: EventsPage,
});

function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "title" | "sales">("date");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Fetch events with real API
  const {
    events,
    loading,
    error,
    deleteEventMutation,
    publishEventMutation,
    cancelEventMutation,
  } = useEvents();

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filterCategory || event.category === filterCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort events
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
        const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
        return bDate - aDate;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "sales") {
        return b.totalRevenue - a.totalRevenue;
      }
      return 0;
    });
  }, [events, searchQuery, filterCategory, sortBy]);

  // Group events by status
  const publishedEvents = filteredAndSortedEvents.filter(
    (event) => event.status === "published",
  );
  const draftEvents = filteredAndSortedEvents.filter(
    (event) => event.status === "draft",
  );
  const pastEvents = filteredAndSortedEvents.filter(
    (event) =>
      event.status === "completed" ||
      (event.status === "published" &&
        event.endDate &&
        new Date(event.endDate) < new Date()),
  );

  const handleCreateEvent = () => {
    router.navigate({ to: "/admin/events/new" });
  };

  const handleEditEvent = (eventId: string) => {
    router.navigate({ to: `/admin/events/$id/edit`, params: { id: eventId } });
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      await deleteEventMutation(eventId);
    }
  };

  const handleDuplicateEvent = (eventId: string) => {
    // TODO: Implement duplication logic
    router.navigate({
      to: `/admin/events/new`,
      search: { duplicate: eventId },
    });
  };

  const handleViewEvent = (eventId: string) => {
    router.navigate({ to: `/admin/events/$id`, params: { id: eventId } });
  };

  const handlePublishEvent = async (eventId: string) => {
    await publishEventMutation(eventId);
  };

  const handleCancelEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to cancel this event?")) {
      await cancelEventMutation(eventId);
    }
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const renderEventCard = (event: Event) => {
    const isPast = event.endDate ? new Date(event.endDate) < new Date() : false;

    return (
      <Card
        key={event.id}
        className={`group transition-all duration-300 hover:shadow-md ${
          event.status === "draft" ? "border-dashed" : ""
        } ${isPast ? "opacity-70" : ""}`}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={event.featuredImage || "/placeholder.svg"}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {event.status === "draft" && (
            <Badge
              variant="outline"
              className="absolute left-3 top-3 bg-background"
            >
              Draft
            </Badge>
          )}

          {isPast && (
            <Badge
              variant="outline"
              className="absolute left-3 top-3 bg-background"
            >
              Past
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewEvent(event.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDuplicateEvent(event.id)}>
                Duplicate
              </DropdownMenuItem>
              {event.status === "draft" && (
                <DropdownMenuItem onClick={() => handlePublishEvent(event.id)}>
                  Publish
                </DropdownMenuItem>
              )}
              {event.status === "published" && (
                <DropdownMenuItem onClick={() => handleCancelEvent(event.id)}>
                  Cancel Event
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteEvent(event.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0 text-xs"
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>
            {event.totalTicketsSold > 0 && (
              <Badge
                variant="outline"
                className="rounded-full px-2 py-0 text-xs"
              >
                {event.totalTicketsSold} tickets sold
              </Badge>
            )}
          </div>

          <h3 className="line-clamp-1 text-lg font-semibold">{event.title}</h3>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {event.startDate
                  ? format(new Date(event.startDate), "MMM d, yyyy")
                  : "Date TBD"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{event.startTime}</span>
            </div>

            <div className="flex items-center gap-1">
              {event.locationType === "virtual" ? (
                <>
                  <Globe className="h-3 w-3" />
                  <span>Virtual</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>
                    {event.city}, {event.country}
                  </span>
                </>
              )}
            </div>
          </div>

          {event.totalRevenue > 0 && (
            <div className="mt-3 flex justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">Revenue</span>
              <span className="font-medium">
                ${event.totalRevenue.toLocaleString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEventList = (event: Event) => {
    const isPast = event.endDate ? new Date(event.endDate) < new Date() : false;

    return (
      <Card
        key={event.id}
        className={`group transition-all duration-300 hover:shadow-md ${
          event.status === "draft" ? "border-dashed" : ""
        } ${isPast ? "opacity-70" : ""}`}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative h-16 w-24 overflow-hidden rounded-md bg-muted">
            <img
              src={event.featuredImage || "/placeholder.svg"}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            {event.status === "draft" && (
              <Badge
                variant="outline"
                className="absolute left-1 top-1 bg-background/80 text-[10px]"
              >
                Draft
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <h3 className="line-clamp-1 font-semibold">{event.title}</h3>

            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {event.startDate
                    ? format(new Date(event.startDate), "MMM d, yyyy")
                    : "Date TBD"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {event.locationType === "virtual" ? (
                  <>
                    <Globe className="h-3 w-3" />
                    <span>Virtual</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3 w-3" />
                    <span>
                      {event.city}, {event.country}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {event.totalTicketsSold > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium">
                  {event.totalTicketsSold} tickets
                </div>
                <div className="text-sm text-muted-foreground">
                  ${event.totalRevenue.toLocaleString()}
                </div>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewEvent(event.id)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDuplicateEvent(event.id)}
                >
                  Duplicate
                </DropdownMenuItem>
                {event.status === "draft" && (
                  <DropdownMenuItem
                    onClick={() => handlePublishEvent(event.id)}
                  >
                    Publish
                  </DropdownMenuItem>
                )}
                {event.status === "published" && (
                  <DropdownMenuItem onClick={() => handleCancelEvent(event.id)}>
                    Cancel Event
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">
              Manage your events and track ticket sales
            </p>
          </div>
          <Button onClick={handleCreateEvent} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-9" disabled />
          </div>
          <div className="flex gap-2">
            <Select disabled>
              <SelectTrigger className="w-[180px] gap-1">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
            </Select>
            <Select disabled>
              <SelectTrigger className="w-[180px] gap-1">
                <ChevronDown className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              disabled
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="relative">
              Active
              <Badge className="ml-2 rounded-full px-1.5 py-0.5">-</Badge>
            </TabsTrigger>
            <TabsTrigger value="drafts" className="relative">
              Drafts
              <Badge className="ml-2 rounded-full px-1.5 py-0.5">-</Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="relative">
              Past
              <Badge className="ml-2 rounded-full px-1.5 py-0.5">-</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <EventsLoading view={view} count={6} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">
              Manage your events and track ticket sales
            </p>
          </div>
          <Button onClick={handleCreateEvent} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="mb-2">Error loading events</CardTitle>
            <CardDescription className="mb-4 max-w-md">{error}</CardDescription>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and track ticket sales
          </p>
        </div>
        <Button onClick={handleCreateEvent} className="gap-2 rounded-full">
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterCategory || "all"}
            onValueChange={(value) =>
              setFilterCategory(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px] gap-1">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="exhibition">Exhibition</SelectItem>
              <SelectItem value="fundraiser">Fundraiser</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy || "date"}
            onValueChange={(value: "date" | "title" | "sales") =>
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-[180px] gap-1">
              <ChevronDown className="h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (newest)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="sales">Sales (highest)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="h-10 w-10"
          >
            {view === "grid" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active" className="relative">
            Active
            <Badge className="ml-2 rounded-full px-1.5 py-0.5">
              {publishedEvents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="relative">
            Drafts
            <Badge className="ml-2 rounded-full px-1.5 py-0.5">
              {draftEvents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="past" className="relative">
            Past
            <Badge className="ml-2 rounded-full px-1.5 py-0.5">
              {pastEvents.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {publishedEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mb-2">No active events</CardTitle>
                <CardDescription className="mb-4 max-w-md">
                  You don't have any active events yet. Create your first event
                  to start selling tickets.
                </CardDescription>
                <Button
                  onClick={handleCreateEvent}
                  className="gap-2 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              }
            >
              {publishedEvents.map((event) =>
                view === "grid"
                  ? renderEventCard(event)
                  : renderEventList(event),
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Edit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mb-2">No draft events</CardTitle>
                <CardDescription className="mb-4 max-w-md">
                  You don't have any draft events. Create an event and save it
                  as a draft to work on it later.
                </CardDescription>
                <Button
                  onClick={handleCreateEvent}
                  className="gap-2 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              }
            >
              {draftEvents.map((event) =>
                view === "grid"
                  ? renderEventCard(event)
                  : renderEventList(event),
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mb-2">No past events</CardTitle>
                <CardDescription className="mb-4 max-w-md">
                  You don't have any past events yet. Events that have ended
                  will appear here.
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              }
            >
              {pastEvents.map((event) =>
                view === "grid"
                  ? renderEventCard(event)
                  : renderEventList(event),
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
