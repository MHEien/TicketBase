"use client";

import { useState, useEffect } from "react";
import { ExtensionPoint } from "@/components/extension-point";
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
  const { toast } = useToast();

  const handlePaymentSuccess = (paymentId: string) => {
    if (!selectedMethod) return;

    setProcessing(false);
    onPaymentComplete(paymentId, selectedMethod);

    toast({
      title: "Payment successful",
      description: `Your payment has been processed successfully.`,
    });
  };

  // Context data to pass to payment method plugins
  const paymentContext = {
    cart,
    onSuccess: handlePaymentSuccess,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 
          This renders all enabled payment method plugins
          Each plugin will render its own payment form
        */}
        <ExtensionPoint
          name="payment-methods"
          context={paymentContext}
          fallback={
            <div className="text-center p-4 border rounded-md border-dashed">
              <p className="text-muted-foreground">
                No payment methods available
              </p>
            </div>
          }
        />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full items-center">
          <div>
            <p className="font-medium">Total</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: cart.currency,
              }).format(cart.total / 100)}
            </p>
          </div>

          <Button
            size="lg"
            disabled={processing || !selectedMethod}
            onClick={() => setProcessing(true)}
          >
            {processing ? "Processing..." : "Complete Purchase"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
