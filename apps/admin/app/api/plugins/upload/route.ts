import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Allowed extensions
const allowedExtensions = [".js", ".mjs"];

// Define max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Helper function to extract basic plugin info from source code
function extractPluginInfo(sourceCode: string) {
  // Try to extract plugin metadata from definePlugin calls or export statements
  // Look for patterns like: definePlugin({ name: "...", ... }) or export default { name: "...", ... }

  // First try to find definePlugin calls (without 's' flag for compatibility)
  const definePluginMatch = sourceCode.match(
    /definePlugin\s*\(\s*\{([\s\S]*?)\}/,
  );
  let metadataBlock = definePluginMatch ? definePluginMatch[1] : null;

  // If no definePlugin, try to find export default object
  if (!metadataBlock) {
    const exportDefaultMatch = sourceCode.match(
      /export\s+default\s*\{([\s\S]*?)\}/,
    );
    metadataBlock = exportDefaultMatch ? exportDefaultMatch[1] : null;
  }

  // If we found a metadata block, extract from it
  if (metadataBlock) {
    const nameMatch = metadataBlock.match(/name\s*:\s*['"`]([^'"`]+)['"`]/);
    const versionMatch = metadataBlock.match(
      /version\s*:\s*['"`]([^'"`]+)['"`]/,
    );
    const descriptionMatch = metadataBlock.match(
      /description\s*:\s*['"`]([^'"`]+)['"`]/,
    );
    const categoryMatch = metadataBlock.match(
      /category\s*:\s*['"`]([^'"`]+)['"`]/,
    );

    return {
      name: nameMatch ? nameMatch[1] : null,
      version: versionMatch ? versionMatch[1] : null,
      description: descriptionMatch ? descriptionMatch[1] : null,
      category: categoryMatch ? categoryMatch[1] : null,
    };
  }

  // Fallback: try to extract from anywhere in the code, but be more specific
  // Look for object property patterns that are likely plugin metadata
  const nameMatch = sourceCode.match(
    /(?:plugin|meta|config)\s*[:\s]*\{[^}]*name\s*:\s*['"`]([^'"`]+)['"`]/i,
  );
  const versionMatch = sourceCode.match(
    /(?:plugin|meta|config)\s*[:\s]*\{[^}]*version\s*:\s*['"`]([^'"`]+)['"`]/i,
  );
  const descriptionMatch = sourceCode.match(
    /(?:plugin|meta|config)\s*[:\s]*\{[^}]*description\s*:\s*['"`]([^'"`]+)['"`]/i,
  );
  const categoryMatch = sourceCode.match(
    /(?:plugin|meta|config)\s*[:\s]*\{[^}]*category\s*:\s*['"`]([^'"`]+)['"`]/i,
  );

  return {
    name: nameMatch ? nameMatch[1] : null,
    version: versionMatch ? versionMatch[1] : null,
    description: descriptionMatch ? descriptionMatch[1] : null,
    category: categoryMatch ? categoryMatch[1] : null,
  };
}

export async function POST(request: NextRequest) {
  // TODO: Re-enable authentication once we understand the JWT issue
  // const session = await auth();
  // if (!session?.accessToken) {
  //   return NextResponse.json(
  //     { error: "Authentication required" },
  //     { status: 401 }
  //   );
  // }
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

    // Read the file content to extract plugin information (for debugging/validation only)
    const fileContent = await file.text();
    const pluginInfo = extractPluginInfo(fileContent);

    // Get plugin server URL from environment (corrected port)
    const PLUGIN_SERVER_URL =
      process.env.NEXT_PUBLIC_PLUGIN_SERVER_URL ||
      process.env.PLUGIN_SERVER_URL ||
      "http://localhost:5000";

    try {
      // Store the file in MinIO storage directly without creating a plugin entry
      const response = await fetch(
        `${PLUGIN_SERVER_URL}/plugins/storage/upload`,
        {
          method: "POST",
          body: (() => {
            const formData = new FormData();
            const fileBlob = new Blob([fileContent], { type: file.type });
            const newFile = new File([fileBlob], file.name, {
              type: file.type,
            });
            formData.append("file", newFile);
            formData.append("pluginId", pluginId);
            formData.append("version", "1.0.0");
            return formData;
          })(),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to upload to plugin server storage:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: `${PLUGIN_SERVER_URL}/plugins/storage/upload`,
        });
        return NextResponse.json(
          { error: "Failed to upload to plugin server storage" },
          { status: 500 },
        );
      }

      const data = await response.json();

      // Return the URL from the plugin server (no plugin creation)
      return NextResponse.json({
        success: true,
        bundleUrl: data.bundleUrl || data.url,
        fileName: fileName,
        pluginId: pluginId,
        extractedInfo: pluginInfo, // Include extracted info for debugging
      });
    } catch (serverError) {
      console.error(
        "Error connecting to plugin server for upload:",
        serverError,
      );
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
