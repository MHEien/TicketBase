// plugin-global-types.ts
// Centralized global type definitions for the plugin system

import type { PluginSDK } from "@/lib/plugin-sdk-context";
import type { ExtensionPointComponent } from "ticketsplatform-plugin-sdk";
import React from "react";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  displayName: string;
  iconUrl?: string;
  bundleUrl: string;
  extensionPoints: string[];
}

export interface InstalledPlugin extends PluginManifest {
  enabled: boolean;
  config?: Record<string, any>;
}

export interface PluginRegistry {
  registered: Record<string, {
    metadata: PluginManifest;
    extensionPoints: Record<string, ExtensionPointComponent>;
  }>;
  register: (pluginId: string, exports: any) => void;
  get: (pluginId: string) => any;
}

// Global declarations that should be consistent across all files
declare global {
  interface Window {
    PluginSDK: PluginSDK;
    React: typeof React; // Using any to avoid conflicts with different React type definitions
    ReactDOM?: any;
    __PLUGIN_REGISTRY: PluginRegistry;
  }
}

export {}; // Make this a module
