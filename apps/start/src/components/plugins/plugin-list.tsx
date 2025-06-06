"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MoreHorizontal, Settings, Eye, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  bundleUrl: string;
  requiredPermissions: string[];
  extensionPoints?: string[];
  metadata?: {
    author?: string;
    installCount?: number;
    lastUpdated?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface InstalledPlugin extends Plugin {
  enabled: boolean;
  tenantId: string;
  configuration: Record<string, any>;
  installedAt: string;
}

const categoryColors = {
  payment: "bg-green-100 text-green-800",
  analytics: "bg-blue-100 text-blue-800",
  marketing: "bg-purple-100 text-purple-800",
  integration: "bg-orange-100 text-orange-800",
  utility: "bg-gray-100 text-gray-800",
};

export function PluginList() {
  const [availablePlugins, setAvailablePlugins] = useState<Plugin[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<InstalledPlugin[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "installed">(
    "available",
  );

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch available plugins from plugin server
      const availableResponse = await fetch("/api/plugins");
      if (!availableResponse.ok) {
        throw new Error("Failed to fetch available plugins");
      }
      const available = await availableResponse.json();
      setAvailablePlugins(available);

      // Fetch installed plugins for current organization
      try {
        const installedResponse = await fetch(
          "/api/plugins/organization/current",
        );
        if (installedResponse.ok) {
          const installed = await installedResponse.json();
          setInstalledPlugins(installed);
        }
      } catch (installedError) {
        console.warn("Failed to fetch installed plugins:", installedError);
        // Continue without installed plugins data
      }
    } catch (error) {
      console.error("Error fetching plugins:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch plugins",
      );
    } finally {
      setLoading(false);
    }
  };

  const installPlugin = async (pluginId: string) => {
    try {
      const response = await fetch("/api/plugins/install", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pluginId }),
      });

      if (!response.ok) {
        throw new Error("Failed to install plugin");
      }

      // Refresh the plugin lists
      await fetchPlugins();
    } catch (error) {
      console.error("Error installing plugin:", error);
      alert("Failed to install plugin");
    }
  };

  const uninstallPlugin = async (pluginId: string) => {
    try {
      const response = await fetch(`/api/plugins/installed/${pluginId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to uninstall plugin");
      }

      // Refresh the plugin lists
      await fetchPlugins();
    } catch (error) {
      console.error("Error uninstalling plugin:", error);
      alert("Failed to uninstall plugin");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex space-x-4 mb-6">
          <Button variant="outline" disabled>
            Available
          </Button>
          <Button variant="outline" disabled>
            Installed
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const pluginsToShow =
    activeTab === "available" ? availablePlugins : installedPlugins;
  const isPluginInstalled = (pluginId: string) =>
    installedPlugins.some((p) => p.id === pluginId);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === "available" ? "default" : "outline"}
          onClick={() => setActiveTab("available")}
        >
          Available ({availablePlugins.length})
        </Button>
        <Button
          variant={activeTab === "installed" ? "default" : "outline"}
          onClick={() => setActiveTab("installed")}
        >
          Installed ({installedPlugins.length})
        </Button>
      </div>

      {/* Plugin Grid */}
      {pluginsToShow.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {activeTab === "available"
              ? "No plugins available"
              : "No plugins installed"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pluginsToShow.map((plugin) => {
            const isInstalled = isPluginInstalled(plugin.id);
            const installedPlugin = installedPlugins.find(
              (p) => p.id === plugin.id,
            );

            return (
              <Card key={plugin.id} className="flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                      <CardDescription className="mt-1">
                        v{plugin.version}
                        {plugin.metadata?.author && (
                          <span className="text-xs text-muted-foreground ml-2">
                            by {plugin.metadata.author}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/settings/plugins/${plugin.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {isInstalled && (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/settings/plugins/${plugin.id}/configure`}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mt-3">
                    <Badge
                      variant="secondary"
                      className={
                        categoryColors[
                          plugin.category as keyof typeof categoryColors
                        ] || categoryColors.utility
                      }
                    >
                      {plugin.category}
                    </Badge>

                    {activeTab === "installed" && installedPlugin && (
                      <Badge
                        variant={
                          installedPlugin.enabled ? "default" : "secondary"
                        }
                      >
                        {installedPlugin.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {plugin.description}
                  </p>

                  {plugin.extensionPoints &&
                    plugin.extensionPoints.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Extension Points:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {plugin.extensionPoints.map((point) => (
                            <Badge
                              key={point}
                              variant="outline"
                              className="text-xs"
                            >
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {plugin.metadata?.installCount && (
                        <span>{plugin.metadata.installCount} installs</span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {activeTab === "available" ? (
                        isInstalled ? (
                          <Button variant="outline" size="sm" disabled>
                            Installed
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => installPlugin(plugin.id)}
                          >
                            Install
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => uninstallPlugin(plugin.id)}
                        >
                          Uninstall
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
