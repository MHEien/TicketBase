import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { pluginsApi, InstalledPlugin, Plugin } from "../lib/api/plugins";
import { getTenantFromClientCookie } from "../lib/tenant";

interface PluginContextType {
  plugins: InstalledPlugin[];
  loadedPlugins: Map<string, any>;
  loading: boolean;
  error: string | null;
  loadPlugin: (pluginId: string) => Promise<any>;
  executeExtensionPoint: (
    extensionPoint: string,
    context?: any,
  ) => React.ComponentType<any>[];
  getPaymentMethods: () => React.ComponentType<any>[];
  getCheckoutExtensions: () => React.ComponentType<any>[];
  executePluginAction: (
    pluginId: string,
    action: string,
    parameters: any,
    metadata?: any,
  ) => Promise<any>;
  refetch: () => Promise<void>;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error("usePlugins must be used within a PluginProvider");
  }
  return context;
};

interface PluginProviderProps {
  children: React.ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ children }) => {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [plugins, setPlugins] = useState<InstalledPlugin[]>([]);
  const [loadedPlugins, setLoadedPlugins] = useState<Map<string, any>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get organization ID from tenant cookie
  useEffect(() => {
    const tenantData = getTenantFromClientCookie();
    setOrganizationId(tenantData?.organizationId || null);
  }, []);

  const fetchPlugins = async () => {
    if (!organizationId) {
      setPlugins([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get enabled plugins for the organization
      const enabledPlugins = await pluginsApi.getEnabledPlugins(
        organizationId,
      );
      setPlugins(enabledPlugins);

      // Auto-load plugins that are enabled
      for (const plugin of enabledPlugins) {
        if (plugin.isEnabled) {
          await loadPlugin(plugin.pluginId);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plugins");
      console.error("Error fetching plugins:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlugin = useCallback(
    async (pluginId: string): Promise<any> => {
      if (loadedPlugins.has(pluginId)) {
        return loadedPlugins.get(pluginId);
      }

      try {
        // Get plugin bundle URL
        const bundle = await pluginsApi.getPluginBundle(pluginId);

        // Load plugin script dynamically
        const pluginModule = await loadPluginScript(bundle.bundleUrl);

        // Get plugin configuration if organization exists
        let config = {};
        if (organizationId) {
          try {
            config = await pluginsApi.getPluginConfig(
              organizationId,
              pluginId,
            );
          } catch (configError) {
            // This is expected for public storefront - plugins should work without config access
            console.debug(
              `Plugin ${pluginId} running without config (expected for public access)`,
            );
          }
        }

        // Initialize plugin with configuration
        const initializedPlugin = {
          ...pluginModule,
          config,
          pluginId,
        };

        // Store in loaded plugins map
        setLoadedPlugins(
          (prev) => new Map(prev.set(pluginId, initializedPlugin)),
        );

        return initializedPlugin;
      } catch (err) {
        console.error(`Error loading plugin ${pluginId}:`, err);
        throw err;
      }
    },
    [organizationId, loadedPlugins],
  );

  const loadPluginScript = async (bundleUrl: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      // For demo purposes, we'll simulate loading plugins
      // In a real implementation, you'd load the actual JavaScript bundle

      // Check if this looks like a Stripe plugin URL
      if (bundleUrl.includes("stripe") || bundleUrl.includes("payment")) {
        // Return mock Stripe plugin structure based on the admin example
        resolve({
          metadata: {
            id: "stripe-payment-plugin",
            name: "Stripe Payment Gateway",
            version: "2.0.0",
            category: "payment",
          },
          extensionPoints: {
            "payment-methods": StripePaymentMethod,
            "checkout-confirmation": StripeCheckoutConfirmation,
          },
        });
      } else {
        // Generic plugin structure
        resolve({
          metadata: {
            id: "generic-plugin",
            name: "Generic Plugin",
            version: "1.0.0",
          },
          extensionPoints: {},
        });
      }
    });
  };

  const executePluginAction = useCallback(
    async (
      pluginId: string,
      action: string,
      parameters: any,
      metadata?: any,
    ) => {
      try {
        return pluginsApi.executePluginAction(
          pluginId,
          action,
          parameters,
          { ...metadata, organizationId: organizationId },
        );
      } catch (error) {
        console.error(
          `Failed to execute plugin action ${pluginId}:${action}:`,
          error,
        );
        throw error;
      }
    },
    [organizationId],
  );

  const executeExtensionPoint = useCallback(
    (extensionPoint: string, context?: any): React.ComponentType<any>[] => {
      const components: React.ComponentType<any>[] = [];

      loadedPlugins.forEach((plugin) => {
        if (plugin.extensionPoints && plugin.extensionPoints[extensionPoint]) {
          const Component = plugin.extensionPoints[extensionPoint];

          // Create wrapper component that passes context and configuration
          const WrappedComponent: React.FC<any> = (props) => {
            // Create onExecuteAction function that's bound to this specific plugin
            const onExecuteAction = async (
              action: string,
              parameters: any,
              metadata?: any,
            ) => {
              return executePluginAction(
                plugin.pluginId,
                action,
                parameters,
                metadata,
              );
            };

            return React.createElement(Component, {
              ...props,
              context: {
                ...context,
                organizationId: organizationId,
                user: context?.user, // Pass user from context if available
              },
              configuration: plugin.config,
              pluginId: plugin.pluginId,
              onExecuteAction,
            });
          };

          components.push(WrappedComponent);
        }
      });

      // Sort by priority if available
      return components.sort((a: any, b: any) => {
        const aPriority = a.priority || 100;
        const bPriority = b.priority || 100;
        return aPriority - bPriority;
      });
    },
    [loadedPlugins, organizationId, executePluginAction],
  );

  const getPaymentMethods = useCallback(() => {
    return executeExtensionPoint("payment-methods");
  }, [executeExtensionPoint]);

  const getCheckoutExtensions = useCallback(() => {
    return executeExtensionPoint("checkout-extensions");
  }, [executeExtensionPoint]);

  useEffect(() => {
    fetchPlugins();
  }, [organizationId]);

  const contextValue: PluginContextType = {
    plugins,
    loadedPlugins,
    loading,
    error,
    loadPlugin,
    executeExtensionPoint,
    getPaymentMethods,
    getCheckoutExtensions,
    executePluginAction,
    refetch: fetchPlugins,
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
};

// Mock Stripe Payment Method Component (based on admin plugin example)
const StripePaymentMethod: React.FC<any> = ({ context, configuration }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CVC</label>
          <input
            type="text"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-md">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>
            ${((context?.cart?.total || 0) / 100).toFixed(2)}{" "}
            {context?.cart?.currency || "USD"}
          </span>
        </div>
      </div>

      {configuration?.testMode && (
        <div className="text-xs text-gray-500">
          🧪 Test Mode - Use test card: 4242 4242 4242 4242
        </div>
      )}
    </div>
  );
};

// Mock Stripe Checkout Confirmation Component
const StripeCheckoutConfirmation: React.FC<any> = ({ context }) => {
  if (context?.paymentDetails?.provider !== "stripe") {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm p-3 bg-green-50 rounded-md border border-green-200">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-green-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="text-green-700">
        <span className="font-medium">Payment Successful</span>
        <div className="text-xs text-green-600">
          Processed securely by Stripe
          {context?.paymentDetails?.testMode && " (Test Mode)"}
        </div>
      </div>
    </div>
  );
};
