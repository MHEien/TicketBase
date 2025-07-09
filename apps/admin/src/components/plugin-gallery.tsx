"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Check,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Globe,
  Grid3X3,
  ImageIcon,
  Layers,
  Loader2,
  Mail,
  MessageSquare,
  Search,
  Share2,
  ShoppingCart,
  Star,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchAvailablePlugins,
  installPlugin,
  uninstallPlugin,
} from "@/lib/plugin-api";
import { usePlugins } from "@/hooks/use-plugin";
import { Plugin, InstalledPlugin } from "@/lib/plugin-types";
import { PluginSettings } from "@/components/plugin-settings";

// Icons map for categories
const categoryIcons: Record<string, React.ElementType> = {
  payment: CreditCard,
  marketing: Mail,
  analytics: BarChart3,
  social: Users,
  ticketing: Ticket,
  layout: Layers,
  seating: Calendar,
};

export function PluginGallery() {
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [showSettings, setShowSettings] = useState<string | null>(null);

  // Get installed plugins using our hook
  const {
    plugins: installedPlugins,
    loading: loadingInstalled,
    error: installedError,
    refreshPlugins,
  } = usePlugins();

  // State for marketplace plugins
  const [availablePlugins, setAvailablePlugins] = useState<Plugin[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [availableError, setAvailableError] = useState<Error | null>(null);

  // State for plugin actions
  const [actionPlugin, setActionPlugin] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch available plugins from the marketplace
  useEffect(() => {
    async function loadAvailablePlugins() {
      try {
        setLoadingAvailable(true);
        setAvailableError(null);

        const response = await fetchAvailablePlugins();
        if (response.success && response.data) {
          setAvailablePlugins(response.data);
        } else {
          setAvailableError(
            new Error(response.error || "Failed to load plugins"),
          );
        }
      } catch (error) {
        setAvailableError(
          error instanceof Error ? error : new Error(String(error)),
        );
      } finally {
        setLoadingAvailable(false);
      }
    }

    loadAvailablePlugins();
  }, []);

  // Prepare data for display
  const categories = [
    { id: "all", name: "All Plugins" },
    { id: "installed", name: "Installed" },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "marketing", name: "Marketing", icon: Mail },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "social", name: "Social", icon: Users },
    { id: "ticketing", name: "Ticketing", icon: Ticket },
    { id: "layout", name: "Layout", icon: Layers },
    { id: "seating", name: "Seating", icon: Calendar },
  ];

  // Map available plugins to UI format
  const mappedPlugins = availablePlugins.map((plugin) => {
    // Check if this plugin is installed
    const installed = installedPlugins.find((p) => p.metadata.id === plugin.metadata.id);

    // Get the appropriate icon
    const IconComponent = categoryIcons[plugin.metadata.category] || Layers;

    return {
      id: plugin.metadata.id,
      name: plugin.metadata.name,
      description: plugin.metadata.description,
      category: plugin.metadata.category,
      version: plugin.metadata.version,
      metadata: plugin.metadata,
      installed: !!installed,
      enabled: installed?.isLoaded || false,
      icon: IconComponent,
      // Use real data from plugin metadata
      installs: plugin.metadata?.installCount || 0,
      rating: plugin.metadata?.rating || null, // No default rating
      developer: plugin.metadata?.author || "Unknown Developer",
      developerAvatar: plugin.metadata?.authorAvatar || null, // No placeholder
    };
  });

  // Apply filters
  const filteredPlugins = mappedPlugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle plugin installation
  const handleInstall = async (pluginId: string) => {
    try {
      setActionPlugin(pluginId);
      setIsInstalling(true);
      setActionError(null);

      const response = await installPlugin(pluginId);
      if (!response.success) {
        setActionError(response.error || "Failed to install plugin");
        return;
      }

      await refreshPlugins();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsInstalling(false);
      setActionPlugin(null);
    }
  };

  // Handle plugin uninstallation
  const handleUninstall = async (pluginId: string) => {
    try {
      setActionPlugin(pluginId);
      setIsUninstalling(true);
      setActionError(null);

      const response = await uninstallPlugin(pluginId);
      if (!response.success) {
        setActionError(response.error || "Failed to uninstall plugin");
        return;
      }

      await refreshPlugins();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsUninstalling(false);
      setActionPlugin(null);
    }
  };

  // Handle opening plugin settings
  const handleOpenSettings = (pluginId: string) => {
    setShowSettings(pluginId);
  };

  const loading = loadingInstalled || loadingAvailable;
  const error = installedError || availableError;

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plugin Gallery</h1>
          <p className="text-muted-foreground">
            Extend your platform with powerful integrations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => (window.location.href = "/admin/settings/plugins/submit")}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Submit Plugin</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
          >
            {view === "grid" ? (
              <Grid3X3 className="h-4 w-4" />
            ) : (
              <Layers className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search plugins..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>
            {error.message || "Failed to load plugins. Please try again later."}
          </AlertDescription>
        </Alert>
      )}

      {actionError && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {showSettings ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PluginSettings
              pluginId={showSettings}
              onClose={() => {
                setShowSettings(null);
                refreshPlugins();
              }}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="flex w-full flex-wrap">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-1"
              >
                {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                {category.name}
                {category.id === "installed" && (
                  <Badge variant="secondary" className="ml-2">
                    {installedPlugins.length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-4"
            >
              <AnimatePresence>
                {selectedPlugin ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            {(() => {
                              const plugin = filteredPlugins.find(
                                (p) => p.id === selectedPlugin,
                              );
                              const PluginIcon = plugin?.icon;
                              return PluginIcon ? (
                                <PluginIcon className="h-6 w-6 text-primary" />
                              ) : null;
                            })()}
                          </div>
                          <div>
                            <CardTitle>
                              {
                                filteredPlugins.find(
                                  (p) => p.id === selectedPlugin,
                                )?.name
                              }
                            </CardTitle>
                            <CardDescription>
                              By{" "}
                              {
                                filteredPlugins.find(
                                  (p) => p.id === selectedPlugin,
                                )?.developer
                              }{" "}
                              •{" "}
                              {
                                filteredPlugins.find(
                                  (p) => p.id === selectedPlugin,
                                )?.installs
                              }{" "}
                              installs
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          onClick={() => setSelectedPlugin(null)}
                          variant="ghost"
                        >
                          Back to Gallery
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          <div className="space-y-1 md:col-span-2">
                            <h3 className="font-medium">Description</h3>
                            <p className="text-muted-foreground">
                              {
                                filteredPlugins.find(
                                  (p) => p.id === selectedPlugin,
                                )?.description
                              }{" "}
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat.
                            </p>
                          </div>
                          <div className="space-y-4 rounded-lg border p-4">
                            <div>
                              <p className="text-sm font-medium">Price</p>
                              <p className="text-2xl font-bold">Free</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Rating</p>
                              {filteredPlugins.find(
                                (p) => p.id === selectedPlugin,
                              )?.rating ? (
                                <div className="flex items-center gap-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(filteredPlugins.find((p) => p.id === selectedPlugin)?.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">
                                    {filteredPlugins
                                      .find((p) => p.id === selectedPlugin)
                                      ?.rating?.toFixed(1)}
                                  </span>
                                  {filteredPlugins.find(
                                    (p) => p.id === selectedPlugin,
                                  )?.metadata?.reviewCount && (
                                    <span className="text-xs text-muted-foreground">
                                      (
                                      {
                                        filteredPlugins.find(
                                          (p) => p.id === selectedPlugin,
                                        )?.metadata?.reviewCount
                                      }{" "}
                                      reviews)
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No ratings yet
                                </p>
                              )}
                            </div>
                            {(() => {
                              const plugin = filteredPlugins.find(
                                (p) => p.id === selectedPlugin,
                              );
                              if (!plugin) return null;

                              return plugin.installed ? (
                                <>
                                  <Badge className="mb-2">Installed</Badge>
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() =>
                                        handleOpenSettings(plugin.id)
                                      }
                                    >
                                      Configure
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="w-full"
                                      onClick={() => handleUninstall(plugin.id)}
                                      disabled={
                                        isUninstalling &&
                                        actionPlugin === plugin.id
                                      }
                                    >
                                      {isUninstalling &&
                                      actionPlugin === plugin.id ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Uninstalling
                                        </>
                                      ) : (
                                        "Uninstall"
                                      )}
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <Button
                                  className="w-full gap-2"
                                  onClick={() => handleInstall(plugin.id)}
                                  disabled={
                                    isInstalling && actionPlugin === plugin.id
                                  }
                                >
                                  {isInstalling &&
                                  actionPlugin === plugin.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Installing
                                    </>
                                  ) : (
                                    <>
                                      <Download className="h-4 w-4" />
                                      Install Plugin
                                    </>
                                  )}
                                </Button>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Features</h3>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {[
                              "Easy integration with your existing setup",
                              "Customizable to match your brand",
                              "Regular updates and improvements",
                              "Dedicated support team",
                              "Detailed documentation",
                              "API access for developers",
                            ].map((feature, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                                  <Check className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Developer</h3>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {filteredPlugins.find(
                                (p) => p.id === selectedPlugin,
                              )?.developerAvatar ? (
                                <AvatarImage
                                  src={
                                    filteredPlugins.find(
                                      (p) => p.id === selectedPlugin,
                                    )?.developerAvatar || ""
                                  }
                                  alt="Developer"
                                />
                              ) : (
                                <AvatarFallback>
                                  {filteredPlugins
                                    .find((p) => p.id === selectedPlugin)
                                    ?.developer?.charAt(0) || "?"}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {
                                  filteredPlugins.find(
                                    (p) => p.id === selectedPlugin,
                                  )?.developer
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Developer
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">View Documentation</Button>
                        {(() => {
                          const plugin = filteredPlugins.find(
                            (p) => p.id === selectedPlugin,
                          );
                          if (!plugin) return null;

                          return plugin.installed ? (
                            <Button
                              variant="outline"
                              onClick={() => handleOpenSettings(plugin.id)}
                            >
                              Configure Plugin
                            </Button>
                          ) : (
                            <Button
                              className="gap-2"
                              onClick={() => handleInstall(plugin.id)}
                              disabled={
                                isInstalling && actionPlugin === plugin.id
                              }
                            >
                              {isInstalling && actionPlugin === plugin.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Installing
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                  Install Plugin
                                </>
                              )}
                            </Button>
                          );
                        })()}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      view === "grid"
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "space-y-4"
                    }
                  >
                    {!loading && !error && filteredPlugins.length === 0 && (
                      <div className="col-span-full py-8 text-center">
                        <p className="text-muted-foreground">
                          No plugins found matching your criteria.
                        </p>
                      </div>
                    )}

                    {filteredPlugins
                      .filter((plugin) => {
                        if (category.id === "all") return true;
                        if (category.id === "installed")
                          return plugin.installed;
                        return plugin.category === category.id;
                      })
                      .map((plugin) => (
                        <motion.div
                          key={plugin.id}
                          layoutId={plugin.id}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          onClick={() => setSelectedPlugin(plugin.id)}
                        >
                          {view === "grid" ? (
                            <Card className="cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-md">
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <plugin.icon className="h-5 w-5 text-primary" />
                                  </div>
                                  <Badge
                                    variant={
                                      plugin.installed ? "outline" : "secondary"
                                    }
                                  >
                                    {plugin.installed ? "Installed" : "Free"}
                                  </Badge>
                                </div>
                                <CardTitle className="mt-3 text-lg">
                                  {plugin.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {plugin.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    {plugin.rating ? (
                                      <>
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-3 w-3 ${i < Math.floor(plugin.rating!) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs font-medium">
                                          {plugin.rating.toFixed(1)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">
                                        No ratings yet
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {plugin.installs} install
                                    {plugin.installs !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </CardContent>
                              <CardFooter>
                                {plugin.installed ? (
                                  <Button
                                    className="w-full gap-2"
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenSettings(plugin.id);
                                    }}
                                  >
                                    Configure
                                  </Button>
                                ) : (
                                  <Button
                                    className="w-full gap-2"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInstall(plugin.id);
                                    }}
                                    disabled={
                                      isInstalling && actionPlugin === plugin.id
                                    }
                                  >
                                    {isInstalling &&
                                    actionPlugin === plugin.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Installing
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-4 w-4" />
                                        Install
                                      </>
                                    )}
                                  </Button>
                                )}
                              </CardFooter>
                            </Card>
                          ) : (
                            <Card className="cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-md">
                              <CardContent className="flex items-center gap-4 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                  <plugin.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{plugin.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {plugin.description}
                                  </p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      {plugin.rating ? (
                                        <>
                                          <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < Math.floor(plugin.rating!) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                              />
                                            ))}
                                          </div>
                                          <span className="text-xs font-medium">
                                            {plugin.rating.toFixed(1)}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">
                                          No ratings yet
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {plugin.installs} install
                                      {plugin.installs !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      plugin.installed ? "outline" : "secondary"
                                    }
                                  >
                                    {plugin.installed ? "Installed" : "Free"}
                                  </Badge>
                                  {plugin.installed ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenSettings(plugin.id);
                                      }}
                                    >
                                      Configure
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="gap-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleInstall(plugin.id);
                                      }}
                                      disabled={
                                        isInstalling &&
                                        actionPlugin === plugin.id
                                      }
                                    >
                                      {isInstalling &&
                                      actionPlugin === plugin.id ? (
                                        <>
                                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                          Installing
                                        </>
                                      ) : (
                                        <>
                                          <Download className="h-3 w-3" />
                                          <span>Install</span>
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
