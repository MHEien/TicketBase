import { definePlugin, registerExtensionPoint } from '@/lib/plugin-sdk';
import PaymentMethodComponent from './components/payment-method';
import AdminSettingsComponent from './components/admin-settings';
import { Cart } from './types/cart';
import React from 'react';

// Register the payment method component with proper type safety
const TypedPaymentMethodComponent = registerExtensionPoint<{ onSuccess?: (paymentId: string) => void }>(
  ({ context, configuration, plugin }) => {
    // Cast context to the expected type
    const { cart } = context as { cart: Cart };
    const { apiKey, webhookUrl } = configuration;
    
    return (
      <PaymentMethodComponent
        apiKey={apiKey}
        webhookUrl={webhookUrl}
        amount={cart?.total || 0}
        currency={cart?.currency || 'USD'}
        orderId={cart?.id}
        customerEmail={cart?.customer?.email}
        onSuccess={context.onSuccess}
      />
    );
  }
);

// Register the admin settings component
const TypedAdminSettingsComponent = registerExtensionPoint(
  ({ configuration, plugin }) => {
    return (
      <AdminSettingsComponent
        initialConfig={configuration}
        pluginId={plugin.id}
      />
    );
  }
);

// Define and export the plugin
export default definePlugin({
  name: 'Stripe Payment Gateway',
  version: '1.0.0',
  description: 'Process credit card payments with Stripe',
  category: 'payments',
  // Legacy format for backwards compatibility
  metadata: {
    author: 'Ticket Platform, Inc.',
    priority: 100, // Higher priority will display before other payment methods
    displayName: 'Credit Card (Stripe)'
  },
  // New format for the marketplace
  adminComponents: {
    settings: './AdminSettingsComponent',
    eventCreation: null,
    dashboard: null
  },
  storefrontComponents: {
    checkout: './PaymentMethodComponent',
    eventDetail: null,
    ticketSelection: null,
    widgets: {
      sidebar: null,
      footer: './CheckoutConfirmation'
    }
  },
  requiredPermissions: [
    'read:orders',
    'write:transactions'
  ],
  extensionPoints: {
    // Register components for various extension points
    'payment-methods': TypedPaymentMethodComponent,
    'admin-settings': TypedAdminSettingsComponent,
    'checkout-confirmation': registerExtensionPoint(({ context }) => {
      const { paymentDetails } = context as { paymentDetails: any };
      
      if (paymentDetails?.provider !== 'stripe') {
        return null;
      }
      
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Payment processed by Stripe</span>
        </div>
      );
    })
  }
}); 