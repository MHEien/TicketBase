import { createServerFileRoute } from "@tanstack/react-start/server";
import JSZip from "jszip";

// TODO: Implement plugin upload with new simplified plugin system

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
        // Forward the request directly to the API server which will handle the build process
        const API_SERVER_URL =
          import.meta.env.VITE_API_URL || "http://localhost:4000";

        // Get the form data and forward it
        const formData = await request.formData();
        
        console.log("🔄 Forwarding plugin upload to API server:", API_SERVER_URL);

        const response = await fetch(`${API_SERVER_URL}/api/plugins/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API server upload failed:", {
            status: response.status,
            error: errorText,
          });
          return Response.json(
            { error: `API server error: ${errorText}` },
            { status: response.status },
          );
        }

        const result = await response.json();
        console.log("✅ Plugin upload successful:", result);

        return Response.json(result);
      } catch (error) {
        console.error("Plugin upload proxy error:", error);
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
