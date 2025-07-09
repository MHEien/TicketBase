import React from "react";
import { ExtensionPoint } from "@/lib/simple-plugin-system";

interface PluginWidgetAreaProps {
  areaName: string;
  eventData?: Record<string, any>;
  className?: string;
}

/**
 * A simplified component that renders plugin widgets using the new extension point system
 */
export function PluginWidgetArea({
  areaName,
  eventData,
  className = "",
}: PluginWidgetAreaProps) {
  return (
    <div
      className={`plugin-widget-area ${className}`}
      data-area-name={areaName}
    >
      <ExtensionPoint
        name={areaName}
        context={{
          eventData,
          configuration: {},
        }}
        fallback={null}
      />
    </div>
  );
}
