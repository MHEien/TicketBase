# Plugin SDK Reference

This document provides a comprehensive guide to using the `@ticketsplatform/plugin-sdk` for developing plugins for the TicketBase platform. The SDK is designed with full TypeScript support and modern React hooks to provide a powerful and type-safe development experience.

## The `PlatformSDK` Object

When you create an extension point, your component receives an `sdk` object. This is your primary toolkit for interacting with the platform. It contains APIs, authentication details, UI components, and utilities.

### API (`sdk.api`)

The `api` object provides methods for interacting with the platform's backend.

-   `loadConfig(pluginId)`: Loads the saved configuration for your plugin.
-   `saveConfig(pluginId, config)`: Saves a new configuration for your plugin.
-   `get(url)`, `post(url, data)`, `put(url, data)`, `delete(url)`: Authenticated HTTP methods for making custom API calls.

### Authentication (`sdk.auth`)

Access the current user's authentication state.

-   `user`: An object containing the current user's `id`, `email`, `name`, and `avatar`, or `null` if not authenticated.
-   `isAuthenticated`: A boolean indicating if the user is currently logged in.
-   `token`: The user's raw JWT, if available.

### Utilities (`sdk.utils`)

A collection of helper functions.

-   `toast({ title, description, variant })`: Displays a notification toast.
-   `formatCurrency(amount, currency)`: Formats a number as a currency string.
-   `formatDate(date, options)`: Formats a date string or object.
-   `confirm(message)`: Shows a confirmation dialog and returns a promise that resolves to a boolean.
-   `prompt(message, defaultValue)`: Shows a prompt dialog and returns the user's input.
-   `navigate(path)`: Programmatically navigates to a different page.

### UI Components (`sdk.components`)

The SDK exposes a suite of pre-built `shadcn/ui` React components that match the platform's design system. This allows you to build a seamless user experience.

Available components include: `Button`, `Input`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Label`, `Switch`, `Select`, `Textarea`, `Alert`, `Badge`, `Separator`, `Dialog`, and more.

## Extension Points

Extension points are predefined areas in the UI where your plugin can render custom components. Each extension point provides a specific `context` object with relevant data.

-   **`admin-settings`**: Renders a component in the admin dashboard. The `context` includes the `pluginId` and the current `user`.
-   **`payment-methods`** & **`checkout-payment`**: Adds a payment processor to the checkout flow. The `context` includes the shopping `cart` details and `onSuccess`/`onError` callbacks.
-   **`checkout-confirmation`**: Displays a component on the checkout confirmation page. The `context` includes the `paymentDetails` of the completed transaction.

## Hooks

The SDK provides React hooks to simplify plugin development.

-   **`usePlatformSDK()`**: Returns the complete `PlatformSDK` object.
-   **`usePluginConfig<T>(pluginId)`**: A wrapper around `sdk.api.loadConfig` and `sdk.api.saveConfig` that manages state for loading, saving, and error handling your plugin's configuration.
-   **`usePaymentProcessor(pluginId)`**: A hook to help implement payment processing logic, providing `processPayment`, `processing`, and `error` states.

## Secure Backend Logic with `backendActions`

For many plugins, especially those dealing with payments or other sensitive data, some logic must run on a secure server, not in the user's browser. The SDK facilitates this through a powerful pattern that separates your plugin's frontend UI from its secure backend logic.

### The `backendActions` Object

In your plugin's main entry file (e.g., `index.tsx`), you can export a special object named `backendActions`. This object maps string keys (action names) to `async` functions.

-   **Execution Environment**: These functions are **not** part of your frontend bundle. They are executed securely on the dedicated Plugin Server (a Node.js environment).
-   **Secure Configuration**: The platform automatically passes the plugin's decrypted configuration as the second argument to your action function. This is how you get secure access to sensitive data like API keys.

**Example: Defining a Backend Action**

```typescript
// src/index.tsx

// ... React components for extension points ...

// Define the shape of your configuration
interface StripeConfig {
  apiKey: string;
  publishableKey: string;
}

// This object is executed on the server
export const backendActions = {
  /**
   * Creates a Stripe checkout session securely on the backend.
   */
  'create-checkout-session': async (params: { amount: number; currency: string }, config: StripeConfig) => {
    // The 'stripe' package is available on the server
    const Stripe = require('stripe');
    const stripe = new Stripe(config.apiKey); // Use the decrypted API key

    const session = await stripe.checkout.sessions.create({
      // ... stripe session configuration ...
      line_items: [
        {
          price_data: {
            currency: params.currency,
            unit_amount: params.amount,
            product_data: { name: 'Event Ticket' },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    return { checkoutUrl: session.url };
  },
};
```

### Calling Backend Actions with `useAction`

From your frontend React components, you use the `useAction` hook to securely call your backend logic. This hook handles the entire communication flow through the platform's secure proxy.

-   **`execute(params)`**: The function you call to trigger the action. It takes one argument: the parameters you want to send to your backend function.
-   **`loading`**: A boolean that is `true` while the action is being executed.
-   **`error`**: An `Error` object if the action fails.
-   **`data`**: The data returned from your backend action upon success.

**Example: Using the `useAction` Hook**

```tsx
// Your React component for the 'payment-methods' extension point
import React from 'react';
import { useAction } from '@ticketsplatform/plugin-sdk';

const StripePaymentComponent: React.FC<any> = ({ context }) => {
  const { cart } = context;

  const { execute: createCheckout, loading, error, data } = useAction('create-checkout-session');

  const handlePay = async () => {
    const result = await createCheckout({ 
      amount: cart.totalPrice, 
      currency: cart.currency 
    });

    if (result?.checkoutUrl) {
      // Redirect the user to Stripe's checkout page
      window.location.href = result.checkoutUrl;
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with Card'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
};
```

This architecture provides the best of both worlds: a rich, interactive frontend experience built with React, and a secure, server-side execution environment for sensitive operations, without requiring the plugin developer to manage servers, authentication, or encryption.
