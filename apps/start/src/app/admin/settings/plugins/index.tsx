"use client";

import { PluginGallery } from "@/components/plugin-gallery";
import { Separator } from "@repo/ui/separator";

export const Route = createFileRoute({
  component: PluginsPage,
});

function PluginsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plugins</h1>
        <p className="text-muted-foreground">
          Discover and manage plugins to extend your event platform.
        </p>
      </div>

      <Separator />

      <PluginGallery />
    </div>
  );
}
