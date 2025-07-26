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
  // Ensure we preserve all context properties
  const extensionContext = {
    configuration: {},
    ...context,
  };

  // Debug log in development
  if (import.meta.env.NODE_ENV === "development") {
    console.log(`🔧 ExtensionPoint "${name}" context:`, extensionContext);
  }

  return (
    <SimpleExtensionPoint
      name={name}
      context={extensionContext}
      fallback={fallback}
    />
  );
}
