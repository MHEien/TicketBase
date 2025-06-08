export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  scope: string;
  module: string;
  url: string;
  main: string;
  dependencies?: Record<string, string>;
  extensionPoints?: string[];
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  manifest: PluginManifest;
  extensionPoints: Record<string, any>;
  isEnabled: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error?: Error;
}
