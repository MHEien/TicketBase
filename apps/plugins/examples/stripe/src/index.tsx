import React from 'react';
import { definePlugin, usePluginConfig, usePaymentProcessor, createExtensionPoint } from 'ticketsplatform-plugin-sdk';
import type { AdminSettingsContext, PaymentMethodContext } from 'ticketsplatform-plugin-sdk';

// Plugin configuration type
interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

// Admin settings component
const AdminSettings = createExtensionPoint<AdminSettingsContext>(({ context, sdk }) => {
  const { pluginId } = context;
  const { config, saveConfig } = usePluginConfig<StripeConfig>(pluginId);

  const handleSave = async (formData: StripeConfig) => {
    await saveConfig(formData);
    sdk.utils.toast({
      title: 'Success',
      description: 'Stripe configuration saved successfully',
      variant: 'success'
    });
  };

  return (
    <sdk.components.Card>
      <sdk.components.CardHeader>
        <sdk.components.CardTitle>Stripe Payment Settings</sdk.components.CardTitle>
        <sdk.components.CardDescription>
          Configure your Stripe payment integration
        </sdk.components.CardDescription>
      </sdk.components.CardHeader>
      <sdk.components.CardContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSave({
            publishableKey: formData.get('publishableKey') as string,
            secretKey: formData.get('secretKey') as string,
            webhookSecret: formData.get('webhookSecret') as string,
            testMode: formData.get('testMode') === 'true'
          });
        }}>
          <div className="space-y-4">
            <div>
              <sdk.components.Label htmlFor="publishableKey">
                Publishable Key
              </sdk.components.Label>
              <sdk.components.Input
                id="publishableKey"
                name="publishableKey"
                defaultValue={config?.publishableKey}
                placeholder="pk_test_..."
              />
            </div>
            <div>
              <sdk.components.Label htmlFor="secretKey">
                Secret Key
              </sdk.components.Label>
              <sdk.components.Input
                id="secretKey"
                name="secretKey"
                type="password"
                defaultValue={config?.secretKey}
                placeholder="sk_test_..."
              />
            </div>
            <div>
              <sdk.components.Label htmlFor="webhookSecret">
                Webhook Secret
              </sdk.components.Label>
              <sdk.components.Input
                id="webhookSecret"
                name="webhookSecret"
                type="password"
                defaultValue={config?.webhookSecret}
                placeholder="whsec_..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <sdk.components.Switch
                id="testMode"
                name="testMode"
                defaultChecked={config?.testMode}
              />
              <sdk.components.Label htmlFor="testMode">
                Test Mode
              </sdk.components.Label>
            </div>
          </div>
          <sdk.components.Button type="submit" className="mt-4">
            Save Settings
          </sdk.components.Button>
        </form>
      </sdk.components.CardContent>
    </sdk.components.Card>
  );
});

// Payment method component
const PaymentMethod = createExtensionPoint<PaymentMethodContext>(({ context, sdk }) => {
  const { pluginId, cart } = context;
  const { config } = usePluginConfig<StripeConfig>(pluginId);
  const { processPayment, processing } = usePaymentProcessor(pluginId);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize Stripe
  React.useEffect(() => {
    if (config?.publishableKey) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [config?.publishableKey]);

  const handlePayment = async () => {
    try {
      setError(null);
      
      // @ts-ignore - Stripe is loaded dynamically
      const stripe = window.Stripe(config?.publishableKey);
      
      // Create payment intent
      const response = await sdk.api.post('/api/payments/create-intent', {
        amount: cart.total,
        currency: cart.currency,
        paymentMethod: 'stripe'
      });
      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/checkout/confirmation'
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Process payment through platform
      await processPayment(
        {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        },
        (paymentId) => {
          // Payment successful
          sdk.utils.toast({
            title: 'Payment Successful',
            description: `Payment ID: ${paymentId}`,
            variant: 'success'
          });
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      sdk.utils.toast({
        title: 'Payment Failed',
        description: err instanceof Error ? err.message : 'Payment failed',
        variant: 'destructive'
      });
    }
  };

  if (!config?.publishableKey) {
    return (
      <sdk.components.Alert variant="destructive">
        <sdk.components.AlertDescription>
          Stripe is not properly configured. Please contact support.
        </sdk.components.AlertDescription>
      </sdk.components.Alert>
    );
  }

  return (
    <div className="space-y-4">
      <sdk.components.Card>
        <sdk.components.CardHeader>
          <sdk.components.CardTitle>Credit Card Payment</sdk.components.CardTitle>
          <sdk.components.CardDescription>
            Secure payment processing by Stripe
          </sdk.components.CardDescription>
        </sdk.components.CardHeader>
        <sdk.components.CardContent>
          {/* Stripe Elements will be mounted here */}
          <div id="stripe-elements" />
          
          {error && (
            <sdk.components.Alert variant="destructive" className="mt-4">
              <sdk.components.AlertDescription>{error}</sdk.components.AlertDescription>
            </sdk.components.Alert>
          )}

          <sdk.components.Button
            onClick={handlePayment}
            disabled={processing}
            className="mt-4 w-full"
          >
            {processing ? 'Processing...' : `Pay ${sdk.utils.formatCurrency(cart.total, cart.currency)}`}
          </sdk.components.Button>
        </sdk.components.CardContent>
      </sdk.components.Card>
    </div>
  );
});

// Export plugin definition
export default definePlugin({
  metadata: {
    id: 'stripe-payment',
    name: 'Stripe Payments',
    version: '1.0.0',
    description: 'Accept credit card payments via Stripe',
    author: 'Tickets Platform',
    category: 'payment',
    displayName: 'Credit Card (Stripe)',
    iconUrl: 'https://cdn.example.com/icons/stripe.svg',
    requiredPermissions: ['process_payments'],
    priority: 100
  },
  extensionPoints: {
    'admin-settings': AdminSettings,
    'payment-methods': PaymentMethod
  }
}); 