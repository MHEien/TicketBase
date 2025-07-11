import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Request,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PluginsProxyService } from './plugins-proxy.service';
import {
  PublicPluginDto,
  PublicInstalledPluginDto,
} from './dto/public-plugin.dto';
import {
  Plugin,
  InstalledPlugin,
  PluginStatus,
  PluginCategory,
} from './types/plugin.types';

@ApiTags('Public Plugins')
@Controller('public/plugins')
export class PublicPluginsController {
  constructor(private readonly pluginsService: PluginsProxyService) {}

  @Get('available')
  @ApiOperation({
    summary: 'Get all available plugins (public endpoint)',
    description:
      'Returns all active plugins available for installation. No authentication required.',
  })
  @ApiQuery({
    name: 'category',
    description: 'Filter by plugin category',
    required: false,
    example: 'payment',
  })
  @ApiQuery({
    name: 'extensionPoint',
    description: 'Filter by extension point',
    required: false,
    example: 'payment-methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Available plugins retrieved successfully',
    type: [PublicPluginDto],
  })
  async getAvailablePlugins(
    @Query('category') category?: string,
    @Query('extensionPoint') extensionPoint?: string,
  ): Promise<PublicPluginDto[]> {
    try {
      let plugins: Plugin[];

      if (category) {
        plugins = await this.pluginsService.findByCategory(
          category as PluginCategory,
        );
      } else if (extensionPoint) {
        plugins =
          await this.pluginsService.findByExtensionPoint(extensionPoint);
      } else {
        plugins = await this.pluginsService.findAll(PluginStatus.ACTIVE);
      }

      // Transform to public DTOs (exclude sensitive data)
      return plugins.map((plugin) => this.transformToPublicDto(plugin));
    } catch {
      throw new NotFoundException('Failed to retrieve available plugins');
    }
  }

