import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eventsApi } from "~/lib/api/events";
import { getCurrentOrganization } from "~/lib/server-organization";
import { EventFilters } from "~/lib/api/events";

export const fetchEvents = createServerFn({ method: "GET" })
  .validator((d: EventFilters) => d)
  .handler(async ({ data }) => {
    console.info("Fetching events...");
    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("No organization found");
    }
    const events = await eventsApi.getEventsByOrganization(organization.id);
    return events;
  });

export const eventsQueryOptions = ({
  category,
  search,
  location,
  limit,
  offset,
}: EventFilters) =>
  queryOptions({
    queryKey: ["events"],
    queryFn: () => fetchEvents({ data: { category, search, location, limit, offset } }),
  });

export const fetchEvent = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    console.info(`Fetching event with id ${data}...`);
    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("No organization found");
    }
    const event = await eventsApi.getPublicEvent(data, organization.id);
    return event;
  });

export const eventQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent({ data: eventId }),
  });
