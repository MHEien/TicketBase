export enum PluginStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
  REMOVED = 'removed',
}

export enum PluginCategory {
  PAYMENT = 'payment',
  NOTIFICATION = 'notification',
  ANALYTICS = 'analytics',
  INTEGRATION = 'integration',
  UI = 'ui',
  WORKFLOW = 'workflow',
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  category: PluginCategory;
  status: PluginStatus;
  bundleUrl?: string;
  extensionPoints: string[];
  requiredPermissions: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstalledPlugin {
  id: string;
  pluginId: string;
  organizationId: string;
  tenantId: string;
  enabled: boolean;
  configuration: Record<string, unknown>;
  installedBy: string;
  version: string;
  installedAt: Date;
  updatedAt: Date;
  plugin?: Plugin;
}

export interface PluginInstallationResponse {
  success: boolean;
  plugin: InstalledPlugin;
  message?: string;
}

export interface PluginListResponse {
  plugins: Plugin[];
  total: number;
  page?: number;
  limit?: number;
}

export interface InstalledPluginListResponse {
  plugins: InstalledPlugin[];
  total: number;
  page?: number;
  limit?: number;
}

export interface PluginHealthStatus {
  isConnected: boolean;
  message?: string;
  timestamp: Date;
}

export interface PluginBundleInfo {
  pluginId: string;
  version: string;
  fileName: string;
  contentType: string;
  size?: number;
  url?: string;
}
