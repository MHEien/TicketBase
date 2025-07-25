import { createServerFileRoute } from "@tanstack/react-start/server";
import { getSession } from "@/lib/auth-client";

// Define a type for the plugin submission
interface PluginSubmission {
  name: string;
  description: string;
  version: string;
  category: string;
  bundleUrl: string;
  repositoryUrl?: string;
  authorName: string;
  authorEmail: string;
  termsAgreed: boolean;
}

// Define the marketplace API DTO based on the provided example
interface PublishPluginDto {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  remoteEntry: string;
  scope: string;
  extensionPoints?: string[];
  adminComponents?: {
    settings?: string;
    eventCreation?: string;
    dashboard?: string;
    [key: string]: string | undefined;
  };
  storefrontComponents?: {
    checkout?: string;
    eventDetail?: string;
    ticketSelection?: string;
    widgets?: {
      sidebar?: string;
      footer?: string;
      [key: string]: string | undefined;
    };
    [key: string]: string | object | undefined;
  };
  requiredPermissions?: string[];
  metadata?: {
    author?: string;
    authorEmail?: string;
    repositoryUrl?: string;
    submittedAt?: string;
    status?: string;
    [key: string]: any;
  };
}

export const ServerRoute = createServerFileRoute("/api/plugins/submit").methods(
  {
    POST: async ({ request }) => {
      try {
        // Check authentication first
        const session = await getSession();
        if (!session?.accessToken) {
          return Response.json(
            { error: "Authentication required" },
            { status: 401 },
          );
        }

        // Parse JSON from the request
        const data = (await request.json()) as PluginSubmission;

        // Validate required fields
        const requiredFields = [
          "name",
          "description",
          "version",
          "category",
          "bundleUrl",
          "authorName",
          "authorEmail",
          "termsAgreed",
        ];
        for (const field of requiredFields) {
          if (!data[field as keyof PluginSubmission]) {
            return Response.json(
              { error: `Field '${field}' is required` },
              { status: 400 },
            );
          }
        }

        // Validate terms agreement
        if (!data.termsAgreed) {
          return Response.json(
            { error: "You must agree to the terms and conditions" },
            { status: 400 },
          );
        }

        // Validate category
        const validCategories = [
          "payments",
          "marketing",
          "analytics",
          "social",
          "ticketing",
          "layout",
          "seating",
        ];
        if (!validCategories.includes(data.category)) {
          return Response.json(
            {
              error: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
            },
            { status: 400 },
          );
        }

        // Validate bundleUrl is a valid URL or a local path starting with /plugins/
        if (
          !data.bundleUrl.startsWith("/plugins/") &&
          !data.bundleUrl.startsWith("http")
        ) {
          return Response.json(
            {
              error:
                "Bundle URL must be a valid URL or a path to an uploaded plugin",
            },
            { status: 400 },
          );
        }

        // Generate a unique plugin ID
        const pluginId = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        // Check if bundleUrl contains an existing plugin ID and use it to maintain consistency
        let uniquePluginId: string;
        if (data.bundleUrl.includes("/plugins/bundles/")) {
          // Extract plugin ID from bundle URL to maintain consistency
          const bundlePathMatch = data.bundleUrl.match(
            /\/plugins\/bundles\/([^\/]+)/,
          );
          if (bundlePathMatch) {
            uniquePluginId = bundlePathMatch[1];
            console.log(
              `Using existing plugin ID from bundle URL: ${uniquePluginId}`,
            );
          } else {
            uniquePluginId = `${pluginId}-${Date.now()}`;
          }
        } else {
          uniquePluginId = `${pluginId}-${Date.now()}`;
        }

        // Fetch and analyze the plugin bundle to extract metadata
        let pluginMetadata = {
          extensionPoints: [] as string[],
          adminComponents: {
            settings: "./Settings",
          },
          storefrontComponents: {},
          requiredPermissions: [] as string[],
        };

        try {
          // Fetch the plugin bundle content
          const bundleResponse = await fetch(data.bundleUrl);
          if (bundleResponse.ok) {
            const bundleContent = await bundleResponse.text();

            // Extract extension points from the plugin code
            const extensionPointsMatch = bundleContent.match(
              /extensionPoints\s*:\s*\{([\s\S]*?)\}/,
            );
            if (extensionPointsMatch) {
              const extensionPointsContent = extensionPointsMatch[1];
              // Extract extension point names (keys in the object)
              const extensionPointNames =
                extensionPointsContent.match(/["']([^"']+)["']\s*:/g);
              if (extensionPointNames) {
                pluginMetadata.extensionPoints = extensionPointNames.map(
                  (name) => name.replace(/["']/g, "").replace(":", "").trim(),
                );
              }
            }

            // Extract admin components
            const adminComponentsMatch = bundleContent.match(
              /adminComponents\s*:\s*\{([\s\S]*?)\}/,
            );
            if (adminComponentsMatch) {
              const adminContent = adminComponentsMatch[1];
              const settingsMatch = adminContent.match(
                /settings\s*:\s*["']([^"']+)["']/,
              );
              if (settingsMatch) {
                pluginMetadata.adminComponents.settings = settingsMatch[1];
              }
            }

            // Extract storefront components
            const storefrontComponentsMatch = bundleContent.match(
              /storefrontComponents\s*:\s*\{([\s\S]*?)\}/,
            );
            if (storefrontComponentsMatch) {
              const storefrontContent = storefrontComponentsMatch[1];
              const checkoutMatch = storefrontContent.match(
                /checkout\s*:\s*["']([^"']+)["']/,
              );
              if (checkoutMatch) {
                pluginMetadata.storefrontComponents = {
                  ...pluginMetadata.storefrontComponents,
                  checkout: checkoutMatch[1],
                };
              }
            }

            // Extract required permissions
            const permissionsMatch = bundleContent.match(
              /requiredPermissions\s*:\s*\[([\s\S]*?)\]/,
            );
            if (permissionsMatch) {
              const permissionsContent = permissionsMatch[1];
              const permissions = permissionsContent.match(/["']([^"']+)["']/g);
              if (permissions) {
                pluginMetadata.requiredPermissions = permissions.map((p) =>
                  p.replace(/["']/g, "").trim(),
                );
              }
            }

            console.log("Extracted plugin metadata:", pluginMetadata);
          }
        } catch (error) {
          console.warn(
            "Failed to analyze plugin bundle, using defaults:",
            error,
          );
        }

        // Prepare data for the plugin server API
        const pluginDto: PublishPluginDto = {
          id: uniquePluginId,
          name: data.name,
          description: data.description,
          version: data.version,
          category: data.category,
          remoteEntry: data.bundleUrl,
          scope: data.name.toLowerCase().replace(/\s+/g, "_"),
          adminComponents: pluginMetadata.adminComponents,
          storefrontComponents: pluginMetadata.storefrontComponents,
          requiredPermissions: pluginMetadata.requiredPermissions,
          metadata: {
            author: data.authorName,
            authorEmail: data.authorEmail,
            repositoryUrl: data.repositoryUrl || "",
            submittedAt: new Date().toISOString(),
            status: "pending",
          },
        };

        // Submit to the plugin server's marketplace endpoint
        const PLUGIN_SERVER_URL =
          import.meta.env.VITE_PLUGIN_SERVER_URL || "http://localhost:5000";

        try {
          const response = await fetch(`${PLUGIN_SERVER_URL}/marketplace`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(pluginDto),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to submit to plugin server:", errorText);

            // Try to parse error message
            let errorMessage = "Failed to submit plugin to server";
            try {
              const errorData = JSON.parse(errorText);
              errorMessage =
                errorData.message || errorData.error || errorMessage;
            } catch {
              // Use default message if parsing fails
            }

            return Response.json(
              { error: errorMessage },
              { status: response.status },
            );
          }

          const result = await response.json();

          // After successful plugin creation, update the extension points
          if (pluginMetadata.extensionPoints.length > 0) {
            try {
              await fetch(`${PLUGIN_SERVER_URL}/plugins/${uniquePluginId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                  extensionPoints: pluginMetadata.extensionPoints,
                }),
              });
            } catch (updateError) {
              console.warn("Failed to update extension points:", updateError);
              // Don't fail the entire submission if extension points update fails
            }
          }

          // Return success response to the client
          return Response.json({
            success: true,
            message:
              "Plugin submitted successfully. It will be reviewed shortly.",
            submissionId: uniquePluginId,
            plugin: result,
          });
        } catch (serverError) {
          console.error("Error connecting to plugin server:", serverError);
          return Response.json(
            {
              error:
                "Failed to connect to plugin server. Please try again later.",
            },
            { status: 503 },
          );
        }
      } catch (error) {
        console.error("Error processing plugin submission:", error);
        return Response.json(
          { error: "Failed to process plugin submission" },
          { status: 500 },
        );
      }
    },
  },
);
