import React from "react";

// =============================================================================
// SIMPLE PLUGIN SDK COMPATIBILITY LAYER
// =============================================================================

// Simple hooks for our current system
function usePluginConfig<T>(pluginId: string) {
  const [config, setConfig] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const saveConfig = React.useCallback(async (newConfig: T) => {
    try {
      setError(null);
      // This would integrate with your actual API
      console.log(`Saving config for ${pluginId}:`, newConfig);
      setConfig(newConfig);
      
      // Show success message (you can replace with your toast system)
      alert('Configuration saved successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
      throw err;
    }
  }, [pluginId]);

  React.useEffect(() => {
    // Load initial config
    async function loadConfig() {
      try {
        setLoading(true);
        setError(null);
        // This would integrate with your actual API
        console.log(`Loading config for ${pluginId}`);
        // For now, return empty config
        setConfig({} as T);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    }
    
    loadConfig();
  }, [pluginId]);

  return { config, loading, error, saveConfig };
}

// Simple UI components (replace with your actual components)
const Card = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="border rounded-lg shadow-sm" {...props}>{children}</div>
);

const CardHeader = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="p-6 pb-4" {...props}>{children}</div>
);

const CardTitle = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <h3 className="text-lg font-semibold" {...props}>{children}</h3>
);

const CardDescription = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <p className="text-sm text-gray-600" {...props}>{children}</p>
);

const CardContent = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="p-6 pt-0" {...props}>{children}</div>
);

const Input = ({ ...props }) => (
  <input className="w-full px-3 py-2 border rounded-md" {...props} />
);

const Label = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <label className="text-sm font-medium" {...props}>{children}</label>
);

const Button = ({ children, disabled, ...props }: React.PropsWithChildren<any>) => (
  <button 
    className={`px-4 py-2 rounded-md ${disabled ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
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

const Alert = ({ variant, children, ...props }: React.PropsWithChildren<any>) => (
  <div className={`p-4 rounded-md ${variant === 'destructive' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`} {...props}>
    {children}
  </div>
);

const AlertDescription = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <div className="text-sm" {...props}>{children}</div>
);

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

const AdminSettingsComponent: React.FC<any> = ({ context = {}, pluginId = "stripe-payment-plugin" }) => {
  const { user = { email: "admin@example.com" } } = context;
  const { config, loading, error, saveConfig } = usePluginConfig<StripeConfig>(pluginId);
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
      <Card>
        <CardContent className="p-6 text-center">
          Loading configuration...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Stripe Payment Configuration
        </CardTitle>
        <CardDescription>
          Configure your Stripe payment gateway. Authenticated as: {user.email}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              Stripe Secret API Key
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
              Your Stripe secret API key from the Stripe Dashboard
            </p>
          </div>

          {/* Publishable Key */}
          <div className="space-y-2">
            <Label htmlFor="publishableKey">
              Stripe Publishable Key
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
              Your Stripe publishable key for client-side integration
            </p>
          </div>

          {/* Webhook URL */}
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">
              Webhook URL (Optional)
            </Label>
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

          {/* Test Mode */}
          <div className="flex items-center space-x-2">
            <Switch
              id="testMode"
              checked={formData.testMode}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({ ...prev, testMode: checked }))
              }
              disabled={saving}
            />
            <Label htmlFor="testMode">
              Test Mode
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PAYMENT METHOD COMPONENT
// =============================================================================

const PaymentMethodComponent: React.FC<any> = ({ context = {} }) => {
  const { cart = { total: 2000, currency: 'USD' } } = context;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Card Payment</CardTitle>
        <CardDescription>
          Secure payment processing via Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              type="text"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                type="text"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${(cart.total / 100).toFixed(2)} {cart.currency}</span>
            </div>
          </div>

          <Button className="w-full">
            Pay ${(cart.total / 100).toFixed(2)}
          </Button>
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
// PLUGIN DEFINITION AND EXPORT
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
};

// Create the plugin definition
const stripePlugin = {
  metadata,
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-confirmation": CheckoutConfirmationComponent,
  },
};

// Export for our simple plugin system
export default stripePlugin;

// Also export individual components for compatibility
export {
  AdminSettingsComponent,
  PaymentMethodComponent,
  CheckoutConfirmationComponent,
  metadata,
};

console.log("✅ Stripe Plugin: Loaded with simple plugin system compatibility");
