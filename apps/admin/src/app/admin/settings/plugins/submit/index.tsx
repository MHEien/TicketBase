"use client";

import PluginUploadInterface from "@/components/plugin-upload";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/plugins/submit/")({ 
  component: SubmitPluginPage,
})

function SubmitPluginPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submit a Plugin</h1>
          <p className="text-muted-foreground">
            Upload your TypeScript plugin source code and let our platform
            handle the build process.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.navigate({ to: "/admin/settings/plugins" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plugins
        </Button>
      </div>

      <Separator />

      <PluginUploadInterface />
    </div>
  );
}
