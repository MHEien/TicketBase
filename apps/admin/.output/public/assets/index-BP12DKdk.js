import {
  c as createLucideIcon,
  r as reactExports,
  j as jsxRuntimeExports,
  B as Button,
  T as Card,
  $ as CardHeader,
  a1 as CardTitle,
  _ as CardContent,
  I as Input,
  S as Select,
  K as SelectTrigger,
  L as SelectValue,
  M as SelectContent,
  N as SelectItem,
  b as Badge,
  a2 as CardDescription,
} from "./main-D54NVj6U.js";
import {
  A as Avatar,
  a as AvatarImage,
  b as AvatarFallback,
} from "./avatar-DaWuUHOH.js";
import {
  D as DropdownMenu,
  a as DropdownMenuTrigger,
  b as DropdownMenuContent,
  c as DropdownMenuLabel,
  d as DropdownMenuSeparator,
  e as DropdownMenuItem,
} from "./dropdown-menu-Cc3wlmA0.js";
import {
  T as Tabs,
  a as TabsList,
  b as TabsTrigger,
  c as TabsContent,
} from "./tabs-DWHFZA6o.js";
import {
  A as ActivityType,
  a as useActivity,
  R as RefreshCw,
  T as TrendingUp,
  b as ActivitySeverity,
} from "./use-activity-DPkvV5M7.js";
import { D as Download } from "./download-Od2Zt_ki.js";
import { S as Search } from "./search-BS6yzFHd.js";
import { S as Shield } from "./shield-BJrRhV_W.js";
import { S as Settings } from "./settings-S4HBAFRa.js";
import { U as Users } from "./users-DGvlZmP3.js";
import { C as Calendar } from "./calendar-Dh5IQ9Oq.js";
import { D as DollarSign } from "./dollar-sign-BqSeDBj7.js";
import { C as CircleCheckBig } from "./circle-check-big-BM710K4p.js";
import { m as motion } from "./proxy-DR25Kbh7.js";
import { C as Clock } from "./clock-BDerWfP-.js";
import { E as Ellipsis } from "./ellipsis-pC1tMovR.js";
import "./index-DACOVT_t.js";
import "./chevron-right-VQ7fFc8Y.js";
import "./use-toast-nfgjIcjL.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const CircleX = createLucideIcon("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Eye = createLucideIcon("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const TriangleAlert = createLucideIcon("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq",
    },
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
]);

