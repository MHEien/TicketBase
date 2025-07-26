import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface BuildRequest {
  pluginId: string;
  sourceCode: string;
  packageJson: string;
  callbackUrl: string;
}

export interface BuildResponse {
  pluginId: string;
  success: boolean;
  bundleContent?: string;
  bundleSize?: number;
  error?: string;
  buildLog?: string;
}

@Injectable()
export class GitHubBuildService {
  private readonly logger = new Logger(GitHubBuildService.name);
  private readonly githubToken: string;
  private readonly githubOwner: string;
  private readonly githubRepo: string;

  constructor(private readonly configService: ConfigService) {
    this.githubToken = this.configService.get<string>('GITHUB_TOKEN');
    this.githubOwner = this.configService.get<string>('GITHUB_OWNER', 'your-username');
    this.githubRepo = this.configService.get<string>('GITHUB_REPO', 'ticketsmonorepo');
  }

  /**
   * Trigger a GitHub Actions workflow to build a plugin
   */
  async triggerBuild(request: BuildRequest): Promise<string> {
    this.logger.debug('🚀 Triggering GitHub Actions build for plugin:', request.pluginId);

    try {
      const workflowId = 'plugin-build.yml';
      const ref = 'main'; // or 'master' depending on your default branch

      const response = await axios.post(
        `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/actions/workflows/${workflowId}/dispatches`,
        {
          ref: ref,
          inputs: {
            plugin_source: Buffer.from(request.sourceCode).toString('base64'),
            package_json: Buffer.from(request.packageJson).toString('base64'),
            plugin_id: request.pluginId,
            callback_url: request.callbackUrl,
          },
        },
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      this.logger.debug('✅ GitHub Actions workflow triggered successfully:', {
        pluginId: request.pluginId,
        status: response.status,
        workflowRunId: response.data?.id,
      });

      return `Build triggered for plugin ${request.pluginId}`;
    } catch (error) {
      this.logger.error('❌ Failed to trigger GitHub Actions build:', {
        pluginId: request.pluginId,
        error: error.message,
        response: error.response?.data,
      });
      throw new Error(`Failed to trigger build: ${error.message}`);
    }
  }

  /**
   * Handle the callback from GitHub Actions with the build result
   */
  async handleBuildCallback(response: BuildResponse): Promise<BuildResponse> {
    this.logger.debug('📥 Received build callback:', {
      pluginId: response.pluginId,
      success: response.success,
      bundleSize: response.bundleSize,
    });

    if (response.success && response.bundleContent) {
      this.logger.debug('✅ Build completed successfully:', {
        pluginId: response.pluginId,
        bundleSize: response.bundleSize,
      });
    } else {
      this.logger.error('❌ Build failed:', {
        pluginId: response.pluginId,
        error: response.error,
        buildLog: response.buildLog,
      });
    }

    return response;
  }

  /**
   * Get the status of a workflow run
   */
  async getWorkflowStatus(runId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/actions/runs/${runId}`,
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get workflow status:', error.message);
      throw error;
    }
  }
} 