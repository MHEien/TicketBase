import {
  Controller,
  All,
  Param,
  Req,
  Res,
  Logger,
  UseGuards,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PluginsProxyService } from './plugins-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PluginProxyResponseDto } from './dto/plugin-proxy-response.dto';

@ApiTags('plugin-proxy')
@Controller('api/plugins/proxy')
export class PluginProxyController {
  private readonly logger = new Logger(PluginProxyController.name);

  constructor(private readonly pluginsProxyService: PluginsProxyService) {}

  @All(':pluginId/*')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Proxy request to plugin server' })
  @ApiResponse({
    status: 200,
    description: 'Request successfully proxied to plugin',
    type: PluginProxyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plugin not found' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({
    name: 'pluginId',
    required: true,
    type: String,
    description: 'ID of the plugin to proxy request to',
  })
  async proxyRequest(
    @Param('pluginId') pluginId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { path, method, headers, body } = req;
      const pluginPath = path.split(`/api/plugins/proxy/${pluginId}/`)[1];

      this.logger.debug(
        `Proxying ${method} request to plugin ${pluginId}: ${pluginPath}`,
      );

      // Convert headers to Record<string, string>
      const stringHeaders: Record<string, string> = {};
      Object.entries(headers).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          stringHeaders[key] = value.join(', ');
        } else if (value) {
          stringHeaders[key] = value;
        }
      });

      // Forward the request to the plugin server
      const response = await this.pluginsProxyService.proxyRequest(
        pluginId,
        pluginPath,
        {
          method,
          headers: stringHeaders,
          body,
        },
      );

      const responseHeaders = response.headers || {};

      // Set response headers
      Object.keys(responseHeaders).forEach((key) => {
        res.setHeader(key, responseHeaders[key]);
      });

      // Send status and body
      return res.status(response.status).send(response.data);
    } catch (error) {
      this.logger.error(
        `Error proxying request: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to proxy request to plugin server',
      );
    }
  }
}
