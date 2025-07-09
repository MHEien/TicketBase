import { r as reactExports } from './main-D54NVj6U.js';
import { b as fetchEvents, c as createEvent, u as updateEvent, d as deleteEvent, p as publishEvent, a as cancelEvent, f as fetchEvent } from './events-api-CXruRnoF.js';
import { u as useToast } from './use-toast-nfgjIcjL.js';

function useEvents(params) {
  const [events, setEvents] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const { toast } = useToast();
  const fetchEventsData = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents(params);
      setEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [params, toast]);
  reactExports.useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);
  const createEventMutation = reactExports.useCallback(
    async (data) => {
      try {
        const newEvent = await createEvent(data);
        setEvents((prev) => [newEvent, ...prev]);
        toast({
          title: "Success",
          description: "Event created successfully"
        });
        return newEvent;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return null;
      }
    },
    [toast]
  );
  const updateEventMutation = reactExports.useCallback(
    async (id, data) => {
      try {
        const updatedEvent = await updateEvent(id, data);
        setEvents(
          (prev) => prev.map((event) => event.id === id ? updatedEvent : event)
        );
        toast({
          title: "Success",
          description: "Event updated successfully"
        });
        return updatedEvent;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return null;
      }
    },
    [toast]
  );
  const deleteEventMutation = reactExports.useCallback(
    async (id) => {
      try {
        await deleteEvent(id);
        setEvents((prev) => prev.filter((event) => event.id !== id));
        toast({
          title: "Success",
          description: "Event deleted successfully"
        });
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    },
    [toast]
  );
  const publishEventMutation = reactExports.useCallback(
    async (id) => {
      try {
        const publishedEvent = await publishEvent(id);
        setEvents(
          (prev) => prev.map((event) => event.id === id ? publishedEvent : event)
        );
        toast({
          title: "Success",
          description: "Event published successfully"
        });
        return publishedEvent;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to publish event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return null;
      }
    },
    [toast]
  );
  const cancelEventMutation = reactExports.useCallback(
    async (id) => {
      try {
        const cancelledEvent = await cancelEvent(id);
        setEvents(
          (prev) => prev.map((event) => event.id === id ? cancelledEvent : event)
        );
        toast({
          title: "Success",
          description: "Event cancelled successfully"
        });
        return cancelledEvent;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to cancel event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return null;
      }
    },
    [toast]
  );
  return {
    events,
    loading,
    error,
    refetch: fetchEventsData,
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
    publishEventMutation,
    cancelEventMutation
  };
}
function useEvent(id) {
  const [event, setEvent] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const { toast } = useToast();
  const fetchEventData = reactExports.useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvent(id);
      setEvent(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch event";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);
  reactExports.useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);
  return {
    event,
    loading,
    error,
    refetch: fetchEventData
  };
}

export { useEvent as a, useEvents as u };
