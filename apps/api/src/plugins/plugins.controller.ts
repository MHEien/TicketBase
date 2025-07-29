import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Logger,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiProperty,
  ApiConsumes,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PluginsProxyService } from './plugins-proxy.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { InstallPluginDto } from './dto/install-plugin.dto';
import { PluginResponseDto } from './dto/plugin.dto';
import {
  Plugin,
  InstalledPlugin,
  PluginStatus,
  PluginCategory,
} from './types/plugin.types';
import { InstalledPluginDto } from './dto/installed-plugin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterPaymentPluginDto } from './dto/payment-plugin.dto';
import { User } from '../users/entities/user.entity';

// Interface for request with authenticated user
interface RequestWithUser extends Request {
  user: User;
}

// Simplified DTO for plugin installation that only requires pluginId
export class SimpleInstallPluginDto {
  @ApiProperty({ description: 'Plugin ID to install' })
  @IsNotEmpty()
  @IsString()
  pluginId: string;
}

@ApiTags('plugins')
@Controller('plugins')
export class PluginsController {
  private readonly logger = new Logger(PluginsController.name);

  constructor(private readonly pluginsService: PluginsProxyService) {}

  // Debug logging helper
  private debugLog(operation: string, details: any) {
    this.logger.debug(`🔌 Plugin Controller Debug: ${operation}`, details);
  }

