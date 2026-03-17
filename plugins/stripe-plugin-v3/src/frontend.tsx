import React from 'react';

// =============================================================================
// STRIPE PAYMENTS PLUGIN - Frontend
// Extension point components rendered in the host app's React tree.
// =============================================================================

// =============================================================================
// TYPES
// =============================================================================

interface StripeConfig {
  secretKey?: string; // encrypted, not sent to frontend
  publishableKey: string;
  webhookSecret?: string; // encrypted, not sent to frontend
  testMode: boolean;
}

interface ExtensionProps {
  pluginId: string;
  tenantId: string;
  configuration: Partial<StripeConfig>;
  onSave?: (config: Record<string, any>) => Promise<void>;
  saving?: boolean;
  user?: { id: string; email: string };
  isAuthenticated?: boolean;
  onExecuteAction?: (action: string, params: any) => Promise<any>;
  context?: Record<string, any>;
}

// =============================================================================
// SHARED UI PRIMITIVES (inline so plugins have zero deps beyond React)
// =============================================================================

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>{children}</div>
);
const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => <div className="p-6 pb-2">{children}</div>;
const CardTitle: React.FC<React.PropsWithChildren> = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;
const CardDescription: React.FC<React.PropsWithChildren> = ({ children }) => <p className="text-sm text-gray-500 mt-1">{children}</p>;
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => <div className={`p-6 pt-2 ${className}`}>{children}</div>;

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" {...props} />
);
const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string }>> = ({ children, ...props }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1" {...props}>{children}</label>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, disabled, className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// =============================================================================
// ADMIN SETTINGS - Extension point: "admin-settings"
// =============================================================================

const AdminSettings: React.FC<ExtensionProps> = ({
  configuration = {},
  onSave,
  saving,
  user,
}) => {
  const [form, setForm] = React.useState({
    secretKey: configuration.secretKey || '',
    publishableKey: configuration.publishableKey || '',
    webhookSecret: configuration.webhookSecret || '',
    testMode: configuration.testMode ?? true,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (configuration && Object.keys(configuration).length > 0) {
      setForm((prev) => ({
        ...prev,
        secretKey: configuration.secretKey || prev.secretKey,
        publishableKey: configuration.publishableKey || prev.publishableKey,
        webhookSecret: configuration.webhookSecret || prev.webhookSecret,
        testMode: configuration.testMode ?? prev.testMode,
      }));
    }
  }, [configuration]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError(null);
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.secretKey.match(/^sk_(test_|live_)/)) {
      setError('Secret key must start with sk_test_ or sk_live_');
      return;
    }
    if (!form.publishableKey.match(/^pk_(test_|live_)/)) {
      setError('Publishable key must start with pk_test_ or pk_live_');
      return;
    }

    try {
      await onSave?.(form);
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Payment Configuration</CardTitle>
        <CardDescription>
          Connect your Stripe account to accept payments.
          {user && <span className="ml-1">Signed in as {user.email}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input id="secretKey" name="secretKey" type="password" placeholder="sk_test_..." value={form.secretKey} onChange={handleChange} disabled={saving} required />
            <p className="text-xs text-gray-400 mt-1">Encrypted at rest (AES-256)</p>
          </div>

          <div>
            <Label htmlFor="publishableKey">Publishable Key</Label>
            <Input id="publishableKey" name="publishableKey" type="text" placeholder="pk_test_..." value={form.publishableKey} onChange={handleChange} disabled={saving} required />
          </div>

          <div>
            <Label htmlFor="webhookSecret">Webhook Signing Secret</Label>
            <Input id="webhookSecret" name="webhookSecret" type="password" placeholder="whsec_..." value={form.webhookSecret} onChange={handleChange} disabled={saving} />
            <p className="text-xs text-gray-400 mt-1">Used to verify webhook signatures</p>
          </div>

          <div className="flex items-center gap-2">
            <input id="testMode" name="testMode" type="checkbox" checked={form.testMode} onChange={handleChange} disabled={saving} />
            <Label htmlFor="testMode">Test Mode</Label>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}
          {saved && <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">Configuration saved successfully.</div>}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving || !onSave}>
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PAYMENT METHOD - Extension point: "payment-methods"
// Rendered at checkout for customers to select & pay.
// =============================================================================

const PaymentMethod: React.FC<ExtensionProps> = ({
  context = {},
  onExecuteAction,
}) => {
  const { cart = { total: 0, currency: 'USD' }, organizationId } = context;
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePay = async () => {
    if (!onExecuteAction) {
      setError('Payment system is not available');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Call the backend route via the plugin proxy
      const result = await onExecuteAction('createCheckoutSession', {
        amount: cart.total,
        currency: cart.currency?.toLowerCase() || 'usd',
        orderId: cart.orderId,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
        metadata: { organizationId },
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const formattedAmount = (cart.total / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: cart.currency || 'USD',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Card</CardTitle>
        <CardDescription>Pay securely with Stripe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
            <span className="text-sm text-gray-600">Total</span>
            <span className="font-semibold">{formattedAmount}</span>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

          <Button onClick={handlePay} disabled={processing || !onExecuteAction} className="w-full">
            {processing ? 'Redirecting to Stripe...' : `Pay ${formattedAmount}`}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Powered by Stripe &middot; PCI compliant
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// CHECKOUT CONFIRMATION - Extension point: "checkout-confirmation"
// =============================================================================

const CheckoutConfirmation: React.FC<ExtensionProps> = ({ context = {} }) => {
  const { paymentDetails } = context;

  if (!paymentDetails || paymentDetails.provider !== 'stripe') return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
      <svg className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <div>
        <span className="font-medium">Payment Successful</span>
        {paymentDetails.testMode && <span className="ml-1 text-xs">(Test Mode)</span>}
      </div>
    </div>
  );
};

// =============================================================================
// DASHBOARD WIDGET - Extension point: "dashboard-widget"
// Shows revenue stats fetched from the plugin's backend.
// =============================================================================

const DashboardWidget: React.FC<ExtensionProps> = ({ onExecuteAction }) => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!onExecuteAction) {
      setLoading(false);
      return;
    }

    onExecuteAction('getRevenueSummary', {})
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [onExecuteAction]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const revenue = stats?.totalRevenue || 0;
  const transactions = stats?.totalTransactions || 0;
  const formatted = (revenue / 100).toLocaleString(undefined, { style: 'currency', currency: stats?.currency || 'usd' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Revenue</CardTitle>
        <CardDescription>Payment overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">{formatted}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-2xl font-bold">{transactions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PLUGIN EXPORT
// =============================================================================

const metadata = {
  id: 'stripe-payments',
  name: 'Stripe Payments',
  version: '3.0.0',
  description: 'Accept credit card and other payments via Stripe',
  author: 'Tickets Platform Team',
  category: 'payment',
  displayName: 'Stripe Payments',
  requiredPermissions: ['read:orders', 'write:orders', 'read:customers', 'write:transactions'],
  priority: 100,
};

const stripePlugin = {
  metadata,
  extensionPoints: {
    'admin-settings': AdminSettings,
    'payment-methods': PaymentMethod,
    'checkout-confirmation': CheckoutConfirmation,
    'dashboard-widget': DashboardWidget,
  },
};

export default stripePlugin;
export { AdminSettings, PaymentMethod, CheckoutConfirmation, DashboardWidget, metadata };
