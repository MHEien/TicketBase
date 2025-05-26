import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json(
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
        return NextResponse.json(
          { error: `Field '${field}' is required` },
          { status: 400 },
        );
      }
    }

    // Validate terms agreement
    if (!data.termsAgreed) {
      return NextResponse.json(
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
      return NextResponse.json(
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
      return NextResponse.json(
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
    const uniquePluginId = `${pluginId}-${Date.now()}`;

    // Prepare data for the plugin server API
    const pluginDto: PublishPluginDto = {
      id: uniquePluginId,
      name: data.name,
      description: data.description,
      version: data.version,
      category: data.category,
      remoteEntry: data.bundleUrl,
      scope: data.name.toLowerCase().replace(/\s+/g, "_"),
      adminComponents: {
        settings: "./Settings",
      },
      storefrontComponents: {},
      requiredPermissions: [],
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
      process.env.PLUGIN_SERVER_URL || "http://localhost:5000";

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
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Use default message if parsing fails
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: response.status },
        );
      }

      const result = await response.json();

      // Return success response to the client
      return NextResponse.json({
        success: true,
        message: "Plugin submitted successfully. It will be reviewed shortly.",
        submissionId: uniquePluginId,
        plugin: result,
      });
    } catch (serverError) {
      console.error("Error connecting to plugin server:", serverError);
      return NextResponse.json(
        {
          error: "Failed to connect to plugin server. Please try again later.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Error processing plugin submission:", error);
    return NextResponse.json(
      { error: "Failed to process plugin submission" },
      { status: 500 },
    );
  }
}
