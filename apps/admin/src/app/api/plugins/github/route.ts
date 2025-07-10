import { createServerFileRoute } from "@tanstack/react-start/server";
import { z } from "zod";

const GitHubSetupSchema = z.object({
  repository: z.string().url(),
  branch: z.string().default("main"),
  path: z.string().optional(),
  webhook: z.string().url().optional(),
});

// TODO: Implement GitHub integration with new simplified plugin system

export const ServerRoute = createServerFileRoute("/api/plugins/github").methods(
  {
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
    POST: async ({ request }) => {
      try {
        const body = await request.json();
        const { repository, branch, path, webhook } =
          GitHubSetupSchema.parse(body);

        // Extract plugin ID from repository URL
        const repoMatch = repository.match(
          /github\.com\/[^\/]+\/([^\/]+)(?:\.git)?$/,
        );
        if (!repoMatch) {
          return Response.json(
            { error: "Invalid GitHub repository URL" },
            { status: 400 },
          );
        }

        const pluginId = repoMatch[1].toLowerCase().replace(/[^a-z0-9-]/g, "-");

        // TODO: Implement GitHub integration
        return Response.json({
          success: false,
          error:
            "GitHub integration not yet implemented with new plugin system",
          pluginId,
          repository,
          branch,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return Response.json(
            {
              success: false,
              errors: error.errors.map(
                (e) => `${e.path.join(".")}: ${e.message}`,
              ),
              buildTime: 0,
              bundleSize: 0,
            },
            { status: 400 },
          );
        }

        console.error("GitHub integration error:", error);

        return Response.json(
          {
            success: false,
            errors: [
              error instanceof Error
                ? error.message
                : "GitHub integration failed",
            ],
            buildTime: 0,
            bundleSize: 0,
          },
          { status: 500 },
        );
      }
    },
  },
);
