# Stripe Payment Plugin for Events Platform

This is a sample plugin that demonstrates how to integrate Stripe payments with the Events Platform.

## Features

- Process credit card payments using Stripe
- Admin settings for configuration
- Support for test mode
- Client-side payment processing
- Webhook integration

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- An Events Platform instance
- A Stripe account (for production use)

### Building the Plugin

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Bundle the plugin:
   ```bash
   npm run bundle
   # or
   bun run bundle
   ```

3. The bundled plugin will be available in `dist/stripe-plugin.js`

## Uploading to Events Platform

1. Go to your Events Platform admin panel
2. Navigate to Settings > Plugins > Submit
3. Fill in the plugin information:
   - Name: Stripe Payment Gateway
   - Description: Process credit card payments with Stripe
   - Category: payments
   - Version: 1.0.0
4. Upload the bundled plugin file (`dist/stripe-plugin.js`)
5. Complete the submission form and submit

### Configuration

After installing the plugin, you'll need to configure it:

1. Go to Settings > Plugins
2. Find the Stripe plugin and click Configure
3. Enter your Stripe API key (found in your Stripe dashboard)
4. Optionally configure webhook URL for server-side events
5. Enable test mode for testing without real charges
6. Save your settings

## Plugin Structure

This plugin follows the standard Events Platform plugin format:

```json
{
  "id": "stripe-payment-gateway",
  "name": "Stripe Payment Gateway",
  "version": "1.0.0",
  "description": "Process credit card payments with Stripe",
  "category": "payments",
  "remoteEntry": "https://cdn.example.com/plugins/payment-gateway/v1.0.0/remoteEntry.js",
  "scope": "stripe_payment",
  "adminComponents": {
    "settings": "./AdminSettingsComponent"
  },
  "storefrontComponents": {
    "checkout": "./PaymentMethodComponent",
    "widgets": {
      "footer": "./CheckoutConfirmation"
    }
  },
  "requiredPermissions": [
    "read:orders",
    "write:transactions"
  ]
}
```

## Development

This plugin is built using the Events Platform Plugin SDK. It demonstrates:

- Creating admin settings UI
- Implementing payment method components
- Using the plugin hooks and utilities
- Type-safe extension points

For more information on plugin development, refer to the Events Platform documentation.

## License

MIT 