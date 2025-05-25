"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// This would be provided by the platform
import { Card, CardContent, CardHeader, CardTitle } from "host/ui";

interface StripePaymentMethodsProps {
  config: {
    publishableKey: string;
    testMode?: boolean;
  };
  eventData?: any;
}

// This is the main component that will be loaded by the platform
export default function StripePaymentMethods({
  config,
  eventData,
}: StripePaymentMethodsProps) {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Stripe with the plugin configuration
    if (config.publishableKey) {
      setStripePromise(loadStripe(config.publishableKey));
    } else {
      setError("Stripe publishable key not configured");
      setLoading(false);
    }
  }, [config.publishableKey]);

  useEffect(() => {
    // In a real implementation, this would make an API call to your server
    // to create a payment intent or setup intent
    async function prepareStripeSession() {
      try {
        setLoading(true);

        // This would be an actual API call in production
        // Example: fetch('/api/plugins/stripe/create-intent', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ eventId: eventData?.id }),
        // })

        // Mock response for the example
        const mockClientSecret =
          "mock_secret_" + Math.random().toString(36).substring(2);

        // Small delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setClientSecret(mockClientSecret);
      } catch (err) {
        setError("Failed to initialize payment methods");
        console.error("Stripe initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (stripePromise && eventData) {
      prepareStripeSession();
    }
  }, [stripePromise, eventData]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (loading || !clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading payment options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        {/* In a real implementation, we would pass the actual client secret */}
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: "mock_secret_for_example" }}
        >
          <CheckoutForm />
        </Elements>

        {config.testMode && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3 text-xs text-yellow-800">
            Stripe is in test mode. Use test card 4242 4242 4242 4242 with any
            future date and CVC.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component to display the actual payment form
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Since this is just an example, we're not actually processing payments
    // In a real implementation, this would call stripe.confirmPayment() or similar

    // Simulate payment processing
    setTimeout(() => {
      setMessage("Payment method saved successfully");
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />

      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className="mt-4 w-full rounded-md bg-primary px-4 py-2 font-medium text-white"
      >
        {isProcessing ? "Processing..." : "Save Payment Method"}
      </button>

      {message && <div className="mt-4 text-sm text-green-600">{message}</div>}
    </form>
  );
}
