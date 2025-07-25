import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { getCurrentOrganization } from "~/lib/server-organization";
import { useCart } from "~/contexts/CartContext";
import { eventsApi } from "~/lib/api/events";
import { ordersApi } from "~/lib/api/orders";
import {
  PaymentMethods,
  CheckoutExtensions,
} from "~/components/plugins/ExtensionPoint";

export const Route = createFileRoute("/checkout")({
  loader: async () => {
    const organization = await getCurrentOrganization();
    return { organization };
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { organization } = Route.useLoaderData();
  const {
    state: cartState,
    clearCart,
    loadCheckoutData,
    saveCheckoutData,
    clearCheckoutData,
  } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Load saved checkout data
  useEffect(() => {
    const savedData = loadCheckoutData();
    if (savedData) {
      setCustomerInfo({
        firstName: savedData.customerInfo.firstName,
        lastName: savedData.customerInfo.lastName,
        email: savedData.customerInfo.email,
        phone: savedData.customerInfo.phone || "",
      });
      setSelectedPaymentMethod(savedData.paymentMethod || null);
      setSpecialRequests(savedData.specialRequests || "");
      setMarketingConsent(savedData.marketingConsent || false);
    }
  }, [loadCheckoutData]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartState.isLoading && cartState.items.length === 0) {
      window.location.href = "/events";
    }
  }, [cartState.isLoading, cartState.items.length]);

  // Fetch event details for all cart items
  const eventIds = [...new Set(cartState.items.map((item) => item.eventId))];
  const { data: events } = useQuery({
    queryKey: ["events", eventIds],
    queryFn: async () => {
      if (!organization) return [];
      const eventPromises = eventIds.map((id) => eventsApi.getPublicEvent(id, organization.id));
      return Promise.all(eventPromises);
    },
    enabled: eventIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (cartState.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Save checkout data
      saveCheckoutData({
        customerInfo,
        paymentMethod: selectedPaymentMethod,
        specialRequests,
        marketingConsent,
      });

      // 1. Create order in backend
      const order = await ordersApi.createOrderFromCart(
        cartState.items,
        customerInfo,
        specialRequests,
        marketingConsent,
      );

      // 2. Create payment intent
      const paymentIntent = await ordersApi.createPaymentIntent({
        orderId: order.id,
        paymentMethod: selectedPaymentMethod,
      });

      // 3. Confirm payment (in real implementation, this would be handled by the payment plugin)
      const paymentResult = await ordersApi.confirmPayment({
        orderId: order.id,
        paymentIntentId: paymentIntent.paymentIntentId,
        paymentMethod: selectedPaymentMethod,
      });

      if (paymentResult.success) {
        // Clear cart and checkout data
        clearCart();
        clearCheckoutData();

        // Show success message
        alert("Payment successful! Your tickets have been purchased.");

        // Redirect to events page
        window.location.href = "/events";
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some tickets to your cart to proceed with checkout.
          </p>
          <Button onClick={() => (window.location.href = "/events")}>
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-lg text-gray-600">Complete your ticket purchase</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Last Name *"
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Email Address *"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    icon={<Phone className="h-4 w-4 text-gray-400" />}
                  />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requests or dietary requirements..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketing-consent"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="marketing-consent"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        I agree to receive marketing communications and updates
                        about future events
                      </label>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Before Payment Extensions */}
            <CheckoutExtensions
              position="before-payment"
              context={{
                events,
                customerInfo,
                cartState,
                organization,
              }}
            />

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethods
                  context={{
                    cart: {
                      total: Math.round(cartState.totalPrice * 100), // Convert to cents
                      currency: cartState.currency,
                      items: cartState.items,
                    },
                    customer: customerInfo,
                    events,
                    organization,
                  }}
                  onMethodSelect={setSelectedPaymentMethod}
                />
              </CardContent>
            </Card>

            {/* After Payment Extensions */}
            <CheckoutExtensions
              position="after-payment"
              context={{
                events,
                customerInfo,
                cartState,
                selectedPaymentMethod,
                organization,
              }}
            />
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartState.items.map((item) => {
                    const itemEvent = events?.find(
                      (e) => e.id === item.eventId,
                    );

                    return (
                      <div
                        key={`${item.eventId}-${item.ticketTypeId}`}
                        className="border-b pb-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {itemEvent?.title || "Event"}
                            </h3>
                            <div className="font-medium text-gray-900 mt-1">
                              {item.ticketTypeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {itemEvent && (
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {format(
                                  new Date(itemEvent.startDate),
                                  "EEEE, MMMM d, yyyy",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{itemEvent.startTime}</span>
                            </div>
                            <div className="flex items-center">
                              {itemEvent.locationType === "virtual" ? (
                                <Globe className="h-4 w-4 mr-2" />
                              ) : (
                                <MapPin className="h-4 w-4 mr-2" />
                              )}
                              <span>
                                {itemEvent.locationType === "virtual"
                                  ? "Virtual Event"
                                  : `${itemEvent.venueName}, ${itemEvent.city}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartState.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {cartState.totalItems} ticket
                    {cartState.totalItems !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Before Submit Extensions */}
                <CheckoutExtensions
                  position="before-submit"
                  context={{
                    events,
                    customerInfo,
                    cartState,
                    selectedPaymentMethod,
                    organization,
                  }}
                />

                {/* Checkout Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={
                    !customerInfo.firstName ||
                    !customerInfo.lastName ||
                    !customerInfo.email ||
                    !selectedPaymentMethod ||
                    isProcessing
                  }
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </Button>

                {/* After Submit Extensions */}
                <CheckoutExtensions
                  position="after-submit"
                  context={{
                    events,
                    customerInfo,
                    cartState,
                    selectedPaymentMethod,
                    isProcessing,
                    organization,
                  }}
                />

                {/* Security Info */}
                <div className="text-xs text-gray-500 text-center">
                  <p>🔒 Your payment information is secure and encrypted</p>
                  {organization?.checkoutMessage && (
                    <p className="mt-2 italic">
                      "{organization.checkoutMessage}"
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
