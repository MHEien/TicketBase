import React from "react";

// =============================================================================
// CORE TYPES
// =============================================================================

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category:
    | "payment"
    | "marketing"
    | "analytics"
    | "social"
    | "ticketing"
    | "layout"
    | "seating";
  displayName?: string;
  iconUrl?: string;
  requiredPermissions?: string[];
  priority?: number;
}

export interface ExtensionPointContext {
  [key: string]: any;
}

export interface AdminSettingsContext extends ExtensionPointContext {
  pluginId: string;
  onSave: (config: any) => Promise<void>;
  saving: boolean;
  user: {
    email: string;
    id: string;
    name?: string;
  };
  isAuthenticated: boolean;
}

export interface PaymentMethodContext extends ExtensionPointContext {
  cart: {
    id: string;
    total: number;
    currency: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    customer?: {
      email: string;
      name?: string;
    };
  };
  onSuccess: (paymentId: string, metadata?: any) => void;
  onError: (error: string) => void;
}

export interface CheckoutConfirmationContext extends ExtensionPointContext {
  paymentDetails: {
    id: string;
    provider: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed";
    testMode?: boolean;
    metadata?: any;
  };
}

// =============================================================================
// PLATFORM SDK INTERFACES
// =============================================================================

export interface PlatformAPI {
  // Plugin configuration
  loadConfig: (pluginId: string) => Promise<any>;
  saveConfig: (pluginId: string, config: any) => Promise<void>;

  // HTTP client with authentication
  get: (url: string) => Promise<Response>;
  post: (url: string, data: any) => Promise<Response>;
  put: (url: string, data: any) => Promise<Response>;
  delete: (url: string) => Promise<Response>;

  // Plugin-specific endpoints
  getPlugin: (pluginId: string) => Promise<any>;
  updatePlugin: (pluginId: string, data: any) => Promise<void>;
}

export interface PlatformAuth {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  } | null;
  token?: string;
  isAuthenticated: boolean;
  session: any;
}

export interface PlatformUtils {
  toast: (options: {
    title: string;
    description?: string;
    variant?: "default" | "destructive" | "success";
    duration?: number;
  }) => void;

  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions,
  ) => string;

  confirm: (message: string) => Promise<boolean>;
  prompt: (message: string, defaultValue?: string) => Promise<string | null>;

  // Navigation helpers
  navigate: (path: string) => void;
  reload: () => void;
}

export interface PlatformComponents {
  // UI Components (shadcn/ui based)
  Button: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Card: React.ComponentType<any>;
  CardContent: React.ComponentType<any>;
  CardDescription: React.ComponentType<any>;
  CardHeader: React.ComponentType<any>;
  CardTitle: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  Switch: React.ComponentType<any>;
  Select: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Alert: React.ComponentType<any>;
  AlertDescription: React.ComponentType<any>;
  AlertTitle: React.ComponentType<any>;
  Badge: React.ComponentType<any>;
  Separator: React.ComponentType<any>;
  Dialog: React.ComponentType<any>;
  DialogContent: React.ComponentType<any>;
  DialogDescription: React.ComponentType<any>;
  DialogHeader: React.ComponentType<any>;
  DialogTitle: React.ComponentType<any>;
  DialogTrigger: React.ComponentType<any>;
}

export interface PlatformSDK {
  api: PlatformAPI;
  auth: PlatformAuth;
  utils: PlatformUtils;
  components: PlatformComponents;
  hooks: {
    useState: typeof React.useState;
    useEffect: typeof React.useEffect;
    useCallback: typeof React.useCallback;
    useMemo: typeof React.useMemo;
    useReducer: typeof React.useReducer;
  };
  env: {
    NODE_ENV: string;
    API_URL: string;
    APP_NAME: string;
    [key: string]: string;
  };
}

// =============================================================================
// COMPONENT TYPES
// =============================================================================