  // Error logging helper
  private errorLog(operation: string, error: any, context?: any) {
    this.logger.error(`❌ Plugin Controller Error: ${operation}`, {
      error: error.message || error,
      context,
      stack: error.stack,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new plugin' })
  @ApiResponse({
    status: 201,
    description: 'The plugin has been successfully created.',
    type: PluginResponseDto,
  })
  @ApiBody({ type: CreatePluginDto })
  async create(@Body() createPluginDto: CreatePluginDto): Promise<Plugin> {
    const operation = 'create';

    try {
      this.debugLog(operation, {
        pluginData: createPluginDto,
        description: 'Creating new plugin',
      });

      const result = await this.pluginsService.create(createPluginDto);

      this.debugLog(`${operation} - Success`, {
        pluginId: result.id,
        pluginName: result.name,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { createPluginDto });
      throw error;
    }
  }

  @Post('payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new payment plugin' })
  @ApiResponse({
    status: 201,
    description: 'The payment plugin has been successfully registered.',
    type: PluginResponseDto,
  })
  @ApiBody({ type: RegisterPaymentPluginDto })
  async registerPaymentPlugin(
    @Body() registerPaymentPluginDto: RegisterPaymentPluginDto,
  ): Promise<Plugin> {
    const operation = 'registerPaymentPlugin';

    try {
      this.debugLog(operation, {
        pluginData: registerPaymentPluginDto,
        description: 'Registering payment plugin',
      });

      // Convert to CreatePluginDto and retain payment-specific metadata
      const createPluginDto = new CreatePluginDto();
      Object.assign(createPluginDto, registerPaymentPluginDto);

      // Add payment-specific metadata
      createPluginDto.metadata = {
        ...createPluginDto.metadata,
        paymentProvider: registerPaymentPluginDto.provider,
        supportedMethods: registerPaymentPluginDto.supportedMethods,
        supportedCurrencies: registerPaymentPluginDto.supportedCurrencies,
        configurationSchema: registerPaymentPluginDto.configurationSchema,
        defaultConfiguration: registerPaymentPluginDto.defaultConfiguration,
      };

      const result = await this.pluginsService.create(createPluginDto);

      this.debugLog(`${operation} - Success`, {
        pluginId: result.id,
        pluginName: result.name,
        provider: registerPaymentPluginDto.provider,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { registerPaymentPluginDto });
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all plugins' })
  @ApiResponse({
    status: 200,
    description: 'Returns all plugins.',
    type: [PluginResponseDto],
  })
  @ApiQuery({
    name: 'status',
    enum: PluginStatus,
    required: false,
  })
  async findAll(@Query('status') status?: PluginStatus): Promise<Plugin[]> {
    const operation = 'findAll';

    try {
      this.debugLog(operation, {
        status,
        description: 'Fetching all available plugins',
      });

      const result = await this.pluginsService.findAll(status);

      this.debugLog(`${operation} - Success`, {
        pluginCount: result.length,
        status,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { status });
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plugin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin if found.',
    type: PluginResponseDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async findOne(@Param('id') id: string): Promise<Plugin> {
    const operation = 'findOne';

    try {
      this.debugLog(operation, {
        pluginId: id,
        description: 'Fetching plugin by ID',
      });

      const result = await this.pluginsService.findOne(id);

      this.debugLog(`${operation} - Success`, {
        pluginId: id,
        pluginName: result.name,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { pluginId: id });
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a plugin' })
  @ApiResponse({
    status: 200,
    description: 'The plugin has been successfully updated.',
    type: PluginResponseDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdatePluginDto })
  async update(
    @Param('id') id: string,
    @Body() updatePluginDto: UpdatePluginDto,
  ): Promise<Plugin> {
    const operation = 'update';

    try {
      this.debugLog(operation, {
        pluginId: id,
        updateData: updatePluginDto,
        description: 'Updating plugin',
      });

      const result = await this.pluginsService.update(id, updatePluginDto);

      this.debugLog(`${operation} - Success`, {
        pluginId: id,
        pluginName: result.name,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { pluginId: id, updatePluginDto });
      throw error;
    }
  }

  @Patch(':id/deprecate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deprecate a plugin' })
  @ApiResponse({
    status: 200,
    description: 'The plugin has been deprecated.',
    type: PluginResponseDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async deprecate(@Param('id') id: string): Promise<Plugin> {
    const operation = 'deprecate';

    try {
      this.debugLog(operation, {
        pluginId: id,
        description: 'Deprecating plugin',
      });

      const result = await this.pluginsService.deprecate(id);

      this.debugLog(`${operation} - Success`, {
        pluginId: id,
        pluginName: result.name,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { pluginId: id });
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a plugin (mark as removed)' })
  @ApiResponse({
    status: 200,
    description: 'The plugin has been marked as removed.',
    type: PluginResponseDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async remove(@Param('id') id: string): Promise<Plugin> {
    const operation = 'remove';

    try {
      this.debugLog(operation, {
        pluginId: id,
        description: 'Removing plugin',
      });

      const result = await this.pluginsService.remove(id);

      this.debugLog(`${operation} - Success`, {
        pluginId: id,
        pluginName: result.name,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { pluginId: id });
      throw error;
    }
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get plugins by category' })
  @ApiResponse({
    status: 200,
    description: 'Returns all plugins in the category.',
    type: [PluginResponseDto],
  })
  @ApiParam({ name: 'category', required: true, type: String })
  async findByCategory(@Param('category') category: string): Promise<Plugin[]> {
    const operation = 'findByCategory';

    try {
      this.debugLog(operation, {
        category,
        description: 'Fetching plugins by category',
      });

      const result = await this.pluginsService.findByCategory(
        category as PluginCategory,
      );

      this.debugLog(`${operation} - Success`, {
        category,
        pluginCount: result.length,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { category });
      throw error;
    }
  }

  @Get('extension-point/:extensionPoint')
  @ApiOperation({ summary: 'Get plugins by extension point' })
  @ApiResponse({
    status: 200,
    description: 'Returns all plugins implementing the extension point.',
    type: [PluginResponseDto],
  })
  @ApiParam({ name: 'extensionPoint', required: true, type: String })
  async findByExtensionPoint(
    @Param('extensionPoint') extensionPoint: string,
  ): Promise<Plugin[]> {
    const operation = 'findByExtensionPoint';

    try {
      this.debugLog(operation, {
        extensionPoint,
        description: 'Fetching plugins by extension point',
      });

      const result =
        await this.pluginsService.findByExtensionPoint(extensionPoint);

      this.debugLog(`${operation} - Success`, {
        extensionPoint,
        pluginCount: result.length,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, { extensionPoint });
      throw error;
    }
  }

  @Post('install')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Install a plugin for an organization' })
  @ApiResponse({
    status: 201,
    description: 'The plugin has been successfully installed.',
    type: InstalledPluginDto,
  })
  @ApiBody({ type: SimpleInstallPluginDto })
  async install(
    @Req() req: RequestWithUser,
    @Body() body: SimpleInstallPluginDto,
  ): Promise<any> {
    const operation = 'install';

    try {
      this.debugLog(operation, {
        pluginId: body.pluginId,
        pluginIdType: typeof body.pluginId,
        pluginIdLength: body.pluginId?.length,
        bodyKeys: Object.keys(body),
        fullBody: body,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        description: 'Installing plugin for organization',
      });

      // Create the full InstallPluginDto with user info from JWT
      const installPluginDto: InstallPluginDto = {
        pluginId: body.pluginId,
        organizationId: req.user.organizationId,
        userId: req.user.id,
      };

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.installPlugin(
        installPluginDto,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        pluginId: body.pluginId,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        result,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        pluginId: body.pluginId,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Delete('installed/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Uninstall a plugin from an organization' })
  @ApiResponse({
    status: 200,
    description: 'The plugin has been successfully uninstalled.',
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async uninstall(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    const operation = 'uninstall';

    try {
      this.debugLog(operation, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        description: 'Uninstalling plugin from organization',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      await this.pluginsService.uninstallPlugin(id, authToken);

      this.debugLog(`${operation} - Success`, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
      });
    } catch (error) {
      this.errorLog(operation, error, {
        installedPluginId: id,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Patch('installed/:id/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable an installed plugin' })
  @ApiResponse({
    status: 200,
    description: 'The plugin has been enabled.',
    type: InstalledPluginDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async enable(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<InstalledPlugin> {
    const operation = 'enable';

    try {
      this.debugLog(operation, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        description: 'Enabling plugin',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.togglePluginStatus(
        id,
        true,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        result,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        installedPluginId: id,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Patch('installed/:id/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable an installed plugin' })
  @ApiResponse({
    status: 200,
    description: 'The plugin has been disabled.',
    type: InstalledPluginDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async disable(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<InstalledPlugin> {
    const operation = 'disable';

    try {
      this.debugLog(operation, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        description: 'Disabling plugin',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.togglePluginStatus(
        id,
        false,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        result,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        installedPluginId: id,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Patch('installed/:id/configure')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update plugin configuration' })
  @ApiResponse({
    status: 200,
    description: 'The plugin configuration has been updated.',
    type: InstalledPluginDto,
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async configure(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() configuration: Record<string, any>,
  ): Promise<InstalledPlugin> {
    const operation = 'configure';

    try {
      this.debugLog(operation, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        configuration,
        description: 'Updating plugin configuration',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.updatePluginConfiguration(
        id,
        configuration,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        installedPluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        result,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        installedPluginId: id,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
        configuration,
      });
      throw error;
    }
  }

  @Get(':id/config')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get plugin configuration' })
  @ApiResponse({
    status: 200,
    description: 'The plugin configuration has been retrieved.',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @ApiParam({ name: 'id', required: true, type: String })
  @Get(':id/config')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get plugin configuration' })
  async getConfig(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    const operation = 'getConfig';

    try {
      this.debugLog(operation, {
        pluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        description: 'Retrieving plugin configuration',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.getPluginConfiguration(
        id,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        pluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        hasConfig: !!result,
      });

      return result || {};
    } catch (error) {
      this.errorLog(operation, error, {
        pluginId: id,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Post(':id/config')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save plugin configuration' })
  @ApiResponse({
    status: 200,
    description: 'The plugin configuration has been saved.',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @ApiParam({ name: 'id', required: true, type: String })
  async saveConfig(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() configuration: Record<string, any>,
  ): Promise<Record<string, any>> {
    const operation = 'saveConfig';

    try {
      this.debugLog(operation, {
        pluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        configuration,
        description: 'Saving plugin configuration',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.savePluginConfiguration(
        id,
        configuration,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        pluginId: id,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        result,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        pluginId: id,
        userId: req.user?.id,
        organizationId: req.user?.organizationId,
        configuration,
      });
      throw error;
    }
  }

  @Get('organization/:organizationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all installed plugins for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Returns all installed plugins for the organization.',
    type: [InstalledPluginDto],
  })
  @ApiParam({ name: 'organizationId', required: true, type: String })
  async getInstalledPlugins(
    @Req() req: RequestWithUser,
    @Param('organizationId') organizationId: string,
  ): Promise<InstalledPlugin[]> {
    const operation = 'getInstalledPlugins';

    try {
      // Allow "current" as a special value to use the authenticated user's organization
      const targetOrgId =
        organizationId === 'current' ? req.user.organizationId : organizationId;

      this.debugLog(operation, {
        requestedOrgId: organizationId,
        targetOrgId,
        userId: req.user.id,
        userOrgId: req.user.organizationId,
        description: 'Fetching installed plugins for organization',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.getInstalledPlugins(
        targetOrgId,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        organizationId: targetOrgId,
        pluginCount: result.length,
        userId: req.user.id,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        organizationId,
        userId: req.user?.id,
        userOrgId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Get('organization/:organizationId/enabled')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enabled plugins for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Returns all enabled plugins for the organization.',
    type: [InstalledPluginDto],
  })
  @ApiParam({ name: 'organizationId', required: true, type: String })
  async getEnabledPlugins(
    @Req() req: RequestWithUser,
    @Param('organizationId') organizationId: string,
  ): Promise<InstalledPlugin[]> {
    const operation = 'getEnabledPlugins';

    try {
      // Allow "current" as a special value to use the authenticated user's organization
      const targetOrgId =
        organizationId === 'current' ? req.user.organizationId : organizationId;

      this.debugLog(operation, {
        requestedOrgId: organizationId,
        targetOrgId,
        userId: req.user.id,
        userOrgId: req.user.organizationId,
        description: 'Fetching enabled plugins for organization',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.getEnabledPlugins(
        targetOrgId,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        organizationId: targetOrgId,
        pluginCount: result.length,
        userId: req.user.id,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        organizationId,
        userId: req.user?.id,
        userOrgId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Get('organization/:organizationId/payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment plugins for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Returns all enabled payment plugins for the organization.',
    type: [InstalledPluginDto],
  })
  @ApiParam({ name: 'organizationId', required: true, type: String })
  async getPaymentPlugins(
    @Req() req: RequestWithUser,
    @Param('organizationId') organizationId: string,
  ): Promise<InstalledPlugin[]> {
    const operation = 'getPaymentPlugins';

    try {
      // Allow "current" as a special value to use the authenticated user's organization
      const targetOrgId =
        organizationId === 'current' ? req.user.organizationId : organizationId;

      this.debugLog(operation, {
        requestedOrgId: organizationId,
        targetOrgId,
        userId: req.user.id,
        userOrgId: req.user.organizationId,
        description: 'Fetching payment plugins for organization',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.getPluginsByType(
        targetOrgId,
        PluginCategory.PAYMENT,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        organizationId: targetOrgId,
        pluginCount: result.length,
        userId: req.user.id,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        organizationId,
        userId: req.user?.id,
        userOrgId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Get('organization/:organizationId/type/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get plugins by type for an organization' })
  @ApiResponse({
    status: 200,
    description:
      'Returns all plugins of the specified type for the organization.',
    type: [InstalledPluginDto],
  })
  @ApiParam({ name: 'organizationId', required: true, type: String })
  @ApiParam({ name: 'type', required: true, type: String })
  async getPluginsByType(
    @Req() req: RequestWithUser,
    @Param('organizationId') organizationId: string,
    @Param('type') type: string,
  ): Promise<InstalledPlugin[]> {
    const operation = 'getPluginsByType';

    try {
      // Allow "current" as a special value to use the authenticated user's organization
      const targetOrgId =
        organizationId === 'current' ? req.user.organizationId : organizationId;

      this.debugLog(operation, {
        requestedOrgId: organizationId,
        targetOrgId,
        type,
        userId: req.user.id,
        userOrgId: req.user.organizationId,
        description: 'Fetching plugins by type for organization',
      });

      // Extract JWT token from request headers
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.replace('Bearer ', '');

      const result = await this.pluginsService.getPluginsByType(
        targetOrgId,
        type as PluginCategory,
        authToken,
      );

      this.debugLog(`${operation} - Success`, {
        organizationId: targetOrgId,
        type,
        pluginCount: result.length,
        userId: req.user.id,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        organizationId,
        type,
        userId: req.user?.id,
        userOrgId: req.user?.organizationId,
      });
      throw error;
    }
  }

  @Post('storage/upload')
  @ApiOperation({ summary: 'Upload plugin bundle to storage server' })
  @ApiResponse({
    status: 201,
    description: 'Plugin bundle successfully uploaded to storage',
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
  async uploadStorage(
    @UploadedFile() file: any,
    @Body() storageDto: { pluginId: string; version: string },
  ): Promise<{ bundleUrl: string; pluginId: string; version: string }> {
    const operation = 'uploadStorage';

    try {
      this.debugLog(operation, {
        filename: file?.originalname,
        size: file?.size,
        pluginId: storageDto.pluginId,
        version: storageDto.version,
        description: 'Uploading plugin bundle to storage server',
      });

      if (!file || !file.buffer) {
        throw new Error('File upload is required');
      }

      if (!storageDto.pluginId || !storageDto.version) {
        throw new Error('pluginId and version are required');
      }

      const result = await this.pluginsService.uploadPluginStorage(
        file.buffer,
        file.originalname,
        storageDto.pluginId,
        storageDto.version,
      );

      this.debugLog(`${operation} - Success`, {
        pluginId: storageDto.pluginId,
        version: storageDto.version,
        bundleUrl: result.bundleUrl,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        filename: file?.originalname,
        size: file?.size,
        pluginId: storageDto?.pluginId,
        version: storageDto?.version,
      });
      throw error;
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload and build plugin from source code' })
  @ApiResponse({
    status: 201,
    description: 'Plugin successfully uploaded, built, and stored',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        bundleUrl: { type: 'string', description: 'URL to the built bundle' },
        fileName: { type: 'string', description: 'Original file name' },
        pluginId: { type: 'string', description: 'Plugin ID' },
        version: { type: 'string', description: 'Plugin version' },
        metadata: { type: 'object', description: 'Plugin metadata' },
        buildInfo: { type: 'object', description: 'Build information' },
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
          description: 'Plugin ZIP file containing source code',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('plugin'))
  async uploadPlugin(@UploadedFile() file: any): Promise<any> {
    const operation = 'uploadPlugin';

    try {
      this.debugLog(operation, {
        filename: file?.originalname,
        size: file?.size,
        description: 'Uploading plugin to plugin server for build',
      });

      if (!file || !file.buffer) {
        throw new Error('Plugin file is required');
      }

      // Forward the file to the plugin server for building
      const result = await this.pluginsService.uploadPluginForBuild(
        file.buffer,
        file.originalname,
      );

      this.debugLog(`${operation} - Success`, {
        filename: file.originalname,
        pluginId: result.pluginId,
        bundleUrl: result.bundleUrl,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        filename: file?.originalname,
        size: file?.size,
      });
      throw error;
    }
  }

  // Bundle serving is now handled by BundleProxyController
  // Removed duplicate @Get('bundles/*') route to avoid conflicts

  @Post('metadata/create')
  @ApiOperation({ summary: 'Create plugin metadata entry in MongoDB' })
  @ApiResponse({
    status: 201,
    description: 'Plugin metadata successfully created',
    type: PluginResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Plugin ID' },
        name: { type: 'string', description: 'Plugin name' },
        version: { type: 'string', description: 'Plugin version' },
        description: { type: 'string', description: 'Plugin description' },
        category: { type: 'string', description: 'Plugin category' },
        sourceCode: { type: 'string', description: 'Plugin source code' },
        bundleUrl: { type: 'string', description: 'URL to the plugin bundle' },
        requiredPermissions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Required permissions',
        },
        extensionPoints: {
          type: 'array',
          items: { type: 'string' },
          description: 'Extension points implemented by the plugin',
        },
        configSchema: {
          type: 'object',
          description:
            'Plugin configuration schema with sensitive fields definition',
          additionalProperties: true,
        },
      },
      required: [
        'id',
        'name',
        'version',
        'description',
        'category',
        'sourceCode',
        'bundleUrl',
      ],
    },
  })
  async createMetadata(
    @Body()
    createMetadataDto: {
      id: string;
      name: string;
      version: string;
      description: string;
      category: string;
      sourceCode: string;
      bundleUrl: string;
      requiredPermissions?: string[];
      extensionPoints?: string[];
      configSchema?: any;
    },
  ): Promise<Plugin> {
    const operation = 'createMetadata';

    try {
      this.debugLog(operation, {
        pluginId: createMetadataDto.id,
        name: createMetadataDto.name,
        version: createMetadataDto.version,
        bundleUrl: createMetadataDto.bundleUrl,
        description: 'Creating plugin metadata entry',
      });

      const result =
        await this.pluginsService.createPluginMetadata(createMetadataDto);

      this.debugLog(`${operation} - Success`, {
        pluginId: createMetadataDto.id,
        name: createMetadataDto.name,
        version: createMetadataDto.version,
      });

      return result;
    } catch (error) {
      this.errorLog(operation, error, {
        pluginId: createMetadataDto?.id,
        name: createMetadataDto?.name,
        version: createMetadataDto?.version,
      });
      throw error;
    }
  }
}
