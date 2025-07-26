import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/auth/decorators/public.decorator';
import { GitHubBuildService, BuildResponse } from './services/github-build.service';
import { PluginsService } from './plugins.service';

@ApiTags('github-build')
@Controller('github-build')
export class GitHubBuildController {
  private readonly logger = new Logger(GitHubBuildController.name);

  constructor(
    private readonly githubBuildService: GitHubBuildService,
    private readonly pluginsService: PluginsService,
  ) {}

  @ApiOperation({ summary: 'Callback endpoint for GitHub Actions build results' })
  @ApiResponse({
    status: 200,
    description: 'Build result processed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid authentication token',
  })
  @Public() // This endpoint is called by GitHub Actions
  @Post('callback')
  async handleBuildCallback(
    @Body() buildResponse: BuildResponse,
    @Headers('authorization') authHeader?: string,
  ) {
    this.logger.debug('📥 Received build callback from GitHub Actions:', {
      pluginId: buildResponse.pluginId,
      success: buildResponse.success,
    });

    // Verify the callback is from GitHub Actions
    const expectedToken = process.env.PLUGIN_BUILD_TOKEN;
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      this.logger.error('❌ Invalid authentication token for build callback');
      throw new UnauthorizedException('Invalid authentication token');
    }

    try {
      // Process the build response
      const processedResponse = await this.githubBuildService.handleBuildCallback(buildResponse);

      if (processedResponse.success && processedResponse.bundleContent) {
        // Convert base64 bundle back to buffer
        const bundleBuffer = Buffer.from(processedResponse.bundleContent, 'base64');
        
        this.logger.debug('💾 Storing built bundle for plugin:', {
          pluginId: processedResponse.pluginId,
          bundleSize: bundleBuffer.length,
        });

        // Store the bundle in MinIO and create plugin entry
        // This would need to be implemented based on your existing storage logic
        // For now, we'll just log that we received a successful build
        this.logger.log('✅ Build completed and bundle received:', {
          pluginId: processedResponse.pluginId,
          bundleSize: bundleBuffer.length,
        });

        // TODO: Store bundle in MinIO and create plugin entry
        // await this.pluginsService.storeBuiltPlugin(processedResponse.pluginId, bundleBuffer);
      } else {
        this.logger.error('❌ Build failed:', {
          pluginId: processedResponse.pluginId,
          error: processedResponse.error,
          buildLog: processedResponse.buildLog,
        });
      }

      return {
        success: true,
        message: 'Build callback processed successfully',
        pluginId: processedResponse.pluginId,
      };
    } catch (error) {
      this.logger.error('❌ Failed to process build callback:', {
        pluginId: buildResponse.pluginId,
        error: error.message,
      });
      throw new BadRequestException(`Failed to process build callback: ${error.message}`);
    }
  }
} 