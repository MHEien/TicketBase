"use client";

import { useState, useEffect } from "react";
import { ExtensionPoint } from "@/components/extension-point";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Script from "next/script";

export default function PluginTestPage() {
  const [cart, setCart] = useState({
    id: 'test-cart-123',
    total: 1999,
    currency: 'USD',
    items: [
      { id: 'item-1', name: 'Test Ticket', quantity: 1, price: 1999 }
    ]
  });
  
  const [paymentResult, setPaymentResult] = useState<{ id: string; timestamp: Date } | null>(null);
  const [loading, setLoading] = useState(false);
  const [pluginsLoaded, setPluginsLoaded] = useState(false);

  // Handle plugin script loading
  const handlePluginLoaderLoad = () => {
    console.log("Plugin loader script loaded");
    setPluginsLoaded(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentResult({
        id: paymentId,
        timestamp: new Date()
      });
      setLoading(false);
    }, 1500);
  };

  const resetPayment = () => {
    setPaymentResult(null);
  };

  return (
    <div className="container mx-auto py-8">
      <Script 
        src="/plugin-loader.js"
        strategy="lazyOnload"
        onLoad={handlePluginLoaderLoad}
      />
      <Script 
        src="/plugins/dev-plugin-1.js"
        strategy="lazyOnload"
        onLoad={() => console.log("Plugin loaded")}
      />
      
      <h1 className="text-3xl font-bold mb-8">Plugin System Test Page</h1>
      
      {paymentResult ? (
        <div className="mb-8">
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Payment Complete!</AlertTitle>
            <AlertDescription className="text-green-700">
              Payment ID: {paymentResult.id}<br />
              Processed at: {paymentResult.timestamp.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
          <Button onClick={resetPayment} className="mt-4">
            Reset
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2">Processing payment...</span>
                  </div>
                ) : (
                  <ExtensionPoint 
                    name="payment-methods" 
                    context={{ 
                      cart: cart,
                      onSuccess: handlePaymentSuccess
                    }}
                    fallback={
                      <div className="text-center p-4 border rounded-md border-dashed">
                        <p className="text-muted-foreground">No payment plugins found.</p>
                        <p className="text-muted-foreground text-sm mt-2">
                          Make sure you have at least one payment plugin installed and enabled.
                        </p>
                      </div>
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Plugin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ExtensionPoint 
                  name="admin-settings" 
                  context={{ pluginId: 'dev-plugin-1' }}
                  fallback={
                    <div className="text-center p-4 border rounded-md border-dashed">
                      <p className="text-muted-foreground">No plugin settings available.</p>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 