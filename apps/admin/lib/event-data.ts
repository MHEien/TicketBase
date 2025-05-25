import type { EventData } from "@/hooks/use-event-creation";

export type EventWithId = EventData & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published" | "cancelled" | "completed";
  totalTicketsSold: number;
  totalRevenue: number;
};

// Sample events data
export const sampleEvents: EventWithId[] = [
  {
    id: "evt-001",
    title: "Summer Music Festival",
    description:
      "A three-day music festival featuring top artists from around the world.",
    category: "concert",
    startDate: new Date("2025-07-15T14:00:00"),
    endDate: new Date("2025-07-17T23:00:00"),
    startTime: "14:00",
    endTime: "23:00",
    timeZone: "America/New_York",
    locationType: "physical",
    venueName: "Central Park",
    address: "5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10022",
    country: "United States",
    virtualEventUrl: "",
    ticketTypes: [
      {
        id: "ticket-001",
        name: "General Admission",
        price: 149.99,
        quantity: 5000,
        description: "Access to all festival areas except VIP zones",
      },
      {
        id: "ticket-002",
        name: "VIP Pass",
        price: 299.99,
        quantity: 500,
        description: "Access to all areas including VIP lounges and backstage",
      },
    ],
    featuredImage: "/vibrant-music-festival.png",
    galleryImages: ["/vibrant-music-festival.png"],
    isPublished: true,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-20"),
    status: "published",
    totalTicketsSold: 2345,
    totalRevenue: 425000,
  },
  {
    id: "evt-002",
    title: "Tech Conference 2025",
    description:
      "The premier tech conference for developers and entrepreneurs.",
    category: "conference",
    startDate: new Date("2025-09-10T09:00:00"),
    endDate: new Date("2025-09-12T17:00:00"),
    startTime: "09:00",
    endTime: "17:00",
    timeZone: "America/Los_Angeles",
    locationType: "hybrid",
    venueName: "Convention Center",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "United States",
    virtualEventUrl: "https://techconf2025.example.com",
    ticketTypes: [
      {
        id: "ticket-003",
        name: "Standard Pass",
        price: 499.99,
        quantity: 2000,
        description: "Access to all talks and workshops",
      },
      {
        id: "ticket-004",
        name: "Virtual Pass",
        price: 199.99,
        quantity: 5000,
        description: "Online access to all talks and workshops",
      },
    ],
    featuredImage: "/conference-event.png",
    galleryImages: ["/conference-event.png"],
    isPublished: true,
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-15"),
    status: "published",
    totalTicketsSold: 1250,
    totalRevenue: 312500,
  },
  {
    id: "evt-003",
    title: "Art Exhibition",
    description: "Featuring works from contemporary artists around the world.",
    category: "exhibition",
    startDate: new Date("2025-05-05T10:00:00"),
    endDate: new Date("2025-06-05T18:00:00"),
    startTime: "10:00",
    endTime: "18:00",
    timeZone: "Europe/London",
    locationType: "physical",
    venueName: "Modern Art Gallery",
    address: "45 Gallery Lane",
    city: "London",
    state: "",
    zipCode: "SW1A 1AA",
    country: "United Kingdom",
    virtualEventUrl: "",
    ticketTypes: [
      {
        id: "ticket-005",
        name: "Adult",
        price: 25,
        quantity: 10000,
        description: "Standard adult admission",
      },
      {
        id: "ticket-006",
        name: "Student/Senior",
        price: 15,
        quantity: 5000,
        description: "Discounted admission for students and seniors",
      },
    ],
    featuredImage: "/art-exhibition.png",
    galleryImages: ["/art-exhibition.png"],
    isPublished: true,
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-10"),
    status: "published",
    totalTicketsSold: 3500,
    totalRevenue: 78750,
  },
  {
    id: "evt-004",
    title: "Charity Gala Dinner",
    description: "Annual fundraising dinner for environmental conservation.",
    category: "fundraiser",
    startDate: new Date("2025-11-15T18:30:00"),
    endDate: new Date("2025-11-15T23:00:00"),
    startTime: "18:30",
    endTime: "23:00",
    timeZone: "America/New_York",
    locationType: "physical",
    venueName: "Grand Hotel Ballroom",
    address: "500 Luxury Ave",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "United States",
    virtualEventUrl: "",
    ticketTypes: [
      {
        id: "ticket-007",
        name: "Individual Seat",
        price: 250,
        quantity: 300,
        description: "Single seat at the gala dinner",
      },
      {
        id: "ticket-008",
        name: "Table of 10",
        price: 2250,
        quantity: 20,
        description: "Reserved table for 10 guests with premium placement",
      },
    ],
    featuredImage: "/elegant-gala-dinner.png",
    galleryImages: ["/elegant-gala-dinner.png"],
    isPublished: false,
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-03-20"),
    status: "draft",
    totalTicketsSold: 0,
    totalRevenue: 0,
  },
  {
    id: "evt-005",
    title: "Marathon 2025",
    description:
      "Annual city marathon with 5K, 10K, half and full marathon options.",
    category: "sports",
    startDate: new Date("2025-04-20T07:00:00"),
    endDate: new Date("2025-04-20T15:00:00"),
    startTime: "07:00",
    endTime: "15:00",
    timeZone: "America/Chicago",
    locationType: "physical",
    venueName: "City Center",
    address: "Downtown",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "United States",
    virtualEventUrl: "",
    ticketTypes: [
      {
        id: "ticket-009",
        name: "5K Run",
        price: 35,
        quantity: 2000,
        description: "Entry to the 5K race",
      },
      {
        id: "ticket-010",
        name: "Half Marathon",
        price: 75,
        quantity: 1500,
        description: "Entry to the half marathon",
      },
      {
        id: "ticket-011",
        name: "Full Marathon",
        price: 120,
        quantity: 1000,
        description: "Entry to the full marathon",
      },
    ],
    featuredImage: "/vibrant-sports-event.png",
    galleryImages: ["/vibrant-sports-event.png"],
    isPublished: true,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2025-01-05"),
    status: "published",
    totalTicketsSold: 2800,
    totalRevenue: 189000,
  },
];

// Function to get all events
export function getAllEvents(): EventWithId[] {
  return sampleEvents;
}

// Function to get an event by ID
export function getEventById(id: string): EventWithId | undefined {
  return sampleEvents.find((event) => event.id === id);
}

// Function to get events by status
export function getEventsByStatus(
  status: EventWithId["status"],
): EventWithId[] {
  return sampleEvents.filter((event) => event.status === status);
}
