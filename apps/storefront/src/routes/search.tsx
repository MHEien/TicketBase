import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { eventsApi } from "~/lib/api/events";
import { getCurrentOrganization } from "~/lib/server-organization";

export const Route = createFileRoute("/search")({
  loader: async () => {
    const organization = await getCurrentOrganization();
    return { organization };
  },
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
      category: (search.category as string) || undefined,
      location: (search.location as string) || undefined,
    };
  },
});

function SearchPage() {
  const { organization } = Route.useLoaderData();
  const { q: query, category, location } = Route.useSearch();

  const [localQuery, setLocalQuery] = useState(query || "");
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  // Fetch search results
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search-events", query, category, location],
    queryFn: () =>
      eventsApi.searchEvents(query, {
        category: category || undefined,
        location: location || undefined,
        limit: 20,
      }),
    enabled: !!query,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ["event-categories"],
    queryFn: () => eventsApi.getEventCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      const params = new URLSearchParams();
      params.set("q", localQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const handleCategoryFilter = (cat: string) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (cat) params.set("category", cat);
    window.location.href = `/search?${params.toString()}`;
  };

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const suggestedSearches = [
    "music concerts",
    "tech conferences",
    "art exhibitions",
    "sports events",
    "food festivals",
    "networking events",
  ];

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Events
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find the perfect event for you
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search for events, venues, or categories..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
                className="text-lg py-4"
              />
              <Button
                type="submit"
                className="mt-4 w-full sm:w-auto"
                disabled={!localQuery.trim()}
              >
                Search Events
              </Button>
            </form>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {suggestedSearches.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setLocalQuery(suggestion);
                    const params = new URLSearchParams();
                    params.set("q", suggestion);
                    window.location.href = `/search?${params.toString()}`;
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Search Error
            </h1>
            <p className="text-gray-600 mb-8">
              There was a problem with your search. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-lg text-gray-600">
            {isLoading ? "Searching..." : `${events?.length || 0} events found`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <Input
              type="text"
              placeholder="Search events..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-gray-400" />}
              className="lg:max-w-md"
            />
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 py-2">Filter by:</span>
            {categories?.slice(0, 6).map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "primary" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
            {category && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryFilter("")}
                className="text-red-600"
              >
                Clear filter
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex">
                  <div className="w-48 h-32 bg-gray-200 flex-shrink-0"></div>
                  <CardContent className="flex-1 p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
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
                          {highlightText(event.title, query)}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {highlightText(
                            event.shortDescription || event.description,
                            query,
                          )}
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
                              {Math.min(
                                ...event.ticketTypes.map((t) => t.price),
                              )}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-6">
                No events match your search for "{query}". Try different
                keywords or browse all events.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => (window.location.href = "/events")}
                  variant="outline"
                >
                  Browse All Events
                </Button>
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Try searching for:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedSearches.slice(0, 3).map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("q", suggestion);
                          window.location.href = `/search?${params.toString()}`;
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested searches for results */}
        {events && events.length > 0 && (
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Related Searches
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedSearches
                .filter((s) => s !== query)
                .slice(0, 4)
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set("q", suggestion);
                      if (category) params.set("category", category);
                      window.location.href = `/search?${params.toString()}`;
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
