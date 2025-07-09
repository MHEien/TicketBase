import {
  j as jsxRuntimeExports,
  e as cn,
  a as useRouter,
  r as reactExports,
  B as Button,
  I as Input,
  S as Select,
  K as SelectTrigger,
  L as SelectValue,
  a4 as ChevronDown,
  b as Badge,
  T as Card,
  _ as CardContent,
  a1 as CardTitle,
  a2 as CardDescription,
  M as SelectContent,
  N as SelectItem,
} from "./main-D54NVj6U.js";
import {
  T as Tabs,
  a as TabsList,
  b as TabsTrigger,
  c as TabsContent,
} from "./tabs-DWHFZA6o.js";
import {
  D as DropdownMenu,
  a as DropdownMenuTrigger,
  b as DropdownMenuContent,
  e as DropdownMenuItem,
  d as DropdownMenuSeparator,
} from "./dropdown-menu-Cc3wlmA0.js";
import { u as useEvents } from "./use-events-Dhmburl0.js";
import { P as Plus } from "./plus-CY3SNhnW.js";
import { S as Search } from "./search-BS6yzFHd.js";
import { F as Filter } from "./filter-CxrQxdgK.js";
import { C as Clock } from "./clock-BDerWfP-.js";
import { C as Calendar } from "./calendar-Dh5IQ9Oq.js";
import { S as SquarePen } from "./square-pen-BFsfaAPy.js";
import { E as Ellipsis } from "./ellipsis-pC1tMovR.js";
import { T as Trash2 } from "./trash-2-N6yWrD4G.js";
import { G as Globe, M as MapPin } from "./map-pin-CvWvnJZB.js";
import { f as format } from "./format-DdtoHLaj.js";
import "./index-DACOVT_t.js";
import "./chevron-right-VQ7fFc8Y.js";
import "./events-api-CXruRnoF.js";
import "./use-toast-nfgjIcjL.js";

function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: cn("animate-pulse rounded-md bg-muted", className),
    ...props,
  });
}
function EventCardSkeleton({ view = "grid" }) {
  if (view === "list") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "rounded-lg border p-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
            className: "h-16 w-24 rounded-md",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex-1 space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-4 w-3/4",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-3 w-1/2",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-3 w-16",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-3 w-20",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
            className: "h-8 w-8 rounded-full",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "rounded-lg border",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
        className: "aspect-video w-full rounded-t-lg",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "p-4 space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-5 w-16 rounded-full",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-5 w-20 rounded-full",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
            className: "h-6 w-full",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-3 w-3/4",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                className: "h-3 w-1/2",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "border-t pt-3",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                  className: "h-3 w-16",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {
                  className: "h-3 w-20",
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function EventsLoading({ view = "grid", count = 8 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className:
      view === "grid"
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "space-y-4",
    children: Array.from({ length: count }).map((_, i) =>
      /* @__PURE__ */ jsxRuntimeExports.jsx(EventCardSkeleton, { view }, i),
    ),
  });
}

