// Type declarations for modules used in the Stripe plugin

declare module '@stripe/stripe-js';
declare module '@stripe/react-stripe-js';

// For federated modules
declare module 'host/ui' {
  export const Card: React.ComponentType<any>;
  export const CardContent: React.ComponentType<any>;
  export const CardHeader: React.ComponentType<any>;
  export const CardTitle: React.ComponentType<any>;
} 