import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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
}

export async function POST(request: NextRequest) {
  try {
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
    ];
    for (const field of requiredFields) {
      if (!data[field as keyof PluginSubmission]) {
        return NextResponse.json(
          { error: `Field '${field}' is required` },
          { status: 400 },
        );
      }
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

    // Create a unique ID for the submission
    const submissionId = Date.now().toString();

    // Add additional fields for the local submission record
    const submission = {
      ...data,
      id: submissionId,
      submittedAt: new Date().toISOString(),
      status: "pending", // pending, approved, rejected
    };

    // Create the submissions directory if it doesn't exist
    const submissionsDir = join(process.cwd(), "data", "plugin-submissions");
    if (!existsSync(submissionsDir)) {
      await mkdir(submissionsDir, { recursive: true });
    }

    // Save the submission data to a JSON file (locally for tracking)
    const filePath = join(submissionsDir, `${submissionId}.json`);
    await writeFile(filePath, JSON.stringify(submission, null, 2));

    // Prepare data for the plugin server API
    const pluginDto: PublishPluginDto = {
      id: data.name.toLowerCase().replace(/\s+/g, "-"), // generate an id from the name
      name: data.name,
      description: data.description,
      version: data.version,
      category: data.category,
      remoteEntry: data.bundleUrl, // use bundleUrl as remoteEntry
      scope: data.name.toLowerCase().replace(/\s+/g, "_"), // generate a scope from the name
      adminComponents: {
        settings: "./Settings",
      },
      storefrontComponents: {},
      requiredPermissions: [],
    };

    // Submit to the plugin server's marketplace endpoint
    // Use either environment variable or default to localhost during development
    const PLUGIN_SERVER_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const response = await fetch(`${PLUGIN_SERVER_URL}/marketplace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PLUGIN_SERVER_API_KEY || ""}`,
        },
        body: JSON.stringify(pluginDto),
      });

      if (!response.ok) {
        console.error(
          "Failed to submit to plugin server:",
          await response.text(),
        );
        // Still return success to the client but log the error
        // In production, you might want to actually return an error to the client
      }
    } catch (serverError) {
      console.error("Error connecting to plugin server:", serverError);
      // Consider this a non-critical error for now - plugin was saved locally
    }

    // Return success response to the client
    return NextResponse.json({
      success: true,
      message: "Plugin submitted successfully. It will be reviewed shortly.",
      submissionId,
    });
  } catch (error) {
    console.error("Error processing plugin submission:", error);
    return NextResponse.json(
      { error: "Failed to process plugin submission" },
      { status: 500 },
    );
  }
}
