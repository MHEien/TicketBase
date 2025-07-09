import { a0 as apiClient } from "./main-D54NVj6U.js";

async function fetchEvents(params) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status);
    if (params?.category);
    if (params?.search);
    if (params?.startDate);
    if (params?.endDate);
    const url = `/api/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiClient.get(url);
    return response.data.map((event) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate
        ? new Date(event.salesStartDate)
        : void 0,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : void 0,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
async function fetchEvent(id) {
  try {
    const response = await apiClient.get(`/api/events/${id}`);
    const event = response.data;
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate
        ? new Date(event.salesStartDate)
        : void 0,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : void 0,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}
async function createEvent(eventData) {
  try {
    const response = await apiClient.post("/api/events", eventData);
    const event = response.data;
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate
        ? new Date(event.salesStartDate)
        : void 0,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : void 0,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}
async function updateEvent(id, eventData) {
  try {
    const response = await apiClient.patch(`/api/events/${id}`, eventData);
    const event = response.data;
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate
        ? new Date(event.salesStartDate)
        : void 0,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : void 0,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}
async function deleteEvent(id) {
  try {
    await apiClient.delete(`/api/events/${id}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}
async function publishEvent(id) {
  try {
    const response = await apiClient.post(`/api/events/${id}/publish`);
    const event = response.data;
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate
        ? new Date(event.salesStartDate)
        : void 0,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : void 0,
    };
  } catch (error) {
    console.error("Error publishing event:", error);
    throw error;
  }
}
async function cancelEvent(id) {
  try {
    const response = await apiClient.post(`/api/events/${id}/cancel`);
    const event = response.data;
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      salesStartDate: event.salesStartDate
        ? new Date(event.salesStartDate)
        : void 0,
      salesEndDate: event.salesEndDate ? new Date(event.salesEndDate) : void 0,
    };
  } catch (error) {
    console.error("Error cancelling event:", error);
    throw error;
  }
}

export {
  cancelEvent as a,
  fetchEvents as b,
  createEvent as c,
  deleteEvent as d,
  fetchEvent as f,
  publishEvent as p,
  updateEvent as u,
};
