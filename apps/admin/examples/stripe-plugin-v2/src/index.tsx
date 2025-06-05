import React from "react";
import {
  definePlugin,
  createExtensionPoint,
  usePluginConfig,
  usePaymentProcessor,
  AdminSettingsContext,
  PaymentMethodContext,
  CheckoutConfirmationContext,
  PluginMetadata,
} from "ticketsplatform-plugin-sdk";

declare global {
  interface Window {
    __PLUGIN_REGISTRY: {
      register: (pluginId: string, exports: any) => void;
      get: (pluginId: string) => any;
    };
  }
}

// =============================================================================
// STRIPE PLUGIN CONFIGURATION TYPES
// =============================================================================

interface StripeConfig {
  apiKey: string;
  webhookUrl?: string;
  testMode: boolean;
  publishableKey: string;
}

// =============================================================================
// ADMIN SETTINGS COMPONENT
// =============================================================================

const AdminSettingsComponent = createExtensionPoint<AdminSettingsContext>(
  ({ context, sdk }) => {
    const { pluginId, user } = context;
    const { config, loading, error, saveConfig } =
      usePluginConfig<StripeConfig>(pluginId);
    const [formData, setFormData] = React.useState<StripeConfig>({
      apiKey: "",
      publishableKey: "",
      webhookUrl: "",
      testMode: true,
    });
    const [saving, setSaving] = React.useState(false);

    // Initialize form data when config loads
    React.useEffect(() => {
      if (config) {
        setFormData(config);
      }
    }, [config]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
        await saveConfig(formData);
      } catch (err) {
        // Error is already handled by usePluginConfig
      } finally {
        setSaving(false);
      }
    };

    if (loading) {
      return (
        <sdk.components.Card>
          <sdk.components.CardContent className="p-6 text-center">
            Loading configuration...
          </sdk.components.CardContent>
        </sdk.components.Card>
      );
    }

    return (
      <sdk.components.Card>
        <sdk.components.CardHeader>
          <sdk.components.CardTitle>
            Stripe Payment Configuration
          </sdk.components.CardTitle>
          <sdk.components.CardDescription>
            Configure your Stripe payment gateway. Authenticated as:{" "}
            {user.email}
          </sdk.components.CardDescription>
        </sdk.components.CardHeader>

        <sdk.components.CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Key */}
            <div className="space-y-2">
              <sdk.components.Label htmlFor="apiKey">
                Stripe Secret API Key
              </sdk.components.Label>
              <sdk.components.Input
                id="apiKey"
                name="apiKey"
                type="password"
                placeholder="sk_test_... or sk_live_..."
                value={formData.apiKey}
                onChange={handleInputChange}
                disabled={saving}
                required
              />
              <p className="text-sm text-muted-foreground">
                Your Stripe secret API key from the Stripe Dashboard
              </p>
            </div>

            {/* Publishable Key */}
            <div className="space-y-2">
              <sdk.components.Label htmlFor="publishableKey">
                Stripe Publishable Key
              </sdk.components.Label>
              <sdk.components.Input
                id="publishableKey"
                name="publishableKey"
                type="text"
                placeholder="pk_test_... or pk_live_..."
                value={formData.publishableKey}
                onChange={handleInputChange}
                disabled={saving}
                required
              />
              <p className="text-sm text-muted-foreground">
                Your Stripe publishable key for client-side integration
              </p>
            </div>

            {/* Test Mode */}
            <div className="flex items-center space-x-2">
              <sdk.components.Switch
                id="testMode"
                checked={formData.testMode}
                onCheckedChange={(checked: boolean) =>
                  setFormData((prev) => ({ ...prev, testMode: checked }))
                }
                disabled={saving}
              />
              <sdk.components.Label htmlFor="testMode">
                Test Mode
              </sdk.components.Label>
            </div>

            {error && (
              <sdk.components.Alert variant="destructive">
                <sdk.components.AlertDescription>
                  {error}
                </sdk.components.AlertDescription>
              </sdk.components.Alert>
            )}

            <div className="flex justify-end">
              <sdk.components.Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Configuration"}
              </sdk.components.Button>
            </div>
          </form>
        </sdk.components.CardContent>
      </sdk.components.Card>
    );
  },
);

// =============================================================================
// PAYMENT METHOD COMPONENT
// =============================================================================

