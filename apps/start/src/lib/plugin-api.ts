import { Plugin, InstalledPlugin } from "./plugin-types";
import { apiClient } from "./api/api-client";

// Base URL for the plugin service - this will be appended to the apiClient baseURL
const PLUGIN_API_PATH = "/api/plugins";

// Interface for standard API responses
export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error?: string;
}

// Debug logging helper
function debugLog(operation: string, details: any) {
  console.group(`🔌 Plugin API Debug: ${operation}`);
  console.log("Timestamp:", new Date().toISOString());
  console.log("Details:", details);
  console.groupEnd();
}

// Error logging helper
function errorLog(operation: string, error: any, context?: any) {
  console.group(`❌ Plugin API Error: ${operation}`);
  console.log("Timestamp:", new Date().toISOString());
  console.error("Error:", error);
  if (context) {
    console.log("Context:", context);
  }
  if (error.response) {
    console.log("Response Status:", error.response.status);
    console.log("Response Data:", error.response.data);
    console.log("Response Headers:", error.response.headers);
  }
  if (error.config) {
    console.log("Request Config:", {
      url: error.config.url,
      method: error.config.method,
      baseURL: error.config.baseURL,
      headers: error.config.headers,
    });
  }
  console.groupEnd();
}

/**
 * Fetches all available plugins from the marketplace
 */
export async function fetchAvailablePlugins(): Promise<ApiResponse<Plugin[]>> {
  const operation = "fetchAvailablePlugins";

  try {
    debugLog(operation, {
      endpoint: PLUGIN_API_PATH,
      method: "GET",
      description: "Fetching all available plugins from marketplace",
    });

    const response = await apiClient.get(PLUGIN_API_PATH);

    debugLog(`${operation} - Success`, {
      status: response.status,
      dataLength: response.data?.length || 0,
      data: response.data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      endpoint: PLUGIN_API_PATH,
      method: "GET",
    });

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
 * Note: This requires an organizationId - we'll need to get this from the session/context
 */
export async function getTenantPlugins(
  organizationId?: string,
): Promise<ApiResponse<InstalledPlugin[]>> {
  const operation = "getTenantPlugins";

  try {
    // Use "current" as the organization ID - the backend should handle this
    const orgId = organizationId || "current";
    const endpoint = `${PLUGIN_API_PATH}/organization/${orgId}`;

    debugLog(operation, {
      endpoint,
      method: "GET",
      organizationId: orgId,
      description: "Fetching installed plugins for organization",
    });

    const response = await apiClient.get(endpoint);

    debugLog(`${operation} - Success`, {
      status: response.status,
      dataLength: response.data?.length || 0,
      data: response.data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      organizationId,
      endpoint: `${PLUGIN_API_PATH}/organization/${organizationId || "current"}`,
    });

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
  const operation = "getPlugin";

  try {
    const endpoint = `${PLUGIN_API_PATH}/${pluginId}`;

    debugLog(operation, {
      endpoint,
      method: "GET",
      pluginId,
      description: "Fetching specific plugin details",
    });

    const response = await apiClient.get(endpoint);

    debugLog(`${operation} - Success`, {
      status: response.status,
      pluginId,
      data: response.data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      pluginId,
      endpoint: `${PLUGIN_API_PATH}/${pluginId}`,
    });

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
  organizationId?: string,
): Promise<ApiResponse<InstalledPlugin>> {
  const operation = "installPlugin";

  try {
    const endpoint = `${PLUGIN_API_PATH}/install`;
    // Only send the pluginId - the backend should extract organizationId and userId from JWT
    const payload = {
      pluginId,
    };

    debugLog(operation, {
      endpoint,
      method: "POST",
      payload,
      description: "Installing plugin for organization",
    });

    const response = await apiClient.post(endpoint, payload);

    debugLog(`${operation} - Success`, {
      status: response.status,
      pluginId,
      data: response.data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      pluginId,
      organizationId,
      endpoint: `${PLUGIN_API_PATH}/install`,
    });

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
  installedPluginId: string,
): Promise<ApiResponse<void>> {
  const operation = "uninstallPlugin";

  try {
    const endpoint = `${PLUGIN_API_PATH}/installed/${installedPluginId}`;

    debugLog(operation, {
      endpoint,
      method: "DELETE",
      installedPluginId,
      description: "Uninstalling plugin from organization",
    });

    await apiClient.delete(endpoint);

    debugLog(`${operation} - Success`, {
      installedPluginId,
      description: "Plugin successfully uninstalled",
    });

    return {
      success: true,
      data: null,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      installedPluginId,
      endpoint: `${PLUGIN_API_PATH}/installed/${installedPluginId}`,
    });

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
  installedPluginId: string,
  config: Record<string, any>,
): Promise<ApiResponse<InstalledPlugin>> {
  const operation = "updatePluginConfig";

  try {
    const endpoint = `${PLUGIN_API_PATH}/installed/${installedPluginId}/configure`;

    debugLog(operation, {
      endpoint,
      method: "PATCH",
      installedPluginId,
      config,
      description: "Updating plugin configuration",
    });

    const response = await apiClient.patch(endpoint, config);

    debugLog(`${operation} - Success`, {
      status: response.status,
      installedPluginId,
      data: response.data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      installedPluginId,
      config,
      endpoint: `${PLUGIN_API_PATH}/installed/${installedPluginId}/configure`,
    });

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
  installedPluginId: string,
  enabled: boolean,
): Promise<ApiResponse<InstalledPlugin>> {
  const operation = "setPluginEnabled";
  const action = enabled ? "enable" : "disable";

  try {
    const endpoint = `${PLUGIN_API_PATH}/installed/${installedPluginId}/${action}`;

    debugLog(operation, {
      endpoint,
      method: "PATCH",
      installedPluginId,
      enabled,
      action,
      description: `${enabled ? "Enabling" : "Disabling"} plugin`,
    });

    const response = await apiClient.patch(endpoint);

    debugLog(`${operation} - Success`, {
      status: response.status,
      installedPluginId,
      enabled,
      data: response.data,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    errorLog(operation, error, {
      installedPluginId,
      enabled,
      action,
      endpoint: `${PLUGIN_API_PATH}/installed/${installedPluginId}/${action}`,
    });

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
