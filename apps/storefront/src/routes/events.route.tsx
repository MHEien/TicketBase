import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { getCurrentOrganization } from "~/lib/server-organization";
import { eventsApi, Event, EventFilters } from "~/lib/api/events";
import { eventsQueryOptions, fetchEvents } from "~/utils/events";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(eventsQueryOptions(params));
    const organization = await getCurrentOrganization();
    return { organization };
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      category: (search.category as string) || undefined,
      search: (search.search as string) || undefined,
      location: (search.location as string) || undefined,
      page: Number(search.page) || 1,
    };
  },
});

interface SearchParams {
  category?: string;
  search?: string;
  location?: string;
  page: number;
}

function EventsPage() {
  const { organization } = Route.useLoaderData();
  const { category, search: searchQuery, location, page } = Route.useSearch();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [showFilters, setShowFilters] = useState(false);

  const filters: EventFilters = useMemo(
    () => ({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      location: location || undefined,
      limit: 12,
      offset: (page - 1) * 12,
    }),
    [selectedCategory, searchQuery, location, page],
  );

  // Fetch events
  const {
    data: events,
    error,
    isLoading,
  } = useSuspenseQuery(eventsQueryOptions(filters));

  // Fetch categories
  const { data: categories } = useSuspenseQuery({
    queryKey: ["event-categories"],
    queryFn: () => eventsApi.getEventCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch !== searchQuery) {
      // Navigate with search parameter
      window.location.href = `/events?search=${encodeURIComponent(localSearch)}`;
    }
  };

  const handleCategoryFilter = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? "" : cat);
    const params = new URLSearchParams();
    if (cat !== selectedCategory && cat) params.set("category", cat);
    if (searchQuery) params.set("search", searchQuery);
    window.location.href = `/events${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setLocalSearch("");
    window.location.href = "/events";
  };

  const renderEventCard = (event: Event) => {
    if (viewMode === "list") {
      return (
        <Card
          key={event.id}
          hover
          className="overflow-hidden cursor-pointer"
          onClick={() => (window.location.href = `/events/${event.id}`)}
        >
          <div className="flex">
            <div className="w-48 h-32 bg-gray-200 flex-shrink-0">
              <img
                src={event.featuredImage || "/api/placeholder/300/200"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                    {event.totalTicketsSold > 0 && (
                      <span className="text-gray-500 text-xs">
                        {event.totalTicketsSold} tickets sold
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.shortDescription}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(event.startDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{event.startTime}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {event.locationType === "virtual"
                          ? "Virtual Event"
                          : `${event.city}, ${event.country}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <div className="mb-2">
                      <span className="text-lg font-semibold text-gray-900">
                        From $
                        {Math.min(...event.ticketTypes.map((t) => t.price))}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/events/${event.id}`;
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      );
    }

    return (
      <Card
        key={event.id}
        hover
        className="overflow-hidden cursor-pointer"
        onClick={() => (window.location.href = `/events/${event.id}`)}
      >
        <div className="aspect-video bg-gray-200 relative">
          <img
            src={event.featuredImage || "/api/placeholder/400/240"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {event.shortDescription}
          </p>

          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(new Date(event.startDate), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.startTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {event.locationType === "virtual"
                  ? "Virtual Event"
                  : `${event.city}, ${event.country}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              {event.ticketTypes &&
                event.ticketTypes.length > 0 &&
                `From $${Math.min(...event.ticketTypes.map((t) => t.price))}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/events/${event.id}`;
              }}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Events
            </h1>
            <p className="text-gray-600 mb-8">
              There was a problem loading events. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-lg text-gray-600">
            Discover amazing events{" "}
            {organization?.name ? `from ${organization.name}` : "near you"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <Input
              type="text"
              placeholder="Search events..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              icon={<Search className="h-4 w-4 text-gray-400" />}
              className="lg:max-w-md"
            />
          </form>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Quick category filters */}
              {categories?.slice(0, 5).map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </Button>
              ))}

              {(selectedCategory || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    placeholder="City or venue"
                    defaultValue={location}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <Input type="date" placeholder="Start date" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {isLoading
              ? "Loading events..."
              : `${events?.length || 0} events found`}
          </p>
        </div>

        {/* Events Grid/List */}
        {isLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div
                  className={
                    viewMode === "grid" ? "aspect-video bg-gray-200" : "flex"
                  }
                >
                  {viewMode === "list" && (
                    <div className="w-48 h-32 bg-gray-200"></div>
                  )}
                  {viewMode === "grid" && (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {events.map(renderEventCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filters to find more events."
                  : "There are no events available at the moment. Check back soon!"}
              </p>
              {(searchQuery || selectedCategory) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination placeholder */}
        {events && events.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="primary">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
