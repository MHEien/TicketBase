import {
  c as createLucideIcon,
  r as reactExports,
  as as useToast,
  at as usePluginSDK,
  j as jsxRuntimeExports,
  au as LoaderCircle,
  T as Card,
  $ as CardHeader,
  a1 as CardTitle,
  a2 as CardDescription,
  _ as CardContent,
  B as Button,
  ar as Separator,
  Q as Switch,
  a5 as Label,
  av as Alert,
  aw as AlertDescription,
  ax as ExtensionPoint,
  a3 as CardFooter,
  ay as getPlugin,
  az as setPluginEnabled,
  I as Input,
  b as Badge,
  a6 as Check,
  aA as fetchAvailablePlugins,
  aB as uninstallPlugin,
  aC as installPlugin,
} from "./main-D54NVj6U.js";
import {
  T as Tabs,
  a as TabsList,
  b as TabsTrigger,
  c as TabsContent,
} from "./tabs-DWHFZA6o.js";
import {
  A as Avatar,
  a as AvatarImage,
  b as AvatarFallback,
} from "./avatar-DaWuUHOH.js";
import {
  p as pluginLoader,
  a as pluginManager,
} from "./plugin-loader-Y88a9AGU.js";
import { A as ArrowLeft } from "./arrow-left-D-CnOb33.js";
import { S as Settings } from "./settings-S4HBAFRa.js";
import { C as Calendar } from "./calendar-Dh5IQ9Oq.js";
import { L as Layers, C as ChartColumn } from "./layers-oyITKq26.js";
import { T as Ticket } from "./ticket-Cl-q8e77.js";
import { U as Users } from "./users-DGvlZmP3.js";
import { M as Mail } from "./mail-Bwy92L3K.js";
import { D as Download } from "./download-Od2Zt_ki.js";
import { F as Filter } from "./filter-CxrQxdgK.js";
import { S as Search } from "./search-BS6yzFHd.js";
import { A as AnimatePresence } from "./index-B_Zo_mO0.js";
import { m as motion } from "./proxy-DR25Kbh7.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const CreditCard = createLucideIcon("CreditCard", [
  [
    "rect",
    { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" },
  ],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ExternalLink = createLucideIcon("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  [
    "path",
    {
      d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      key: "a6xqqp",
    },
  ],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Grid3x3 = createLucideIcon("Grid3x3", [
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
  ],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Star = createLucideIcon("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s",
    },
  ],
]);

