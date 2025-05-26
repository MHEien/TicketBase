import { NextRequest, NextResponse } from "next/server";

// Allowed extensions
const allowedExtensions = [".js", ".mjs"];

// Define max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check if the request has a valid content type
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content type must be multipart/form-data" },
        { status: 400 },
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate that a file was provided
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the maximum limit of ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`,
        },
        { status: 400 },
      );
    }

    // Get file extension and validate it
    const fileName = file.name;
    const fileExtension = "." + fileName.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed extensions: ${allowedExtensions.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Generate a unique plugin ID for the upload
    const pluginId = `plugin-${Date.now()}`;

    // Get plugin server URL from environment (corrected port)
    const PLUGIN_SERVER_URL = process.env.NEXT_PUBLIC_PLUGIN_SERVER_URL || process.env.PLUGIN_SERVER_URL || "http://localhost:5000";
    
    try {
      // Create a new FormData object for the plugin server
      const serverFormData = new FormData();
      serverFormData.append("file", file);
      serverFormData.append("id", pluginId);
      serverFormData.append("name", "Temporary Plugin");
      serverFormData.append("version", "1.0.0");
      serverFormData.append("description", "Uploaded plugin bundle");
      serverFormData.append("category", "payments"); // Default category

      // Upload to plugin server storage
      const response = await fetch(
        `${PLUGIN_SERVER_URL}/plugins/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PLUGIN_SERVER_API_KEY || ""}`,
          },
          body: serverFormData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to upload to plugin server storage:", errorText);
        return NextResponse.json(
          { error: "Failed to upload to plugin server" },
          { status: 500 },
        );
      }

      const data = await response.json();
      
      // Return the URL from the plugin server
      return NextResponse.json({
        success: true,
        bundleUrl: data.bundleUrl || data.url,
        fileName: fileName,
        pluginId: pluginId,
      });
    } catch (serverError) {
      console.error("Error connecting to plugin server for upload:", serverError);
      return NextResponse.json(
        { error: "Failed to connect to plugin server" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

// Max file size for the route
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "10mb",
  },
};
