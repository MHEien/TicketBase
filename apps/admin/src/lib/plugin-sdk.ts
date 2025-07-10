import React from "react";
import { ExtensionPointContext, ExtensionComponentProps } from "./plugin-types";

type ExtensionComponent<T = any> = React.ComponentType<
  ExtensionComponentProps & T
>;

// Define types for the component references
type ComponentReference = string | null;

// Define types for component structures
interface AdminComponents {
  settings?: ComponentReference;
  eventCreation?: ComponentReference;
  dashboard?: ComponentReference;
  [key: string]: ComponentReference | undefined;
}

interface StorefrontWidgets {
  sidebar?: ComponentReference;
  footer?: ComponentReference;
  [key: string]: ComponentReference | undefined;
}

interface StorefrontComponents {
  checkout?: ComponentReference;
  eventDetail?: ComponentReference;
  ticketSelection?: ComponentReference;
  widgets?: StorefrontWidgets;
  [key: string]: ComponentReference | StorefrontWidgets | undefined;
}

interface PluginDefinition {
  name: string;
  version: string;
  description: string;
  category:
    | "payment"
    | "payments"
    | "marketing"
    | "analytics"
    | "social"
    | "ticketing"
    | "layout"
    | "seating";
  metadata?: {
    priority?: number;
    displayName?: string;
    author?: string;
  };
  extensionPoints: Record<string, ExtensionComponent>;
  // New properties for marketplace format
  adminComponents?: AdminComponents;
  storefrontComponents?: StorefrontComponents;
  requiredPermissions?: string[];
}

/**
 * Helper function to define a plugin's metadata and components
 *
 * This is the main function that plugin developers will use to define their plugin.
 *
 * @example
 * ```ts
 * // Example plugin for a Stripe payment gateway
 * export default definePlugin({
 *   name: 'Stripe Payment Gateway',
 *   version: '1.0.0',
 *   description: 'Process payments with Stripe',
 *   category: 'payments',
 *   metadata: {
 *     author: 'Stripe, Inc',
 *     priority: 10
 *   },
 *   // Component paths for the marketplace
 *   adminComponents: {
 *     settings: './AdminSettingsComponent',
 *   },
 *   storefrontComponents: {
 *     checkout: './PaymentMethodComponent',
 *     widgets: {
 *       footer: './CheckoutConfirmation'
 *     }
 *   },
 *   requiredPermissions: ['read:orders', 'write:transactions'],
 *   // Component implementations
 *   extensionPoints: {
 *     'payment-methods': PaymentMethodComponent,
 *     'admin-settings': AdminSettingsComponent
 *   }
 * });
 * ```
 */
export function definePlugin(definition: PluginDefinition): PluginDefinition {
  return definition;
}

/**
 * Type-safe helper to register an extension point component
 *
 * @example
 * ```tsx
 * const PaymentMethodComponent = registerExtensionPoint<PaymentMethodProps>(
 *   ({ context, configuration, plugin }) => {
 *     const { cart } = context;
 *     const { apiKey } = configuration;
 *
 *     return (
 *       <StripePaymentForm
 *         apiKey={apiKey}
 *         amount={cart.total}
 *         onSuccess={cart.checkout}
 *       />
 *     );
 *   }
 * );
 * ```
 */
export function registerExtensionPoint<T = any>(
  component: React.ComponentType<ExtensionComponentProps & T>,
): ExtensionComponent<T> {
  return component;
}

/**
 * Helper hook for extension components to access context in a type-safe way
 *
 * @example
 * ```tsx
 * const PaymentMethodComponent = registerExtensionPoint(() => {
 *   const { cart } = useExtensionContext<{ cart: Cart }>();
 *
 *   return <StripePaymentForm amount={cart.total} />;
 * });
 * ```
 */
export function useExtensionContext<T extends ExtensionPointContext>(): T {
  // In a real implementation, this would use React Context to get the extension point context
  // For simplicity, we'll cast the empty object to T
  return {} as T;
}

/**
 * Helper hook for extension components to access configuration
 *
 * @example
 * ```tsx
 * const AdminSettingsComponent = registerExtensionPoint(() => {
 *   const { apiKey, webhookSecret } = useConfiguration<{
 *     apiKey: string;
 *     webhookSecret: string;
 *   }>();
 *
 *   return (
 *     <form>
 *       <input defaultValue={apiKey} name="apiKey" />
 *       <input defaultValue={webhookSecret} name="webhookSecret" />
 *     </form>
 *   );
 * });
 * ```
 */
export function useConfiguration<T = Record<string, any>>(): T {
  // In a real implementation, this would use React Context to get the configuration
  // For simplicity, we'll cast the empty object to T
  return {} as T;
}

/**
 * Helper hook for extension components to access plugin metadata
 */
export function usePlugin() {
  // In a real implementation, this would use React Context to get the plugin
  // For simplicity, we'll return a placeholder
  return {
    id: "",
    name: "",
    version: "",
    enabled: true,
  };
}
