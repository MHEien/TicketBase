import { apiClient } from '../api-client';

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'payment' | 'analytics' | 'marketing' | 'integration' | 'other';
  displayName: string;
  requiredPermissions: string[];
  priority: number;
  status: 'active' | 'inactive' | 'deprecated' | 'removed';
  extensionPoints: string[];
  configSchema?: any;
  metadata: {
    paymentProvider?: string;
    supportedMethods?: string[];
    supportedCurrencies?: string[];
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InstalledPlugin {
  id: string;
  pluginId: string;
  organizationId: string;
  isEnabled: boolean;
  configuration: Record<string, any>;
  installedAt: string;
  lastUpdated: string;
  plugin: Plugin;
}

export interface PluginBundle {
  pluginId: string;
  bundleUrl: string;
  version: string;
  extensionPoints: Record<string, any>;
}

export const pluginsApi = {
  // Get all available plugins (public endpoint)
  async getAvailablePlugins(): Promise<Plugin[]> {
    return apiClient.get<Plugin[]>('/plugins');
  },

  // Get plugins by category
  async getPluginsByCategory(category: string): Promise<Plugin[]> {
    return apiClient.get<Plugin[]>(`/plugins/category/${category}`);
  },

  // Get plugins by extension point
  async getPluginsByExtensionPoint(extensionPoint: string): Promise<Plugin[]> {
    return apiClient.get<Plugin[]>(`/plugins/extension-point/${extensionPoint}`);
  },

  // Get installed plugins for organization (requires organization context)
  async getInstalledPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(`/plugins/organizations/${organizationId}/installed`);
  },

  // Get enabled plugins for organization
  async getEnabledPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(`/plugins/organizations/${organizationId}/enabled`);
  },

  // Get payment plugins for organization
  async getPaymentPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(`/plugins/organizations/${organizationId}/payment`);
  },

  // Get plugins by type for organization
  async getPluginsByType(organizationId: string, type: string): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(`/plugins/organizations/${organizationId}/type/${type}`);
  },

  // Get plugin bundle/script URL
  async getPluginBundle(pluginId: string, version?: string): Promise<PluginBundle> {
    const params = version ? `?version=${version}` : '';
    return apiClient.get<PluginBundle>(`/plugins/${pluginId}/bundle${params}`);
  },

  // Get plugin configuration for organization
  async getPluginConfig(organizationId: string, pluginId: string): Promise<Record<string, any>> {
    return apiClient.get<Record<string, any>>(`/plugins/organizations/${organizationId}/plugins/${pluginId}/config`);
  },
}; 