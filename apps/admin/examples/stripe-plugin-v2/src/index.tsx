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

            {/* Webhook URL */}
            <div className="space-y-2">
              <sdk.components.Label htmlFor="webhookUrl">
                Webhook URL (Optional)
              </sdk.components.Label>
              <sdk.components.Input
                id="webhookUrl"
                name="webhookUrl"
                type="url"
                placeholder="https://yoursite.com/api/stripe/webhook"
                value={formData.webhookUrl || ""}
                onChange={handleInputChange}
                disabled={saving}
              />
              <p className="text-sm text-muted-foreground">
                Stripe will send payment events to this URL
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
            {/* Cardholder Name */}
            <div className="space-y-2">
              <sdk.components.Label htmlFor="cardholderName">
                Cardholder Name
              </sdk.components.Label>
              <sdk.components.Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCardholderName(e.target.value)
                }
                disabled={processing}
                required
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <sdk.components.Label htmlFor="cardNumber">
                Card Number
              </sdk.components.Label>
              <sdk.components.Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCardNumber(e.target.value)
                }
                disabled={processing}
                required
              />
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <sdk.components.Label htmlFor="expiry">
                  Expiry Date
                </sdk.components.Label>
                <sdk.components.Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setExpiry(e.target.value)
                  }
                  disabled={processing}
                  required
                />
              </div>
              <div className="space-y-2">
                <sdk.components.Label htmlFor="cvc">CVC</sdk.components.Label>
                <sdk.components.Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCvc(e.target.value)
                  }
                  disabled={processing}
                  required
                />
              </div>
            </div>

            {error && (
              <sdk.components.Alert variant="destructive">
                <sdk.components.AlertDescription>
                  {error}
                </sdk.components.AlertDescription>
              </sdk.components.Alert>
            )}

            {/* Payment Summary */}
            <div className="p-3 bg-muted rounded-md text-sm">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  {sdk.utils.formatCurrency(cart.total / 100, cart.currency)}
                </span>
              </div>
            </div>

            <sdk.components.Button
              type="submit"
              disabled={
                processing || !cardNumber || !expiry || !cvc || !cardholderName
              }
              className="w-full"
            >
              {processing
                ? "Processing Payment..."
                : `Pay ${sdk.utils.formatCurrency(cart.total / 100, cart.currency)}`}
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
// PLUGIN DEFINITION
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

export default definePlugin({
  metadata,
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-confirmation": CheckoutConfirmationComponent,
  },
});
