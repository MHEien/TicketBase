import { useState, useEffect, useCallback } from "react";
import {
  fetchEvents,
  fetchEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
  type Event,
  type CreateEventDto,
  type UpdateEventDto,
  type EventsQueryParams,
} from "@/src/lib/api/events-api";
import { useToast } from "@/hooks/use-toast";

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createEventMutation: (data: CreateEventDto) => Promise<Event | null>;
  updateEventMutation: (
    id: string,
    data: UpdateEventDto,
  ) => Promise<Event | null>;
  deleteEventMutation: (id: string) => Promise<boolean>;
  publishEventMutation: (id: string) => Promise<Event | null>;
  cancelEventMutation: (id: string) => Promise<Event | null>;
}

export function useEvents(params?: EventsQueryParams): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEventsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents(params);
      setEvents(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  const createEventMutation = useCallback(
    async (data: CreateEventDto): Promise<Event | null> => {
      try {
        const newEvent = await createEvent(data);
        setEvents((prev) => [newEvent, ...prev]);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        return newEvent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  const updateEventMutation = useCallback(
    async (id: string, data: UpdateEventDto): Promise<Event | null> => {
      try {
        const updatedEvent = await updateEvent(id, data);
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? updatedEvent : event)),
        );
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        return updatedEvent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  const deleteEventMutation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteEvent(id);
        setEvents((prev) => prev.filter((event) => event.id !== id));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    },
    [toast],
  );

  const publishEventMutation = useCallback(
    async (id: string): Promise<Event | null> => {
      try {
        const publishedEvent = await publishEvent(id);
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? publishedEvent : event)),
        );
        toast({
          title: "Success",
          description: "Event published successfully",
        });
        return publishedEvent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to publish event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  const cancelEventMutation = useCallback(
    async (id: string): Promise<Event | null> => {
      try {
        const cancelledEvent = await cancelEvent(id);
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? cancelledEvent : event)),
        );
        toast({
          title: "Success",
          description: "Event cancelled successfully",
        });
        return cancelledEvent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to cancel event";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
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
    cancelEventMutation,
  };
}

interface UseEventReturn {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEvent(id: string): UseEventReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEventData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvent(id);
      setEvent(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch event";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  return {
    event,
    loading,
    error,
    refetch: fetchEventData,
  };
}
