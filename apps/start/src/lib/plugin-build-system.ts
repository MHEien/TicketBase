/**
 * Plugin Build System - Platform-managed builds for all plugin types
 *
 * This system handles:
 * - TypeScript compilation
 * - Dependency bundling
 * - Optimization and minification
 * - Compatibility shimming
 * - Hot reloading for development
 * - Production builds with caching
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";

const execAsync = promisify(exec);

// =============================================================================
// PLUGIN MANIFEST SCHEMA
// =============================================================================

const PluginManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  category: z.enum([
    "payment",
    "analytics",
    "marketing",
    "integration",
    "utility",
  ]),
  displayName: z.string(),

  // Entry points
  main: z.string().default("index.tsx"),
  types: z.string().optional(),

  // Extension points this plugin provides
  extensionPoints: z.array(
    z.enum([
      "admin-settings",
      "payment-methods",
      "checkout-confirmation",
      "dashboard-widgets",
      "event-actions",
      "customer-fields",
    ]),
  ),

  // Dependencies
  dependencies: z.record(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),

  // Configuration schema for the plugin
  configSchema: z.any().optional(),

  // Permissions required
  requiredPermissions: z.array(z.string()).default([]),

  // Display settings
  priority: z.number().default(100),
  icon: z.string().optional(),

  // Build settings
  build: z
    .object({
      target: z.enum(["es2020", "es2018", "es5"]).default("es2020"),
      external: z.array(z.string()).default(["react", "react-dom"]),
      minify: z.boolean().default(true),
      sourcemap: z.boolean().default(false),
    })
    .optional(),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

export interface BuildResult {
  success: boolean;
  bundlePath?: string;
  bundleUrl?: string;
  sourceMap?: string;
  assets?: string[];
  errors?: string[];
  warnings?: string[];
  buildTime: number;
  bundleSize: number;
}

export interface PluginUploadOptions {
  type: "source" | "built" | "github";
  source?: {
    files: Map<string, Buffer>; // filename -> content
    manifest: PluginManifest;
  };
  built?: {
    bundleContent: Buffer;
    manifest: PluginManifest;
  };
  github?: {
    repository: string;
    branch?: string;
    path?: string;
    webhook?: string;
  };
}

// =============================================================================
// PLUGIN BUILD SERVICE
// =============================================================================

export class PluginBuildService {
  private buildDir: string;
  private outputDir: string;
  private cacheDir: string;

  constructor(
    buildDir = "/tmp/plugin-builds",
    outputDir = "./public/plugins",
    cacheDir = "./cache/plugin-builds",
  ) {
    this.buildDir = buildDir;
    this.outputDir = outputDir;
    this.cacheDir = cacheDir;
  }

  /**
   * Main entry point - processes plugin upload and returns ready-to-use bundle
   */
  async processPlugin(
    pluginId: string,
    options: PluginUploadOptions,
  ): Promise<BuildResult> {
    const startTime = Date.now();

    try {
      // Create build workspace
      const workspaceDir = path.join(
        this.buildDir,
        pluginId,
        Date.now().toString(),
      );
      await fs.mkdir(workspaceDir, { recursive: true });

      let manifest: PluginManifest;
      let buildResult: BuildResult;

      switch (options.type) {
        case "source":
          buildResult = await this.buildFromSource(
            workspaceDir,
            options.source!,
          );
          break;
        case "built":
          buildResult = await this.processPreBuilt(
            workspaceDir,
            options.built!,
          );
          break;
        case "github":
          buildResult = await this.buildFromGitHub(
            workspaceDir,
            options.github!,
          );
          break;
        default:
          throw new Error(`Unsupported upload type: ${options.type}`);
      }

      buildResult.buildTime = Date.now() - startTime;

      // Note: Bundle URL will be provided by the plugin server after upload
      // We don't deploy locally since the bundle goes through API server to plugin server

      return buildResult;
    } catch (error) {
      return {
        success: false,
        errors: [
          error instanceof Error ? error.message : "Unknown build error",
        ],
        buildTime: Date.now() - startTime,
        bundleSize: 0,
      };
    }
  }

  /**
   * Build from TypeScript source code (RECOMMENDED)
   */
  private async buildFromSource(
    workspaceDir: string,
    source: NonNullable<PluginUploadOptions["source"]>,
  ): Promise<BuildResult> {
    const { files, manifest } = source;

    // Write source files to workspace
    for (const [filename, content] of files) {
      const filePath = path.join(workspaceDir, filename);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content);
    }

    // Check if package.json was uploaded, if not create a basic one
    const packageJsonPath = path.join(workspaceDir, "package.json");
    if (!files.has("package.json")) {
      // Create package.json with proper dependencies
      const packageJson = {
        name: manifest.id,
        version: manifest.version,
        private: true,
        dependencies: {
          "ticketsplatform-plugin-sdk": "latest",
          react: "^18.0.0",
          "react-dom": "^18.0.0",
          ...manifest.dependencies,
        },
        devDependencies: {
          typescript: "^5.0.0",
          "@types/react": "^18.2.0",
          "@types/react-dom": "^18.2.0",
        },
        peerDependencies: {
          react: ">=18.0.0",
          "react-dom": ">=18.0.0",
          ...manifest.peerDependencies,
        },
      };

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } else {
      // Enhance existing package.json to ensure TypeScript is available
      const existingPackageJson = JSON.parse(
        files.get("package.json")!.toString("utf8"),
      );
      existingPackageJson.devDependencies =
        existingPackageJson.devDependencies || {};

      // Ensure TypeScript and types are available
      if (!existingPackageJson.devDependencies.typescript) {
        existingPackageJson.devDependencies.typescript = "^5.0.0";
      }
      if (!existingPackageJson.devDependencies["@types/react"]) {
        existingPackageJson.devDependencies["@types/react"] = "^18.2.0";
      }
      if (!existingPackageJson.devDependencies["@types/react-dom"]) {
        existingPackageJson.devDependencies["@types/react-dom"] = "^18.2.0";
      }

      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(existingPackageJson, null, 2),
      );
    }

    // Check if tsconfig.json was uploaded, if not create a basic one
    if (!files.has("tsconfig.json")) {
      // Create TypeScript config optimized for plugins
      const tsConfig = {
        compilerOptions: {
          target: manifest.build?.target || "es2020",
          lib: ["dom", "dom.iterable", "es6"],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          moduleResolution: "node",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: false,
          jsx: "react-jsx",
          declaration: true,
          outDir: "dist",
        },
        include: ["**/*"],
        exclude: ["node_modules", "dist"],
      };

      await fs.writeFile(
        path.join(workspaceDir, "tsconfig.json"),
        JSON.stringify(tsConfig, null, 2),
      );
    }

    try {
      // Install dependencies
      await execAsync("bun install", { cwd: workspaceDir });

      // TypeScript compilation
      await execAsync("bunx tsc", { cwd: workspaceDir });

      // Bundle with optimizations
      const bundleCmd = [
        "bunx esbuild",
        `dist/${path.basename(manifest.main, path.extname(manifest.main))}.js`,
        "--bundle",
        "--format=iife",
        "--global-name=PluginBundle",
        `--target=${manifest.build?.target || "es2020"}`,
        manifest.build?.minify ? "--minify" : "",
        manifest.build?.sourcemap ? "--sourcemap" : "",
        `--external:${manifest.build?.external?.join(",") || "react,react-dom"}`,
        "--outfile=bundle.js",
      ]
        .filter(Boolean)
        .join(" ");

      await execAsync(bundleCmd, { cwd: workspaceDir });

      // Add plugin system integration wrapper
      await this.wrapBundle(path.join(workspaceDir, "bundle.js"), manifest);

      const bundlePath = path.join(workspaceDir, "bundle.js");
      const stats = await fs.stat(bundlePath);

      return {
        success: true,
        bundlePath,
        bundleSize: stats.size,
        errors: [],
        warnings: [],
        buildTime: 0,
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : "Build failed"],
        bundleSize: 0,
        buildTime: 0,
      };
    }
  }

  /**
   * Add compatibility wrapper to make bundle work with current plugin system
   */
  private async wrapBundle(
    bundlePath: string,
    manifest: PluginManifest,
  ): Promise<void> {
    const originalBundle = await fs.readFile(bundlePath, "utf8");

    const wrappedBundle = `
// Auto-generated plugin wrapper for ${manifest.name} v${manifest.version}
(function(window) {
  'use strict';
  
  // Ensure PluginSDK is available
  if (!window.PluginSDK) {
    console.error('[${manifest.id}] PluginSDK not available');
    return;
  }

  // Plugin bundle
  ${originalBundle}

  // Extract plugin from bundle
  const plugin = typeof PluginBundle !== 'undefined' ? PluginBundle.default || PluginBundle : null;
  
  if (!plugin || !plugin.extensionPoints) {
    console.error('[${manifest.id}] Invalid plugin structure');
    return;
  }

  // Register with current plugin system
  window.__PLUGIN_REGISTRY = window.__PLUGIN_REGISTRY || { registered: {}, register: () => {}, get: () => {} };
  window.__PLUGIN_REGISTRY.registered['${manifest.id}'] = {
    metadata: plugin.metadata || ${JSON.stringify(manifest)},
    extensionPoints: plugin.extensionPoints,
    // Legacy compatibility
    AdminSettingsComponent: plugin.extensionPoints['admin-settings'],
    PaymentMethodComponent: plugin.extensionPoints['payment-methods'],
    CheckoutConfirmationComponent: plugin.extensionPoints['checkout-confirmation']
  };

  console.log('✅ Plugin ${manifest.name} loaded successfully');
  
})(window);
`;

    await fs.writeFile(bundlePath, wrappedBundle);
  }

  /**
   * Process pre-built bundle (validate and wrap)
   */
  private async processPreBuilt(
    workspaceDir: string,
    built: NonNullable<PluginUploadOptions["built"]>,
  ): Promise<BuildResult> {
    const bundlePath = path.join(workspaceDir, "bundle.js");
    await fs.writeFile(bundlePath, built.bundleContent);

    // Add wrapper for compatibility
    await this.wrapBundle(bundlePath, built.manifest);

    const stats = await fs.stat(bundlePath);

    return {
      success: true,
      bundlePath,
      bundleSize: stats.size,
      errors: [],
      warnings: [
        "Pre-built bundles may have compatibility issues. Source uploads are recommended.",
      ],
      buildTime: 0,
    };
  }

  /**
   * Build from GitHub repository (for CI/CD integration)
   */
  private async buildFromGitHub(
    workspaceDir: string,
    github: NonNullable<PluginUploadOptions["github"]>,
  ): Promise<BuildResult> {
    // Clone repository
    const cloneCmd = `git clone ${github.repository} ${workspaceDir}`;
    await execAsync(cloneCmd);

    if (github.branch && github.branch !== "main") {
      await execAsync(`git checkout ${github.branch}`, { cwd: workspaceDir });
    }

    // Change to plugin directory if specified
    const pluginDir = github.path
      ? path.join(workspaceDir, github.path)
      : workspaceDir;

    // Read manifest
    const manifestPath = path.join(pluginDir, "plugin.json");
    const manifestContent = await fs.readFile(manifestPath, "utf8");
    const manifest = PluginManifestSchema.parse(JSON.parse(manifestContent));

    // Read source files
    const files = new Map<string, Buffer>();
    const srcDir = path.join(pluginDir, "src");
    const srcFiles = await this.getAllFiles(srcDir);

    for (const file of srcFiles) {
      const relativePath = path.relative(pluginDir, file);
      const content = await fs.readFile(file);
      files.set(relativePath, content);
    }

    // Build as source
    return this.buildFromSource(workspaceDir, { files, manifest });
  }

  /**
   * Recursively get all files in a directory
   */
  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.getAllFiles(fullPath)));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  private async extractZip(zipBuffer: Buffer): Promise<Map<string, Buffer>> {
    const StreamZip = require("node-stream-zip");
    const os = require("os");
    const files = new Map<string, Buffer>();

    try {
      // Create a temporary file from the buffer
      const tmpPath = path.join(os.tmpdir(), "plugin-" + Date.now() + ".zip");
      await fs.writeFile(tmpPath, zipBuffer);

      // Extract ZIP file
      const zip = new StreamZip.async({ file: tmpPath });
      const entries = await zip.entries();

      for (const entry of Object.values(entries) as any[]) {
        if (!entry.isDirectory) {
          const data = await zip.entryData(entry.name);
          files.set(entry.name, Buffer.from(data));
        }
      }

      await zip.close();

      // Clean up temporary file
      await fs.unlink(tmpPath).catch(() => {}); // Ignore errors

      return files;
    } catch (error) {
      throw new Error(
        `Failed to extract ZIP file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

// =============================================================================
// PLUGIN UPLOAD API ENDPOINTS
// =============================================================================

export class PluginUploadAPI {
  constructor(private buildService: PluginBuildService) {}

  /**
   * Upload plugin source code (ZIP file with TypeScript)
   */
  async uploadSource(
    pluginId: string,
    zipBuffer: Buffer,
  ): Promise<BuildResult> {
    // Extract ZIP and parse files
    const files = await this.extractZip(zipBuffer);

    // Read and validate manifest
    const manifestContent = files.get("plugin.json");
    if (!manifestContent) {
      throw new Error("plugin.json manifest file is required");
    }

    const manifest = PluginManifestSchema.parse(
      JSON.parse(manifestContent.toString("utf8")),
    );

    return this.buildService.processPlugin(pluginId, {
      type: "source",
      source: { files, manifest },
    });
  }

  /**
   * Upload pre-built plugin bundle
   */
  async uploadBuilt(
    pluginId: string,
    bundle: Buffer,
    manifest: PluginManifest,
  ): Promise<BuildResult> {
    return this.buildService.processPlugin(pluginId, {
      type: "built",
      built: { bundleContent: bundle, manifest },
    });
  }

  /**
   * Setup GitHub integration for automatic builds
   */
  async setupGitHubIntegration(
    pluginId: string,
    repository: string,
    options: { branch?: string; path?: string; webhook?: string } = {},
  ): Promise<BuildResult> {
    return this.buildService.processPlugin(pluginId, {
      type: "github",
      github: { repository, ...options },
    });
  }

  private async extractZip(zipBuffer: Buffer): Promise<Map<string, Buffer>> {
    const StreamZip = require("node-stream-zip");
    const os = require("os");
    const files = new Map<string, Buffer>();

    try {
      // Create a temporary file from the buffer
      const tmpPath = path.join(os.tmpdir(), "plugin-" + Date.now() + ".zip");
      await fs.writeFile(tmpPath, zipBuffer);

      // Extract ZIP file
      const zip = new StreamZip.async({ file: tmpPath });
      const entries = await zip.entries();

      for (const entry of Object.values(entries) as any[]) {
        if (!entry.isDirectory) {
          const data = await zip.entryData(entry.name);
          files.set(entry.name, Buffer.from(data));
        }
      }

      await zip.close();

      // Clean up temporary file
      await fs.unlink(tmpPath).catch(() => {}); // Ignore errors

      return files;
    } catch (error) {
      throw new Error(
        `Failed to extract ZIP file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
