"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { getPlugin, updatePluginConfig, setPluginEnabled } from "@/lib/plugin-api";
import { useToast } from "@/components/ui/use-toast";
import { ExtensionPoint } from "@/components/extension-point";
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

  // Load plugin data
  useEffect(() => {
    async function loadPlugin() {
      try {
        setLoading(true);
        const response = await getPlugin(pluginId);
        if (response.success && response.data) {
          setPlugin(response.data);
          setEnabled(response.data.enabled);
          setError(null);
        } else {
          setError(response.error || "Failed to load plugin settings. The plugin may not be installed.");
        }
      } catch (err) {
        console.error("Failed to load plugin:", err);
        setError("Failed to load plugin settings. The plugin may not be installed.");
      } finally {
        setLoading(false);
      }
    }

    loadPlugin();
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
          title: newState ? "Plugin Enabled" : "Plugin Disabled",
          description: `The plugin has been ${newState ? "enabled" : "disabled"} successfully.`,
        });
      } else {
        toast({
          title: "Action Failed",
          description: response.error || "Failed to update plugin status.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err instanceof Error ? err.message : "Failed to update plugin status.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle saving plugin configuration
  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!plugin) return;
    
    try {
      setSaving(true);
      
      const response = await updatePluginConfig(pluginId, config);
      
      if (response.success && response.data) {
        setPlugin(response.data);
        
        toast({
          title: "Settings Saved",
          description: "The plugin settings have been updated successfully.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: response.error || "Failed to save plugin settings.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "Failed to save plugin settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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
          <Button onClick={onClose}>
            Back to Plugins
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{plugin.name}</h2>
          <p className="text-muted-foreground">{plugin.description}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
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
                  This plugin is currently disabled. Enable it to use it in your events.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Plugin Configuration</CardTitle>
            <CardDescription>
              Configure how this plugin works with your events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExtensionPoint 
              name="admin-settings" 
              context={{ 
                plugin,
                onSave: handleSaveConfig,
                saving
              }} 
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
            <CardDescription>
              Plugin information and details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-sm font-medium text-muted-foreground">Version</dt>
              <dd>{plugin.version}</dd>
              
              <dt className="text-sm font-medium text-muted-foreground">Category</dt>
              <dd className="capitalize">{plugin.category}</dd>
              
              {plugin.metadata?.author && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                  <dd>{plugin.metadata.author}</dd>
                </>
              )}
              
              <dt className="text-sm font-medium text-muted-foreground">Installed On</dt>
              <dd>{new Date(plugin.installedAt).toLocaleDateString()}</dd>
              
              <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd>{new Date(plugin.updatedAt).toLocaleDateString()}</dd>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Documentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 