const ACTIVITY_TYPES = {
  [ActivityType.FINANCIAL]: {
    label: "Financial",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  [ActivityType.EVENT_MANAGEMENT]: {
    label: "Event Management",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  [ActivityType.USER_MANAGEMENT]: {
    label: "User Management",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  [ActivityType.ADMINISTRATIVE]: {
    label: "Administrative",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  [ActivityType.SECURITY]: {
    label: "Security",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  [ActivityType.MARKETING]: {
    label: "Marketing",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
};
const ACTIVITY_SEVERITY = {
  [ActivitySeverity.LOW]: {
    label: "Low",
    icon: CircleCheckBig,
    color: "text-green-600",
  },
  [ActivitySeverity.MEDIUM]: {
    label: "Medium",
    icon: TriangleAlert,
    color: "text-yellow-600",
  },
  [ActivitySeverity.HIGH]: {
    label: "High",
    icon: CircleX,
    color: "text-red-600",
  },
};
const SplitComponent = function ActivityPage() {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedType, setSelectedType] = reactExports.useState("all");
  const [selectedSeverity, setSelectedSeverity] = reactExports.useState("all");
  const [dateRange, setDateRange] = reactExports.useState("7d");
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const tabToActivityType = {
    financial: ActivityType.FINANCIAL,
    event_management: ActivityType.EVENT_MANAGEMENT,
    user_management: ActivityType.USER_MANAGEMENT,
    security: ActivityType.SECURITY,
  };
  const {
    activities,
    activityCounts,
    loading,
    error,
    refresh,
    exportActivities,
  } = useActivity({
    search: searchQuery,
    type: activeTab === "all" ? void 0 : tabToActivityType[activeTab],
    severity: selectedSeverity === "all" ? void 0 : selectedSeverity,
    dateRange,
    limit: 50,
    offset: 0,
    autoRefresh: true,
    refreshInterval: 3e4,
  });
  const formatTimeAgo = (date) => {
    const now = /* @__PURE__ */ new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - activityDate.getTime()) / 1e3,
    );
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return activityDate.toLocaleDateString();
  };
  const getActivityIcon = (type, severity) => {
    const typeConfig = ACTIVITY_TYPES[type];
    const severityConfig = ACTIVITY_SEVERITY[severity];
    if (severity === ActivitySeverity.HIGH) {
      return severityConfig.icon;
    }
    return typeConfig?.icon || Settings;
  };
  const getActivityColor = (type, severity) => {
    if (severity === ActivitySeverity.HIGH) {
      return ACTIVITY_SEVERITY.HIGH.color;
    }
    const typeConfig = ACTIVITY_TYPES[type];
    return typeConfig?.color || "text-gray-600";
  };
  const filteredActivities = activities;
  const displayedActivityCounts = activityCounts
    ? {
        all: activityCounts.total,
        financial: activityCounts.financial,
        eventManagement: activityCounts.eventManagement,
        userManagement: activityCounts.userManagement,
        security: activityCounts.security,
      }
    : {
        all: 0,
        financial: 0,
        eventManagement: 0,
        userManagement: 0,
        security: 0,
      };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "h-full space-y-6 overflow-y-auto",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-2xl font-bold tracking-tight",
                children: "Activity Log",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground",
                children:
                  "Monitor all activities and events across your organization",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                variant: "outline",
                onClick: exportActivities,
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                    className: "h-4 w-4",
                  }),
                  "Export",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                variant: "outline",
                size: "icon",
                onClick: refresh,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                  className: "h-4 w-4",
                }),
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
              className: "text-lg",
              children: "Filters",
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
            className: "space-y-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-sm font-medium",
                      children: "Search",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "relative",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                          className:
                            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                          placeholder: "Search activities...",
                          value: searchQuery,
                          onChange: (e) => setSearchQuery(e.target.value),
                          className: "pl-9",
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-sm font-medium",
                      children: "Activity Type",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                      value: selectedType,
                      onValueChange: setSelectedType,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectValue,
                            { placeholder: "All types" },
                          ),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                              value: "all",
                              children: "All Types",
                            }),
                            Object.entries(ACTIVITY_TYPES).map(
                              ([key, config]) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectItem,
                                  { value: key, children: config.label },
                                  key,
                                ),
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-sm font-medium",
                      children: "Severity",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                      value: selectedSeverity,
                      onValueChange: setSelectedSeverity,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectValue,
                            { placeholder: "All severities" },
                          ),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                              value: "all",
                              children: "All Severities",
                            }),
                            Object.entries(ACTIVITY_SEVERITY).map(
                              ([key, config]) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectItem,
                                  { value: key, children: config.label },
                                  key,
                                ),
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-sm font-medium",
                      children: "Date Range",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
                      value: dateRange,
                      onValueChange: setDateRange,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectValue,
                            {},
                          ),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                              value: "1d",
                              children: "Last 24 hours",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                              value: "7d",
                              children: "Last 7 days",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                              value: "30d",
                              children: "Last 30 days",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, {
                              value: "90d",
                              children: "Last 90 days",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center justify-between mb-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, {
                className: "grid grid-cols-5 w-fit",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                    value: "all",
                    className: "flex items-center gap-2 px-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: "All",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                        variant: "secondary",
                        className: "text-xs",
                        children: displayedActivityCounts.all,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                    value: "financial",
                    className: "flex items-center gap-2 px-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: "Financial",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                        variant: "secondary",
                        className: "text-xs",
                        children: displayedActivityCounts.financial,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                    value: "event_management",
                    className: "flex items-center gap-2 px-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: "Events",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                        variant: "secondary",
                        className: "text-xs",
                        children: displayedActivityCounts.eventManagement,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                    value: "user_management",
                    className: "flex items-center gap-2 px-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: "Users",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                        variant: "secondary",
                        className: "text-xs",
                        children: displayedActivityCounts.userManagement,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                    value: "security",
                    className: "flex items-center gap-2 px-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        children: "Security",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                        variant: "secondary",
                        className: "text-xs",
                        children: displayedActivityCounts.security,
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "flex items-center gap-2 text-sm text-muted-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                  children: [
                    "Last updated: ",
                    /* @__PURE__ */ new Date().toLocaleTimeString(),
                  ],
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: activeTab,
            className: "mt-6",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                      children: "Activity Feed",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, {
                      children: [
                        filteredActivities.length,
                        " activities found",
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
                  children: loading
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "space-y-4",
                        children: Array.from({
                          length: 5,
                        }).map((_, i) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "flex items-start gap-4 p-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className:
                                    "h-10 w-10 rounded-full bg-muted animate-pulse",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex-1 space-y-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        className:
                                          "h-4 bg-muted rounded animate-pulse",
                                      },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        className:
                                          "h-3 bg-muted rounded animate-pulse w-2/3",
                                      },
                                    ),
                                  ],
                                }),
                              ],
                            },
                            i,
                          ),
                        ),
                      })
                    : error
                      ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "text-center py-8",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-muted-foreground",
                              children: error,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                              variant: "outline",
                              onClick: refresh,
                              className: "mt-4",
                              children: "Try Again",
                            }),
                          ],
                        })
                      : filteredActivities.length === 0
                        ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "text-center py-8",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, {
                                className:
                                  "h-12 w-12 text-muted-foreground mx-auto mb-4",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-muted-foreground",
                                children: "No activities found",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-sm text-muted-foreground mt-1",
                                children:
                                  "Try adjusting your filters or search criteria",
                              }),
                            ],
                          })
                        : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "space-y-1",
                            children: filteredActivities.map((activity) => {
                              const ActivityIcon = getActivityIcon(
                                activity.type,
                                activity.severity,
                              );
                              const iconColor = getActivityColor(
                                activity.type,
                                activity.severity,
                              );
                              const typeConfig = ACTIVITY_TYPES[activity.type];
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                motion.div,
                                {
                                  initial: {
                                    opacity: 0,
                                    y: 20,
                                  },
                                  animate: {
                                    opacity: 1,
                                    y: 0,
                                  },
                                  className:
                                    "flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        className: `flex h-10 w-10 items-center justify-center rounded-full ${typeConfig?.bgColor} ${typeConfig?.borderColor} border`,
                                        children:
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                            ActivityIcon,
                                            {
                                              className: `h-5 w-5 ${iconColor}`,
                                            },
                                          ),
                                      },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        className: "flex-1 space-y-1",
                                        children:
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className:
                                                "flex items-start justify-between",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          className:
                                                            "flex items-center gap-2",
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                              Avatar,
                                                              {
                                                                className:
                                                                  "h-6 w-6",
                                                                children: [
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    AvatarImage,
                                                                    {
                                                                      src: activity
                                                                        .user
                                                                        .avatar,
                                                                      alt: activity
                                                                        .user
                                                                        .name,
                                                                    },
                                                                  ),
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    AvatarFallback,
                                                                    {
                                                                      className:
                                                                        "text-xs",
                                                                      children:
                                                                        activity.user.name.charAt(
                                                                          0,
                                                                        ),
                                                                    },
                                                                  ),
                                                                ],
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "span",
                                                              {
                                                                className:
                                                                  "font-medium text-sm",
                                                                children:
                                                                  activity.user
                                                                    .name,
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              Badge,
                                                              {
                                                                variant:
                                                                  "outline",
                                                                className:
                                                                  "text-xs",
                                                                children:
                                                                  typeConfig?.label,
                                                              },
                                                            ),
                                                            activity.severity ===
                                                              ActivitySeverity.HIGH &&
                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Badge,
                                                                {
                                                                  variant:
                                                                    "destructive",
                                                                  className:
                                                                    "text-xs",
                                                                  children:
                                                                    "High Priority",
                                                                },
                                                              ),
                                                          ],
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        "p",
                                                        {
                                                          className:
                                                            "text-sm text-muted-foreground mt-1",
                                                          children:
                                                            activity.description,
                                                        },
                                                      ),
                                                      activity.metadata &&
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "div",
                                                          {
                                                            className:
                                                              "mt-2 text-xs text-muted-foreground",
                                                            children:
                                                              Object.entries(
                                                                activity.metadata,
                                                              ).map(
                                                                ([
                                                                  key,
                                                                  value,
                                                                ]) =>
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                    "span",
                                                                    {
                                                                      className:
                                                                        "mr-4",
                                                                      children:
                                                                        [
                                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                            "span",
                                                                            {
                                                                              className:
                                                                                "font-medium",
                                                                              children:
                                                                                [
                                                                                  key,
                                                                                  ":",
                                                                                ],
                                                                            },
                                                                          ),
                                                                          " ",
                                                                          String(
                                                                            value,
                                                                          ),
                                                                        ],
                                                                    },
                                                                    key,
                                                                  ),
                                                              ),
                                                          },
                                                        ),
                                                    ],
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "flex items-center gap-2",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          className:
                                                            "flex items-center gap-1 text-xs text-muted-foreground",
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              Clock,
                                                              {
                                                                className:
                                                                  "h-3 w-3",
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "span",
                                                              {
                                                                children:
                                                                  formatTimeAgo(
                                                                    activity.createdAt,
                                                                  ),
                                                              },
                                                            ),
                                                          ],
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        DropdownMenu,
                                                        {
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              DropdownMenuTrigger,
                                                              {
                                                                asChild: true,
                                                                children:
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    Button,
                                                                    {
                                                                      variant:
                                                                        "ghost",
                                                                      size: "icon",
                                                                      className:
                                                                        "h-8 w-8",
                                                                      children:
                                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                          Ellipsis,
                                                                          {
                                                                            className:
                                                                              "h-4 w-4",
                                                                          },
                                                                        ),
                                                                    },
                                                                  ),
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                              DropdownMenuContent,
                                                              {
                                                                align: "end",
                                                                children: [
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    DropdownMenuLabel,
                                                                    {
                                                                      children:
                                                                        "Actions",
                                                                    },
                                                                  ),
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    DropdownMenuSeparator,
                                                                    {},
                                                                  ),
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    DropdownMenuItem,
                                                                    {
                                                                      children:
                                                                        "View Details",
                                                                    },
                                                                  ),
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    DropdownMenuItem,
                                                                    {
                                                                      children:
                                                                        "Copy ID",
                                                                    },
                                                                  ),
                                                                  activity.relatedEntityName &&
                                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                      DropdownMenuItem,
                                                                      {
                                                                        children:
                                                                          [
                                                                            "Go to ",
                                                                            activity.relatedEntityType,
                                                                          ],
                                                                      },
                                                                    ),
                                                                ],
                                                              },
                                                            ),
                                                          ],
                                                        },
                                                      ),
                                                    ],
                                                  },
                                                ),
                                              ],
                                            },
                                          ),
                                      },
                                    ),
                                  ],
                                },
                                activity.id,
                              );
                            }),
                          }),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};

export { SplitComponent as component };
