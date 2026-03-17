import {
  Controller,
  Post,
  All,
  Param,
  Headers,
  Body,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PluginRuntimeService } from './services/plugin-runtime.service';
import { Public } from '../common/auth/decorators/public.decorator';

/**
 * Handles webhook requests for plugins.
 * Webhooks are typically called by external services (e.g., Stripe, SendGrid)
 * and routed to the appropriate plugin handler.
 */
@Controller('webhooks/plugins')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly runtimeService: PluginRuntimeService) {}

  /**
   * Route webhook requests to plugin handlers.
   * URL format: POST /webhooks/plugins/:pluginId/:path*
   *
   * Webhooks are public (no JWT auth) because they come from external services.
   * Plugins should verify webhook signatures themselves (e.g., Stripe webhook secret).
   */
  @Public()
  @All(':pluginId')
  async handleWebhookRoot(
    @Param('pluginId') pluginId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.routeToPlugin(pluginId, tenantId, '/webhooks', req, res);
  }

  @Public()
  @All(':pluginId/*path')
  async handleWebhookWithPath(
    @Param('pluginId') pluginId: string,
    @Param('path') path: string,
    @Headers('x-tenant-id') tenantId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.routeToPlugin(
      pluginId,
      tenantId,
      `/webhooks/${path}`,
      req,
      res,
    );
  }

  private async routeToPlugin(
    pluginId: string,
    tenantId: string,
    pluginPath: string,
    req: Request,
    res: Response,
  ) {
    // For webhooks, tenant ID might come from query params or be embedded in the path
    const effectiveTenantId =
      tenantId ||
      (req.query.tenantId as string) ||
      'default';

    this.logger.log(
      `Webhook: ${req.method} /webhooks/plugins/${pluginId}${pluginPath} (tenant: ${effectiveTenantId})`,
    );

    try {
      const result = await this.runtimeService.handleRoute(
        effectiveTenantId,
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
        `Webhook handling failed for plugin ${pluginId}: ${error.message}`,
      );
      return res.status(error.status || 500).json({
        error: error.message || 'Plugin webhook handler failed',
      });
    }
  }
}
