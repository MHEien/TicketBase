import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Puzzle,
  Download,
  Settings,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { getCurrentOrganization } from "~/lib/server-organization";
import { usePlugins } from "~/contexts/PluginContext";
import { pluginsApi } from "~/lib/api/plugins";

export const Route = createFileRoute("/plugins")({
  component: PluginsPage,
  loader: async () => {
    const organization = await getCurrentOrganization();
    return { organization };
  },
});

function PluginsPage() {
  const { organization } = Route.useLoaderData();
  const { plugins, loading, error, refetch } = usePlugins();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: availablePlugins, isLoading: availableLoading } = useQuery({
    queryKey: ["available-plugins"],
    queryFn: () => pluginsApi.getAvailablePlugins(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const categories = [
    { id: "all", name: "All Plugins", icon: Puzzle },
    { id: "payment", name: "Payment", icon: Check },
    { id: "analytics", name: "Analytics", icon: Settings },
    { id: "marketing", name: "Marketing", icon: Download },
    { id: "integration", name: "Integration", icon: Settings },
  ];

  const filteredPlugins =
    availablePlugins?.filter(
      (plugin) =>
        selectedCategory === "all" || plugin.category === selectedCategory,
    ) || [];

  const isPluginInstalled = (pluginId: string) => {
    return plugins.some((p) => p.pluginId === pluginId);
  };

  const getPluginStatus = (pluginId: string) => {
    const installedPlugin = plugins.find((p) => p.pluginId === pluginId);
    if (!installedPlugin) return "not-installed";
    return installedPlugin.isEnabled ? "enabled" : "disabled";
  };

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Organization Required
          </h1>
          <p className="text-gray-600">
            Please set up your organization to manage plugins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plugin Management
          </h1>
          <p className="text-lg text-gray-600">
            Extend your storefront with powerful plugins for payments,
            analytics, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <Button
                  key={category.id}
                  variant={isActive ? "primary" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Plugin Error */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">
                  Error loading plugins: {error}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installed Plugins Summary */}
        {plugins.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Installed Plugins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {plugins.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Installed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {plugins.filter((p) => p.isEnabled).length}
                    </div>
                    <div className="text-sm text-gray-500">Enabled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {plugins.filter((p) => !p.isEnabled).length}
                    </div>
                    <div className="text-sm text-gray-500">Disabled</div>
                  </div>
                </div>
                <Button onClick={() => refetch()} variant="outline">
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plugins */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Plugins
          </h2>

          {availableLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlugins.map((plugin) => {
                const status = getPluginStatus(plugin.id);
                const isInstalled = isPluginInstalled(plugin.id);

                return (
                  <Card
                    key={plugin.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {plugin.displayName}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            by {plugin.author}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              plugin.category === "payment"
                                ? "bg-green-100 text-green-800"
                                : plugin.category === "analytics"
                                  ? "bg-blue-100 text-blue-800"
                                  : plugin.category === "marketing"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {plugin.category}
                          </span>
                          {isInstalled && (
                            <div
                              className={`flex items-center px-2 py-1 text-xs rounded-full ${
                                status === "enabled"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {status === "enabled" ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              {status}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {plugin.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>Version {plugin.version}</span>
                        <span>Priority: {plugin.priority}</span>
                      </div>

                      {/* Extension Points */}
                      {plugin.extensionPoints &&
                        plugin.extensionPoints.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Extension Points:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {plugin.extensionPoints.map((point) => (
                                <span
                                  key={point}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Metadata */}
                      {plugin.metadata && (
                        <div className="mb-4">
                          {plugin.metadata.paymentProvider && (
                            <div className="text-xs text-gray-600">
                              <strong>Payment Provider:</strong>{" "}
                              {plugin.metadata.paymentProvider}
                            </div>
                          )}
                          {plugin.metadata.supportedMethods && (
                            <div className="text-xs text-gray-600">
                              <strong>Methods:</strong>{" "}
                              {plugin.metadata.supportedMethods.join(", ")}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {!isInstalled ? (
                          <Button size="sm" className="flex-1" disabled>
                            <Download className="h-4 w-4 mr-2" />
                            Install (Admin Only)
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            disabled
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure (Admin Only)
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredPlugins.length === 0 && !availableLoading && (
            <div className="text-center py-12">
              <Puzzle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No plugins found
              </h3>
              <p className="text-gray-600">
                {selectedCategory === "all"
                  ? "No plugins are available in the marketplace"
                  : `No ${selectedCategory} plugins are available`}
              </p>
            </div>
          )}
        </div>

        {/* Plugin Development Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Puzzle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Develop Custom Plugins
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Extend your storefront with custom functionality using our
                  Plugin SDK. Create payment processors, analytics tools,
                  marketing integrations, and more.
                </p>
                <div className="text-xs text-blue-600">
                  <strong>Note:</strong> Plugin installation and configuration
                  is managed through the admin panel.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
