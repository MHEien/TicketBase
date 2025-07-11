import React from "react";

// =============================================================================
// SIMPLE PLUGIN SDK COMPATIBILITY LAYER
// =============================================================================

// Simple UI components (replace with your actual components)
const Card = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="border rounded-lg shadow-sm" {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="p-6 pb-4" {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <h3 className="text-lg font-semibold" {...props}>
    {children}
  </h3>
);

const CardDescription = ({
  children,
  ...props
}: React.PropsWithChildren<any>) => (
  <p className="text-sm text-gray-600" {...props}>
    {children}
  </p>
);

const CardContent = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="p-6 pt-0" {...props}>
    {children}
  </div>
);

const Input = ({ ...props }) => (
  <input className="w-full px-3 py-2 border rounded-md" {...props} />
);

const Label = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <label className="text-sm font-medium" {...props}>
    {children}
  </label>
);

const Button = ({
  children,
  disabled,
  ...props
}: React.PropsWithChildren<any>) => (
  <button
    className={`px-4 py-2 rounded-md ${disabled ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const Switch = ({ checked, onCheckedChange, ...props }: any) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    {...props}
  />
);

const Alert = ({
  variant,
  children,
  ...props
}: React.PropsWithChildren<any>) => (
  <div
    className={`p-4 rounded-md ${variant === "destructive" ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`}
    {...props}
  >
    {children}
  </div>
);

const AlertDescription = ({
  children,
  ...props
}: React.PropsWithChildren<any>) => (
  <div className="text-sm" {...props}>
    {children}
  </div>
);

// =============================================================================
// STRIPE PLUGIN CONFIGURATION TYPES
// =============================================================================

interface StripeConfig {
  apiKey: string; // This will be encrypted automatically (defined in plugin.json sensitiveFields)
  publishableKey: string; // This will be stored as plain text (not in sensitiveFields)
  webhookUrl?: string; // This will be stored as plain text
  testMode: boolean; // This will be stored as plain text
}

// =============================================================================
// BACKEND ACTION HANDLERS (NEW!)
// =============================================================================

const backendActions = {
  /**
   * Create a Stripe checkout session securely on the backend
   * This runs on the plugins server with access to encrypted config
   */
  'create-checkout-session': async (params: any, config: StripeConfig) => {
    // Import Stripe on the backend (plugins server has access to node_modules)
    const Stripe = require('stripe');
    const stripe = new Stripe(config.apiKey);

    const { amount, currency, successUrl, cancelUrl, metadata } = params;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency || 'usd',
              product_data: {
                name: 'Event Ticket',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata || {},
      });

      return {
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
      };
    } catch (error: any) {
      throw new Error(`Stripe checkout session creation failed: ${error.message}`);
    }
  },

  /**
   * Verify a payment on the backend
   */
  'verify-payment': async (params: any, config: StripeConfig) => {
    const Stripe = require('stripe');
    const stripe = new Stripe(config.apiKey);

    const { sessionId } = params;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      return {
        success: true,
        paymentStatus: session.payment_status,
        paymentIntentId: session.payment_intent,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email,
      };
    } catch (error: any) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  },

  /**
   * Handle Stripe webhooks
   */
  'handle-webhook': async (params: any, config: StripeConfig) => {
    const Stripe = require('stripe');
    const stripe = new Stripe(config.apiKey);

    const { payload, signature, endpointSecret } = params;

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      
      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          return {
            success: true,
            eventType: 'payment_succeeded',
            paymentIntentId: event.data.object.id,
            amount: event.data.object.amount,
          };
        case 'payment_intent.payment_failed':
          return {
            success: true,
            eventType: 'payment_failed',
            paymentIntentId: event.data.object.id,
            error: event.data.object.last_payment_error,
          };
        default:
          return {
            success: true,
            eventType: 'unhandled',
            type: event.type,
          };
      }
    } catch (error: any) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  },
};

// =============================================================================
// ADMIN SETTINGS COMPONENT
// =============================================================================

const AdminSettingsComponent: React.FC<any> = (props) => {
  // Context is spread as direct props, not nested under 'context'
  const {
    plugin,
    pluginId = "stripe-payment-plugin",
    onSave,
    saving = false,
    user = { email: "admin@example.com" },
    isAuthenticated = true,
    configuration = {},
    ...restProps
  } = props;

  // Debug log to see what props we're receiving
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 Stripe Plugin received props:", props);
    console.log("🔧 onSave function:", onSave);
    console.log("🔧 onSave type:", typeof onSave);
    console.log("🔧 configuration:", configuration);
  }

  // Initialize with existing configuration or defaults
  const [formData, setFormData] = React.useState<StripeConfig>({
    apiKey: configuration?.apiKey || "",
    publishableKey: configuration?.publishableKey || "",
    webhookUrl: configuration?.webhookUrl || "",
    testMode: configuration?.testMode ?? true,
  });

  const [formError, setFormError] = React.useState<string | null>(null);

  // Update form data when configuration changes
  React.useEffect(() => {
    if (configuration && Object.keys(configuration).length > 0) {
      setFormData({
        apiKey: configuration.apiKey || "",
        publishableKey: configuration.publishableKey || "",
        webhookUrl: configuration.webhookUrl || "",
        testMode: configuration.testMode ?? true,
      });
    }
  }, [configuration]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.apiKey.trim()) {
      setFormError("Stripe Secret API Key is required");
      return;
    }

    if (!formData.publishableKey.trim()) {
      setFormError("Stripe Publishable Key is required");
      return;
    }

    // Validate API key format
    if (!formData.apiKey.match(/^sk_(test_|live_)/)) {
      setFormError(
        "Stripe Secret API Key must start with 'sk_test_' or 'sk_live_'",
      );
      return;
    }

    // Validate publishable key format
    if (!formData.publishableKey.match(/^pk_(test_|live_)/)) {
      setFormError(
        "Stripe Publishable Key must start with 'pk_test_' or 'pk_live_'",
      );
      return;
    }

    try {
      setFormError(null);

      // Use the onSave function passed from the admin settings UI
      // This will automatically:
      // 1. Encrypt sensitive fields (apiKey) based on plugin.json configSchema
      // 2. Store non-sensitive fields (publishableKey, webhookUrl, testMode) as plain text
      // 3. Validate against the configSchema
      // 4. Create audit trail of changes
      // 5. Handle tenant isolation
      if (onSave) {
        await onSave(formData);
      } else {
        throw new Error(
          "No save function available. Plugin may not be properly integrated.",
        );
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save configuration",
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Alert variant="destructive">
            <AlertDescription>
              You must be authenticated to configure this plugin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔒 Stripe Payment Configuration</CardTitle>
        <CardDescription>
          Configure your Stripe payment gateway. Sensitive data is encrypted
          automatically.
          <br />
          <strong>Authenticated as:</strong> {user.email}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key - This will be encrypted */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              🔐 Stripe Secret API Key (Encrypted) *
            </Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              placeholder="sk_test_... or sk_live_..."
              value={formData.apiKey}
              onChange={handleInputChange}
              disabled={saving}
              required
            />
            <p className="text-sm text-gray-500">
              ✅ <strong>This field is automatically encrypted</strong> and
              stored securely based on the plugin.json configuration.
            </p>
          </div>

          {/* Publishable Key - This will NOT be encrypted */}
          <div className="space-y-2">
            <Label htmlFor="publishableKey">
              📖 Stripe Publishable Key (Plain Text) *
            </Label>
            <Input
              id="publishableKey"
              name="publishableKey"
              type="text"
              placeholder="pk_test_... or pk_live_..."
              value={formData.publishableKey}
              onChange={handleInputChange}
              disabled={saving}
              required
            />
            <p className="text-sm text-gray-500">
              ℹ️ This field is stored as plain text (safe for client-side use).
            </p>
          </div>

          {/* Webhook URL - This will NOT be encrypted */}
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">🔗 Webhook URL (Optional)</Label>
            <Input
              id="webhookUrl"
              name="webhookUrl"
              type="url"
              placeholder="https://yoursite.com/api/stripe/webhook"
              value={formData.webhookUrl || ""}
              onChange={handleInputChange}
              disabled={saving}
            />
            <p className="text-sm text-gray-500">
              Stripe will send payment events to this URL
            </p>
          </div>

          {/* Test Mode - This will NOT be encrypted */}
          <div className="flex items-center space-x-2">
            <Switch
              id="testMode"
              checked={formData.testMode}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({ ...prev, testMode: checked }))
              }
              disabled={saving}
            />
            <Label htmlFor="testMode">🧪 Test Mode</Label>
          </div>

          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving || !onSave}>
              {saving ? "🔄 Saving..." : "💾 Save Secure Configuration"}
            </Button>
          </div>

          {/* Security Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">
              🔒 Security Features
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                ✅ Sensitive fields (API keys) are AES-256 encrypted at rest
              </li>
              <li>✅ Each value uses unique initialization vectors</li>
              <li>✅ Configuration changes are fully audited</li>
              <li>✅ Tenant isolation ensures data separation</li>
              <li>✅ Encryption keys are stored separately from data</li>
              <li>✅ Real-time validation against plugin schema</li>
            </ul>
          </div>

          {/* Debug Info in Development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">
                🔧 Debug Information
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Plugin ID:</strong> {pluginId}
                </p>
                <p>
                  <strong>Save Function:</strong>{" "}
                  {onSave ? "✅ Available" : "❌ Missing"}
                </p>
                <p>
                  <strong>Current Config:</strong>{" "}
                  {JSON.stringify(configuration || {}, null, 2)}
                </p>
                <p>
                  <strong>Form Data:</strong>{" "}
                  {JSON.stringify(
                    {
                      ...formData,
                      apiKey: formData.apiKey ? "***HIDDEN***" : "",
                    },
                    null,
                    2,
                  )}
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PAYMENT METHOD COMPONENT (UPDATED!)
// =============================================================================

const PaymentMethodComponent: React.FC<any> = ({ context = {}, onExecuteAction }) => {
  const { cart = { total: 2000, currency: "USD" }, organizationId, user } = context;
  
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePayment = async () => {
    if (!onExecuteAction) {
      setError("Payment system not properly configured");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Call the backend action to create a secure checkout session
      const result = await onExecuteAction('create-checkout-session', {
        amount: cart.total,
        currency: cart.currency || 'USD',
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
        metadata: {
          organizationId,
          userId: user?.id,
          cartId: cart.id,
        }
      });

      if (result.success && result.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>💳 Credit Card Payment</CardTitle>
        <CardDescription>Secure payment processing via Stripe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">🔒 Secure Checkout</h4>
            <p className="text-sm text-blue-800">
              You'll be redirected to Stripe's secure checkout page to complete your payment.
              No card details are stored on our servers.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>
                ${(cart.total / 100).toFixed(2)} {cart.currency || 'USD'}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={processing || !onExecuteAction}
          >
            {processing ? (
              <>🔄 Creating secure checkout...</>
            ) : (
              <>🔒 Pay ${(cart.total / 100).toFixed(2)} - Secure Checkout</>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            ✅ Powered by Stripe • 🔒 Bank-level security • 🛡️ PCI compliant
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// CHECKOUT CONFIRMATION COMPONENT
// =============================================================================

const CheckoutConfirmationComponent: React.FC<any> = ({ context = {} }) => {
  const { paymentDetails = {} } = context;

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
};

// =============================================================================
// PLUGIN DEFINITION AND EXPORT (UPDATED!)
// =============================================================================

const metadata = {
  id: "stripe-payment-plugin",
  name: "Stripe Payment Gateway",
  version: "2.0.0",
  description: "Accept credit card payments securely with Stripe",
  author: "Tickets Platform Team",
  category: "payment",
  displayName: "Credit Card (Stripe)",
  requiredPermissions: ["read:orders", "write:transactions"],
  priority: 100,
  // NEW: Define supported backend actions
  supportedActions: [
    'create-checkout-session',
    'verify-payment', 
    'handle-webhook'
  ],
};

// Create the plugin definition with backend actions
const stripePlugin = {
  metadata,
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-confirmation": CheckoutConfirmationComponent,
  },
  // NEW: Backend action handlers that run on plugins server
  backendActions,
};

// Export for our simple plugin system
export default stripePlugin;

// Also export individual components for compatibility
export {
  AdminSettingsComponent,
  PaymentMethodComponent,
  CheckoutConfirmationComponent,
  metadata,
  backendActions,
};

console.log("✅ Stripe Plugin: Loaded with secure backend integration and action handlers");
