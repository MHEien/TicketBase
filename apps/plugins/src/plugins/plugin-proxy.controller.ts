import {
  Controller,
  All,
  Req,
  Res,
  Headers,
  Param,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PluginRuntimeService } from './services/plugin-runtime.service';
import { JwtAuthGuard } from '../common/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

/**
 * Routes authenticated API requests to plugin backend handlers.
 * This is the main entry point for plugin API calls from the frontend.
 *
 * URL format: ALL /api/plugin-proxy/:pluginId/*path
 */
@ApiTags('plugin-proxy')
@Controller('api/plugin-proxy')
@UseGuards(JwtAuthGuard)
export class PluginProxyController {
  private readonly logger = new Logger(PluginProxyController.name);

  constructor(private readonly runtimeService: PluginRuntimeService) {}

  @ApiOperation({ summary: 'Route requests to plugin backend handlers' })
  @ApiResponse({
    status: 200,
    description: 'Successfully routed the request to the plugin handler',
  })
  @ApiResponse({ status: 401, description: 'Tenant ID is required' })
  @ApiResponse({
    status: 404,
    description: 'Plugin not found or route not matched',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({ name: 'pluginId', description: 'Plugin ID', required: true })
  @All(':pluginId')
  async proxyRoot(
    @Headers('x-tenant-id') tenantId: string,
    @Param('pluginId') pluginId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.routeToPlugin(pluginId, tenantId, '/', req, res);
  }

  @All(':pluginId/*path')
  async proxyWithPath(
    @Headers('x-tenant-id') tenantId: string,
    @Param('pluginId') pluginId: string,
    @Param('path') path: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.routeToPlugin(pluginId, tenantId, `/${path}`, req, res);
  }

  private async routeToPlugin(
    pluginId: string,
    tenantId: string,
    pluginPath: string,
    req: Request,
    res: Response,
  ) {
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant ID is required' });
    }

    this.logger.debug(
      `Plugin API: ${req.method} ${pluginPath} -> plugin ${pluginId} (tenant: ${tenantId})`,
    );

    try {
      const result = await this.runtimeService.handleRoute(
        tenantId,
        pluginId,
        req.method,
        pluginPath,
        req.body,
        req.query as Record<string, string>,
        req.headers as Record<string, string>,
      );

      if (result.headers) {
        for (const [key, value] of Object.entries(result.headers)) {
          res.setHeader(key, value);
        }
      }

      return res.status(result.status).json(result.body);
    } catch (error) {
      this.logger.error(
        `Plugin proxy failed for ${pluginId}: ${error.message}`,
      );
      return res.status(error.status || 500).json({
        error: error.message || 'Plugin handler failed',
      });
    }
  }
}
