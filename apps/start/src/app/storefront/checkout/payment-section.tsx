"use client";

import { useState, useEffect } from "react";
import { ExtensionPoint } from "@/components/extension-point";
import { usePluginSDK } from "@/lib/plugin-sdk-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cart } from "@/examples/stripe-plugin/types/cart";

interface PaymentSectionProps {
  cart: Cart;
  onPaymentComplete: (paymentId: string, method: string) => void;
}

export default function PaymentSection({
  cart,
  onPaymentComplete,
}: PaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentErrors, setPaymentErrors] = useState<string[]>([]);
  const { toast } = useToast();

  // Use Plugin SDK for authentication and utilities
  const { auth, utils } = usePluginSDK();

  const handlePaymentSuccess = (paymentId: string, method?: string) => {
    const paymentMethod = method || selectedMethod || "unknown";

    setProcessing(false);
    setPaymentErrors([]);
    onPaymentComplete(paymentId, paymentMethod);

    toast({
      title: "Payment Successful! 🎉",
      description: `Your payment has been processed successfully via ${paymentMethod}.`,
    });
  };

  const handlePaymentError = (error: string, method?: string) => {
    setProcessing(false);
    const errorMessage = `Payment failed${method ? ` (${method})` : ""}: ${error}`;
    setPaymentErrors((prev) => [...prev, errorMessage]);

    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentErrors([]); // Clear previous errors when selecting new method
  };

  // Enhanced context data to pass to payment method plugins
  const paymentContext = {
    cart,
    onSuccess: handlePaymentSuccess,
    onError: handlePaymentError,
    onMethodSelect: handlePaymentMethodSelect,
    selectedMethod,
    processing,
    setProcessing,
    // Provide cart details in multiple formats for plugin compatibility
    amount: cart.total, // Amount in cents
    amountFormatted: utils.formatCurrency(cart.total / 100, cart.currency),
    currency: cart.currency,
    total: cart.total,
    customer: cart.customer,
    orderId: cart.id,
    // User context
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  };

  return (
    <div className="space-y-4">
      {/* Payment Errors Display */}
      {paymentErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-1">
              {paymentErrors.map((error, index) => (
                <div key={index} className="text-sm">
                  {error}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Payment Method
            {auth.isAuthenticated && (
              <span className="text-sm font-normal text-muted-foreground">
                {auth.user?.email}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 
            Plugin SDK Context-Aware Extension Point
            Loads payment plugins dynamically from MinIO with full context injection
          */}
          <ExtensionPoint
            name="payment-methods"
            context={paymentContext}
            fallback={
              <div className="text-center p-6 border rounded-md border-dashed">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    No payment methods available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Payment plugins load dynamically with Plugin SDK Context
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 mt-4">
                    <p>
                      <strong>Total:</strong>{" "}
                      {utils.formatCurrency(cart.total / 100, cart.currency)}
                    </p>
                    <p>
                      <strong>Currency:</strong> {cart.currency}
                    </p>
                    <p>
                      <strong>Order ID:</strong> {cart.id}
                    </p>
                    <p>
                      <strong>Auth Status:</strong>{" "}
                      {auth.isAuthenticated ? "✅ Authenticated" : "❌ Guest"}
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Alternative Extension Point for Checkout Payment */}
          <ExtensionPoint
            name="checkout-payment"
            context={paymentContext}
            fallback={null}
          />
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="flex justify-between w-full items-center">
            <div className="space-y-1">
              <p className="font-medium">Order Total</p>
              <p className="text-2xl font-bold">
                {utils.formatCurrency(cart.total / 100, cart.currency)}
              </p>
              {cart.customer?.email && (
                <p className="text-xs text-muted-foreground">
                  Billing: {cart.customer.email}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end space-y-2">
              {selectedMethod && (
                <div className="text-xs text-muted-foreground">
                  Method: <span className="font-medium">{selectedMethod}</span>
                </div>
              )}

              <Button
                size="lg"
                disabled={processing || !selectedMethod}
                onClick={() => {
                  setProcessing(true);
                  // The actual payment processing is handled by the selected plugin
                }}
                className="min-w-[160px]"
              >
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ${utils.formatCurrency(cart.total / 100, cart.currency)}`
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Payment Confirmation Extension Point */}
      <ExtensionPoint
        name="checkout-confirmation"
        context={{
          cart,
          paymentDetails: selectedMethod
            ? {
                provider: selectedMethod,
                amount: cart.total,
                currency: cart.currency,
                status: processing ? "processing" : "pending",
              }
            : null,
        }}
        fallback={null}
      />

      {/* Development Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Payment Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <details className="text-xs space-y-1">
              <summary className="cursor-pointer hover:text-foreground">
                Cart & Context Data
              </summary>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <p>
                  <strong>Cart ID:</strong> {cart.id}
                </p>
                <p>
                  <strong>Total (cents):</strong> {cart.total}
                </p>
                <p>
                  <strong>Currency:</strong> {cart.currency}
                </p>
                <p>
                  <strong>Customer:</strong> {cart.customer?.email || "Guest"}
                </p>
                <p>
                  <strong>Selected Method:</strong> {selectedMethod || "None"}
                </p>
                <p>
                  <strong>Processing:</strong> {processing ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Auth Status:</strong>{" "}
                  {auth.isAuthenticated ? "Authenticated" : "Guest"}
                </p>
                <p>
                  <strong>Plugin SDK:</strong> ✅ Available
                </p>
              </div>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
