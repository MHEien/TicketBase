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
  // Puck widget components for page editor integration
  puckComponents?: PuckWidgetDefinition[];
}

// =============================================================================
// PUCK INTEGRATION TYPES
// =============================================================================

export interface PuckWidgetDefinition {
  id: string;
  label: string;
  defaultProps: Record<string, any>;
  fields: Record<string, any>;
  render: (props: any) => React.ReactElement;
  category?: string;
  icon?: string;
}

export interface GlassEffectFieldProps {
  value: {
    blur: string;
    opacity: string;
    borderStyle: string;
  };
  onChange: (value: any) => void;
  label?: string;
}

export interface SpacingFieldProps {
  value: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onChange: (value: any) => void;
  label?: string;
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
 * Create a Puck-compatible widget component for the page editor
 */
export function createPuckWidget(definition: PuckWidgetDefinition): PuckWidgetDefinition {
  // Validate the definition
  if (!definition.id || !definition.label || !definition.render) {
    throw new Error('Invalid Puck widget definition: id, label, and render are required');
  }

  // Apply default patterns and enhance the definition
  const enhanced: PuckWidgetDefinition = {
    ...definition,
    defaultProps: {
      // Apply platform design system defaults
      className: 'plugin-widget',
      animation: 'fadeIn',
      // Glassmorphism defaults
      blur: 'backdrop-blur-md',
      opacity: 'bg-white/20',
      borderStyle: 'border-white/20',
      padding: 'p-6',
      rounded: 'rounded-2xl',
      ...definition.defaultProps,
    },
    fields: {
      // Add common styling fields for consistency
      animation: {
        type: 'select',
        label: 'Animation',
        options: [
          { label: 'Fade In', value: 'fadeIn' },
          { label: 'Slide Up', value: 'slideUp' },
          { label: 'Scale', value: 'scale' },
          { label: 'Bounce', value: 'bounce' },
          { label: 'None', value: 'none' },
        ],
      },
      styling: {
        type: 'custom',
        label: 'Glass Effect',
        render: GlassEffectField,
      },
      spacing: {
        type: 'custom',
        label: 'Spacing',
        render: SpacingField,
      },
      ...definition.fields,
    },
    render: definition.render,
    category: definition.category || 'Plugin Widgets',
  };

  return enhanced;
}

/**
 * Glass effect field component for Puck editor
 */
export const GlassEffectField: React.FC<GlassEffectFieldProps> = ({ value, onChange, label }) => {
  const currentValue = value || {
    blur: 'backdrop-blur-md',
    opacity: 'bg-white/20',
    borderStyle: 'border-white/20',
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Blur Intensity</label>
          <select
            value={currentValue.blur}
            onChange={(e) => onChange({ ...currentValue, blur: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="backdrop-blur-sm">Light Blur</option>
            <option value="backdrop-blur-md">Medium Blur</option>
            <option value="backdrop-blur-lg">Heavy Blur</option>
            <option value="backdrop-blur-xl">Extra Heavy Blur</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Background Opacity</label>
          <select
            value={currentValue.opacity}
            onChange={(e) => onChange({ ...currentValue, opacity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="bg-white/5">5% White</option>
            <option value="bg-white/10">10% White</option>
            <option value="bg-white/20">20% White</option>
            <option value="bg-white/30">30% White</option>
            <option value="bg-black/10">10% Black</option>
            <option value="bg-black/20">20% Black</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Border Style</label>
          <select
            value={currentValue.borderStyle}
            onChange={(e) => onChange({ ...currentValue, borderStyle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="border-white/20">Light White</option>
            <option value="border-white/40">Medium White</option>
            <option value="border-gray-300/20">Light Gray</option>
            <option value="border-transparent">None</option>
          </select>
        </div>
      </div>
    </div>
  );
};

/**
 * Spacing field component for Puck editor
 */
export const SpacingField: React.FC<SpacingFieldProps> = ({ value, onChange, label }) => {
  const currentValue = value || { top: 0, right: 0, bottom: 0, left: 0 };

  const updateSpacing = (side: keyof typeof currentValue, newValue: number) => {
    onChange({ ...currentValue, [side]: newValue });
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Top</label>
          <input
            type="number"
            min="0"
            value={currentValue.top}
            onChange={(e) => updateSpacing('top', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Right</label>
          <input
            type="number"
            min="0"
            value={currentValue.right}
            onChange={(e) => updateSpacing('right', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Bottom</label>
          <input
            type="number"
            min="0"
            value={currentValue.bottom}
            onChange={(e) => updateSpacing('bottom', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Left</label>
          <input
            type="number"
            min="0"
            value={currentValue.left}
            onChange={(e) => updateSpacing('left', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to access the platform SDK within plugin components
 * Now works with Module Federation shared dependencies
 */
export function usePlatformSDK(): PlatformSDK {
  // For Module Federation, we'll try multiple access patterns
  if (typeof window !== 'undefined') {
    // First try the modern Module Federation way
    if ((window as any).__SHARED_PLUGIN_SDK__) {
      return (window as any).__SHARED_PLUGIN_SDK__ as PlatformSDK;
    }
    
    // Fallback to the old global way for backward compatibility
    if ((window as any).PluginSDK) {
      return (window as any).PluginSDK as PlatformSDK;
    }
  }
  
  // If neither is available, throw a helpful error
  throw new Error(
    'Platform SDK not available. Make sure your plugin is loaded through the Module Federation system.'
  );
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

/**
 * Register plugin Puck components with the platform
 * Now works with Module Federation component registry
 */
export function registerPuckComponents(components: PuckWidgetDefinition[]): void {
  if (typeof window !== 'undefined') {
    // Modern Module Federation approach - use the global registry function
    if (typeof (window as any).registerPuckComponents === 'function') {
      (window as any).registerPuckComponents(components);
      console.log('✅ Registered Puck components via Module Federation:', components.map(c => c.id));
    }
    
    // Also dispatch event for backward compatibility and other listeners
    window.dispatchEvent(new CustomEvent('puck-components-registered', {
      detail: { components }
    }));
    
    // Legacy event name for backward compatibility
    window.dispatchEvent(new CustomEvent('plugin:register-puck-components', {
      detail: { components }
    }));
  }
}

export default {
  definePlugin,
  createExtensionPoint,
  createPuckWidget,
  usePlatformSDK,
  usePluginConfig,
  usePaymentProcessor,
  registerPuckComponents,
  GlassEffectField,
  SpacingField,
};
