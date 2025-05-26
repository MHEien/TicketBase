import { Plugin, InstalledPlugin } from "./plugin-types";
import { apiClient } from "./api/api-client";

// Base URL for the plugin service - this will be appended to the apiClient baseURL
const PLUGIN_API_PATH = "/plugins";

// Interface for standard API responses
export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error?: string;
}

/**
 * Fetches all available plugins from the marketplace
 */
export async function fetchAvailablePlugins(): Promise<ApiResponse<Plugin[]>> {
  try {
    const response = await apiClient.get(PLUGIN_API_PATH);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching available plugins:", error);
    return {
      success: false,
      data: [],
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

/**
 * Fetches all plugins installed for the current tenant
 */
export async function getTenantPlugins(): Promise<
  ApiResponse<InstalledPlugin[]>
> {
  try {
    const response = await apiClient.get(`${PLUGIN_API_PATH}/installed`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error fetching tenant plugins:", error);
    return {
      success: false,
      data: [],
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

/**
 * Fetches a specific plugin by ID
 */
export async function getPlugin(
  pluginId: string,
): Promise<ApiResponse<InstalledPlugin>> {
  try {
    const response = await apiClient.get(`${PLUGIN_API_PATH}/${pluginId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error fetching plugin ${pluginId}:`, error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

/**
 * Installs a plugin for the current tenant
 */
export async function installPlugin(
  pluginId: string,
): Promise<ApiResponse<InstalledPlugin>> {
  try {
    const response = await apiClient.post(`${PLUGIN_API_PATH}/install`, {
      pluginId,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error installing plugin ${pluginId}:`, error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

/**
 * Uninstalls a plugin for the current tenant
 */
export async function uninstallPlugin(
  pluginId: string,
): Promise<ApiResponse<void>> {
  try {
    await apiClient.post(`${PLUGIN_API_PATH}/uninstall`, {
      pluginId,
    });
    return {
      success: true,
      data: null,
    };
  } catch (error: any) {
    console.error(`Error uninstalling plugin ${pluginId}:`, error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

/**
 * Updates the configuration for a plugin
 */
export async function updatePluginConfig(
  pluginId: string,
  config: Record<string, any>,
): Promise<ApiResponse<InstalledPlugin>> {
  try {
    const response = await apiClient.put(`${PLUGIN_API_PATH}/config`, config);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error updating config for plugin ${pluginId}:`, error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

/**
 * Enables or disables a plugin
 */
export async function setPluginEnabled(
  pluginId: string,
  enabled: boolean,
): Promise<ApiResponse<InstalledPlugin>> {
  try {
    const response = await apiClient.put(`${PLUGIN_API_PATH}/status`, {
      enabled,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error updating status for plugin ${pluginId}:`, error);
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}
