import { aP as Route, a as useRouter, r as reactExports, j as jsxRuntimeExports, B as Button } from './main-D54NVj6U.js';
import { u as useEventCreation, E as EventBasicDetails, a as EventDateTime, b as EventLocation, c as EventTickets, d as EventMedia, e as EventPreview, C as ChevronLeft, S as Save } from './event-preview-D4gNGLBQ.js';
import { u as useToast } from './use-toast-nfgjIcjL.js';
import { a as useEvent } from './use-events-Dhmburl0.js';
import { u as updateEvent } from './events-api-CXruRnoF.js';
import { X } from './index-B18GAnIN.js';
import { m as motion } from './proxy-DR25Kbh7.js';
import { A as AnimatePresence } from './index-B_Zo_mO0.js';
import { C as ChevronRight } from './chevron-right-VQ7fFc8Y.js';
import './calendar-Dh5IQ9Oq.js';
import './clock-BDerWfP-.js';
import './format-DdtoHLaj.js';
import './endOfMonth-Dv1-wySt.js';
import './radio-group-N39z_63C.js';
import './map-pin-CvWvnJZB.js';
import './plus-CY3SNhnW.js';
import './trash-2-N6yWrD4G.js';
import './dollar-sign-BqSeDBj7.js';
import './upload-BX4izcAV.js';
import './tabs-DWHFZA6o.js';
import './index-DACOVT_t.js';
import './index-DQRAsB8C.js';
import './ticket-Cl-q8e77.js';
import './share-2-BKUoAFN6.js';
import './users-DGvlZmP3.js';

const SplitComponent = function EditEventPage() {
  const {
    id
  } = Route.useParams();
  const router = useRouter();
  const {
    toast
  } = useToast();
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const {
    eventData,
    isValid,
    resetEventData,
    updateEventData
  } = useEventCreation();
  const {
    event,
    loading,
    error
  } = useEvent(id);
  const steps = [{
    id: "basics",
    title: "Basic Details",
    component: EventBasicDetails
  }, {
    id: "datetime",
    title: "Date & Time",
    component: EventDateTime
  }, {
    id: "location",
    title: "Location",
    component: EventLocation
  }, {
    id: "tickets",
    title: "Tickets",
    component: EventTickets
  }, {
    id: "media",
    title: "Media",
    component: EventMedia
  }, {
    id: "preview",
    title: "Preview",
    component: EventPreview
  }];
  reactExports.useEffect(() => {
    if (event && !loading) {
      updateEventData({
        title: event.title,
        description: event.description,
        category: event.category,
        startDate: event.startDate ? new Date(event.startDate) : null,
        endDate: event.endDate ? new Date(event.endDate) : null,
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
        ticketTypes: event.ticketTypes?.map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          quantity: ticket.quantity,
          description: ticket.description || ""
        })) || []
      });
    }
  }, [event, loading, updateEventData]);
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
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateEvent(id, {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        startDate: new Date(eventData.startDate).toISOString(),
        endDate: new Date(eventData.endDate).toISOString(),
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
        capacity: eventData.ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0),
        ticketTypes: eventData.ticketTypes.map((ticket) => ({
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quantity: ticket.quantity,
          isHidden: false,
          isFree: ticket.price === 0,
          requiresApproval: false,
          sortOrder: 0
        }))
      });
      toast({
        title: "Success",
        description: `${eventData.title} has been updated successfully.`
      });
      router.push(`/events/${id}`);
    } catch (error2) {
      console.error("Error updating event:", error2);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All your changes will be lost.")) {
      router.push(`/events/${id}`);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading event data..." })
    ] }) });
  }
  if (error || !event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-destructive", children: "Error loading event data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => router.navigate({
        to: "/admin/events"
      }), children: "Back to Events" })
    ] }) });
  }
  const CurrentStepComponent = steps[currentStep].component;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-gradient-to-br from-background to-background/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container flex h-16 items-center justify-between px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => router.push(`/events/${id}`), className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Edit Event" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleCancel, className: "gap-1 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cancel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", size: "sm", onClick: handleSave, disabled: !isValid() || isSubmitting, className: "gap-1 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isSubmitting ? "Saving..." : "Save Changes" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto mt-6 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 flex justify-between", children: steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { className: `relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${index <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background"}`, onClick: () => {
          if (index <= currentStep + 1) {
            setCurrentStep(index);
          }
        }, whileHover: {
          scale: 1.05
        }, whileTap: {
          scale: 0.95
        }, disabled: index > currentStep + 1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: index + 1 }),
          index < currentStep && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 flex items-center justify-center rounded-full bg-primary", initial: {
            scale: 0
          }, animate: {
            scale: 1
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary-foreground", children: "✓" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-2 text-xs ${index <= currentStep ? "font-medium text-foreground" : "text-muted-foreground"}`, children: step.title })
      ] }, step.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex-1 px-4 pb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        x: 20
      }, animate: {
        opacity: 1,
        x: 0
      }, exit: {
        opacity: 0,
        x: -20
      }, transition: {
        duration: 0.3
      }, className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrentStepComponent, {}) }, currentStep) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-8 flex max-w-3xl justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handlePrevious, disabled: currentStep === 0, className: "gap-1 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Previous" })
        ] }),
        currentStep < steps.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", onClick: handleNext, className: "gap-1 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Next" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", onClick: handleSave, disabled: !isValid() || isSubmitting, className: "gap-1 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isSubmitting ? "Saving..." : "Save Changes" })
        ] })
      ] })
    ] })
  ] });
};

export { SplitComponent as component };