export interface AdminSettingsComponentProps {
  context: AdminSettingsContext;
  sdk: PlatformSDK;
}

export interface PaymentMethodComponentProps {
  context: PaymentMethodContext;
  sdk: PlatformSDK;
}

export interface CheckoutConfirmationComponentProps {
  context: CheckoutConfirmationContext;
  sdk: PlatformSDK;
}

export type ExtensionPointComponent<TContext = ExtensionPointContext> =
  React.ComponentType<{
    context: TContext;
    sdk: PlatformSDK;
  }>;

// =============================================================================
// PLUGIN DEFINITION
// =============================================================================

export interface PluginDefinition {
  metadata: PluginMetadata;
  extensionPoints: {
    "admin-settings"?: ExtensionPointComponent<AdminSettingsContext>;
    "payment-methods"?: ExtensionPointComponent<PaymentMethodContext>;
    "checkout-payment"?: ExtensionPointComponent<PaymentMethodContext>;
    "checkout-confirmation"?: ExtensionPointComponent<CheckoutConfirmationContext>;
    [key: string]: ExtensionPointComponent<any> | undefined;
  };
}

// =============================================================================
// PLUGIN SDK HELPERS
// =============================================================================

/**
 * Define a plugin with metadata and extension points
 */
export function definePlugin(definition: PluginDefinition): PluginDefinition {
  return definition;
}

/**
 * Create a type-safe extension point component
 */
export function createExtensionPoint<TContext extends ExtensionPointContext>(
  component: ExtensionPointComponent<TContext>,
): ExtensionPointComponent<TContext> {
  return component;
}

/**
 * Hook to access the platform SDK within plugin components
 */
export function usePlatformSDK(): PlatformSDK {
  // This will be injected by the platform at runtime
  return (window as any).PluginSDK as PlatformSDK;
}

/**
 * Hook to access plugin configuration
 */
export function usePluginConfig<T = any>(
  pluginId: string,
): {
  config: T | null;
  loading: boolean;
  error: string | null;
  saveConfig: (newConfig: T) => Promise<void>;
} {
  const sdk = usePlatformSDK();
  const [config, setConfig] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        setError(null);
        const savedConfig = await sdk.api.loadConfig(pluginId);
        setConfig(savedConfig);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load configuration",
        );
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [pluginId, sdk.api]);

  const saveConfig = React.useCallback(
    async (newConfig: T) => {
      try {
        setError(null);
        await sdk.api.saveConfig(pluginId, newConfig);
        setConfig(newConfig);
        sdk.utils.toast({
          title: "Success",
          description: "Configuration saved successfully",
          variant: "success",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save configuration";
        setError(errorMessage);
        sdk.utils.toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [pluginId, sdk.api, sdk.utils],
  );

  return { config, loading, error, saveConfig };
}

/**
 * Hook for payment processing with error handling
 */
export function usePaymentProcessor(pluginId: string) {
  const sdk = usePlatformSDK();
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const processPayment = React.useCallback(
    async (
      paymentData: any,
      onSuccess: (paymentId: string, metadata?: any) => void,
    ) => {
      try {
        setProcessing(true);
        setError(null);

        // Plugin-specific payment processing logic goes here
        // This is just a framework - each payment plugin implements their own logic

        const response = await sdk.api.post("/api/payments/process", {
          pluginId,
          ...paymentData,
        });

        const result = await response.json();

        if (result.success) {
          sdk.utils.toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully",
            variant: "success",
          });
          onSuccess(result.paymentId, result.metadata);
        } else {
          throw new Error(result.error || "Payment failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment processing failed";
        setError(errorMessage);
        sdk.utils.toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      } finally {
        setProcessing(false);
      }
    },
    [pluginId, sdk],
  );

  return { processPayment, processing, error };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  definePlugin,
  createExtensionPoint,
  usePlatformSDK,
  usePluginConfig,
  usePaymentProcessor,
};
