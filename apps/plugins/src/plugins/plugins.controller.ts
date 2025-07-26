import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  NotFoundException,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PluginsService } from './plugins.service';
import { InstallPluginDto } from './dto/install-plugin.dto';
import { UpdatePluginStatusDto } from './dto/update-plugin-status.dto';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../common/auth/decorators/public.decorator';
import { Roles } from '../common/auth/decorators/roles.decorator';
import { Response } from 'express';
import { PluginStorageService } from './services/plugin-storage.service';
import { PluginActionService } from './services/plugin-action.service';
import {
  ExecutePluginActionDto,
  PluginActionResponseDto,
} from './dto/plugin-action.dto';

@ApiTags('plugins')
@Controller('plugins')
@ApiBearerAuth()
export class PluginsController {
  constructor(
    private readonly pluginsService: PluginsService,
    private readonly pluginStorageService: PluginStorageService,
    private readonly pluginActionService: PluginActionService,
  ) {}

  @ApiOperation({ summary: 'Get all available plugins' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all plugins available in the system',
  })
  @Public() // No auth required for public catalog
  @Get('available')
  async getAvailablePlugins() {
    return this.pluginsService.findAll();
  }

  @ApiOperation({ summary: 'Get all installed plugins for a tenant' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of plugins installed for the tenant',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @Get('installed')
  async getInstalledPlugins(@Request() req) {
    const logger = new Logger('PluginsController.getInstalledPlugins');

    logger.debug('🔍 Request received for installed plugins');
    logger.debug('📋 Request headers:', {
      authorization: req.headers.authorization ? '[PRESENT]' : '[MISSING]',
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent'],
    });

    if (!req.user) {
      logger.error('❌ No user found in request - authentication failed');
      throw new UnauthorizedException('Authentication required');
    }

    logger.debug('👤 Authenticated user:', {
      userId: req.user.userId,
      email: req.user.email,
      tenantId: req.user.tenantId,
      role: req.user.role,
    });

    // Tenant ID is now automatically extracted from the JWT token
    const tenantId = req.user.tenantId;

    if (!tenantId) {
      logger.error('❌ No tenant ID found in user context');
      throw new UnauthorizedException('Tenant ID required');
    }

    logger.debug('🏢 Using tenant ID:', tenantId);

    try {
      const result = await this.pluginsService.getInstalledPlugins(tenantId);
      logger.debug('✅ Successfully retrieved plugins:', {
        count: result.length,
        tenantId: tenantId,
      });
      return result;
    } catch (error) {
      logger.error('❌ Failed to get installed plugins:', error.message);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Install a plugin for a tenant' })
  @ApiResponse({
    status: 201,
    description: 'Plugin successfully installed',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiBody({ type: InstallPluginDto })
  @Roles('admin') // Only admins can install plugins
  @Post('install')
  async installPlugin(@Request() req, @Body() installDto: InstallPluginDto) {
    const tenantId = req.user.tenantId;
    return this.pluginsService.installPlugin(tenantId, installDto.pluginId);
  }

  @ApiOperation({ summary: 'Uninstall a plugin for a tenant' })
  @ApiResponse({
    status: 200,
    description: 'Plugin successfully uninstalled',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiBody({ type: InstallPluginDto })
  @Roles('admin') // Only admins can uninstall plugins
  @Post('uninstall')
  async uninstallPlugin(@Request() req, @Body() installDto: InstallPluginDto) {
    const tenantId = req.user.tenantId;
    await this.pluginsService.uninstallPlugin(tenantId, installDto.pluginId);
    return { success: true };
  }

  @ApiOperation({ summary: 'Get a specific plugin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin details',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true,
  })
  @Public() // No auth required for public plugin details
  @Get(':id')
  async getPluginById(@Param('id') id: string) {
    return this.pluginsService.findById(id);
  }

  @ApiOperation({ summary: 'Update plugin configuration' })
  @ApiResponse({
    status: 200,
    description: 'Plugin configuration successfully updated',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true,
  })
  @ApiBody({
    description: 'Plugin configuration',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @Roles('admin') // Only admins can update plugin configuration
  @Put(':id/config')
  async updatePluginConfig(
    @Request() req,
    @Param('id') pluginId: string,
    @Body() config: Record<string, any>,
  ) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.pluginsService.updatePluginConfig(tenantId, pluginId, config, {
      userId,
    });
  }

  @ApiOperation({ summary: 'Get plugin configuration' })
  @ApiResponse({
    status: 200,
    description: 'Plugin configuration successfully retrieved',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin configuration not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true,
  })
  @Roles('admin') // Only admins can view plugin configuration
  @Get(':id/config')
  async getPluginConfig(@Request() req, @Param('id') pluginId: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.pluginsService.getPluginConfig(tenantId, pluginId, { userId });
  }

  @ApiOperation({ summary: 'Enable or disable a plugin' })
  @ApiResponse({
    status: 200,
    description: 'Plugin status successfully updated',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true,
  })
  @Roles('admin') // Only admins can enable/disable plugins
  @Put(':id/status')
  async setPluginEnabled(
    @Request() req,
    @Param('id') pluginId: string,
    @Body() statusDto: UpdatePluginStatusDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.pluginsService.setPluginEnabled(
      tenantId,
      pluginId,
      statusDto.enabled,
    );
  }

  @ApiOperation({ summary: 'Create a new plugin' })
  @ApiResponse({
    status: 201,
    description: 'Plugin successfully created',
  })
  @ApiBody({ type: CreatePluginDto })
  @Public() // Make this public for plugin uploads from admin interface
  @Post()
  async createPlugin(@Body() createDto: CreatePluginDto) {
    const logger = new Logger('PluginsController.createPlugin');
    logger.debug(
      'Received CreatePluginDto:',
      JSON.stringify(createDto, null, 2),
    );
    logger.debug('bundleUrl:', createDto.bundleUrl);
    return this.pluginsService.createPlugin(
      createDto.id,
      createDto.name,
      createDto.version,
      createDto.description,
      createDto.category,
      createDto.sourceCode,
      createDto.requiredPermissions,
      createDto.bundleUrl,
      createDto.extensionPoints,
      createDto.configSchema,
    );
  }

  @ApiOperation({ summary: 'Update an existing plugin' })
  @ApiResponse({
    status: 200,
    description: 'Plugin successfully updated',
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true,
  })
  @ApiBody({ type: UpdatePluginDto })
  @Put(':id')
  async updatePlugin(
    @Param('id') id: string,
    @Body() updateDto: UpdatePluginDto,
  ) {
    return this.pluginsService.updatePlugin(id, updateDto);
  }

  @ApiOperation({ summary: 'Get plugins by extension point' })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of plugins that implement the specified extension point',
  })
  @ApiResponse({
    status: 401,
    description: 'Extension point parameter is required',
  })
  @ApiQuery({
    name: 'point',
    description: 'Extension point identifier',
    required: true,
  })
  @Get('by-extension-point')
  async getPluginsByExtensionPoint(@Query('point') extensionPoint: string) {
    if (!extensionPoint) {
      throw new UnauthorizedException('Extension point parameter is required');
    }
    return this.pluginsService.getPluginsByExtensionPoint(extensionPoint);
  }

  @ApiOperation({ summary: 'Execute a plugin backend action' })
  @ApiResponse({
    status: 200,
    description: 'Plugin action executed successfully',
    type: PluginActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin not found or action not supported',
  })
  @ApiParam({
    name: 'pluginId',
    description: 'Plugin ID',
    required: true,
  })
  @ApiBody({ type: ExecutePluginActionDto })
  @Post(':pluginId/actions')
  async executePluginAction(
    @Request() req,
    @Param('pluginId') pluginId: string,
    @Body() actionDto: ExecutePluginActionDto,
  ): Promise<PluginActionResponseDto> {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID required');
    }

    return this.pluginActionService.executeAction(
      tenantId,
      pluginId,
      actionDto.action,
      actionDto.parameters,
      actionDto.metadata,
      {
        userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );
  }

  // Add new public endpoints for organization-specific data
  @ApiOperation({
    summary: 'Get enabled plugins for organization (public endpoint)',
    description:
      'Returns enabled plugins for a specific organization. Used by storefront for rendering extension points.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns enabled plugins for the organization',
  })
  @ApiQuery({
    name: 'organizationId',
    description: 'Organization ID to filter plugins',
    required: true,
  })
  @ApiQuery({
    name: 'extensionPoint',
    description: 'Filter by specific extension point',
    required: false,
  })
  @Public() // No auth required for storefront access
  @Get('public/organizations/enabled')
  async getEnabledPluginsForOrganization(
    @Query('organizationId') organizationId: string,
    @Query('extensionPoint') extensionPoint?: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    const plugins =
      await this.pluginsService.getInstalledPlugins(organizationId);

    // Filter to only enabled plugins
    let enabledPlugins = plugins.filter((plugin) => plugin.enabled);

    // Filter by extension point if specified
    if (extensionPoint) {
      enabledPlugins = enabledPlugins.filter((plugin) =>
        plugin.plugin?.extensionPoints?.includes(extensionPoint),
      );
    }

    return enabledPlugins;
  }

  @ApiOperation({
    summary: 'Get payment plugins for organization (public endpoint)',
    description:
      'Returns enabled payment plugins for an organization. Used by storefront for checkout.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns enabled payment plugins for the organization',
  })
  @ApiQuery({
    name: 'organizationId',
    description: 'Organization ID to filter plugins',
    required: true,
  })
  @Public() // No auth required for storefront access
  @Get('public/organizations/payment')
  async getPaymentPluginsForOrganization(
    @Query('organizationId') organizationId: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('Organization ID is required');
    }

    const plugins =
      await this.pluginsService.getInstalledPlugins(organizationId);

    // Filter to enabled payment plugins
    return plugins.filter(
      (plugin) =>
        plugin.enabled && plugin.plugin?.category?.toLowerCase() === 'payment',
    );
  }

  @ApiOperation({ summary: 'Build plugin from source code (ZIP file)' })
  @ApiResponse({
    status: 201,
    description: 'Plugin successfully built and stored',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        bundleUrl: { type: 'string', description: 'URL to the built bundle' },
        fileName: { type: 'string', description: 'Original file name' },
        pluginId: { type: 'string', description: 'Plugin ID' },
        version: { type: 'string', description: 'Plugin version' },
        metadata: { type: 'object', description: 'Plugin metadata' },
        buildInfo: {
          type: 'object',
          properties: {
            buildTime: { type: 'number', description: 'Build time in ms' },
            bundleSize: { type: 'number', description: 'Bundle size in bytes' },
            compiled: { type: 'boolean', description: 'Whether plugin was compiled' },
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        plugin: {
          type: 'string',
          format: 'binary',
          description: 'Plugin ZIP file containing source code, plugin.json, and package.json',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('plugin'))
  @Public() // Make this endpoint public for admin uploads
  @Post('build')
  async buildPlugin(@UploadedFile() file: any) {
    const logger = new Logger('PluginsController.buildPlugin');
    const startTime = Date.now();

    if (!file || !file.buffer) {
      throw new BadRequestException('Plugin ZIP file is required');
    }

    logger.debug('🔄 Starting plugin build process:', {
      filename: file.originalname,
      fileSize: file.size,
      mimetype: file.mimetype,
      encoding: file.encoding,
    });

    try {
      // Use the BundleService to extract, build, and store the plugin
      logger.debug('📦 Calling buildPluginFromZip service...');
      const result = await this.pluginsService.buildPluginFromZip(
        file.buffer,
        file.originalname,
      );

      const buildTime = Date.now() - startTime;

      logger.debug('✅ Plugin build completed successfully:', {
        filename: file.originalname,
        pluginId: result.pluginId,
        buildTime,
        bundleUrl: result.bundleUrl,
        bundleSize: result.bundleSize,
        metadata: result.metadata,
      });

      return {
        success: true,
        bundleUrl: result.bundleUrl,
        fileName: file.originalname,
        pluginId: result.pluginId,
        version: result.version,
        metadata: result.metadata,
        buildInfo: {
          buildTime,
          bundleSize: result.bundleSize,
          compiled: true,
        },
      };
    } catch (error) {
      const buildTime = Date.now() - startTime;
      
      logger.error('❌ Plugin build failed:', {
        filename: file.originalname,
        error: error.message,
        errorStack: error.stack,
        buildTime,
        errorName: error.name,
        errorCode: error.code,
      });

      // Log additional error details if available
      if (error.stderr) {
        logger.error('🔍 Build stderr output:', error.stderr);
      }
      if (error.stdout) {
        logger.error('🔍 Build stdout output:', error.stdout);
      }
      if (error.cmd) {
        logger.error('🔍 Failed command:', error.cmd);
      }

      throw new BadRequestException(
        `Failed to build plugin: ${error.message}`,
      );
    }
  }

  @ApiOperation({ summary: 'Upload a plugin bundle file' })
  @ApiResponse({ status: 201, description: 'Plugin successfully created' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Plugin bundle file (JavaScript)',
        },
        id: { type: 'string', description: 'Plugin ID' },
        name: { type: 'string', description: 'Plugin name' },
        version: { type: 'string', description: 'Plugin version' },
        description: { type: 'string', description: 'Plugin description' },
        category: { type: 'string', description: 'Plugin category' },
        bundleUrl: {
          type: 'string',
          description:
            'Optional: Direct URL to the bundle (if not uploading a file)',
        },
        requiredPermissions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Required permissions',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Public() // Temporarily make this endpoint public for testing
  @Post('upload')
  async uploadPlugin(
    @UploadedFile() file: any,
    @Body()
    createDto: {
      id: string;
      name: string;
      version: string;
      description: string;
      category: string;
      bundleUrl?: string;
      requiredPermissions?: string;
    },
  ) {
    // Parse requiredPermissions if it's a JSON string
    let requiredPermissionsArray: string[] = [];
    if (createDto.requiredPermissions) {
      try {
        requiredPermissionsArray = JSON.parse(createDto.requiredPermissions);
      } catch (e) {
        // If not valid JSON, treat as a comma-separated string
        requiredPermissionsArray = createDto.requiredPermissions
          .split(',')
          .map((p) => p.trim());
      }
    }

    let bundleUrl = createDto.bundleUrl;
    let sourceCode = '';

    // If a file was uploaded, store it in MinIO
    if (file && file.buffer) {
      // Convert file to sourceCode for metadata extraction
      sourceCode = file.buffer.toString('utf-8');

      try {
        // Check MinIO connection first
        const storageStatus = await this.pluginsService.checkStorageHealth();
        if (!storageStatus.isConnected) {
          throw new BadRequestException(storageStatus.message);
        }

        // Store the bundle directly in MinIO
        bundleUrl = await this.pluginsService.storePluginBundle(
          createDto.id,
          createDto.version,
          file.buffer,
        );
      } catch (error) {
        throw new BadRequestException(
          `Failed to store plugin bundle: ${error.message}. ` +
            `Make sure MinIO is running and properly configured.`,
        );
      }
    } else if (!bundleUrl) {
      throw new BadRequestException(
        'Either a file upload or a bundleUrl must be provided',
      );
    }

    return this.pluginsService.createPlugin(
      createDto.id,
      createDto.name,
      createDto.version,
      createDto.description,
      createDto.category,
      sourceCode,
      requiredPermissionsArray,
      bundleUrl,
    );
  }

  @ApiOperation({
    summary: 'Store plugin bundle file without creating plugin entry',
  })
  @ApiResponse({
    status: 201,
    description: 'Bundle successfully stored',
    schema: {
      type: 'object',
      properties: {
        bundleUrl: { type: 'string', description: 'URL to the stored bundle' },
        pluginId: { type: 'string', description: 'Plugin ID used for storage' },
        version: { type: 'string', description: 'Version used for storage' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Plugin bundle file (JavaScript)',
        },
        pluginId: { type: 'string', description: 'Plugin ID for storage path' },
        version: {
          type: 'string',
          description: 'Plugin version for storage path',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Public() // Make this endpoint public for admin uploads
  @Post('storage/upload')
  async storePluginBundle(
    @UploadedFile() file: any,
    @Body()
    storageDto: {
      pluginId: string;
      version: string;
    },
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File upload is required');
    }

    if (!storageDto.pluginId || !storageDto.version) {
      throw new BadRequestException('pluginId and version are required');
    }

    try {
      // Check MinIO connection first
      const storageStatus = await this.pluginsService.checkStorageHealth();
      if (!storageStatus.isConnected) {
        throw new BadRequestException(storageStatus.message);
      }

      // Store the bundle directly in MinIO without creating a plugin entry
      const bundleUrl = await this.pluginsService.storePluginBundle(
        storageDto.pluginId,
        storageDto.version,
        file.buffer,
      );

      return {
        bundleUrl,
        pluginId: storageDto.pluginId,
        version: storageDto.version,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to store plugin bundle: ${error.message}. ` +
          `Make sure MinIO is running and properly configured.`,
      );
    }
  }

  @ApiOperation({ summary: 'Check MinIO storage health' })
  @ApiResponse({
    status: 200,
    description: 'Storage health status',
    schema: {
      type: 'object',
      properties: {
        isConnected: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @Get('storage-health')
  async checkStorageHealth() {
    return this.pluginsService.checkStorageHealth();
  }

  @ApiOperation({ summary: 'Get plugin bundle' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin bundle file',
    content: {
      'application/javascript': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true,
  })
  @Get(':id/bundle')
  async getPluginBundle(@Param('id') id: string, @Res() res: Response) {
    const plugin = await this.pluginsService.findById(id);

    if (!plugin.bundleUrl) {
      throw new NotFoundException('Plugin bundle not found');
    }

    // If it's a MinIO URL, serve from storage
    if (plugin.bundleUrl.includes('minio') || plugin.bundleUrl.includes('s3')) {
      try {
        const stream = await this.pluginStorageService.getPluginBundleStream(
          plugin.bundleUrl.split('/').slice(-3).join('/'), // Extract object key from URL
        );

        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${plugin.name}-${plugin.version}.js"`,
        );

        stream.pipe(res);
      } catch (error) {
        throw new NotFoundException('Plugin bundle not found in storage');
      }
    } else {
      // If it's an external URL, redirect
      res.redirect(plugin.bundleUrl);
    }
  }
}
