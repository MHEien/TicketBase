import {
  Controller,
  Get,
  Res,
  Req,
  NotFoundException,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@ApiTags('plugin-bundle-proxy')
@Controller('plugins/bundles')
export class BundleProxyController {
  private readonly logger = new Logger(BundleProxyController.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('*')
  @ApiOperation({ summary: 'Proxy bundle requests to plugin server' })
  @ApiParam({ name: 'path', description: 'Full bundle path with version' })
  async proxyBundleRequest(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const pluginServerUrl =
        this.configService.get<string>('plugins.serverUrl');

      if (!pluginServerUrl) {
        throw new Error('Plugin server URL not configured');
      }

      // Extract the path after /api/plugins/bundles/
      const fullPath = req.path;
      const bundlesPath = '/api/plugins/bundles/';
      const path = fullPath.startsWith(bundlesPath)
        ? fullPath.substring(bundlesPath.length)
        : fullPath;

      this.logger.debug(`Proxying bundle request: ${path}`);
      this.logger.debug(`Plugin server URL: ${pluginServerUrl}`);
      this.logger.debug(`Original request path: ${fullPath}`);

      // Construct the target URL - make sure it matches the plugin server's route
      const targetUrl = `${pluginServerUrl}/plugins/bundles/${path}`;

      this.logger.debug(`Target URL: ${targetUrl}`);

      const response = await firstValueFrom(
        this.httpService.get(targetUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: {
            Accept: 'application/javascript, */*',
          },
        }),
      );

      // Set appropriate headers
      res.set({
        'Content-Type': 'application/javascript',
        'Cache-Control': 'max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });

      this.logger.debug(`Successfully proxied bundle request for: ${path}`);

      return new StreamableFile(response.data);
    } catch (error) {
      this.logger.error(
        `Error proxying bundle request for path ${req.path}: ${error.message}`,
      );
      this.logger.error(`Error details:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data?.toString?.(),
        url: error.config?.url,
      });

      // Log the actual response content to debug what we're getting
      if (error.response?.data) {
        const responseText = error.response.data.toString();
        this.logger.error(
          `Response content preview: ${responseText.substring(0, 200)}...`,
        );
      }

      throw new NotFoundException(`Bundle not found: ${error.message}`);
    }
  }
}
