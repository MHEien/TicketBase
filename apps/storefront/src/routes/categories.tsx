import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { getCurrentOrganization } from "~/lib/server-organization";
import { eventsApi } from "~/lib/api/events";

export const Route = createFileRoute("/categories")({
  loader: async () => {
    const organization = await getCurrentOrganization();
    return { organization };
  },
  component: CategoriesPage,
});

interface CategoryStats {
  name: string;
  count: number;
  icon: string;
  description: string;
  color: string;
}

function CategoriesPage() {
  const { organization } = Route.useLoaderData();

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["event-categories"],
    queryFn: () => eventsApi.getEventCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // For each category, we would normally fetch event counts
  // For demo purposes, we'll create mock data with reasonable stats
  const categoryStats: CategoryStats[] = [
    {
      name: "Music",
      count: 45,
      icon: "🎵",
      description: "Concerts, festivals, and live music performances",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      name: "Conference",
      count: 32,
      icon: "🎤",
      description: "Professional conferences and business events",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      name: "Sports",
      count: 28,
      icon: "⚽",
      description: "Sporting events and athletic competitions",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      name: "Arts",
      count: 21,
      icon: "🎨",
      description: "Art exhibitions, galleries, and creative showcases",
      color: "bg-pink-100 text-pink-800 border-pink-200",
    },
    {
      name: "Food",
      count: 19,
      icon: "🍽️",
      description: "Food festivals, tastings, and culinary events",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      name: "Technology",
      count: 15,
      icon: "💻",
      description: "Tech meetups, workshops, and innovation events",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      name: "Business",
      count: 12,
      icon: "💼",
      description: "Networking, workshops, and business seminars",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
    {
      name: "Community",
      count: 8,
      icon: "🤝",
      description: "Local community events and social gatherings",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
  ];

  // Filter stats to only include categories that exist in the API
  const filteredStats = categoryStats.filter((stat) =>
    categories?.includes(stat.name),
  );

  const handleCategoryClick = (categoryName: string) => {
    window.location.href = `/events?category=${encodeURIComponent(categoryName)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover events by category{" "}
            {organization?.name
              ? `from ${organization.name}`
              : "and find exactly what you're looking for"}
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>

          {categoriesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStats.map((category) => (
                <Card
                  key={category.name}
                  hover
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.color} mb-4`}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      {category.count} events
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group"
                    >
                      Browse Events
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* All Categories List */}
        {categories && categories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              All Categories
            </h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {categories.map((category, index) => {
                  const categoryData = filteredStats.find(
                    (s) => s.name === category,
                  );

                  return (
                    <div
                      key={category}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl mr-4">
                            {categoryData?.icon || "📅"}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {category}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {categoryData?.description ||
                                `Events in the ${category.toLowerCase()} category`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="flex items-center text-gray-500 text-sm">
                              <Users className="h-4 w-4 mr-1" />
                              <span>
                                {categoryData?.count ||
                                  Math.floor(Math.random() * 20) + 5}{" "}
                                events
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Category Search */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Can't find what you're looking for?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Try searching for specific events or browse all available
                events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/search")}
                  variant="primary"
                >
                  Search Events
                </Button>
                <Button
                  onClick={() => (window.location.href = "/events")}
                  variant="outline"
                >
                  Browse All Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
