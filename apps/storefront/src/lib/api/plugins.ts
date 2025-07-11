import { apiClient } from "../api-client";

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: "payment" | "analytics" | "marketing" | "integration" | "other";
  displayName: string;
  requiredPermissions: string[];
  priority: number;
  status: "active" | "inactive" | "deprecated" | "removed";
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
    return apiClient.get<Plugin[]>("/api/public/plugins/available");
  },

  // Get plugins by category
  async getPluginsByCategory(category: string): Promise<Plugin[]> {
    return apiClient.get<Plugin[]>(`/api/public/plugins/available?category=${category}`);
  },

  // Get plugins by extension point
  async getPluginsByExtensionPoint(extensionPoint: string): Promise<Plugin[]> {
    return apiClient.get<Plugin[]>(
      `/api/public/plugins/available?extensionPoint=${extensionPoint}`,
    );
  },

  // Get installed plugins for organization (requires organization context)
  async getInstalledPlugins(
    organizationId: string,
  ): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(
      `/api/public/plugins/organizations/${organizationId}/enabled`,
    );
  },

  // Get enabled plugins for organization
  async getEnabledPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(
      `/api/public/plugins/organizations/${organizationId}/enabled`,
    );
  },

  // Get payment plugins for organization
  async getPaymentPlugins(organizationId: string): Promise<InstalledPlugin[]> {
    return apiClient.get<InstalledPlugin[]>(
      `/api/public/plugins/organizations/${organizationId}/payment`,
    );
  },

  // Get plugins by type for organization
  async getPluginsByType(
    organizationId: string,
    type: string,
  ): Promise<InstalledPlugin[]> {
    // For public access, we only support payment plugins for now
    if (type === 'payment') {
      return this.getPaymentPlugins(organizationId);
    }
    // For other types, filter enabled plugins by extension points
    const enabledPlugins = await this.getEnabledPlugins(organizationId);
    return enabledPlugins.filter(plugin => 
      plugin.plugin.category === type ||
      plugin.plugin.extensionPoints?.some(point => point.includes(type))
    );
  },

  // Get plugin bundle/script URL
  async getPluginBundle(
    pluginId: string,
    version?: string,
  ): Promise<PluginBundle> {
    const params = version ? `?version=${version}` : "";
    return apiClient.get<PluginBundle>(`/api/public/plugins/bundles/${pluginId}${params}`);
  },

  // Get plugin configuration for organization (NOTE: This is not available for public access)
  async getPluginConfig(
    organizationId: string,
    pluginId: string,
  ): Promise<Record<string, any>> {
    // Plugin configurations are not available through public endpoints for security
    // This would require authentication and should only be used in admin contexts
    throw new Error('Plugin configuration is not available for public access. Use admin API instead.');
  },

  // Execute a plugin backend action securely
  async executePluginAction(
    pluginId: string,
    action: string,
    parameters: any,
    metadata?: any,
  ): Promise<any> {
    return apiClient.post(`/api/public/plugins/${pluginId}/actions`, {
      action,
      parameters,
      metadata,
    });
  },
};
