import {
  c as createLucideIcon,
  r as reactExports,
  j as jsxRuntimeExports,
  au as LoaderCircle,
  aF as Route,
  a as useRouter,
  B as Button,
  b as Badge,
  a4 as ChevronDown,
  T as Card,
  _ as CardContent,
  $ as CardHeader,
  a1 as CardTitle,
  a2 as CardDescription,
  a3 as CardFooter,
} from "./main-D54NVj6U.js";
import {
  D as DropdownMenu,
  a as DropdownMenuTrigger,
  b as DropdownMenuContent,
  e as DropdownMenuItem,
  d as DropdownMenuSeparator,
} from "./dropdown-menu-Cc3wlmA0.js";
import { P as Progress } from "./progress-CdUsEqSy.js";
import {
  T as Tabs,
  a as TabsList,
  b as TabsTrigger,
  c as TabsContent,
} from "./tabs-DWHFZA6o.js";
import { a as useEvent } from "./use-events-Dhmburl0.js";
import { u as useToast } from "./use-toast-nfgjIcjL.js";
import {
  p as pluginLoader,
  a as pluginManager,
} from "./plugin-loader-Y88a9AGU.js";
import {
  p as publishEvent,
  a as cancelEvent,
  d as deleteEvent,
} from "./events-api-CXruRnoF.js";
import { S as SquarePen } from "./square-pen-BFsfaAPy.js";
import { S as Share2 } from "./share-2-BKUoAFN6.js";
import { D as Download } from "./download-Od2Zt_ki.js";
import { T as Trash2 } from "./trash-2-N6yWrD4G.js";
import { C as Calendar } from "./calendar-Dh5IQ9Oq.js";
import { C as Clock } from "./clock-BDerWfP-.js";
import { G as Globe, M as MapPin } from "./map-pin-CvWvnJZB.js";
import { U as Users } from "./users-DGvlZmP3.js";
import { f as format } from "./format-DdtoHLaj.js";
import "./index-DACOVT_t.js";
import "./chevron-right-VQ7fFc8Y.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ChartNoAxesColumnIncreasing = createLucideIcon(
  "ChartNoAxesColumnIncreasing",
  [
    ["line", { x1: "12", x2: "12", y1: "20", y2: "10", key: "1vz5eb" }],
    ["line", { x1: "18", x2: "18", y1: "20", y2: "4", key: "cun8e5" }],
    ["line", { x1: "6", x2: "6", y1: "20", y2: "16", key: "hq0ia6" }],
  ],
);

