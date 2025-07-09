import React from "react";
import { ExtensionPoint as SimpleExtensionPoint } from "@/lib/simple-plugin-system";

export interface ExtensionPointProps {
  name: string;
  context?: Record<string, any>;
  fallback?: React.ReactNode;
}

/**
 * Simplified extension point component using the new plugin system
 */
export function ExtensionPoint({
  name,
  context = {},
  fallback = null,
}: ExtensionPointProps) {
  return (
    <SimpleExtensionPoint
      name={name}
      context={{ configuration: {}, ...context }}
      fallback={fallback}
    />
  );
}
