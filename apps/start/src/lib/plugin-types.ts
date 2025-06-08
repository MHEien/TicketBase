import { type InstalledPluginDto } from "@repo/api-sdk";

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  category:
    | "payment"
    | "marketing"
    | "analytics"
    | "social"
    | "ticketing"
    | "layout"
    | "seating";
  bundleUrl: string; // URL to the plugin bundle
  extensionPoints: string[]; // List of extension points this plugin implements
  adminComponents: {
    settings?: string; // Component name for admin settings
    eventCreation?: string; // Component for event creation flow
    dashboard?: string; // Component for dashboard widgets
  };
  storefrontComponents: {
    checkout?: string; // Component for checkout process
    eventDetail?: string; // Component for event detail page
    ticketSelection?: string; // Component for ticket selection
    widgets?: Record<string, string>; // Named widget components for placement
  };
  metadata: {
    priority?: number; // Priority for rendering when multiple plugins implement the same extension point
    displayName?: string; // Human-readable name for display
    author?: string; // Plugin author/developer
    authorEmail?: string; // Plugin author email
    authorAvatar?: string; // Plugin author avatar URL
    repositoryUrl?: string; // Repository URL for the plugin source code
    submittedAt?: string; // Plugin submission timestamp
    status?: "pending" | "approved" | "rejected"; // Plugin submission status
    iconUrl?: string; // URL to the plugin icon
    installCount?: number; // Number of times this plugin has been installed
    rating?: number; // Average rating (1-5 stars)
    reviewCount?: number; // Number of reviews
    lastUpdated?: string; // Last update timestamp
    [key: string]: any; // Allow additional metadata
  };
  requiredPermissions?: string[];
}

export type InstalledPlugin = InstalledPluginDto;

// Context type for extension points
export type ExtensionPointContext = Record<string, any>;

// Common props for all extension point components
export interface ExtensionComponentProps {
  context: ExtensionPointContext;
  configuration: Record<string, any>;
  plugin: InstalledPlugin;
}