const PaymentMethodComponent = createExtensionPoint<PaymentMethodContext>(
  ({ context, sdk }) => {
    const { cart, onSuccess, onError } = context;
    const { config, loading } = usePluginConfig<StripeConfig>(
      "stripe-payment-plugin",
    );
    const { processPayment, processing, error } = usePaymentProcessor(
      "stripe-payment-plugin",
    );

    const [cardNumber, setCardNumber] = React.useState("");
    const [expiry, setExpiry] = React.useState("");
    const [cvc, setCvc] = React.useState("");
    const [cardholderName, setCardholderName] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!config?.apiKey) {
        onError("Stripe is not configured properly");
        return;
      }

      try {
        await processPayment(
          {
            paymentMethod: "stripe",
            cardNumber,
            expiry,
            cvc,
            cardholderName,
            amount: cart.total,
            currency: cart.currency,
            customer: cart.customer,
          },
          (paymentId: string, metadata?: any) => {
            onSuccess(paymentId, {
              provider: "stripe",
              testMode: config.testMode,
              ...metadata,
            });
          },
        );
      } catch (err) {
        onError(err instanceof Error ? err.message : "Payment failed");
      }
    };

    if (loading) {
      return (
        <sdk.components.Card>
          <sdk.components.CardContent className="p-6 text-center">
            Loading payment configuration...
          </sdk.components.CardContent>
        </sdk.components.Card>
      );
    }

    if (!config?.apiKey) {
      return (
        <sdk.components.Alert variant="destructive">
          <sdk.components.AlertDescription>
            Stripe payment is not configured. Please contact the administrator.
          </sdk.components.AlertDescription>
        </sdk.components.Alert>
      );
    }

    return (
      <sdk.components.Card>
        <sdk.components.CardHeader>
          <sdk.components.CardTitle>
            Credit Card Payment
          </sdk.components.CardTitle>
          <sdk.components.CardDescription>
            Secure payment processing via Stripe
            {config.testMode && " (Test Mode)"}
          </sdk.components.CardDescription>
        </sdk.components.CardHeader>

        <sdk.components.CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card form fields... */}
            <sdk.components.Button
              type="submit"
              disabled={processing}
              className="w-full"
            >
              {processing ? "Processing Payment..." : "Pay Now"}
            </sdk.components.Button>
          </form>
        </sdk.components.CardContent>
      </sdk.components.Card>
    );
  },
);

// =============================================================================
// CHECKOUT CONFIRMATION COMPONENT
// =============================================================================

const CheckoutConfirmationComponent =
  createExtensionPoint<CheckoutConfirmationContext>(({ context, sdk }) => {
    const { paymentDetails } = context;

    if (paymentDetails.provider !== "stripe") {
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
            Processed securely by Stripe{" "}
            {paymentDetails.testMode && "(Test Mode)"}
          </div>
        </div>
      </div>
    );
  });

// =============================================================================
// PLUGIN DEFINITION AND EXPORT
// =============================================================================

const metadata: PluginMetadata = {
  id: "stripe-payment-plugin",
  name: "Stripe Payment Gateway",
  version: "2.0.0",
  description: "Accept credit card payments securely with Stripe",
  author: "Tickets Platform Team",
  category: "payment",
  displayName: "Credit Card (Stripe)",
  requiredPermissions: ["read:orders", "write:transactions"],
  priority: 100,
};

// Create the plugin definition
const stripePlugin = definePlugin({
  metadata,
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-confirmation": CheckoutConfirmationComponent,
  },
});

// CRITICAL: Multiple export strategies to ensure compatibility
console.log("🔧 Stripe Plugin: Setting up exports...");

// Strategy 1: Standard ES6 default export
export default stripePlugin;

// Strategy 2: CommonJS style for broader compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = stripePlugin;
  module.exports.default = stripePlugin;
  console.log("✅ Stripe Plugin: CommonJS exports set");
}

// Strategy 3: Global registration (for legacy compatibility)
if (typeof window !== 'undefined' && window.__PLUGIN_REGISTRY) {
  window.__PLUGIN_REGISTRY.register('stripe-payment-plugin', {
    metadata,
    extensionPoints: {
      "admin-settings": AdminSettingsComponent,
      "payment-methods": PaymentMethodComponent,
      "checkout-confirmation": CheckoutConfirmationComponent,
    },
    // Legacy component names for backward compatibility
    AdminSettingsComponent,
    PaymentMethodComponent,
    CheckoutConfirmationComponent,
  });
  console.log("✅ Stripe Plugin: Global registry registration complete");
}

// Strategy 4: Explicit exports object for webpack/bundler compatibility
const pluginExports = {
  default: stripePlugin,
  metadata,
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-confirmation": CheckoutConfirmationComponent,
  },
  AdminSettingsComponent,
  PaymentMethodComponent,
  CheckoutConfirmationComponent,
};

// Assign to global exports if available
if (typeof exports !== 'undefined') {
  Object.assign(exports, pluginExports);
  console.log("✅ Stripe Plugin: Global exports assigned");
}

console.log("✅ Stripe Plugin: All export strategies completed", {
  hasDefault: !!stripePlugin,
  hasExtensionPoints: !!stripePlugin.extensionPoints,
  extensionPointsCount: Object.keys(stripePlugin.extensionPoints || {}).length,
});

// For debugging: make components globally available during development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).StripePluginDebug = {
    AdminSettingsComponent,
    PaymentMethodComponent,
    CheckoutConfirmationComponent,
    metadata,
    fullPlugin: stripePlugin,
  };
}