import { apiClient } from './api-client';

export interface PluginBuildResult {
  success: boolean;
  pluginId: string;
  version: string;
  bundleUrl: string;
  bundleSize: number;
  buildTime: number;
  metadata: any;
  errors?: string[];
  warnings?: string[];
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  bundleUrl: string;
  extensionPoints: string[];
  metadata: any;
  requiredPermissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InstalledPlugin extends Plugin {
  enabled: boolean;
  tenantId: string;
  configuration: Record<string, any>;
  installedAt: string;
}

/**
 * Upload and build a plugin from ZIP file
 * @param file - Plugin ZIP file containing source code
 * @returns Build result with bundle URL and metadata
 */
export async function uploadPluginBuild(file: File): Promise<PluginBuildResult> {
  const formData = new FormData();
  formData.append('plugin', file);

  const response = await apiClient.post('/api/plugins/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Get all available plugins
 * @returns Array of available plugins
 */
export async function getPlugins(): Promise<Plugin[]> {
  const response = await apiClient.get('/api/plugins');
  return response.data;
}

/**
 * Get installed plugins for a tenant
 * @param tenantId - Tenant ID
 * @returns Array of installed plugins
 */
export async function getInstalledPlugins(tenantId: string): Promise<InstalledPlugin[]> {
  const response = await apiClient.get(`/api/plugins/installed/${tenantId}`);
  return response.data;
}

/**
 * Install a plugin for a tenant
 * @param tenantId - Tenant ID
 * @param pluginId - Plugin ID to install
 * @returns Installed plugin details
 */
export async function installPlugin(tenantId: string, pluginId: string): Promise<InstalledPlugin> {
  const response = await apiClient.post('/api/plugins/install', {
    tenantId,
    pluginId,
  });
  return response.data;
}

/**
 * Uninstall a plugin for a tenant
 * @param tenantId - Tenant ID
 * @param pluginId - Plugin ID to uninstall
 */
export async function uninstallPlugin(tenantId: string, pluginId: string): Promise<void> {
  await apiClient.delete(`/api/plugins/uninstall`, {
    data: { tenantId, pluginId },
  });
}

/**
 * Update plugin configuration for a tenant
 * @param tenantId - Tenant ID
 * @param pluginId - Plugin ID
 * @param configuration - Plugin configuration
 * @returns Updated plugin details
 */
export async function updatePluginConfig(
  tenantId: string, 
  pluginId: string, 
  configuration: Record<string, any>
): Promise<InstalledPlugin> {
  const response = await apiClient.put(`/api/plugins/${pluginId}/config`, {
    tenantId,
    configuration,
  });
  return response.data;
}

/**
 * Enable or disable a plugin for a tenant
 * @param tenantId - Tenant ID
 * @param pluginId - Plugin ID
 * @param enabled - Whether plugin should be enabled
 * @returns Updated plugin details
 */
export async function setPluginEnabled(
  tenantId: string, 
  pluginId: string, 
  enabled: boolean
): Promise<InstalledPlugin> {
  const response = await apiClient.put(`/api/plugins/${pluginId}/status`, {
    tenantId,
    enabled,
  });
  return response.data;
}

/**
 * Get plugin configuration for a tenant
 * @param tenantId - Tenant ID
 * @param pluginId - Plugin ID
 * @returns Plugin configuration
 */
export async function getPluginConfig(
  tenantId: string, 
  pluginId: string
): Promise<Record<string, any>> {
  const response = await apiClient.get(`/api/plugins/${pluginId}/config`, {
    params: { tenantId },
  });
  return response.data;
}