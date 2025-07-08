import { Controller, All, Req, Param, UseGuards, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PluginsProxyService, ProxyResponse } from './plugins-proxy.service';
import { PluginProxyResponseDto } from './dto/plugin-proxy-response.dto';

@ApiTags('plugin-proxy')
@Controller('api/plugins/proxy')
export class PluginProxyController {
  private readonly logger = new Logger(PluginProxyController.name);

  constructor(private readonly pluginsProxyService: PluginsProxyService) {}

  @All('/:pluginId/*path')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Proxy request to plugin server' })
  @ApiParam({ name: 'pluginId', description: 'Plugin ID', type: 'string' })
  @ApiParam({ 
    name: 'path', 
    description: 'Path to proxy', 
    type: 'string',
    style: 'simple',
    explode: false,
    allowReserved: true
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully proxied request',
    type: PluginProxyResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plugin not found' })
  @ApiBearerAuth()
  async proxyRequest(
    @Param('pluginId') pluginId: string,
    @Param('path') path: string,
    @Req() request: Request,
  ): Promise<ProxyResponse> {
    this.logger.debug(`Proxying request to plugin ${pluginId}, path: ${path}`);

    // Extract request details
    const { method, headers: rawHeaders, body } = request;

    // Convert headers to Record<string, string>
    const headers: Record<string, string> = {};
    Object.entries(rawHeaders).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      } else if (Array.isArray(value)) {
        headers[key] = value.join(', ');
      }
    });

    // Remove host header as it will be set by the proxy
    delete headers.host;

    return this.pluginsProxyService.proxyRequest(pluginId, path, {
      method: method || 'GET',
      headers,
      body,
    });
  }
}