const SplitComponent = function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterCategory, setFilterCategory] = reactExports.useState(null);
  const [sortBy, setSortBy] = reactExports.useState("date");
  const [view, setView] = reactExports.useState("grid");
  const {
    events,
    loading,
    error,
    deleteEventMutation,
    publishEventMutation,
    cancelEventMutation,
  } = useEvents();
  const filteredAndSortedEvents = reactExports.useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !filterCategory || event.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
        const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
        return bDate - aDate;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "sales") {
        return b.totalRevenue - a.totalRevenue;
      }
      return 0;
    });
  }, [events, searchQuery, filterCategory, sortBy]);
  const publishedEvents = filteredAndSortedEvents.filter(
    (event) => event.status === "published",
  );
  const draftEvents = filteredAndSortedEvents.filter(
    (event) => event.status === "draft",
  );
  const pastEvents = filteredAndSortedEvents.filter(
    (event) =>
      event.status === "completed" ||
      (event.status === "published" &&
        event.endDate &&
        new Date(event.endDate) < /* @__PURE__ */ new Date()),
  );
  const handleCreateEvent = () => {
    router.navigate({
      to: "/admin/events/new",
    });
  };
  const handleEditEvent = (eventId) => {
    router.push(`/events/${eventId}/edit`);
  };
  const handleDeleteEvent = async (eventId) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      await deleteEventMutation(eventId);
    }
  };
  const handleDuplicateEvent = (eventId) => {
    router.push(`/events/new?duplicate=${eventId}`);
  };
  const handleViewEvent = (eventId) => {
    router.push(`/events/${eventId}`);
  };
  const handlePublishEvent = async (eventId) => {
    await publishEventMutation(eventId);
  };
  const handleCancelEvent = async (eventId) => {
    if (confirm("Are you sure you want to cancel this event?")) {
      await cancelEventMutation(eventId);
    }
  };
  const handleSearchChange = reactExports.useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);
  const renderEventCard = (event) => {
    const isPast = event.endDate
      ? new Date(event.endDate) < /* @__PURE__ */ new Date()
      : false;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: `group transition-all duration-300 hover:shadow-md ${event.status === "draft" ? "border-dashed" : ""} ${isPast ? "opacity-70" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "relative overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "aspect-video w-full overflow-hidden bg-muted",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                  src: event.featuredImage || "/placeholder.svg",
                  alt: event.title,
                  className:
                    "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                }),
              }),
              event.status === "draft" &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                  variant: "outline",
                  className: "absolute left-3 top-3 bg-background",
                  children: "Draft",
                }),
              isPast &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                  variant: "outline",
                  className: "absolute left-3 top-3 bg-background",
                  children: "Past",
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, {
                    asChild: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                      variant: "ghost",
                      size: "icon",
                      className:
                        "absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Ellipsis,
                        { className: "h-4 w-4" },
                      ),
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, {
                    align: "end",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, {
                        onClick: () => handleViewEvent(event.id),
                        children: "View Details",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
                        onClick: () => handleEditEvent(event.id),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, {
                            className: "mr-2 h-4 w-4",
                          }),
                          "Edit Event",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, {
                        onClick: () => handleDuplicateEvent(event.id),
                        children: "Duplicate",
                      }),
                      event.status === "draft" &&
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          DropdownMenuItem,
                          {
                            onClick: () => handlePublishEvent(event.id),
                            children: "Publish",
                          },
                        ),
                      event.status === "published" &&
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          DropdownMenuItem,
                          {
                            onClick: () => handleCancelEvent(event.id),
                            children: "Cancel Event",
                          },
                        ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        DropdownMenuSeparator,
                        {},
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
                        onClick: () => handleDeleteEvent(event.id),
                        className: "text-destructive focus:text-destructive",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {
                            className: "mr-2 h-4 w-4",
                          }),
                          "Delete Event",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
            className: "p-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "mb-2 flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    variant: "secondary",
                    className: "rounded-full px-2 py-0 text-xs",
                    children:
                      event.category.charAt(0).toUpperCase() +
                      event.category.slice(1),
                  }),
                  event.totalTicketsSold > 0 &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, {
                      variant: "outline",
                      className: "rounded-full px-2 py-0 text-xs",
                      children: [event.totalTicketsSold, " tickets sold"],
                    }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "line-clamp-1 text-lg font-semibold",
                children: event.title,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                        className: "h-3 w-3",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: event.startDate
                          ? format(new Date(event.startDate), "MMM d, yyyy")
                          : "Date TBD",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                        className: "h-3 w-3",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: event.startTime,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "flex items-center gap-1",
                    children:
                      event.locationType === "virtual"
                        ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            jsxRuntimeExports.Fragment,
                            {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, {
                                  className: "h-3 w-3",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  children: "Virtual",
                                }),
                              ],
                            },
                          )
                        : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            jsxRuntimeExports.Fragment,
                            {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, {
                                  className: "h-3 w-3",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                  children: [event.city, ", ", event.country],
                                }),
                              ],
                            },
                          ),
                  }),
                ],
              }),
              event.totalRevenue > 0 &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "mt-3 flex justify-between border-t pt-3 text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                      className: "text-muted-foreground",
                      children: "Revenue",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                      className: "font-medium",
                      children: ["$", event.totalRevenue.toLocaleString()],
                    }),
                  ],
                }),
            ],
          }),
        ],
      },
      event.id,
    );
  };
  const renderEventList = (event) => {
    const isPast = event.endDate
      ? new Date(event.endDate) < /* @__PURE__ */ new Date()
      : false;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: `group transition-all duration-300 hover:shadow-md ${event.status === "draft" ? "border-dashed" : ""} ${isPast ? "opacity-70" : ""}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
          className: "flex items-center gap-4 p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className:
                "relative h-16 w-24 overflow-hidden rounded-md bg-muted",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                  src: event.featuredImage || "/placeholder.svg",
                  alt: event.title,
                  className: "h-full w-full object-cover",
                }),
                event.status === "draft" &&
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    variant: "outline",
                    className:
                      "absolute left-1 top-1 bg-background/80 text-[10px]",
                    children: "Draft",
                  }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex-1 overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                  className: "line-clamp-1 font-semibold",
                  children: event.title,
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center gap-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                          className: "h-3 w-3",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          children: event.startDate
                            ? format(new Date(event.startDate), "MMM d, yyyy")
                            : "Date TBD",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "flex items-center gap-1",
                      children:
                        event.locationType === "virtual"
                          ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              jsxRuntimeExports.Fragment,
                              {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, {
                                    className: "h-3 w-3",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "span",
                                    { children: "Virtual" },
                                  ),
                                ],
                              },
                            )
                          : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              jsxRuntimeExports.Fragment,
                              {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    MapPin,
                                    { className: "h-3 w-3" },
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "span",
                                    {
                                      children: [
                                        event.city,
                                        ", ",
                                        event.country,
                                      ],
                                    },
                                  ),
                                ],
                              },
                            ),
                    }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                event.totalTicketsSold > 0 &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "text-right",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-sm font-medium",
                        children: [event.totalTicketsSold, " tickets"],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-sm text-muted-foreground",
                        children: ["$", event.totalRevenue.toLocaleString()],
                      }),
                    ],
                  }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, {
                      asChild: true,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8 rounded-full",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Ellipsis,
                          { className: "h-4 w-4" },
                        ),
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      DropdownMenuContent,
                      {
                        align: "end",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            DropdownMenuItem,
                            {
                              onClick: () => handleViewEvent(event.id),
                              children: "View Details",
                            },
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            DropdownMenuItem,
                            {
                              onClick: () => handleEditEvent(event.id),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SquarePen,
                                  { className: "mr-2 h-4 w-4" },
                                ),
                                "Edit Event",
                              ],
                            },
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            DropdownMenuItem,
                            {
                              onClick: () => handleDuplicateEvent(event.id),
                              children: "Duplicate",
                            },
                          ),
                          event.status === "draft" &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              DropdownMenuItem,
                              {
                                onClick: () => handlePublishEvent(event.id),
                                children: "Publish",
                              },
                            ),
                          event.status === "published" &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              DropdownMenuItem,
                              {
                                onClick: () => handleCancelEvent(event.id),
                                children: "Cancel Event",
                              },
                            ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            DropdownMenuSeparator,
                            {},
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            DropdownMenuItem,
                            {
                              onClick: () => handleDeleteEvent(event.id),
                              className:
                                "text-destructive focus:text-destructive",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {
                                  className: "mr-2 h-4 w-4",
                                }),
                                "Delete Event",
                              ],
                            },
                          ),
                        ],
                      },
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
      },
      event.id,
    );
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "container mx-auto py-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className:
            "mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                  className: "text-3xl font-bold",
                  children: "Events",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className: "text-muted-foreground",
                  children: "Manage your events and track ticket sales",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
              onClick: handleCreateEvent,
              className: "gap-2 rounded-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                  className: "h-4 w-4",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  children: "Create Event",
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "mb-6 flex flex-col gap-4 md:flex-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "relative flex-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                  className:
                    "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                  placeholder: "Search events...",
                  className: "pl-9",
                  disabled: true,
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Select, {
                  disabled: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    SelectTrigger,
                    {
                      className: "w-[180px] gap-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, {
                          className: "h-4 w-4",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {
                          placeholder: "All Categories",
                        }),
                      ],
                    },
                  ),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Select, {
                  disabled: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    SelectTrigger,
                    {
                      className: "w-[180px] gap-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, {
                          className: "h-4 w-4",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {
                          placeholder: "Sort by",
                        }),
                      ],
                    },
                  ),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  variant: "outline",
                  size: "icon",
                  className: "h-10 w-10",
                  disabled: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                        x: "3",
                        y: "3",
                        width: "7",
                        height: "7",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                        x: "14",
                        y: "3",
                        width: "7",
                        height: "7",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                        x: "14",
                        y: "14",
                        width: "7",
                        height: "7",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                        x: "3",
                        y: "14",
                        width: "7",
                        height: "7",
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
          defaultValue: "active",
          className: "space-y-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                  value: "active",
                  className: "relative",
                  children: [
                    "Active",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                      className: "ml-2 rounded-full px-1.5 py-0.5",
                      children: "-",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                  value: "drafts",
                  className: "relative",
                  children: [
                    "Drafts",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                      className: "ml-2 rounded-full px-1.5 py-0.5",
                      children: "-",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                  value: "past",
                  className: "relative",
                  children: [
                    "Past",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                      className: "ml-2 rounded-full px-1.5 py-0.5",
                      children: "-",
                    }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
              value: "active",
              className: "space-y-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventsLoading, {
                view,
                count: 6,
              }),
            }),
          ],
        }),
      ],
    });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "container mx-auto py-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className:
            "mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                  className: "text-3xl font-bold",
                  children: "Events",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className: "text-muted-foreground",
                  children: "Manage your events and track ticket sales",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
              onClick: handleCreateEvent,
              className: "gap-2 rounded-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                  className: "h-4 w-4",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  children: "Create Event",
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
            className:
              "flex flex-col items-center justify-center py-12 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "mb-4 rounded-full bg-destructive/10 p-3",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                  className: "h-6 w-6 text-destructive",
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                className: "mb-2",
                children: "Error loading events",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
                className: "mb-4 max-w-md",
                children: error,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                onClick: () => window.location.reload(),
                children: "Try Again",
              }),
            ],
          }),
        }),
      ],
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "container mx-auto py-8",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-3xl font-bold",
                children: "Events",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground",
                children: "Manage your events and track ticket sales",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
            onClick: handleCreateEvent,
            className: "gap-2 rounded-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                className: "h-4 w-4",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                children: "Create Event",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "mb-6 flex flex-col gap-4 md:flex-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "relative flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                className:
                  "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                placeholder: "Search events...",
                className: "pl-9",
                value: searchQuery,
                onChange: handleSearchChange,
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                value: filterCategory || "all",
                onValueChange: (value) =>
                  setFilterCategory(value === "all" ? null : value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, {
                    className: "w-[180px] gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {
                        placeholder: "All Categories",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "all",
                        children: "All Categories",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "conference",
                        children: "Conference",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "concert",
                        children: "Concert",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "exhibition",
                        children: "Exhibition",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "fundraiser",
                        children: "Fundraiser",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "sports",
                        children: "Sports",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                value: sortBy || "date",
                onValueChange: (value) => setSortBy(value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, {
                    className: "w-[180px] gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {
                        placeholder: "Sort by",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "date",
                        children: "Date (newest)",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "title",
                        children: "Title (A-Z)",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                        value: "sales",
                        children: "Sales (highest)",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                variant: "outline",
                size: "icon",
                onClick: () => setView(view === "grid" ? "list" : "grid"),
                className: "h-10 w-10",
                children:
                  view === "grid"
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", {
                            x1: "3",
                            y1: "6",
                            x2: "21",
                            y2: "6",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", {
                            x1: "3",
                            y1: "12",
                            x2: "21",
                            y2: "12",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", {
                            x1: "3",
                            y1: "18",
                            x2: "21",
                            y2: "18",
                          }),
                        ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                            x: "3",
                            y: "3",
                            width: "7",
                            height: "7",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                            x: "14",
                            y: "3",
                            width: "7",
                            height: "7",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                            x: "14",
                            y: "14",
                            width: "7",
                            height: "7",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
                            x: "3",
                            y: "14",
                            width: "7",
                            height: "7",
                          }),
                        ],
                      }),
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
        defaultValue: "active",
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                value: "active",
                className: "relative",
                children: [
                  "Active",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    className: "ml-2 rounded-full px-1.5 py-0.5",
                    children: publishedEvents.length,
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                value: "drafts",
                className: "relative",
                children: [
                  "Drafts",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    className: "ml-2 rounded-full px-1.5 py-0.5",
                    children: draftEvents.length,
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                value: "past",
                className: "relative",
                children: [
                  "Past",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    className: "ml-2 rounded-full px-1.5 py-0.5",
                    children: pastEvents.length,
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: "active",
            className: "space-y-4",
            children:
              publishedEvents.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      CardContent,
                      {
                        className:
                          "flex flex-col items-center justify-center py-12 text-center",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "mb-4 rounded-full bg-primary/10 p-3",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Calendar,
                              { className: "h-6 w-6 text-primary" },
                            ),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                            className: "mb-2",
                            children: "No active events",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CardDescription,
                            {
                              className: "mb-4 max-w-md",
                              children:
                                "You don't have any active events yet. Create your first event to start selling tickets.",
                            },
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                            onClick: handleCreateEvent,
                            className: "gap-2 rounded-full",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                                className: "h-4 w-4",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Create Event",
                              }),
                            ],
                          }),
                        ],
                      },
                    ),
                  })
                : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      view === "grid"
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "space-y-4",
                    children: publishedEvents.map((event) =>
                      view === "grid"
                        ? renderEventCard(event)
                        : renderEventList(event),
                    ),
                  }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: "drafts",
            className: "space-y-4",
            children:
              draftEvents.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      CardContent,
                      {
                        className:
                          "flex flex-col items-center justify-center py-12 text-center",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "mb-4 rounded-full bg-primary/10 p-3",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SquarePen,
                              { className: "h-6 w-6 text-primary" },
                            ),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                            className: "mb-2",
                            children: "No draft events",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CardDescription,
                            {
                              className: "mb-4 max-w-md",
                              children:
                                "You don't have any draft events. Create an event and save it as a draft to work on it later.",
                            },
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                            onClick: handleCreateEvent,
                            className: "gap-2 rounded-full",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                                className: "h-4 w-4",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Create Event",
                              }),
                            ],
                          }),
                        ],
                      },
                    ),
                  })
                : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      view === "grid"
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "space-y-4",
                    children: draftEvents.map((event) =>
                      view === "grid"
                        ? renderEventCard(event)
                        : renderEventList(event),
                    ),
                  }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: "past",
            className: "space-y-4",
            children:
              pastEvents.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      CardContent,
                      {
                        className:
                          "flex flex-col items-center justify-center py-12 text-center",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "mb-4 rounded-full bg-primary/10 p-3",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Clock,
                              { className: "h-6 w-6 text-primary" },
                            ),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                            className: "mb-2",
                            children: "No past events",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CardDescription,
                            {
                              className: "mb-4 max-w-md",
                              children:
                                "You don't have any past events yet. Events that have ended will appear here.",
                            },
                          ),
                        ],
                      },
                    ),
                  })
                : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      view === "grid"
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "space-y-4",
                    children: pastEvents.map((event) =>
                      view === "grid"
                        ? renderEventCard(event)
                        : renderEventList(event),
                    ),
                  }),
          }),
        ],
      }),
    ],
  });
};

export { SplitComponent as component };
