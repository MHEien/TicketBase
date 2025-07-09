import {
  c as createLucideIcon,
  r as reactExports,
  j as jsxRuntimeExports,
  b as Badge,
  T as Card,
  $ as CardHeader,
  a1 as CardTitle,
  a2 as CardDescription,
  _ as CardContent,
  av as Alert,
  aw as AlertDescription,
  I as Input,
  B as Button,
  a5 as Label,
  a as useRouter,
  ar as Separator,
} from "./main-D54NVj6U.js";
import {
  T as Tabs,
  a as TabsList,
  b as TabsTrigger,
  c as TabsContent,
} from "./tabs-DWHFZA6o.js";
import { P as Progress } from "./progress-CdUsEqSy.js";
import { U as Upload } from "./upload-BX4izcAV.js";
import { C as CircleCheckBig } from "./circle-check-big-BM710K4p.js";
import { C as Clock } from "./clock-BDerWfP-.js";
import { A as ArrowLeft } from "./arrow-left-D-CnOb33.js";
import "./index-DACOVT_t.js";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const FileCode = createLucideIcon("FileCode", [
  ["path", { d: "M10 12.5 8 15l2 2.5", key: "1tg20x" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5", key: "yinavb" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
      key: "1mlx9k",
    },
  ],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Github = createLucideIcon("Github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef",
    },
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const HardDrive = createLucideIcon("HardDrive", [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr",
    },
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }],
]);

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Zap = createLucideIcon("Zap", [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db",
    },
  ],
]);

