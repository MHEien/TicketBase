// plugin-global-types.ts
// Centralized global type definitions for the plugin system

import { PluginSDK } from "@/lib/plugin-sdk-context";
import React from "react";

export interface PluginRegistry {
  registered: Record<string, any>;
  register: (pluginId: string, exports: any) => any;
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