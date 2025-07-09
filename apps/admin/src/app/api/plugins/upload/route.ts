import { createServerFileRoute } from "@tanstack/react-start/server";
import { PluginBuildService, PluginUploadAPI } from "@/lib/plugin-build-system";
import { promises as fs } from "fs";
import * as path from "path";
import * as os from "os";
import JSZip from "jszip";

const buildService = new PluginBuildService();
const uploadAPI = new PluginUploadAPI(buildService);

// Allowed extensions
const allowedExtensions = [".js", ".mjs", ".zip"];

// Define max file size (10MB for ZIP files)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ServerRoute = createServerFileRoute("/api/plugins/upload").methods(
  {
    POST: async ({ request }) => {
      // TODO: Re-enable authentication once JWT issue is resolved
      // const session = await auth();
      // if (!session?.accessToken) {
      //   return NextResponse.json(
      //     { error: "Authentication required" },
      //     { status: 401 }
      //   );
      // }

      try {
        const formData = await request.formData();
        const file = formData.get("plugin") as File;

        if (!file) {
          return Response.json(
            { error: "No plugin file provided" },
            { status: 400 },
          );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return Response.json(
            {
              error: `File size exceeds the maximum limit of ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`,
            },
            { status: 400 },
          );
        }

        let bundleBuffer: Buffer;
        let pluginId: string;
        let version = "1.0.0";
        let pluginMetadata: any = null;

        if (file.name.endsWith(".zip")) {
          // TypeScript Source Upload - Build First
          console.log("Processing TypeScript source upload...");

          // Convert File to Buffer
          const arrayBuffer = await file.arrayBuffer();
          const zipBuffer = Buffer.from(arrayBuffer);

          // Generate plugin ID from filename
          pluginId = file.name
            .replace(".zip", "")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");

          // Build the TypeScript plugin using our build system
          const buildResult = await uploadAPI.uploadSource(pluginId, zipBuffer);

          if (!buildResult.success) {
            return Response.json(
              {
                success: false,
                error: "Build failed",
                details: buildResult.errors,
                buildTime: buildResult.buildTime,
              },
              { status: 400 },
            );
          }

          // Read the built bundle file
          if (!buildResult.bundlePath) {
            return Response.json(
              {
                success: false,
                error: "Build succeeded but no bundle was generated",
              },
              { status: 500 },
            );
          }

          bundleBuffer = await fs.readFile(buildResult.bundlePath);

          // Extract plugin metadata from the ZIP (plugin.json)
          try {
            // Load the ZIP buffer into JSZip
            const zip = new JSZip();
            await zip.loadAsync(zipBuffer);

            // Check for plugin.json
            const pluginJsonFile = zip.file("plugin.json");
            if (pluginJsonFile) {
              const content = await pluginJsonFile.async("text");
              pluginMetadata = JSON.parse(content);

              // Use metadata from plugin.json
              pluginId = pluginMetadata.id || pluginId;
              version = pluginMetadata.version || version;
            }
          } catch (error) {
            console.warn("Could not extract plugin.json metadata:", error);
          }

          console.log(
            `✅ TypeScript build succeeded: ${bundleBuffer.length} bytes`,
          );
        } else if (file.name.endsWith(".js") || file.name.endsWith(".mjs")) {
          // Pre-built JavaScript Upload
          console.log("Processing pre-built JavaScript upload...");

          const arrayBuffer = await file.arrayBuffer();
          bundleBuffer = Buffer.from(arrayBuffer);
          pluginId = file.name
            .replace(/\.(js|mjs)$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");
        } else {
          return Response.json(
            {
              error:
                "Invalid file type. Please upload a .zip (TypeScript source) or .js/.mjs (built bundle) file",
            },
            { status: 400 },
          );
        }

        // Get API server URL for proxying to plugin server
        const API_SERVER_URL =
          process.env.API_SERVER_URL ||
          process.env.NEXT_PUBLIC_API_SERVER_URL ||
          "http://localhost:4000";

        try {
          // Step 1: Upload bundle to storage
          const apiFormData = new FormData();
          const bundleFile = new File([bundleBuffer], `${pluginId}.js`, {
            type: "application/javascript",
          });
          apiFormData.append("file", bundleFile);
          apiFormData.append("pluginId", pluginId);
          apiFormData.append("version", version);

          const storageResponse = await fetch(
            `${API_SERVER_URL}/api/plugins/storage/upload`,
            {
              method: "POST",
              body: apiFormData,
            },
          );

          if (!storageResponse.ok) {
            const errorText = await storageResponse.text();
            console.error("Failed to upload to storage:", {
              status: storageResponse.status,
              error: errorText,
            });
            return Response.json(
              { error: "Failed to upload plugin bundle to storage" },
              { status: 500 },
            );
          }

          const storageData = await storageResponse.json();
          const bundleUrl = storageData.bundleUrl || storageData.url;

          // Step 2: Create plugin metadata entry in MongoDB
          if (pluginMetadata) {
            const metadataPayload = {
              id: pluginMetadata.id,
              name: pluginMetadata.name || pluginMetadata.displayName,
              version: pluginMetadata.version,
              description: pluginMetadata.description,
              category: pluginMetadata.category,
              sourceCode: bundleBuffer.toString("utf8"),
              bundleUrl: bundleUrl,
              requiredPermissions: pluginMetadata.requiredPermissions || [],
            };

            const metadataResponse = await fetch(
              `${API_SERVER_URL}/api/plugins/metadata/create`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(metadataPayload),
              },
            );

            if (!metadataResponse.ok) {
              const errorText = await metadataResponse.text();
              console.error("Failed to create plugin metadata:", {
                status: metadataResponse.status,
                error: errorText,
              });
              // Don't fail the entire upload if metadata creation fails
              console.warn(
                "Plugin bundle uploaded but metadata creation failed",
              );
            } else {
              console.log("✅ Plugin metadata created successfully");
            }
          }

          // Return success response
          return Response.json({
            success: true,
            bundleUrl: bundleUrl,
            fileName: file.name,
            pluginId: pluginId,
            version: version,
            metadata: pluginMetadata,
            buildInfo: file.name.endsWith(".zip")
              ? {
                  compiled: true,
                  originalSize: file.size,
                  bundleSize: bundleBuffer.length,
                }
              : {
                  compiled: false,
                  bundleSize: bundleBuffer.length,
                },
          });
        } catch (serverError) {
          console.error("Error during plugin upload process:", serverError);
          return Response.json(
            { error: "Failed to process plugin upload" },
            { status: 500 },
          );
        }
      } catch (error) {
        console.error("Plugin upload error:", error);
        return Response.json(
          { error: "Failed to process plugin upload" },
          { status: 500 },
        );
      }
    },
    OPTIONS: async () => {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    },
  },
);

// Max file size for the route
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "10mb",
  },
};
