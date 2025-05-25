"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TicketType = {
  id: string
  name: string
  price: number
  quantity: number
  description: string
}

export type EventData = {
  title: string
  description: string
  category: string
  startDate: Date | null
  endDate: Date | null
  startTime: string
  endTime: string
  timeZone: string
  locationType: "physical" | "virtual" | "hybrid"
  venueName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  virtualEventUrl: string
  ticketTypes: TicketType[]
  featuredImage: string
  galleryImages: string[]
  isPublished: boolean
}

interface EventCreationState {
  eventData: EventData
  updateEventData: (data: Partial<EventData>) => void
  updateTicketType: (id: string, data: Partial<TicketType>) => void
  addTicketType: () => void
  removeTicketType: (id: string) => void
  resetEventData: () => void
  isValid: () => boolean
}

const initialEventData: EventData = {
  title: "",
  description: "",
  category: "",
  startDate: null,
  endDate: null,
  startTime: "",
  endTime: "",
  timeZone: "America/New_York",
  locationType: "physical",
  venueName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  virtualEventUrl: "",
  ticketTypes: [
    {
      id: "default",
      name: "General Admission",
      price: 0,
      quantity: 100,
      description: "",
    },
  ],
  featuredImage: "",
  galleryImages: [],
  isPublished: false,
}

export const useEventCreation = create<EventCreationState>()(
  persist(
    (set, get) => ({
      eventData: { ...initialEventData },

      updateEventData: (data) => {
        set((state) => ({
          eventData: {
            ...state.eventData,
            ...data,
          },
        }))
      },

      updateTicketType: (id, data) => {
        set((state) => ({
          eventData: {
            ...state.eventData,
            ticketTypes: state.eventData.ticketTypes.map((ticket) =>
              ticket.id === id ? { ...ticket, ...data } : ticket,
            ),
          },
        }))
      },

      addTicketType: () => {
        set((state) => ({
          eventData: {
            ...state.eventData,
            ticketTypes: [
              ...state.eventData.ticketTypes,
              {
                id: `ticket-${Date.now()}`,
                name: "",
                price: 0,
                quantity: 100,
                description: "",
              },
            ],
          },
        }))
      },

      removeTicketType: (id) => {
        set((state) => ({
          eventData: {
            ...state.eventData,
            ticketTypes: state.eventData.ticketTypes.filter((ticket) => ticket.id !== id),
          },
        }))
      },

      resetEventData: () => {
        set({ eventData: { ...initialEventData } })
      },

      isValid: () => {
        const { eventData } = get()

        // Basic validation
        if (!eventData.title || !eventData.description || !eventData.category) {
          return false
        }

        // Date validation
        if (!eventData.startDate || !eventData.endDate || !eventData.startTime || !eventData.endTime) {
          return false
        }

        // Location validation
        if (eventData.locationType === "physical" || eventData.locationType === "hybrid") {
          if (!eventData.venueName || !eventData.address || !eventData.city || !eventData.country) {
            return false
          }
        }

        if (eventData.locationType === "virtual" || eventData.locationType === "hybrid") {
          if (!eventData.virtualEventUrl) {
            return false
          }
        }

        // Ticket validation
        if (eventData.ticketTypes.length === 0) {
          return false
        }

        for (const ticket of eventData.ticketTypes) {
          if (!ticket.name || ticket.quantity <= 0) {
            return false
          }
        }

        // Media validation - Make this optional for now
        // if (!eventData.featuredImage) {
        //   return false
        // }

        return true
      },
    }),
    {
      name: "event-creation-storage",
    },
  ),
)
