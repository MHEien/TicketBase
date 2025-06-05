import { NextRequest, NextResponse } from "next/server";
import { PluginBuildService, PluginUploadAPI } from "@/lib/plugin-build-system";
import { z } from "zod";

const GitHubSetupSchema = z.object({
  repository: z.string().url(),
  branch: z.string().default("main"),
  path: z.string().optional(),
  webhook: z.string().url().optional(),
});

const buildService = new PluginBuildService();
const uploadAPI = new PluginUploadAPI(buildService);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repository, branch, path, webhook } = GitHubSetupSchema.parse(body);

    // Extract plugin ID from repository URL
    const repoMatch = repository.match(
      /github\.com\/[^\/]+\/([^\/]+)(?:\.git)?$/,
    );
    if (!repoMatch) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 },
      );
    }

    const pluginId = repoMatch[1].toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Setup GitHub integration
    const result = await uploadAPI.setupGitHubIntegration(
      pluginId,
      repository,
      {
        branch: branch || "main",
        path,
        webhook,
      },
    );

    // If successful, we could also setup webhook here
    if (result.success && webhook) {
      // TODO: Setup GitHub webhook to trigger builds on push
      // This would involve GitHub API calls to register webhook
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
          buildTime: 0,
          bundleSize: 0,
        },
        { status: 400 },
      );
    }

    console.error("GitHub integration error:", error);

    return NextResponse.json(
      {
        success: false,
        errors: [
          error instanceof Error ? error.message : "GitHub integration failed",
        ],
        buildTime: 0,
        bundleSize: 0,
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
