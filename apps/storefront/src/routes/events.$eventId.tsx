import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Share2,
  Heart,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { useOrganization } from "~/contexts/OrganizationContext";
import { eventsApi, Event, TicketType } from "~/lib/api/events";
import { EventDetailExtensions } from "~/components/plugins/ExtensionPoint";
import { useCart } from "~/contexts/CartContext";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetailPage,
});

interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
  price: number;
  name: string;
}

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const { organization } = useOrganization();
  const {
    addItem,
    updateQuantity,
    getItemQuantity,
    state: cartState,
  } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch event details
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", eventId, organization?.id],
    queryFn: () => {
      if (!organization?.id) {
        throw new Error("Organization ID is required");
      }
      return eventsApi.getPublicEvent(eventId, organization.id);
    },
    enabled: !!organization?.id && !!eventId, // Only run query when we have both organization ID and event ID
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleTicketQuantityChange = (
    ticketType: TicketType,
    quantity: number,
  ) => {
    if (quantity === 0) {
      // Remove item from cart
      updateQuantity(eventId, ticketType.id, 0);
    } else if (event) {
      // Add to cart or update quantity
      const existingQuantity = getItemQuantity(eventId, ticketType.id);
      if (existingQuantity === 0) {
        // Add new item to cart
        addItem({
          eventId,
          ticketTypeId: ticketType.id,
          ticketTypeName: ticketType.name,
          quantity,
          price: ticketType.price,
          event,
        });
      } else {
        // Update existing item quantity
        updateQuantity(eventId, ticketType.id, quantity);
      }
    }
  };

  // Get cart items for this event
  const eventCartItems = cartState.items.filter(
    (item) => item.eventId === eventId,
  );

  const totalPrice = eventCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalQuantity = eventCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.shortDescription || event.description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const proceedToCheckout = () => {
    if (eventCartItems.length === 0) return;

    // Navigate to checkout - cart data is already managed by CartProvider
    window.location.href = "/checkout";
  };

  if (isLoading || !organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-96 bg-gray-200"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {!organization
              ? "Please select an organization to view event details."
              : "The event you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => (window.location.href = "/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const images =
    event.galleryImages && event.galleryImages.length > 0
      ? [event.featuredImage, ...event.galleryImages].filter(Boolean)
      : event.featuredImage
        ? [event.featuredImage]
        : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[activeImageIndex] || "/api/placeholder/1200/400"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-700"></div>
        )}

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Share button */}
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            onClick={handleShare}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Image navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeImageIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
                {event.status === "published" && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Available
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              {event.shortDescription && (
                <p className="text-xl text-gray-600 mb-6">
                  {event.shortDescription}
                </p>
              )}

              {/* Event Meta */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">
                      {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                    </div>
                    {event.endDate && event.endDate !== event.startDate && (
                      <div className="text-sm text-gray-500">
                        to{" "}
                        {format(new Date(event.endDate), "EEEE, MMMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">{event.startTime}</div>
                    {event.endTime && (
                      <div className="text-sm text-gray-500">
                        to {event.endTime}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {event.timeZone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  {event.locationType === "virtual" ? (
                    <Globe className="h-5 w-5 mr-3 text-blue-600" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  )}
                  <div>
                    {event.locationType === "virtual" ? (
                      <div className="font-medium">Virtual Event</div>
                    ) : (
                      <div>
                        <div className="font-medium">{event.venueName}</div>
                        <div className="text-sm text-gray-500">
                          {event.address && `${event.address}, `}
                          {event.city}, {event.country}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {event.capacity > 0 && (
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        Capacity: {event.capacity}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.totalTicketsSold} tickets sold
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {event.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Detail Extensions */}
            <EventDetailExtensions event={event} context={{ organization }} />

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ticket Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Select Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {event.ticketTypes && event.ticketTypes.length > 0 ? (
                    <>
                      {event.ticketTypes
                        .filter((ticket) => ticket.isActive)
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((ticketType) => {
                          const quantity = getItemQuantity(
                            eventId,
                            ticketType.id,
                          );
                          const available =
                            ticketType.quantity - ticketType.sold;
                          const isAvailable = available > 0;

                          return (
                            <div
                              key={ticketType.id}
                              className={`border rounded-lg p-4 ${
                                !isAvailable
                                  ? "opacity-50 bg-gray-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {ticketType.name}
                                  </h3>
                                  <p className="text-2xl font-bold text-gray-900">
                                    ${ticketType.price}
                                  </p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  {available} left
                                </div>
                              </div>

                              {ticketType.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {ticketType.description}
                                </p>
                              )}

                              {isAvailable ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleTicketQuantityChange(
                                          ticketType,
                                          Math.max(0, quantity - 1),
                                        )
                                      }
                                      disabled={quantity === 0}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">
                                      {quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleTicketQuantityChange(
                                          ticketType,
                                          Math.min(available, quantity + 1),
                                        )
                                      }
                                      disabled={quantity >= available}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {quantity > 0 && (
                                    <div className="text-sm font-medium text-gray-900">
                                      $
                                      {(ticketType.price * quantity).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-red-600 font-medium">
                                  Sold Out
                                </div>
                              )}
                            </div>
                          );
                        })}

                      {/* Total and Checkout */}
                      {totalQuantity > 0 && (
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-4">
                            {totalQuantity} ticket
                            {totalQuantity !== 1 ? "s" : ""}
                          </div>
                          <Button
                            className="w-full"
                            size="lg"
                            onClick={proceedToCheckout}
                          >
                            Continue to Checkout
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No tickets available</p>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Organizer Info */}
              {organization && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Event Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      {organization.logo ? (
                        <img
                          src={organization.logo}
                          alt={organization.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-600">
                            {organization.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {organization.name}
                        </div>
                        {organization.website && (
                          <a
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
