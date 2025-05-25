"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExtensionPoint } from "@/components/extension-point";
import { getPlugin } from "@/lib/plugin-api";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export default function PluginSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [plugin, setPlugin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const pluginId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    async function loadPlugin() {
      try {
        setLoading(true);
        const pluginData = await getPlugin(pluginId);
        setPlugin(pluginData);
        setError(null);
      } catch (err) {
        console.error("Failed to load plugin:", err);
        setError(
          "Failed to load plugin settings. The plugin may not be installed.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (pluginId) {
      loadPlugin();
    }
  }, [pluginId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !plugin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            {error || "Failed to load plugin settings."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/settings/plugins")}>
            Back to Plugins
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {plugin.name} Settings
        </h1>
        <p className="text-muted-foreground">
          Configure the settings for the {plugin.name} plugin.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plugin Configuration</CardTitle>
            <CardDescription>
              These settings control how the plugin works with your events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 
              This renders the plugin's admin settings UI
              The plugin component receives its configuration as a prop
            */}
            <ExtensionPoint
              name="admin-settings"
              context={{ pluginId }}
              fallback={
                <div className="text-center p-4 border rounded-md border-dashed">
                  <p className="text-muted-foreground">
                    This plugin does not have configurable settings.
                  </p>
                </div>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About {plugin.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <dl className="grid grid-cols-2 gap-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Version
              </dt>
              <dd>{plugin.version}</dd>

              <dt className="text-sm font-medium text-muted-foreground">
                Category
              </dt>
              <dd className="capitalize">{plugin.category}</dd>

              {plugin.metadata?.author && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Author
                  </dt>
                  <dd>{plugin.metadata.author}</dd>
                </>
              )}

              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd>
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
            </dl>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                {plugin.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
