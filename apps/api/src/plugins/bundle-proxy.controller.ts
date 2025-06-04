import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
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

  @Get('*path')
  @ApiOperation({ summary: 'Proxy versioned bundle requests to plugin server' })
  @ApiParam({ name: 'path', description: 'Full bundle path with version' })
  async proxyBundleRequest(
    @Param('path') path: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const pluginServerUrl =
        this.configService.get<string>('plugins.serverUrl');

      if (!pluginServerUrl) {
        throw new Error('Plugin server URL not configured');
      }

      // FIX: Convert commas back to slashes since NestJS converts slashes to commas in wildcard params
      const actualPath = path.replace(/,/g, '/');

      this.logger.log(
        `Proxying bundle request to plugin server. Original path: ${path}, Converted: ${actualPath}`,
      );

      // Make sure to construct the URL correctly with proper slashes
      const targetUrl = `${pluginServerUrl}/plugins/bundles/${actualPath}`;

      this.logger.debug(`Target URL: ${targetUrl}`);

      const response = await firstValueFrom(
        this.httpService.get(targetUrl, {
          responseType: 'arraybuffer',
          timeout: 30000, // Add timeout
        }),
      );

      // Set headers from plugin server response
      res.set({
        'Content-Type':
          response.headers['content-type'] || 'application/javascript',
        'Cache-Control':
          response.headers['cache-control'] || 'max-age=31536000, immutable',
      });

      return new StreamableFile(response.data);
    } catch (error) {
      this.logger.error(
        `Error proxying bundle request for path ${path}: ${error.message}`,
      );
      this.logger.error(`Error details:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new NotFoundException(`Bundle not found: ${error.message}`);
    }
  }
}