function PluginUploadInterface() {
  const [activeTab, setActiveTab] = reactExports.useState("source");
  const [uploading, setUploading] = reactExports.useState(false);
  const [buildResult, setBuildResult] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [sourceFile, setSourceFile] = reactExports.useState(null);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [githubRepo, setGithubRepo] = reactExports.useState("");
  const [githubBranch, setGithubBranch] = reactExports.useState("main");
  const [githubPath, setGithubPath] = reactExports.useState("");
  const handleDrop = reactExports.useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find((file) => file.name.endsWith(".zip"));
    if (zipFile) {
      setSourceFile(zipFile);
    }
  }, []);
  const handleDragOver = reactExports.useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const handleDragLeave = reactExports.useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  const uploadSourceCode = async () => {
    if (!sourceFile) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("plugin", sourceFile);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      const response = await fetch("/api/plugins/upload", {
        method: "POST",
        body: formData,
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      const result = await response.json();
      setBuildResult(result);
    } catch (error) {
      setBuildResult({
        success: false,
        errors: [
          "Upload failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        ],
        buildTime: 0,
        bundleSize: 0,
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2e3);
    }
  };
  const setupGitHubIntegration = async () => {
    if (!githubRepo) return;
    setUploading(true);
    try {
      const response = await fetch("/api/plugins/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository: githubRepo,
          branch: githubBranch || "main",
          path: githubPath || void 0,
        }),
      });
      const result = await response.json();
      setBuildResult(result);
    } catch (error) {
      setBuildResult({
        success: false,
        errors: [
          "GitHub setup failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        ],
        buildTime: 0,
        bundleSize: 0,
      });
    } finally {
      setUploading(false);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };
  const formatBuildTime = (ms) => {
    if (ms < 1e3) return `${ms}ms`;
    return `${(ms / 1e3).toFixed(1)}s`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "max-w-4xl mx-auto space-y-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
            className: "text-3xl font-bold",
            children: "Upload Plugin",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-muted-foreground",
            children:
              "Upload your plugin source code and let our platform handle the build process",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, {
            className: "grid w-full grid-cols-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                value: "source",
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, {
                    className: "h-4 w-4",
                  }),
                  "Source Code",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, {
                    variant: "secondary",
                    className: "text-xs",
                    children: "Recommended",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                value: "github",
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Github, {
                    className: "h-4 w-4",
                  }),
                  "GitHub",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, {
                value: "built",
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, {
                    className: "h-4 w-4",
                  }),
                  "Pre-built",
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: "source",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, {
                          className: "h-5 w-5",
                        }),
                        "Upload TypeScript Source Code",
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
                      children:
                        "Upload a ZIP file containing your plugin source code with TypeScript. Our platform will compile, bundle, and optimize it automatically.",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, {
                          className: "h-4 w-4",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          AlertDescription,
                          {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                                children: "Required files:",
                              }),
                              " plugin.json (manifest), src/index.tsx (entry point), package.json (optional)",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                                children: "Benefits:",
                              }),
                              " Full TypeScript support, automatic optimization, type checking, dependency resolution",
                            ],
                          },
                        ),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: `border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}`,
                      onDrop: handleDrop,
                      onDragOver: handleDragOver,
                      onDragLeave: handleDragLeave,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, {
                          className:
                            "h-12 w-12 mx-auto mb-4 text-muted-foreground",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-lg font-medium",
                              children: sourceFile
                                ? sourceFile.name
                                : "Drop your plugin ZIP file here",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-sm text-muted-foreground",
                              children: "or click to browse files",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                              type: "file",
                              accept: ".zip",
                              onChange: (e) =>
                                setSourceFile(e.target.files?.[0] || null),
                              className: "max-w-xs mx-auto",
                            }),
                          ],
                        }),
                      ],
                    }),
                    uploading &&
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex justify-between text-sm",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                children: "Building plugin...",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                children: [uploadProgress, "%"],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, {
                            value: uploadProgress,
                          }),
                        ],
                      }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                      onClick: uploadSourceCode,
                      disabled: !sourceFile || uploading,
                      className: "w-full",
                      size: "lg",
                      children: uploading
                        ? "Building..."
                        : "Upload & Build Plugin",
                    }),
                  ],
                }),
              ],
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: "github",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Github, {
                          className: "h-5 w-5",
                        }),
                        "GitHub Integration",
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
                      children:
                        "Connect your GitHub repository for automatic builds on every push. Perfect for CI/CD workflows and collaborative development.",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, {
                          className: "h-4 w-4",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          AlertDescription,
                          {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                                children: "Auto-deploy:",
                              }),
                              " Every push to your repository will trigger a new build and deployment. Webhooks will be configured automatically.",
                            ],
                          },
                        ),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                              htmlFor: "repo",
                              children: "Repository URL",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                              id: "repo",
                              placeholder:
                                "https://github.com/user/plugin-repo",
                              value: githubRepo,
                              onChange: (e) => setGithubRepo(e.target.value),
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                              htmlFor: "branch",
                              children: "Branch",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                              id: "branch",
                              placeholder: "main",
                              value: githubBranch,
                              onChange: (e) => setGithubBranch(e.target.value),
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          htmlFor: "path",
                          children: "Plugin Path (optional)",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                          id: "path",
                          placeholder:
                            "plugins/my-plugin (if plugin is in a subdirectory)",
                          value: githubPath,
                          onChange: (e) => setGithubPath(e.target.value),
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                      onClick: setupGitHubIntegration,
                      disabled: !githubRepo || uploading,
                      className: "w-full",
                      size: "lg",
                      children: uploading
                        ? "Setting up..."
                        : "Setup GitHub Integration",
                    }),
                  ],
                }),
              ],
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, {
            value: "built",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, {
                          className: "h-5 w-5",
                        }),
                        "Upload Pre-built Bundle",
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, {
                      children:
                        "Upload a pre-compiled JavaScript bundle. Use this if you have your own build process.",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, {
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, {
                          className: "h-4 w-4",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          AlertDescription,
                          {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                                children: "Not recommended:",
                              }),
                              " Pre-built bundles may have compatibility issues. Source code uploads provide better optimization and type safety.",
                            ],
                          },
                        ),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          children: "JavaScript Bundle",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                          type: "file",
                          accept: ".js",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
                          children: "Plugin Manifest (plugin.json)",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                          type: "file",
                          accept: ".json",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                      disabled: true,
                      className: "w-full",
                      size: "lg",
                      children: "Upload Pre-built Bundle",
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      buildResult &&
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, {
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, {
                className: "flex items-center gap-2",
                children: [
                  buildResult.success
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, {
                        className: "h-5 w-5 text-green-500",
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, {
                        className: "h-5 w-5 text-red-500",
                      }),
                  "Build ",
                  buildResult.success ? "Successful" : "Failed",
                ],
              }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, {
              className: "space-y-4",
              children: [
                buildResult.success &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-2 text-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                            className: "h-4 w-4 text-muted-foreground",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            children: [
                              "Build time: ",
                              formatBuildTime(buildResult.buildTime),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-2 text-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, {
                            className: "h-4 w-4 text-muted-foreground",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            children: [
                              "Bundle size: ",
                              formatFileSize(buildResult.bundleSize),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-2 text-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CircleCheckBig,
                            { className: "h-4 w-4 text-green-500" },
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            children: "Ready to deploy",
                          }),
                        ],
                      }),
                    ],
                  }),
                buildResult.success &&
                  buildResult.bundleUrl &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, {
                        children: [
                          "Your plugin has been built and deployed successfully! Bundle URL: ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("code", {
                            className: "text-sm",
                            children: buildResult.bundleUrl,
                          }),
                        ],
                      }),
                    ],
                  }),
                buildResult.warnings &&
                  buildResult.warnings.length > 0 &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                            children: "Warnings:",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                            className: "list-disc list-inside mt-2",
                            children: buildResult.warnings.map((warning, i) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "li",
                                { className: "text-sm", children: warning },
                                i,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                buildResult.errors &&
                  buildResult.errors.length > 0 &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, {
                    variant: "destructive",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, {
                        className: "h-4 w-4",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                            children: "Errors:",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                            className: "list-disc list-inside mt-2",
                            children: buildResult.errors.map((error, i) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "li",
                                { className: "text-sm", children: error },
                                i,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
    ],
  });
}

const SplitComponent = function SubmitPluginPage() {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "space-y-6 pb-24",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-2xl font-bold tracking-tight",
                children: "Submit a Plugin",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-muted-foreground",
                children:
                  "Upload your TypeScript plugin source code and let our platform handle the build process.",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
            variant: "outline",
            onClick: () =>
              router.navigate({
                to: "/admin/settings/plugins",
              }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, {
                className: "mr-2 h-4 w-4",
              }),
              "Back to Plugins",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PluginUploadInterface, {}),
    ],
  });
};

export { SplitComponent as component };