  @Get('organizations/:organizationId/enabled')
  @ApiOperation({
    summary: 'Get enabled plugins for organization (public endpoint)',
    description:
      'Returns enabled plugins for a specific organization. Used by storefront to render extension points.',
  })
  @ApiQuery({
    name: 'extensionPoint',
    description: 'Filter by extension point',
    required: false,
    example: 'payment-methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Enabled plugins retrieved successfully',
    type: [PublicInstalledPluginDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid organization ID' })
  async getEnabledPlugins(
    @Param('organizationId') organizationId: string,
    @Query('extensionPoint') extensionPoint?: string,
  ): Promise<PublicInstalledPluginDto[]> {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    try {
      // Use the new public methods that call plugin server public endpoints
      const installedPlugins =
        await this.pluginsService.getEnabledPluginsPublic(
          organizationId,
          extensionPoint,
        );

      // Transform to public DTOs (exclude sensitive configuration)
      return installedPlugins.map((installed) =>
        this.transformToPublicInstalledDto(installed),
      );
    } catch {
      throw new NotFoundException(
        'Organization not found or no enabled plugins',
      );
    }
  }

  @Get('organizations/:organizationId/payment')
  @ApiOperation({
    summary: 'Get payment plugins for organization (public endpoint)',
    description: 'Returns enabled payment plugins for checkout processing.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment plugins retrieved successfully',
    type: [PublicInstalledPluginDto],
  })
  async getPaymentPlugins(
    @Param('organizationId') organizationId: string,
  ): Promise<PublicInstalledPluginDto[]> {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    try {
      // Use the new public methods that call plugin server public endpoints
      const paymentPlugins =
        await this.pluginsService.getPaymentPluginsPublic(organizationId);

      return paymentPlugins.map((installed) =>
        this.transformToPublicInstalledDto(installed),
      );
    } catch {
      throw new NotFoundException(
        'Organization not found or no payment plugins',
      );
    }
  }

  @Get('bundles/:pluginId')
  @ApiOperation({
    summary: 'Get plugin bundle URL (public endpoint)',
    description:
      'Returns the secure bundle URL for loading plugin JavaScript code.',
  })
  @ApiQuery({
    name: 'version',
    description: 'Specific version to load',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Bundle URL retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        bundleUrl: { type: 'string' },
        pluginId: { type: 'string' },
        version: { type: 'string' },
        extensionPoints: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async getPluginBundle(
    @Param('pluginId') pluginId: string,
    @Query('version') version?: string,
  ): Promise<{
    bundleUrl: string;
    pluginId: string;
    version: string;
    extensionPoints: string[];
  }> {
    if (!pluginId) {
      throw new BadRequestException('Plugin ID is required');
    }

    try {
      // Get plugin details to verify it exists and is active
      const plugin = await this.pluginsService.findOne(pluginId);

      // Check if plugin is explicitly marked as inactive or deprecated
      // If no status is set, assume it's active for backward compatibility
      if (
        plugin.status === PluginStatus.INACTIVE ||
        plugin.status === PluginStatus.DEPRECATED ||
        plugin.status === PluginStatus.REMOVED
      ) {
        throw new NotFoundException('Plugin is not active');
      }

      // For now, return the plugin's bundleUrl directly
      // In the future, this could generate secure, time-limited URLs
      return {
        bundleUrl: plugin.bundleUrl || '',
        pluginId: plugin.id,
        version: version || plugin.version,
        extensionPoints: plugin.extensionPoints || [],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw our specific errors
      }
      throw new NotFoundException('Plugin bundle not found');
    }
  }

  /**
   * Transform internal Plugin entity to public DTO
   * Excludes sensitive administrative data
   */
  private transformToPublicDto(plugin: Plugin): PublicPluginDto {
    return {
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      description: plugin.description,
      author: (plugin.metadata?.author as string) || 'Unknown',
      category: plugin.category,
      displayName: (plugin.metadata?.displayName as string) || plugin.name,
      priority: (plugin.metadata?.priority as number) || 0,
      status: plugin.status,
      extensionPoints: plugin.extensionPoints || [],
      metadata: {
        // Only include safe, public metadata
        displayName: plugin.metadata?.displayName as string,
        iconUrl: plugin.metadata?.iconUrl as string,
        paymentProvider: plugin.metadata?.paymentProvider as string,
        supportedMethods: plugin.metadata?.supportedMethods as string[],
        supportedCurrencies: plugin.metadata?.supportedCurrencies as string[],
        // Exclude any sensitive metadata like API keys, secrets, etc.
      },
      bundleUrl: plugin.bundleUrl,
      createdAt: plugin.createdAt.toISOString(),
      updatedAt: plugin.updatedAt.toISOString(),
    };
  }

  /**
   * Transform internal InstalledPlugin entity to public DTO
   * Excludes sensitive configuration data
   */
  private transformToPublicInstalledDto(
    installed: InstalledPlugin,
  ): PublicInstalledPluginDto {
    // Handle flattened structure from plugins server where plugin details are merged into installed plugin
    const plugin = installed.plugin || {
      id: installed.pluginId || (installed as any).id,
      name: (installed as any).name || 'Unknown Plugin',
      version: (installed as any).version || '1.0.0',
      description: (installed as any).description || '',
      category: (installed as any).category || 'other',
      status: (installed as any).status || 'active',
      bundleUrl: (installed as any).bundleUrl,
      extensionPoints: (installed as any).extensionPoints || [],
      requiredPermissions: (installed as any).requiredPermissions || [],
      metadata: (installed as any).metadata || {},
      createdAt: new Date((installed as any).createdAt || Date.now()),
      updatedAt: new Date((installed as any).updatedAt || Date.now()),
    };

    // Helper function to safely convert date to ISO string
    const toISOString = (
      date: string | Date | { $date: string } | null | undefined,
    ): string => {
      if (!date) return new Date().toISOString();
      if (typeof date === 'string') return date;
      if (date instanceof Date) return date.toISOString();
      if (typeof date === 'object' && '$date' in date) return date.$date; // MongoDB date format
      return new Date(date as string).toISOString();
    };

    return {
      id: installed.id || (installed as any)._id,
      pluginId: installed.pluginId || (installed as any).id,
      organizationId: installed.organizationId || (installed as any).tenantId,
      isEnabled:
        installed.enabled !== undefined
          ? installed.enabled
          : (installed as any).enabled,
      installedAt: toISOString(
        installed.installedAt || (installed as any).installedAt,
      ),
      lastUpdated: toISOString(
        installed.updatedAt || (installed as any).updatedAt,
      ),
      plugin: this.transformToPublicDto(plugin),
      // NOTE: Configuration is intentionally excluded for security
      // Storefront should never have access to sensitive plugin configuration
    };
  }

  @Post('plugins/:pluginId/actions')
  @ApiOperation({
    summary: 'Execute a plugin backend action (authenticated endpoint)',
    description:
      'Execute a secure backend action for a plugin, such as creating payment sessions. Requires authentication.',
  })
  @ApiParam({
    name: 'pluginId',
    description: 'Plugin ID',
    required: true,
  })
  @ApiBody({
    description: 'Action details',
    schema: {
      type: 'object',
      properties: {
        action: { type: 'string', example: 'create-checkout-session' },
        parameters: {
          type: 'object',
          example: {
            amount: 2000,
            currency: 'usd',
            successUrl: 'https://example.com/success',
            cancelUrl: 'https://example.com/cancel',
          },
        },
        metadata: { type: 'object', example: { orderId: '12345' } },
      },
      required: ['action', 'parameters'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Action executed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        action: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({
    status: 404,
    description: 'Plugin not found or action not supported',
  })
  async executePluginAction(
    @Request() req,
    @Param('pluginId') pluginId: string,
    @Body() actionData: { action: string; parameters: any; metadata?: any },
  ): Promise<any> {
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }

    const organizationId = req.user.tenantId;
    if (!organizationId) {
      throw new UnauthorizedException('Organization ID required');
    }

    if (!pluginId) {
      throw new BadRequestException('Plugin ID is required');
    }

    if (!actionData.action) {
      throw new BadRequestException('Action is required');
    }

    try {
      return await this.pluginsService.executePluginAction(
        organizationId,
        pluginId,
        actionData.action,
        actionData.parameters,
        actionData.metadata,
        req.headers.authorization?.replace('Bearer ', ''),
      );
    } catch (error) {
      throw new NotFoundException(
        `Failed to execute plugin action: ${error.message}`,
      );
    }
  }
}
