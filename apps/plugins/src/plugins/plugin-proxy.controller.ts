import {
  Controller,
  All,
  Req,
  Res,
  Headers,
  NotFoundException,
  Param,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PluginsService } from './plugins.service';
import axios from 'axios';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('plugin-proxy')
@Controller('api/plugin-proxy')
export class PluginProxyController {
  private readonly logger = new Logger(PluginProxyController.name);

  constructor(private readonly pluginsService: PluginsService) {}

  @ApiOperation({ summary: 'Proxy requests to plugin services' })
  @ApiResponse({
    status: 200,
    description: 'Successfully proxied the request to the plugin service',
  })
  @ApiResponse({
    status: 401,
    description: 'Tenant ID is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin not found or not installed for this tenant',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'pluginId',
    description: 'Plugin ID',
    required: true,
  })
  @ApiParam({
    name: 'pathSuffix',
    description: 'The path to forward to the plugin service',
    required: false,
  })
  @All(':pluginId/*pathSuffix')
  async proxyRequest(
    @Headers('x-tenant-id') tenantId: string,
    @Param('pluginId') pluginId: string,
    @Param('pathSuffix') pathSuffix: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.debug(`🔍 Received request: ${req.method} ${req.url}`);
    this.logger.debug(`👉 Plugin ID: ${pluginId}, Path Suffix: ${pathSuffix}`);
    this.logger.debug(`📄 Query params: ${JSON.stringify(req.query)}`);
    this.logger.debug(
      `🔑 Headers: ${JSON.stringify(this.sanitizeHeaders(req.headers))}`,
    );

    if (req.body && Object.keys(req.body).length > 0) {
      this.logger.debug(
        `📦 Request body: ${JSON.stringify(req.body, null, 2)}`,
      );
    }

    if (!tenantId) {
      this.logger.warn(`❌ Missing tenant ID in request`);
      return res.status(401).json({ error: 'Tenant ID is required' });
    }

    // Get plugin data
    try {
      this.logger.debug(`🔍 Looking up plugin with ID: ${pluginId}`);
      const plugin = await this.pluginsService.findById(pluginId);
      this.logger.debug(`✅ Found plugin: ${plugin.name} (v${plugin.version})`);

      // Check if plugin is installed for this tenant
      this.logger.debug(
        `🔍 Checking if plugin is installed for tenant: ${tenantId}`,
      );
      const installedPlugins =
        await this.pluginsService.getInstalledPlugins(tenantId);
      const isInstalled = installedPlugins.some((p) => p.id === pluginId);

      if (!isInstalled) {
        this.logger.warn(
          `❌ Plugin ${pluginId} not installed for tenant ${tenantId}`,
        );
        return res
          .status(404)
          .json({ error: `Plugin ${pluginId} not installed` });
      }

      this.logger.debug(
        `✅ Plugin ${pluginId} is installed for tenant ${tenantId}`,
      );

      // Forward request to plugin API service
      // This URL would be configured differently in production
      const targetUrl = `https://api.plugin-service.example.com/${pluginId}/${pathSuffix || ''}`;
      this.logger.debug(`🔀 Forwarding request to: ${targetUrl}`);

      try {
        // Forward the request with tenant context
        this.logger.debug(`📤 Sending ${req.method} request to plugin service`);
        const response = await axios({
          method: req.method,
          url: targetUrl,
          data: req.body,
          headers: {
            ...(req.headers as Record<string, any>),
            'x-tenant-id': tenantId,
          },
          params: req.query,
        });

        this.logger.debug(
          `📥 Received response from plugin service: ${response.status}`,
        );

        // Return the response
        return res
          .status(response.status)
          .set(response.headers as Record<string, string>)
          .json(response.data);
      } catch (error: any) {
        if (error.response) {
          this.logger.error(
            `❌ Plugin service error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
          );
          return res.status(error.response.status).json(error.response.data);
        }
        this.logger.error(`❌ Connection error: ${error.message}`, error.stack);
        return res
          .status(500)
          .json({ error: 'Error connecting to plugin service' });
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(`❌ Plugin not found: ${pluginId}`);
        return res.status(404).json({ error: `Plugin ${pluginId} not found` });
      }
      this.logger.error(`❌ Server error: ${error.message}`, error.stack);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Helper to prevent sensitive data from being logged
  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