function usePlugins() {
  const [plugins, setPlugins] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let isMounted = true;
    async function loadPlugins() {
      try {
        setLoading(true);
        await pluginLoader.loadInstalledPlugins();
        if (isMounted) {
          setPlugins(pluginManager.getAllPlugins());
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadPlugins();
    return () => {
      isMounted = false;
    };
  }, []);
  const refreshPlugins = async () => {
    try {
      setLoading(true);
      pluginManager.clear();
      await pluginLoader.loadInstalledPlugins();
      setPlugins(pluginManager.getAllPlugins());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  return { plugins, loading, error, refreshPlugins };
}

function PluginSettings({ pluginId, onClose }) {
  const { toast } = useToast();
  const [plugin, setPlugin] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [enabled, setEnabled] = reactExports.useState(false);
  const { api, auth, utils } = usePluginSDK();
  reactExports.useEffect(() => {
    async function loadPlugin() {
      try {
        setLoading(true);
        console.log(`Loading plugin settings for: ${pluginId}`);
        const response = await getPlugin(pluginId);
        if (response.success && response.data) {
          setPlugin(response.data);
          setEnabled(response.data.enabled);
          setError(null);
          console.log("Plugin settings loaded:", response.data);
        } else {
          setError(
            response.error ||
              "Failed to load plugin settings. The plugin may not be installed or you may not have permission to access it.",
          );
        }
      } catch (err) {
        console.error("Failed to load plugin:", err);
        setError(
          "Failed to load plugin settings. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    }
    if (pluginId) {
      loadPlugin();
    }
  }, [pluginId]);
  const handleToggleEnabled = async () => {
    if (!plugin) return;
    try {
      setSaving(true);
      const newState = !enabled;
      const response = await setPluginEnabled(pluginId, newState);
      if (response.success) {
        setEnabled(newState);
        toast({
          title: newState ? "Plugin Enabled ✅" : "Plugin Disabled ⏸️",
          description: `${plugin.name} has been ${newState ? "enabled" : "disabled"} successfully.`,
        });
        setPlugin((prev) => (prev ? { ...prev, enabled: newState } : null));
      } else {
        toast({
          title: "Action Failed",
          description: response.error || "Failed to update plugin status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to update plugin status.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  const handleSaveConfig = async (config) => {
    if (!plugin) return;
    try {
      setSaving(true);
      console.log(`Saving configuration for plugin ${pluginId}:`, config);
      await api.saveConfig(pluginId, config);
      setPlugin((prev) => (prev ? { ...prev, configuration: config } : null));
      toast({
        title: "Settings Saved Successfully! 🎉",
        description: `Configuration for ${plugin.name} has been updated.`,
      });
    } catch (err) {
      console.error("Failed to save plugin config:", err);
      toast({
        title: "Save Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to save plugin settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "flex items-center justify-center min-h-[400px]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, {
          className: "h-8 w-8 animate-spin text-muted-foreground",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
          className: "ml-2 text-muted-foreground",
          children: "Loading plugin settings...",
        }),
      ],
    });
  }
  if (error || !plugin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
              children: "Error Loading Plugin Settings",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
              children: error || "Failed to load plugin settings.",
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children: "This could happen if:",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", {
                  className:
                    "text-sm text-muted-foreground list-disc list-inside space-y-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                      children: "The plugin is not installed",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                      children: "The plugin ID is invalid",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                      children:
                        "You don't have permission to access this plugin",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                      children: "The plugin bundle failed to load from storage",
                    }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex gap-2 mt-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  onClick: onClose,
                  children: "Back to Plugins",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                  variant: "outline",
                  onClick: () => window.location.reload(),
                  children: "Retry",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "space-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "text-2xl font-bold tracking-tight",
                children: plugin.name,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground",
                children: plugin.description,
              }),
              auth.isAuthenticated &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["Authenticated as: ", auth.user?.email],
                }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
            variant: "outline",
            onClick: onClose,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {
                className: "mr-2 h-4 w-4",
              }),
              "Back to Gallery",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid gap-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                          children: "Plugin Status",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
                          children:
                            "Enable or disable this plugin for your events.",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {
                          id: "plugin-enabled",
                          checked: enabled,
                          onCheckedChange: handleToggleEnabled,
                          disabled: saving,
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          htmlFor: "plugin-enabled",
                          children: enabled ? "Enabled" : "Disabled",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                children: [
                  !enabled &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, {
                      className: "bg-yellow-50 border-yellow-200",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AlertDescription,
                        {
                          className: "text-yellow-800",
                          children:
                            "This plugin is currently disabled. Enable it to use it in your events and checkout processes.",
                        },
                      ),
                    }),
                  enabled &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, {
                      className: "bg-green-50 border-green-200",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AlertDescription,
                        {
                          className: "text-green-800",
                          children:
                            "✅ This plugin is active and will be available for use in your events.",
                        },
                      ),
                    }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex items-center space-x-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {
                      className: "h-5 w-5",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                          children: "Plugin Configuration",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          CardDescription,
                          {
                            children: [
                              "Configure how this plugin works with your events.",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("small", {
                                className: "text-blue-600",
                                children:
                                  "✨ Powered by Plugin SDK Context-Aware system - no bundling issues!",
                              }),
                            ],
                          },
                        ),
                      ],
                    }),
                  ],
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ExtensionPoint,
                  {
                    name: "admin-settings",
                    context: {
                      plugin,
                      pluginId,
                      onSave: handleSaveConfig,
                      saving,
                      user: auth.user,
                      isAuthenticated: auth.isAuthenticated,
                    },
                    fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "text-center p-6 border rounded-md border-dashed",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-muted-foreground",
                            children:
                              "This plugin does not have configurable settings.",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-xs text-muted-foreground",
                            children: "Using Plugin SDK Context-Aware system",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "text-xs text-muted-foreground space-y-1 mt-4",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "strong",
                                    { children: "Plugin ID:" },
                                  ),
                                  " ",
                                  pluginId,
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "strong",
                                    { children: "Extension Points:" },
                                  ),
                                  " ",
                                  plugin.extensionPoints?.join(", ") ||
                                    "None specified",
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "strong",
                                    { children: "Bundle URL:" },
                                  ),
                                  " ",
                                  plugin.bundleUrl
                                    ? "✅ Available"
                                    : "❌ Missing",
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "strong",
                                    { children: "Version:" },
                                  ),
                                  " ",
                                  plugin.version,
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  },
                ),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, {
                    children: "Plugin Information",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
                    children: "Details about this plugin and its capabilities.",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Version",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1",
                            children: plugin.version,
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Category",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1 capitalize",
                            children: plugin.category,
                          }),
                        ],
                      }),
                      plugin.metadata?.author &&
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                              className:
                                "text-sm font-medium text-muted-foreground",
                              children: "Author",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                              className: "mt-1",
                              children: plugin.metadata.author,
                            }),
                          ],
                        }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Installed On",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1",
                            children: new Date(
                              plugin.installedAt,
                            ).toLocaleDateString(),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Last Updated",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1",
                            children: new Date(
                              plugin.updatedAt,
                            ).toLocaleDateString(),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Plugin System",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className:
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
                                children: "Plugin SDK Context-Aware ✨",
                              },
                            ),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Bundle Status",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1",
                            children: plugin.bundleUrl
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
                                  children: "✅ Bundle Available",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
                                  children: "⚠️ No Bundle URL",
                                }),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                            className:
                              "text-sm font-medium text-muted-foreground",
                            children: "Status",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                            className: "mt-1",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`,
                                children: enabled ? "Active" : "Inactive",
                              },
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  plugin.extensionPoints &&
                    plugin.extensionPoints.length > 0 &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "pt-4 border-t mt-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                          className:
                            "text-sm font-medium text-muted-foreground mb-2",
                          children: "Extension Points",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                          className: "flex flex-wrap gap-2",
                          children: plugin.extensionPoints.map((point) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className:
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800",
                                children: point,
                              },
                              point,
                            ),
                          ),
                        }),
                      ],
                    }),
                  plugin.bundleUrl &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "pt-4 border-t mt-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", {
                          className:
                            "text-sm font-medium text-muted-foreground mb-2",
                          children: "Bundle URL",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", {
                          className:
                            "text-xs text-muted-foreground font-mono break-all bg-muted p-2 rounded",
                          children: plugin.bundleUrl,
                        }),
                      ],
                    }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex gap-2 w-full",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                      variant: "outline",
                      size: "sm",
                      className: "flex-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, {
                          className: "mr-2 h-4 w-4",
                        }),
                        "View Documentation",
                      ],
                    }),
                    plugin.bundleUrl &&
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: () => window.open(plugin.bundleUrl, "_blank"),
                        className: "flex-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, {
                            className: "mr-2 h-4 w-4",
                          }),
                          "View Bundle",
                        ],
                      }),
                  ],
                }),
              }),
            ],
          }),
          false,
        ],
      }),
    ],
  });
}

const categoryIcons = {
  payment: CreditCard,
  marketing: Mail,
  analytics: ChartColumn,
  social: Users,
  ticketing: Ticket,
  layout: Layers,
  seating: Calendar,
};
function PluginGallery() {
  const [selectedPlugin, setSelectedPlugin] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [view, setView] = reactExports.useState("grid");
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [showSettings, setShowSettings] = reactExports.useState(null);
  const {
    plugins: installedPlugins,
    loading: loadingInstalled,
    error: installedError,
    refreshPlugins,
  } = usePlugins();
  const [availablePlugins, setAvailablePlugins] = reactExports.useState([]);
  const [loadingAvailable, setLoadingAvailable] = reactExports.useState(true);
  const [availableError, setAvailableError] = reactExports.useState(null);
  const [actionPlugin, setActionPlugin] = reactExports.useState(null);
  const [isInstalling, setIsInstalling] = reactExports.useState(false);
  const [isUninstalling, setIsUninstalling] = reactExports.useState(false);
  const [actionError, setActionError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    async function loadAvailablePlugins() {
      try {
        setLoadingAvailable(true);
        setAvailableError(null);
        const response = await fetchAvailablePlugins();
        if (response.success && response.data) {
          setAvailablePlugins(response.data);
        } else {
          setAvailableError(
            new Error(response.error || "Failed to load plugins"),
          );
        }
      } catch (error2) {
        setAvailableError(
          error2 instanceof Error ? error2 : new Error(String(error2)),
        );
      } finally {
        setLoadingAvailable(false);
      }
    }
    loadAvailablePlugins();
  }, []);
  const categories = [
    { id: "all", name: "All Plugins" },
    { id: "installed", name: "Installed" },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "marketing", name: "Marketing", icon: Mail },
    { id: "analytics", name: "Analytics", icon: ChartColumn },
    { id: "social", name: "Social", icon: Users },
    { id: "ticketing", name: "Ticketing", icon: Ticket },
    { id: "layout", name: "Layout", icon: Layers },
    { id: "seating", name: "Seating", icon: Calendar },
  ];
  const mappedPlugins = availablePlugins.map((plugin) => {
    const installed = installedPlugins.find(
      (p) => p.metadata.id === plugin.metadata.id,
    );
    const IconComponent = categoryIcons[plugin.metadata.category] || Layers;
    return {
      id: plugin.metadata.id,
      name: plugin.metadata.name,
      description: plugin.metadata.description,
      category: plugin.metadata.category,
      version: plugin.metadata.version,
      metadata: plugin.metadata,
      installed: !!installed,
      enabled: installed?.isLoaded || false,
      icon: IconComponent,
      // Use real data from plugin metadata
      installs: plugin.metadata?.installCount || 0,
      rating: plugin.metadata?.rating || null,
      // No default rating
      developer: plugin.metadata?.author || "Unknown Developer",
      developerAvatar: plugin.metadata?.authorAvatar || null,
      // No placeholder
    };
  });
  const filteredPlugins = mappedPlugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleInstall = async (pluginId) => {
    try {
      setActionPlugin(pluginId);
      setIsInstalling(true);
      setActionError(null);
      const response = await installPlugin(pluginId);
      if (!response.success) {
        setActionError(response.error || "Failed to install plugin");
        return;
      }
      await refreshPlugins();
    } catch (error2) {
      setActionError(error2 instanceof Error ? error2.message : String(error2));
    } finally {
      setIsInstalling(false);
      setActionPlugin(null);
    }
  };
  const handleUninstall = async (pluginId) => {
    try {
      setActionPlugin(pluginId);
      setIsUninstalling(true);
      setActionError(null);
      const response = await uninstallPlugin(pluginId);
      if (!response.success) {
        setActionError(response.error || "Failed to uninstall plugin");
        return;
      }
      await refreshPlugins();
    } catch (error2) {
      setActionError(error2 instanceof Error ? error2.message : String(error2));
    } finally {
      setIsUninstalling(false);
      setActionPlugin(null);
    }
  };
  const handleOpenSettings = (pluginId) => {
    setShowSettings(pluginId);
  };
  const loading = loadingInstalled || loadingAvailable;
  const error = installedError || availableError;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "h-full space-y-6 overflow-y-auto",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-2xl font-bold tracking-tight",
                children: "Plugin Gallery",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground",
                children: "Extend your platform with powerful integrations.",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                onClick: () =>
                  (window.location.href = "/admin/settings/plugins/submit"),
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                    className: "h-4 w-4",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    children: "Submit Plugin",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                variant: "outline",
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, {
                    className: "h-4 w-4",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    children: "Filter",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                variant: "outline",
                size: "icon",
                onClick: () => setView(view === "grid" ? "list" : "grid"),
                children:
                  view === "grid"
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, {
                        className: "h-4 w-4",
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, {
                        className: "h-4 w-4",
                      }),
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "relative",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
            className:
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
            placeholder: "Search plugins...",
            className: "pl-9",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
          }),
        ],
      }),
      loading &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex justify-center py-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, {
            className: "h-8 w-8 animate-spin text-muted-foreground",
          }),
        }),
      !loading &&
        error &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, {
          variant: "destructive",
          className: "my-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, {
            children:
              error.message ||
              "Failed to load plugins. Please try again later.",
          }),
        }),
      actionError &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, {
          variant: "destructive",
          className: "my-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, {
            children: actionError,
          }),
        }),
      showSettings
        ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              transition: { duration: 0.3 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PluginSettings, {
                pluginId: showSettings,
                onClose: () => {
                  setShowSettings(null);
                  refreshPlugins();
                },
              }),
            }),
          })
        : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
            value: activeTab,
            onValueChange: setActiveTab,
            className: "space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, {
                className: "flex w-full flex-wrap",
                children: categories.map((category) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: category.id,
                      className: "flex-1",
                      children: [
                        category.icon &&
                          /* @__PURE__ */ jsxRuntimeExports.jsx(category.icon, {
                            className: "mr-2 h-4 w-4",
                          }),
                        category.name,
                        category.id === "installed" &&
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                            variant: "secondary",
                            className: "ml-2",
                            children: installedPlugins.length,
                          }),
                      ],
                    },
                    category.id,
                  ),
                ),
              }),
              categories.map((category) =>
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsContent,
                  {
                    value: category.id,
                    className: "space-y-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AnimatePresence,
                      {
                        children: selectedPlugin
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, {
                              initial: { opacity: 0, y: 20 },
                              animate: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: -20 },
                              transition: { duration: 0.3 },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                Card,
                                {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      CardHeader,
                                      {
                                        className:
                                          "flex flex-row items-center justify-between",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className:
                                                "flex items-center gap-4",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "div",
                                                  {
                                                    className:
                                                      "flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10",
                                                    children: (() => {
                                                      const plugin =
                                                        filteredPlugins.find(
                                                          (p) =>
                                                            p.id ===
                                                            selectedPlugin,
                                                        );
                                                      const PluginIcon =
                                                        plugin?.icon;
                                                      return PluginIcon
                                                        ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            PluginIcon,
                                                            {
                                                              className:
                                                                "h-6 w-6 text-primary",
                                                            },
                                                          )
                                                        : null;
                                                    })(),
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        CardTitle,
                                                        {
                                                          children:
                                                            filteredPlugins.find(
                                                              (p) =>
                                                                p.id ===
                                                                selectedPlugin,
                                                            )?.name,
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        CardDescription,
                                                        {
                                                          children: [
                                                            "By",
                                                            " ",
                                                            filteredPlugins.find(
                                                              (p) =>
                                                                p.id ===
                                                                selectedPlugin,
                                                            )?.developer,
                                                            " ",
                                                            "•",
                                                            " ",
                                                            filteredPlugins.find(
                                                              (p) =>
                                                                p.id ===
                                                                selectedPlugin,
                                                            )?.installs,
                                                            " ",
                                                            "installs",
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
                                            Button,
                                            {
                                              onClick: () =>
                                                setSelectedPlugin(null),
                                              variant: "ghost",
                                              children: "Back to Gallery",
                                            },
                                          ),
                                        ],
                                      },
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      CardContent,
                                      {
                                        className: "space-y-6",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className:
                                                "grid grid-cols-1 gap-6 md:grid-cols-3",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "space-y-1 md:col-span-2",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        "h3",
                                                        {
                                                          className:
                                                            "font-medium",
                                                          children:
                                                            "Description",
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "p",
                                                        {
                                                          className:
                                                            "text-muted-foreground",
                                                          children: [
                                                            filteredPlugins.find(
                                                              (p) =>
                                                                p.id ===
                                                                selectedPlugin,
                                                            )?.description,
                                                            " ",
                                                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                                                          ],
                                                        },
                                                      ),
                                                    ],
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "space-y-4 rounded-lg border p-4",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "p",
                                                              {
                                                                className:
                                                                  "text-sm font-medium",
                                                                children:
                                                                  "Price",
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "p",
                                                              {
                                                                className:
                                                                  "text-2xl font-bold",
                                                                children:
                                                                  "Free",
                                                              },
                                                            ),
                                                          ],
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "p",
                                                              {
                                                                className:
                                                                  "text-sm font-medium",
                                                                children:
                                                                  "Rating",
                                                              },
                                                            ),
                                                            filteredPlugins.find(
                                                              (p) =>
                                                                p.id ===
                                                                selectedPlugin,
                                                            )?.rating
                                                              ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "flex items-center gap-1",
                                                                    children: [
                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                        "div",
                                                                        {
                                                                          className:
                                                                            "flex",
                                                                          children:
                                                                            [
                                                                              ...Array(
                                                                                5,
                                                                              ),
                                                                            ].map(
                                                                              (
                                                                                _,
                                                                                i,
                                                                              ) =>
                                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                  Star,
                                                                                  {
                                                                                    className: `h-4 w-4 ${i < Math.floor(filteredPlugins.find((p) => p.id === selectedPlugin)?.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"}`,
                                                                                  },
                                                                                  i,
                                                                                ),
                                                                            ),
                                                                        },
                                                                      ),
                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                        "span",
                                                                        {
                                                                          className:
                                                                            "text-sm font-medium",
                                                                          children:
                                                                            filteredPlugins
                                                                              .find(
                                                                                (
                                                                                  p,
                                                                                ) =>
                                                                                  p.id ===
                                                                                  selectedPlugin,
                                                                              )
                                                                              ?.rating?.toFixed(
                                                                                1,
                                                                              ),
                                                                        },
                                                                      ),
                                                                      filteredPlugins.find(
                                                                        (p) =>
                                                                          p.id ===
                                                                          selectedPlugin,
                                                                      )
                                                                        ?.metadata
                                                                        ?.reviewCount &&
                                                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                          "span",
                                                                          {
                                                                            className:
                                                                              "text-xs text-muted-foreground",
                                                                            children:
                                                                              [
                                                                                "(",
                                                                                filteredPlugins.find(
                                                                                  (
                                                                                    p,
                                                                                  ) =>
                                                                                    p.id ===
                                                                                    selectedPlugin,
                                                                                )
                                                                                  ?.metadata
                                                                                  ?.reviewCount,
                                                                                " ",
                                                                                "reviews)",
                                                                              ],
                                                                          },
                                                                        ),
                                                                    ],
                                                                  },
                                                                )
                                                              : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  "p",
                                                                  {
                                                                    className:
                                                                      "text-sm text-muted-foreground",
                                                                    children:
                                                                      "No ratings yet",
                                                                  },
                                                                ),
                                                          ],
                                                        },
                                                      ),
                                                      (() => {
                                                        const plugin =
                                                          filteredPlugins.find(
                                                            (p) =>
                                                              p.id ===
                                                              selectedPlugin,
                                                          );
                                                        if (!plugin)
                                                          return null;
                                                        return plugin.installed
                                                          ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                              jsxRuntimeExports.Fragment,
                                                              {
                                                                children: [
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    Badge,
                                                                    {
                                                                      className:
                                                                        "mb-2",
                                                                      children:
                                                                        "Installed",
                                                                    },
                                                                  ),
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                    "div",
                                                                    {
                                                                      className:
                                                                        "flex flex-col gap-2",
                                                                      children:
                                                                        [
                                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                            Button,
                                                                            {
                                                                              variant:
                                                                                "outline",
                                                                              className:
                                                                                "w-full",
                                                                              onClick:
                                                                                () =>
                                                                                  handleOpenSettings(
                                                                                    plugin.id,
                                                                                  ),
                                                                              children:
                                                                                "Configure",
                                                                            },
                                                                          ),
                                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                            Button,
                                                                            {
                                                                              variant:
                                                                                "destructive",
                                                                              className:
                                                                                "w-full",
                                                                              onClick:
                                                                                () =>
                                                                                  handleUninstall(
                                                                                    plugin.id,
                                                                                  ),
                                                                              disabled:
                                                                                isUninstalling &&
                                                                                actionPlugin ===
                                                                                  plugin.id,
                                                                              children:
                                                                                isUninstalling &&
                                                                                actionPlugin ===
                                                                                  plugin.id
                                                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                                      jsxRuntimeExports.Fragment,
                                                                                      {
                                                                                        children:
                                                                                          [
                                                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                              LoaderCircle,
                                                                                              {
                                                                                                className:
                                                                                                  "mr-2 h-4 w-4 animate-spin",
                                                                                              },
                                                                                            ),
                                                                                            "Uninstalling",
                                                                                          ],
                                                                                      },
                                                                                    )
                                                                                  : "Uninstall",
                                                                            },
                                                                          ),
                                                                        ],
                                                                    },
                                                                  ),
                                                                ],
                                                              },
                                                            )
                                                          : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              Button,
                                                              {
                                                                className:
                                                                  "w-full gap-2",
                                                                onClick: () =>
                                                                  handleInstall(
                                                                    plugin.id,
                                                                  ),
                                                                disabled:
                                                                  isInstalling &&
                                                                  actionPlugin ===
                                                                    plugin.id,
                                                                children:
                                                                  isInstalling &&
                                                                  actionPlugin ===
                                                                    plugin.id
                                                                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                        jsxRuntimeExports.Fragment,
                                                                        {
                                                                          children:
                                                                            [
                                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                LoaderCircle,
                                                                                {
                                                                                  className:
                                                                                    "mr-2 h-4 w-4 animate-spin",
                                                                                },
                                                                              ),
                                                                              "Installing",
                                                                            ],
                                                                        },
                                                                      )
                                                                    : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                        jsxRuntimeExports.Fragment,
                                                                        {
                                                                          children:
                                                                            [
                                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                Download,
                                                                                {
                                                                                  className:
                                                                                    "h-4 w-4",
                                                                                },
                                                                              ),
                                                                              "Install Plugin",
                                                                            ],
                                                                        },
                                                                      ),
                                                              },
                                                            );
                                                      })(),
                                                    ],
                                                  },
                                                ),
                                              ],
                                            },
                                          ),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className: "space-y-4",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "h3",
                                                  {
                                                    className: "font-medium",
                                                    children: "Features",
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "div",
                                                  {
                                                    className:
                                                      "grid grid-cols-1 gap-2 sm:grid-cols-2",
                                                    children: [
                                                      "Easy integration with your existing setup",
                                                      "Customizable to match your brand",
                                                      "Regular updates and improvements",
                                                      "Dedicated support team",
                                                      "Detailed documentation",
                                                      "API access for developers",
                                                    ].map((feature, i) =>
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          className:
                                                            "flex items-center gap-2",
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "div",
                                                              {
                                                                className:
                                                                  "flex h-5 w-5 items-center justify-center rounded-full bg-primary/10",
                                                                children:
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    Check,
                                                                    {
                                                                      className:
                                                                        "h-3 w-3 text-primary",
                                                                    },
                                                                  ),
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "span",
                                                              {
                                                                className:
                                                                  "text-sm",
                                                                children:
                                                                  feature,
                                                              },
                                                            ),
                                                          ],
                                                        },
                                                        i,
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
                                              className: "space-y-4",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "h3",
                                                  {
                                                    className: "font-medium",
                                                    children: "Developer",
                                                  },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "flex items-center gap-3",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        Avatar,
                                                        {
                                                          className: "h-8 w-8",
                                                          children:
                                                            filteredPlugins.find(
                                                              (p) =>
                                                                p.id ===
                                                                selectedPlugin,
                                                            )?.developerAvatar
                                                              ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  AvatarImage,
                                                                  {
                                                                    src:
                                                                      filteredPlugins.find(
                                                                        (p) =>
                                                                          p.id ===
                                                                          selectedPlugin,
                                                                      )
                                                                        ?.developerAvatar ||
                                                                      "",
                                                                    alt: "Developer",
                                                                  },
                                                                )
                                                              : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  AvatarFallback,
                                                                  {
                                                                    children:
                                                                      filteredPlugins
                                                                        .find(
                                                                          (p) =>
                                                                            p.id ===
                                                                            selectedPlugin,
                                                                        )
                                                                        ?.developer?.charAt(
                                                                          0,
                                                                        ) ||
                                                                      "?",
                                                                  },
                                                                ),
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "p",
                                                              {
                                                                className:
                                                                  "text-sm font-medium",
                                                                children:
                                                                  filteredPlugins.find(
                                                                    (p) =>
                                                                      p.id ===
                                                                      selectedPlugin,
                                                                  )?.developer,
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "p",
                                                              {
                                                                className:
                                                                  "text-xs text-muted-foreground",
                                                                children:
                                                                  "Developer",
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
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      CardFooter,
                                      {
                                        className: "flex justify-between",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                            Button,
                                            {
                                              variant: "outline",
                                              children: "View Documentation",
                                            },
                                          ),
                                          (() => {
                                            const plugin = filteredPlugins.find(
                                              (p) => p.id === selectedPlugin,
                                            );
                                            if (!plugin) return null;
                                            return plugin.installed
                                              ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  Button,
                                                  {
                                                    variant: "outline",
                                                    onClick: () =>
                                                      handleOpenSettings(
                                                        plugin.id,
                                                      ),
                                                    children:
                                                      "Configure Plugin",
                                                  },
                                                )
                                              : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  Button,
                                                  {
                                                    className: "gap-2",
                                                    onClick: () =>
                                                      handleInstall(plugin.id),
                                                    disabled:
                                                      isInstalling &&
                                                      actionPlugin ===
                                                        plugin.id,
                                                    children:
                                                      isInstalling &&
                                                      actionPlugin === plugin.id
                                                        ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            jsxRuntimeExports.Fragment,
                                                            {
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  LoaderCircle,
                                                                  {
                                                                    className:
                                                                      "mr-2 h-4 w-4 animate-spin",
                                                                  },
                                                                ),
                                                                "Installing",
                                                              ],
                                                            },
                                                          )
                                                        : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            jsxRuntimeExports.Fragment,
                                                            {
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  Download,
                                                                  {
                                                                    className:
                                                                      "h-4 w-4",
                                                                  },
                                                                ),
                                                                "Install Plugin",
                                                              ],
                                                            },
                                                          ),
                                                  },
                                                );
                                          })(),
                                        ],
                                      },
                                    ),
                                  ],
                                },
                              ),
                            })
                          : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, {
                              initial: { opacity: 0 },
                              animate: { opacity: 1 },
                              exit: { opacity: 0 },
                              transition: { duration: 0.3 },
                              className:
                                view === "grid"
                                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                  : "space-y-4",
                              children: [
                                !loading &&
                                  !error &&
                                  filteredPlugins.length === 0 &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className: "col-span-full py-8 text-center",
                                    children:
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "p",
                                        {
                                          className: "text-muted-foreground",
                                          children:
                                            "No plugins found matching your criteria.",
                                        },
                                      ),
                                  }),
                                filteredPlugins
                                  .filter((plugin) => {
                                    if (category.id === "all") return true;
                                    if (category.id === "installed")
                                      return plugin.installed;
                                    return plugin.category === category.id;
                                  })
                                  .map((plugin) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      motion.div,
                                      {
                                        layoutId: plugin.id,
                                        whileHover: {
                                          y: -5,
                                          transition: { duration: 0.2 },
                                        },
                                        onClick: () =>
                                          setSelectedPlugin(plugin.id),
                                        children:
                                          view === "grid"
                                            ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                Card,
                                                {
                                                  className:
                                                    "cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-md",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                      CardHeader,
                                                      {
                                                        className: "pb-2",
                                                        children: [
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            "div",
                                                            {
                                                              className:
                                                                "flex items-start justify-between",
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
                                                                    children:
                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                        plugin.icon,
                                                                        {
                                                                          className:
                                                                            "h-5 w-5 text-primary",
                                                                        },
                                                                      ),
                                                                  },
                                                                ),
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  Badge,
                                                                  {
                                                                    variant:
                                                                      plugin.installed
                                                                        ? "outline"
                                                                        : "secondary",
                                                                    children:
                                                                      plugin.installed
                                                                        ? "Installed"
                                                                        : "Free",
                                                                  },
                                                                ),
                                                              ],
                                                            },
                                                          ),
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            CardTitle,
                                                            {
                                                              className:
                                                                "mt-3 text-lg",
                                                              children:
                                                                plugin.name,
                                                            },
                                                          ),
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            CardDescription,
                                                            {
                                                              className:
                                                                "line-clamp-2",
                                                              children:
                                                                plugin.description,
                                                            },
                                                          ),
                                                        ],
                                                      },
                                                    ),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      CardContent,
                                                      {
                                                        className: "pb-2",
                                                        children:
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            "div",
                                                            {
                                                              className:
                                                                "flex items-center justify-between",
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "flex items-center gap-1",
                                                                    children:
                                                                      plugin.rating
                                                                        ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                            jsxRuntimeExports.Fragment,
                                                                            {
                                                                              children:
                                                                                [
                                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                    "div",
                                                                                    {
                                                                                      className:
                                                                                        "flex",
                                                                                      children:
                                                                                        [
                                                                                          ...Array(
                                                                                            5,
                                                                                          ),
                                                                                        ].map(
                                                                                          (
                                                                                            _,
                                                                                            i,
                                                                                          ) =>
                                                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                              Star,
                                                                                              {
                                                                                                className: `h-3 w-3 ${i < Math.floor(plugin.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`,
                                                                                              },
                                                                                              i,
                                                                                            ),
                                                                                        ),
                                                                                    },
                                                                                  ),
                                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                    "span",
                                                                                    {
                                                                                      className:
                                                                                        "text-xs font-medium",
                                                                                      children:
                                                                                        plugin.rating.toFixed(
                                                                                          1,
                                                                                        ),
                                                                                    },
                                                                                  ),
                                                                                ],
                                                                            },
                                                                          )
                                                                        : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                            "span",
                                                                            {
                                                                              className:
                                                                                "text-xs text-muted-foreground",
                                                                              children:
                                                                                "No ratings yet",
                                                                            },
                                                                          ),
                                                                  },
                                                                ),
                                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                  "span",
                                                                  {
                                                                    className:
                                                                      "text-xs text-muted-foreground",
                                                                    children: [
                                                                      plugin.installs,
                                                                      " install",
                                                                      plugin.installs !==
                                                                      1
                                                                        ? "s"
                                                                        : "",
                                                                    ],
                                                                  },
                                                                ),
                                                              ],
                                                            },
                                                          ),
                                                      },
                                                    ),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      CardFooter,
                                                      {
                                                        children:
                                                          plugin.installed
                                                            ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Button,
                                                                {
                                                                  className:
                                                                    "w-full gap-2",
                                                                  size: "sm",
                                                                  variant:
                                                                    "outline",
                                                                  onClick: (
                                                                    e,
                                                                  ) => {
                                                                    e.stopPropagation();
                                                                    handleOpenSettings(
                                                                      plugin.id,
                                                                    );
                                                                  },
                                                                  children:
                                                                    "Configure",
                                                                },
                                                              )
                                                            : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Button,
                                                                {
                                                                  className:
                                                                    "w-full gap-2",
                                                                  size: "sm",
                                                                  onClick: (
                                                                    e,
                                                                  ) => {
                                                                    e.stopPropagation();
                                                                    handleInstall(
                                                                      plugin.id,
                                                                    );
                                                                  },
                                                                  disabled:
                                                                    isInstalling &&
                                                                    actionPlugin ===
                                                                      plugin.id,
                                                                  children:
                                                                    isInstalling &&
                                                                    actionPlugin ===
                                                                      plugin.id
                                                                      ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                          jsxRuntimeExports.Fragment,
                                                                          {
                                                                            children:
                                                                              [
                                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                  LoaderCircle,
                                                                                  {
                                                                                    className:
                                                                                      "mr-2 h-4 w-4 animate-spin",
                                                                                  },
                                                                                ),
                                                                                "Installing",
                                                                              ],
                                                                          },
                                                                        )
                                                                      : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                          jsxRuntimeExports.Fragment,
                                                                          {
                                                                            children:
                                                                              [
                                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                  Download,
                                                                                  {
                                                                                    className:
                                                                                      "h-4 w-4",
                                                                                  },
                                                                                ),
                                                                                "Install",
                                                                              ],
                                                                          },
                                                                        ),
                                                                },
                                                              ),
                                                      },
                                                    ),
                                                  ],
                                                },
                                              )
                                            : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                Card,
                                                {
                                                  className:
                                                    "cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-md",
                                                  children:
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                      CardContent,
                                                      {
                                                        className:
                                                          "flex items-center gap-4 p-4",
                                                        children: [
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            "div",
                                                            {
                                                              className:
                                                                "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
                                                              children:
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  plugin.icon,
                                                                  {
                                                                    className:
                                                                      "h-5 w-5 text-primary",
                                                                  },
                                                                ),
                                                            },
                                                          ),
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            "div",
                                                            {
                                                              className:
                                                                "flex-1",
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  "h3",
                                                                  {
                                                                    className:
                                                                      "font-medium",
                                                                    children:
                                                                      plugin.name,
                                                                  },
                                                                ),
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  "p",
                                                                  {
                                                                    className:
                                                                      "text-sm text-muted-foreground",
                                                                    children:
                                                                      plugin.description,
                                                                  },
                                                                ),
                                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "mt-1 flex items-center gap-2",
                                                                    children: [
                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                        "div",
                                                                        {
                                                                          className:
                                                                            "flex items-center gap-1",
                                                                          children:
                                                                            plugin.rating
                                                                              ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                                  jsxRuntimeExports.Fragment,
                                                                                  {
                                                                                    children:
                                                                                      [
                                                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                          "div",
                                                                                          {
                                                                                            className:
                                                                                              "flex",
                                                                                            children:
                                                                                              [
                                                                                                ...Array(
                                                                                                  5,
                                                                                                ),
                                                                                              ].map(
                                                                                                (
                                                                                                  _,
                                                                                                  i,
                                                                                                ) =>
                                                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                                    Star,
                                                                                                    {
                                                                                                      className: `h-3 w-3 ${i < Math.floor(plugin.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`,
                                                                                                    },
                                                                                                    i,
                                                                                                  ),
                                                                                              ),
                                                                                          },
                                                                                        ),
                                                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                          "span",
                                                                                          {
                                                                                            className:
                                                                                              "text-xs font-medium",
                                                                                            children:
                                                                                              plugin.rating.toFixed(
                                                                                                1,
                                                                                              ),
                                                                                          },
                                                                                        ),
                                                                                      ],
                                                                                  },
                                                                                )
                                                                              : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                  "span",
                                                                                  {
                                                                                    className:
                                                                                      "text-xs text-muted-foreground",
                                                                                    children:
                                                                                      "No ratings yet",
                                                                                  },
                                                                                ),
                                                                        },
                                                                      ),
                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                        "span",
                                                                        {
                                                                          className:
                                                                            "text-xs text-muted-foreground",
                                                                          children:
                                                                            "•",
                                                                        },
                                                                      ),
                                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                        "span",
                                                                        {
                                                                          className:
                                                                            "text-xs text-muted-foreground",
                                                                          children:
                                                                            [
                                                                              plugin.installs,
                                                                              " install",
                                                                              plugin.installs !==
                                                                              1
                                                                                ? "s"
                                                                                : "",
                                                                            ],
                                                                        },
                                                                      ),
                                                                    ],
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
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  Badge,
                                                                  {
                                                                    variant:
                                                                      plugin.installed
                                                                        ? "outline"
                                                                        : "secondary",
                                                                    children:
                                                                      plugin.installed
                                                                        ? "Installed"
                                                                        : "Free",
                                                                  },
                                                                ),
                                                                plugin.installed
                                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                      Button,
                                                                      {
                                                                        size: "sm",
                                                                        variant:
                                                                          "outline",
                                                                        onClick:
                                                                          (
                                                                            e,
                                                                          ) => {
                                                                            e.stopPropagation();
                                                                            handleOpenSettings(
                                                                              plugin.id,
                                                                            );
                                                                          },
                                                                        children:
                                                                          "Configure",
                                                                      },
                                                                    )
                                                                  : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                      Button,
                                                                      {
                                                                        size: "sm",
                                                                        className:
                                                                          "gap-1",
                                                                        onClick:
                                                                          (
                                                                            e,
                                                                          ) => {
                                                                            e.stopPropagation();
                                                                            handleInstall(
                                                                              plugin.id,
                                                                            );
                                                                          },
                                                                        disabled:
                                                                          isInstalling &&
                                                                          actionPlugin ===
                                                                            plugin.id,
                                                                        children:
                                                                          isInstalling &&
                                                                          actionPlugin ===
                                                                            plugin.id
                                                                            ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                                jsxRuntimeExports.Fragment,
                                                                                {
                                                                                  children:
                                                                                    [
                                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                        LoaderCircle,
                                                                                        {
                                                                                          className:
                                                                                            "mr-2 h-3 w-3 animate-spin",
                                                                                        },
                                                                                      ),
                                                                                      "Installing",
                                                                                    ],
                                                                                },
                                                                              )
                                                                            : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                                jsxRuntimeExports.Fragment,
                                                                                {
                                                                                  children:
                                                                                    [
                                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                        Download,
                                                                                        {
                                                                                          className:
                                                                                            "h-3 w-3",
                                                                                        },
                                                                                      ),
                                                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                                        "span",
                                                                                        {
                                                                                          children:
                                                                                            "Install",
                                                                                        },
                                                                                      ),
                                                                                    ],
                                                                                },
                                                                              ),
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
                                      },
                                      plugin.id,
                                    ),
                                  ),
                              ],
                            }),
                      },
                    ),
                  },
                  category.id,
                ),
              ),
            ],
          }),
    ],
  });
}

export { PluginGallery as P };
