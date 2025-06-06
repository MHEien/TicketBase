"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Switch } from "@repo/ui/switch";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import { Alert, AlertDescription } from "@repo/ui/alert";
import { Loader2, ArrowLeft, Save, ExternalLink, Settings } from "lucide-react";
import {
  getPlugin,
  updatePluginConfig,
  setPluginEnabled,
} from "@/lib/plugin-api";
import { useToast } from "@repo/ui/use-toast";
import { ExtensionPoint } from "@/components/extension-point";
import { usePluginSDK } from "@/lib/plugin-sdk-context";
import { InstalledPlugin } from "@/lib/plugin-types";

interface PluginSettingsProps {
  pluginId: string;
  onClose: () => void;
}

export function PluginSettings({ pluginId, onClose }: PluginSettingsProps) {
  const { toast } = useToast();
  const [plugin, setPlugin] = useState<InstalledPlugin | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Use Plugin SDK for authentication and API access
  const { api, auth, utils } = usePluginSDK();

  // Load plugin data
  useEffect(() => {
    async function loadPlugin() {
      try {
        setLoading(true);
        console.log(`Loading plugin settings for: ${pluginId}`);

        const response = await getPlugin(pluginId);
        if (response.success && response.data) {
          setPlugin(response.data);
          setEnabled(response.data.enabled);
          setError(null);
          console.log("Plugin settings loaded:", response.data);
        } else {
          setError(
            response.error ||
              "Failed to load plugin settings. The plugin may not be installed or you may not have permission to access it.",
          );
        }
      } catch (err) {
        console.error("Failed to load plugin:", err);
        setError(
          "Failed to load plugin settings. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (pluginId) {
      loadPlugin();
    }
  }, [pluginId]);

  // Handle enabling/disabling the plugin
  const handleToggleEnabled = async () => {
    if (!plugin) return;

    try {
      setSaving(true);
      const newState = !enabled;

      const response = await setPluginEnabled(pluginId, newState);

      if (response.success) {
        setEnabled(newState);

        toast({
          title: newState ? "Plugin Enabled ✅" : "Plugin Disabled ⏸️",
          description: `${plugin.name} has been ${newState ? "enabled" : "disabled"} successfully.`,
        });

        // Update plugin state
        setPlugin((prev) => (prev ? { ...prev, enabled: newState } : null));
      } else {
        toast({
          title: "Action Failed",
          description: response.error || "Failed to update plugin status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to update plugin status.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle saving plugin configuration using Plugin SDK
  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!plugin) return;

    try {
      setSaving(true);
      console.log(`Saving configuration for plugin ${pluginId}:`, config);

      // Use Plugin SDK API to save configuration
      await api.saveConfig(pluginId, config);

      // Update plugin configuration in state
      setPlugin((prev) => (prev ? { ...prev, configuration: config } : null));

      toast({
        title: "Settings Saved Successfully! 🎉",
        description: `Configuration for ${plugin.name} has been updated.`,
      });
    } catch (err) {
      console.error("Failed to save plugin config:", err);
      toast({
        title: "Save Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to save plugin settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          <CardTitle>Error Loading Plugin Settings</CardTitle>
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
            <Button onClick={onClose}>Back to Plugins</Button>
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
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{plugin.name}</h2>
          <p className="text-muted-foreground">{plugin.description}</p>
          {auth.isAuthenticated && (
            <p className="text-xs text-muted-foreground">
              Authenticated as: {auth.user?.email}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Plugin Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plugin Status</CardTitle>
                <CardDescription>
                  Enable or disable this plugin for your events.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="plugin-enabled"
                  checked={enabled}
                  onCheckedChange={handleToggleEnabled}
                  disabled={saving}
                />
                <Label htmlFor="plugin-enabled">
                  {enabled ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!enabled && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800">
                  This plugin is currently disabled. Enable it to use it in your
                  events and checkout processes.
                </AlertDescription>
              </Alert>
            )}
            {enabled && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  ✅ This plugin is active and will be available for use in your
                  events.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Plugin Configuration Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <div>
                <CardTitle>Plugin Configuration</CardTitle>
                <CardDescription>
                  Configure how this plugin works with your events.
                  <br />
                  <small className="text-blue-600">
                    ✨ Powered by Plugin SDK Context-Aware system - no bundling
                    issues!
                  </small>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Use the new context-aware ExtensionPoint */}
            <ExtensionPoint
              name="admin-settings"
              context={{
                plugin,
                pluginId,
                onSave: handleSaveConfig,
                saving,
                user: auth.user,
                isAuthenticated: auth.isAuthenticated,
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
                      <p>
                        <strong>Version:</strong> {plugin.version}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Plugin Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Plugin Information</CardTitle>
            <CardDescription>
              Details about this plugin and its capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  Installed On
                </dt>
                <dd className="mt-1">
                  {new Date(plugin.installedAt).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </dt>
                <dd className="mt-1">
                  {new Date(plugin.updatedAt).toLocaleDateString()}
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

              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {enabled ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
            </dl>

            {/* Extension Points */}
            {plugin.extensionPoints && plugin.extensionPoints.length > 0 && (
              <div className="pt-4 border-t mt-4">
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

            {/* Bundle URL */}
            {plugin.bundleUrl && (
              <div className="pt-4 border-t mt-4">
                <dt className="text-sm font-medium text-muted-foreground mb-2">
                  Bundle URL
                </dt>
                <dd className="text-xs text-muted-foreground font-mono break-all bg-muted p-2 rounded">
                  {plugin.bundleUrl}
                </dd>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
              {plugin.bundleUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(plugin.bundleUrl, "_blank")}
                  className="flex-1"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Bundle
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Development Debug Card */}
        {process.env.NODE_ENV === "development" && (
          <Card className="border-dashed">
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
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
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