function PluginWidgetArea({ areaName, eventData, className = "" }) {
  const [widgets, setWidgets] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadWidgets() {
      try {
        setLoading(true);
        await pluginLoader.loadInstalledPlugins();
        const relevantPlugins =
          pluginManager.getPluginsForExtensionPoint(areaName);
        const loadedWidgets = [];
        for (const plugin of relevantPlugins) {
          if (!plugin.isLoaded) continue;
          const Component = plugin.extensionPoints[areaName];
          if (Component) {
            loadedWidgets.push({
              pluginId: plugin.metadata.id,
              component: Component,
              config: {},
            });
          }
        }
        if (isMounted) {
          setWidgets(loadedWidgets);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          console.error(`Failed to load widgets for area ${areaName}:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadWidgets();
    return () => {
      isMounted = false;
    };
  }, [areaName]);
  if (!loading && widgets.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: `plugin-widget-area ${className}`,
    "data-area-name": areaName,
    children: loading
      ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex items-center justify-center py-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, {
            className: "h-5 w-5 animate-spin text-muted-foreground",
          }),
        })
      : widgets.map(({ pluginId, component: Widget, config }, index) =>
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "plugin-widget mb-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Widget, {
                config,
                eventData,
              }),
            },
            `${pluginId}-${index}`,
          ),
        ),
  });
}

const SplitComponent = function EventDetailsPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { event, loading, error, refetch } = useEvent(id);
  const handleEditEvent = () => {
    router.push(`/events/${id}/edit`);
  };
  const handleDeleteEvent = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteEvent(id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      router.navigate({
        to: "/admin/events",
      });
    } catch (error2) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };
  const handleDuplicateEvent = () => {
    router.push(`/events/new?duplicate=${id}`);
  };
  const handlePublishEvent = async () => {
    try {
      await publishEvent(id);
      toast({
        title: "Success",
        description: "Event published successfully",
      });
      refetch();
    } catch (error2) {
      toast({
        title: "Error",
        description: "Failed to publish event",
        variant: "destructive",
      });
    }
  };
  const handleCancelEvent = async () => {
    if (!confirm("Are you sure you want to cancel this event?")) {
      return;
    }
    try {
      await cancelEvent(id);
      toast({
        title: "Success",
        description: "Event cancelled successfully",
      });
      refetch();
    } catch (error2) {
      toast({
        title: "Error",
        description: "Failed to cancel event",
        variant: "destructive",
      });
    }
  };
  const handleShareEvent = () => {
    const eventUrl = `${window.location.origin}/events/${id}`;
    navigator.clipboard
      .writeText(eventUrl)
      .then(() => {
        toast({
          title: "Success",
          description: "Event URL copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy URL to clipboard",
          variant: "destructive",
        });
      });
  };
  const handleExportAttendees = () => {
    toast({
      title: "Coming Soon",
      description: "Attendee export functionality will be available soon",
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "p-8 text-center",
      children: "Loading event details...",
    });
  }
  if (error || !event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "p-8 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "text-destructive",
          children: "Error loading event details",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
          onClick: () =>
            router.navigate({
              to: "/admin/events",
            }),
          className: "mt-4",
          children: "Back to Events",
        }),
      ],
    });
  }
  const totalTickets = event.ticketTypes.reduce(
    (sum, ticket) => sum + Number(ticket.quantity),
    0,
  );
  const ticketsSoldPercentage =
    Math.round((Number(event.totalTicketsSold) / totalTickets) * 100) || 0;
  const isPast = event.endDate
    ? new Date(event.endDate) < /* @__PURE__ */ new Date()
    : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "container mx-auto p-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
        variant: "outline",
        className: "mb-6",
        onClick: () =>
          router.navigate({
            to: "/admin/events",
          }),
        children: "← Back to Events",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-3xl font-bold",
                children: event.title,
              }),
              event.status === "draft" &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                  variant: "outline",
                  children: "Draft",
                }),
              isPast &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                  variant: "outline",
                  children: "Past",
                }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex gap-2",
            children: [
              event.status === "draft" &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  onClick: handlePublishEvent,
                  className: "gap-2",
                  children: "Publish Event",
                }),
              event.status === "published" &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  onClick: handleCancelEvent,
                  variant: "destructive",
                  className: "gap-2",
                  children: "Cancel Event",
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, {
                    asChild: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                      variant: "outline",
                      className: "gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          children: "Actions",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, {
                          className: "h-4 w-4",
                        }),
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, {
                    align: "end",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
                        onClick: handleEditEvent,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, {
                            className: "mr-2 h-4 w-4",
                          }),
                          "Edit Event",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, {
                        onClick: handleDuplicateEvent,
                        children: "Duplicate",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
                        onClick: handleShareEvent,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, {
                            className: "mr-2 h-4 w-4",
                          }),
                          "Share",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
                        onClick: handleExportAttendees,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                            className: "mr-2 h-4 w-4",
                          }),
                          "Export Attendees",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        DropdownMenuSeparator,
                        {},
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, {
                        onClick: handleDeleteEvent,
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
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "mb-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
          fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "h-20 animate-pulse rounded-lg bg-muted",
          }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PluginWidgetArea, {
            areaName: "event-detail-header",
            eventData: event,
          }),
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "lg:col-span-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
                className: "overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "aspect-video w-full bg-muted",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                      src: event.featuredImage || "/placeholder.svg",
                      alt: event.title,
                      className: "h-full w-full object-cover",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                    className: "p-6",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "mb-4 flex flex-wrap gap-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                            variant: "secondary",
                            children:
                              event.category.charAt(0).toUpperCase() +
                              event.category.slice(1),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                                className: "h-4 w-4 text-primary",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                children: [
                                  event.startDate
                                    ? format(
                                        new Date(event.startDate),
                                        "MMM d, yyyy",
                                      )
                                    : "No start date",
                                  event.startDate &&
                                    event.endDate &&
                                    format(
                                      new Date(event.startDate),
                                      "MMM d, yyyy",
                                    ) !==
                                      format(
                                        new Date(event.endDate),
                                        "MMM d, yyyy",
                                      ) &&
                                    ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`,
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                                className: "h-4 w-4 text-primary",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                children: [
                                  event.startTime,
                                  " - ",
                                  event.endTime,
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm",
                            children:
                              event.locationType === "virtual"
                                ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    jsxRuntimeExports.Fragment,
                                    {
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          Globe,
                                          { className: "h-4 w-4 text-primary" },
                                        ),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "span",
                                          { children: "Virtual Event" },
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
                                          { className: "h-4 w-4 text-primary" },
                                        ),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                          "span",
                                          {
                                            children: [
                                              event.venueName,
                                              ", ",
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
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                            className: "text-xl font-semibold",
                            children: "About This Event",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-muted-foreground",
                            children: event.description,
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "mt-6",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          reactExports.Suspense,
                          {
                            fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className:
                                  "h-20 animate-pulse rounded-lg bg-muted",
                              },
                            ),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              PluginWidgetArea,
                              {
                                areaName: "event-detail-main",
                                eventData: event,
                              },
                            ),
                          },
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
                defaultValue: "tickets",
                className: "mt-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, {
                    className: "grid w-full grid-cols-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, {
                        value: "tickets",
                        children: "Tickets",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, {
                        value: "attendees",
                        children: "Attendees",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, {
                        value: "analytics",
                        children: "Analytics",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
                    value: "tickets",
                    className: "mt-4 space-y-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                              children: "Ticket Types",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              CardDescription,
                              {
                                children:
                                  "Manage your event's ticket types and pricing",
                              },
                            ),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                          className: "space-y-4",
                          children: [
                            event.ticketTypes.map((ticket, index) => {
                              const soldQuantity =
                                Number(ticket.quantity) -
                                (Number(ticket.availableQuantity) ||
                                  Number(ticket.quantity));
                              const soldPercentage =
                                Math.round(
                                  (soldQuantity / Number(ticket.quantity)) *
                                    100,
                                ) || 0;
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  className: "space-y-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className:
                                          "flex items-center justify-between",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "h3",
                                                  {
                                                    className: "font-medium",
                                                    children: ticket.name,
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "p",
                                                  {
                                                    className:
                                                      "text-sm text-muted-foreground",
                                                    children:
                                                      ticket.description,
                                                  },
                                                ),
                                              ],
                                            },
                                          ),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className: "text-right",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "p",
                                                  {
                                                    className: "font-bold",
                                                    children: [
                                                      "$",
                                                      Number(
                                                        ticket.price,
                                                      ).toFixed(2),
                                                    ],
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "p",
                                                  {
                                                    className:
                                                      "text-sm text-muted-foreground",
                                                    children: [
                                                      soldQuantity,
                                                      " sold / ",
                                                      ticket.quantity,
                                                      " total",
                                                    ],
                                                  },
                                                ),
                                              ],
                                            },
                                          ),
                                        ],
                                      },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      Progress,
                                      {
                                        value: soldPercentage,
                                        className: "h-2",
                                      },
                                    ),
                                  ],
                                },
                                ticket.id,
                              );
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              reactExports.Suspense,
                              {
                                fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className:
                                      "h-16 animate-pulse rounded-lg bg-muted",
                                  },
                                ),
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  PluginWidgetArea,
                                  {
                                    areaName: "ticket-options",
                                    eventData: event,
                                  },
                                ),
                              },
                            ),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              variant: "outline",
                              className: "w-full gap-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SquarePen,
                                  { className: "h-4 w-4" },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  children: "Edit Ticket Types",
                                }),
                              ],
                            },
                          ),
                        }),
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
                    value: "attendees",
                    className: "mt-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                              children: "Attendees",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              CardDescription,
                              { children: "View and manage event attendees" },
                            ),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className:
                                "rounded-lg border bg-muted/50 p-8 text-center",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                                  className:
                                    "mx-auto mb-4 h-8 w-8 text-muted-foreground",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "mb-2 text-lg font-medium",
                                  children: "Attendee Management",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className:
                                    "mb-4 text-sm text-muted-foreground",
                                  children:
                                    "Detailed attendee management will be available here. You'll be able to view, search, and export your attendee list.",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  variant: "outline",
                                  children: "Coming Soon",
                                }),
                              ],
                            },
                          ),
                        }),
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
                    value: "analytics",
                    className: "mt-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                              children: "Analytics",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              CardDescription,
                              {
                                children:
                                  "View detailed event analytics and insights",
                              },
                            ),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className:
                                "rounded-lg border bg-muted/50 p-8 text-center",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  ChartNoAxesColumnIncreasing,
                                  {
                                    className:
                                      "mx-auto mb-4 h-8 w-8 text-muted-foreground",
                                  },
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "mb-2 text-lg font-medium",
                                  children: "Analytics Dashboard",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className:
                                    "mb-4 text-sm text-muted-foreground",
                                  children:
                                    "Detailed analytics will be available here. You'll be able to track ticket sales, revenue, and attendee demographics.",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                  variant: "outline",
                                  children: "Coming Soon",
                                }),
                              ],
                            },
                          ),
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "space-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                      children: "Event Summary",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                    className: "space-y-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Status",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                            variant:
                              event.status === "published"
                                ? "default"
                                : "outline",
                            children:
                              event.status.charAt(0).toUpperCase() +
                              event.status.slice(1),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Created",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            children: format(
                              new Date(event.createdAt),
                              "MMM d, yyyy",
                            ),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Last Updated",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            children: format(
                              new Date(event.updatedAt),
                              "MMM d, yyyy",
                            ),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Ticket Types",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            children: event.ticketTypes.length,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
                fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "h-16 animate-pulse rounded-lg bg-muted",
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PluginWidgetArea,
                  { areaName: "event-detail-sidebar", eventData: event },
                ),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                      children: "Sales Summary",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                    className: "space-y-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "mb-2 flex items-center justify-between",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "text-muted-foreground",
                                children: "Tickets Sold",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className: "font-medium",
                                children: [
                                  event.totalTicketsSold,
                                  " / ",
                                  totalTickets,
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, {
                            value: ticketsSoldPercentage,
                            className: "h-2",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className:
                              "mt-1 text-right text-xs text-muted-foreground",
                            children: [ticketsSoldPercentage, "% sold"],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex items-center justify-between border-t pt-4",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Total Revenue",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            className: "text-xl font-bold",
                            children: [
                              "$",
                              Number(event.totalRevenue || 0).toLocaleString(),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                      variant: "outline",
                      className: "w-full gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                          className: "h-4 w-4",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          children: "Export Sales Report",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export { SplitComponent as component };
