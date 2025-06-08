import { Suspense } from "react";
import { usePlugins } from "@/lib/plugins/plugin-context";

interface PluginWidgetAreaProps {
  areaName: string;
  eventData?: any;
}

export function PluginWidgetArea({ areaName, eventData }: PluginWidgetAreaProps) {
  const { getExtensionPoint } = usePlugins();
  const widgets = getExtensionPoint(areaName);

  return (
    <div className="space-y-4">
      {widgets.map((Widget, index) => (
        <Suspense key={index} fallback={<div className="h-20 animate-pulse rounded-lg bg-muted" />}>
          <Widget context={{ event: eventData }} sdk={window.PluginSDK} />
        </Suspense>
      ))}
    </div>
  );
} 