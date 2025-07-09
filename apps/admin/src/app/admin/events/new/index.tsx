"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearch } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventBasicDetails } from "@/components/event-creation/event-basic-details";
import { EventDateTime } from "@/components/event-creation/event-date-time";
import { EventLocation } from "@/components/event-creation/event-location";
import { EventTickets } from "@/components/event-creation/event-tickets";
import { EventMedia } from "@/components/event-creation/event-media";
import { EventPreview } from "@/components/event-creation/event-preview";
import { useToast } from "@/hooks/use-toast";
import { useEventCreation } from "@/hooks/use-event-creation";
import { createEvent, fetchEvent } from "@/lib/api/events-api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/events/new/")({
  component: CreateEventPage,
});

function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearch({ from: "__root__" });
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDuplicate, setIsLoadingDuplicate] = useState(false);
  const { eventData, isValid, resetEventData, updateEventData } =
    useEventCreation();

  const duplicateId = searchParams.duplicate;

  // Load event data for duplication
  useEffect(() => {
    if (duplicateId) {
      setIsLoadingDuplicate(true);
      fetchEvent(duplicateId)
        .then((event) => {
          updateEventData({
            title: `${event.title} (Copy)`,
            description: event.description,
            category: event.category,
            startDate: null, // Reset dates for new event
            endDate: null,
            startTime: event.startTime,
            endTime: event.endTime,
            timeZone: event.timeZone || "UTC",
            locationType: event.locationType,
            venueName: event.venueName || "",
            address: event.address || "",
            city: event.city || "",
            state: event.state || "",
            zipCode: event.zipCode || "",
            country: event.country || "",
            virtualEventUrl: event.virtualEventUrl || "",
            featuredImage: event.featuredImage || "",
            galleryImages: event.galleryImages || [],
            ticketTypes:
              event.ticketTypes?.map((ticket) => ({
                id: `${ticket.id}-copy-${Date.now()}`,
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity,
                description: ticket.description || "",
              })) || [],
          });
          toast({
            title: "Event Duplicated",
            description:
              "Event data has been loaded for duplication. Please update the dates and other details as needed.",
          });
        })
        .catch((error) => {
          console.error("Error loading event for duplication:", error);
          toast({
            title: "Error",
            description: "Failed to load event for duplication.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoadingDuplicate(false);
        });
    }
  }, [duplicateId, updateEventData, toast]);

  const steps = [
    { id: "basics", title: "Basic Details", component: EventBasicDetails },
    { id: "datetime", title: "Date & Time", component: EventDateTime },
    { id: "location", title: "Location", component: EventLocation },
    { id: "tickets", title: "Tickets", component: EventTickets },
    { id: "media", title: "Media", component: EventMedia },
    { id: "preview", title: "Preview", component: EventPreview },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!isValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the event using the API
      const newEvent = await createEvent({
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        startDate: new Date(eventData.startDate!).toISOString(),
        endDate: new Date(eventData.endDate!).toISOString(),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        timeZone: eventData.timeZone,
        locationType: eventData.locationType,
        venueName: eventData.venueName,
        address: eventData.address,
        city: eventData.city,
        state: eventData.state,
        zipCode: eventData.zipCode,
        country: eventData.country,
        virtualEventUrl: eventData.virtualEventUrl,
        featuredImage: eventData.featuredImage,
        galleryImages: eventData.galleryImages,
        visibility: "public", // Default to public
        capacity: eventData.ticketTypes.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        ),
        ticketTypes: eventData.ticketTypes.map((ticket) => ({
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quantity: ticket.quantity,
          isHidden: false,
          isFree: ticket.price === 0,
          requiresApproval: false,
          sortOrder: 0,
        })),
      });

      toast({
        title: "Success",
        description: `${eventData.title} has been created successfully.`,
      });

      // Reset form and navigate to the new event
      resetEventData();
      router.push(`/events/${newEvent.id}`);
    } catch (error: any) {
      console.error("Error creating event:", error);

      // Log detailed error information for debugging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }

      // Log the payload that was sent
      console.error("Event payload that was sent:", {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        timeZone: eventData.timeZone,
        locationType: eventData.locationType,
        venueName: eventData.venueName,
        address: eventData.address,
        city: eventData.city,
        state: eventData.state,
        zipCode: eventData.zipCode,
        country: eventData.country,
        virtualEventUrl: eventData.virtualEventUrl,
        featuredImage: eventData.featuredImage,
        galleryImages: eventData.galleryImages,
        visibility: "public",
        capacity: eventData.ticketTypes.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        ),
        ticketTypes: eventData.ticketTypes.map((ticket) => ({
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quantity: ticket.quantity,
          isHidden: false,
          isFree: ticket.price === 0,
          requiresApproval: false,
          sortOrder: 0,
        })),
      });

      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel? All your progress will be lost.",
      )
    ) {
      resetEventData();
      router.navigate({ to: "/admin/events" });
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Show loading state when loading duplicate data
  if (isLoadingDuplicate) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading event data for duplication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.navigate({ to: "/admin/" })}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {duplicateId ? "Duplicate Event" : "Create New Event"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="gap-1 rounded-full"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!isValid() || isSubmitting}
              className="gap-1 rounded-full"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Save Event"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="container mx-auto mt-6 px-4">
        <div className="relative mb-8">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
          <div className="relative z-10 flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.button
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    index <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background"
                  }`}
                  onClick={() => {
                    // Only allow navigating to completed steps or the current step + 1
                    if (index <= currentStep + 1) {
                      setCurrentStep(index);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={index > currentStep + 1}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                  {index < currentStep && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-sm font-medium text-primary-foreground">
                        ✓
                      </span>
                    </motion.div>
                  )}
                </motion.button>
                <span
                  className={`mt-2 text-xs ${index <= currentStep ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto flex-1 px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mx-auto mt-8 flex max-w-3xl justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-1 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="default"
              onClick={handleNext}
              className="gap-1 rounded-full"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!isValid() || isSubmitting}
              className="gap-1 rounded-full"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Save Event"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
