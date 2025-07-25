import { createFileRoute } from "@tanstack/react-router";
import { FullscreenPuckApp } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { clearPluginComponentsCache } from "@/lib/plugin-puck-integration";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/test-puck")({
  component: TestPuckPage,
});

function TestPuckPage() {
  const router = useRouter();

  const handleClearCache = () => {
    clearPluginComponentsCache();
    window.location.reload(); // Reload to see fresh plugin components
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Test Header */}
      <div className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.navigate({ to: "/admin" })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              Plugin-Puck Integration Test
            </h1>
            <p className="text-sm text-muted-foreground">
              Test the dynamic loading of plugin components in Puck editor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleClearCache}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Cache & Reload
          </Button>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-blue-50 border-b px-6 py-3">
        <div className="text-sm space-y-1">
          <p className="font-medium text-blue-900">🧪 Testing Instructions:</p>
          <ol className="list-decimal list-inside text-blue-700 space-y-1 ml-4">
            <li>Check if Stripe plugin components load in the "Plugins" tab</li>
            <li>
              Try dragging "Payment Form" and "Pricing Table" components to the
              canvas
            </li>
            <li>Test the component properties panel for plugin components</li>
            <li>Verify plugin components render correctly in preview</li>
          </ol>
        </div>
      </div>

      {/* Puck Editor */}
      <div className="flex-1">
        <FullscreenPuckApp />
      </div>
    </div>
  );
}
