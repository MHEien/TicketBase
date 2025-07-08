"use client";

import { useState, useEffect } from "react";
import { useRouter, createFileRoute } from "@tanstack/react-router";
import { ExtensionPoint } from "@/components/extension-point";
import { PluginsControllerClient, AuthControllerClient } from "@repo/api-sdk";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import { useToast } from "@repo/ui/use-toast";

export const Route = createFileRoute("/admin/settings/plugins/$id/")({
  component: PluginSettingsPage,
});

function PluginSettingsPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [plugin, setPlugin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const pluginId = typeof id === "string" ? id : "";

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await AuthControllerClient.getSession();
        setUser(session);
      } catch (err) {
        console.error("Failed to load user session:", err);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function loadPlugin() {
      try {
        setLoading(true);
        console.log(`Loading plugin settings for: ${pluginId}`);

        const pluginData = await PluginsControllerClient.findOne(pluginId);
        setPlugin(pluginData);
        setError(null);

        console.log("Plugin data loaded:", pluginData);
      } catch (err) {
        console.error("Failed to load plugin:", err);
        setError(
          "Failed to load plugin settings. The plugin may not be installed or you may not have permission to view it.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (pluginId) {
      loadPlugin();
    }
  }, [pluginId]);

  const handleSaveConfig = async (config: any) => {
    try {
      console.log(`Saving configuration for plugin ${pluginId}:`, config);

      // Use the API SDK to save configuration
      await PluginsControllerClient.configure(pluginId);

      toast({
        title: "Settings Saved",
        description: `Configuration for ${plugin?.name || pluginId} has been saved successfully.`,
      });
    } catch (error) {
      console.error("Failed to save plugin config:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save plugin configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Loading plugin settings...
        </span>
      </div>
    );
  }

  if (error || !plugin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Plugin</CardTitle>
          <CardDescription>
            {error || "Failed to load plugin settings."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This could happen if:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>The plugin is not installed</li>
              <li>The plugin ID is invalid</li>
              <li>You don't have permission to access this plugin</li>
              <li>The plugin bundle failed to load from storage</li>
            </ul>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => router.navigate({ to: "/admin/settings/plugins" })}>
              Back to Plugins
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {plugin.name} Settings
          </h1>
          <p className="text-muted-foreground">
            Configure the settings for the {plugin.name} plugin.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Authenticated as: {user?.email || "Unknown"}
          </span>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plugin Configuration</CardTitle>
            <CardDescription>
              These settings control how the plugin works with your events.
              <br />
              <small className="text-blue-600">
                ✨ Powered by Plugin SDK Context-Aware system - no bundling
                issues!
              </small>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Use the new context-aware ExtensionPoint */}
            <ExtensionPoint
              name="admin-settings"
              context={{
                pluginId,
                onSave: handleSaveConfig,
                plugin,
                user: user,
              }}
              fallback={
                <div className="text-center p-6 border rounded-md border-dashed">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      This plugin does not have configurable settings.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Using Plugin SDK Context-Aware system
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1 mt-4">
                      <p>
                        <strong>Plugin ID:</strong> {pluginId}
                      </p>
                      <p>
                        <strong>Extension Points:</strong>{" "}
                        {plugin.extensionPoints?.join(", ") || "None specified"}
                      </p>
                      <p>
                        <strong>Bundle URL:</strong>{" "}
                        {plugin.bundleUrl ? "✅ Available" : "❌ Missing"}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plugin Information</CardTitle>
            <CardDescription>
              Details about this plugin and its capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Version
                </dt>
                <dd className="mt-1">{plugin.version}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Category
                </dt>
                <dd className="mt-1 capitalize">{plugin.category}</dd>
              </div>

              {plugin.metadata?.author && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Author
                  </dt>
                  <dd className="mt-1">{plugin.metadata.author}</dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plugin.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {plugin.enabled ? "Enabled" : "Disabled"}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Plugin System
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Plugin SDK Context-Aware ✨
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Bundle Status
                </dt>
                <dd className="mt-1">
                  {plugin.bundleUrl ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Bundle Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠️ No Bundle URL
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            {plugin.description && (
              <div className="pt-4 border-t">
                <dt className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </dt>
                <dd className="text-sm text-muted-foreground">
                  {plugin.description}
                </dd>
              </div>
            )}

            {plugin.extensionPoints && plugin.extensionPoints.length > 0 && (
              <div className="pt-4 border-t">
                <dt className="text-sm font-medium text-muted-foreground mb-2">
                  Extension Points
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {plugin.extensionPoints.map((point: string) => (
                    <span
                      key={point}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {point}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            {plugin.bundleUrl && (
              <div className="pt-4 border-t">
                <dt className="text-sm font-medium text-muted-foreground mb-2">
                  Bundle URL
                </dt>
                <dd className="text-xs text-muted-foreground font-mono break-all">
                  {plugin.bundleUrl}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Development Debug Card (only show in development) */}
        {process.env.NODE_ENV === "development" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Debug Information</CardTitle>
              <CardDescription className="text-xs">
                Development-only debug information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Plugin Raw Data
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {JSON.stringify(plugin, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
