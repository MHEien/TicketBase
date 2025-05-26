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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
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

@ApiTags('plugins')
@Controller('api/plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsProxyService) {}

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
    return this.pluginsService.create(createPluginDto);
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

    return this.pluginsService.create(createPluginDto);
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
    return this.pluginsService.findAll(status);
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
    return this.pluginsService.findOne(id);
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
    return this.pluginsService.update(id, updatePluginDto);
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
    return this.pluginsService.deprecate(id);
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
    return this.pluginsService.remove(id);
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
    return this.pluginsService.findByCategory(category as PluginCategory);
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
    return this.pluginsService.findByExtensionPoint(extensionPoint);
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
  @ApiBody({ type: InstallPluginDto })
  async install(@Body() installPluginDto: InstallPluginDto): Promise<any> {
    return this.pluginsService.installPlugin(installPluginDto);
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
  async uninstall(@Param('id') id: string): Promise<void> {
    return this.pluginsService.uninstallPlugin(id);
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
  async enable(@Param('id') id: string): Promise<InstalledPlugin> {
    return this.pluginsService.togglePluginStatus(id, true);
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
  async disable(@Param('id') id: string): Promise<InstalledPlugin> {
    return this.pluginsService.togglePluginStatus(id, false);
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
    @Param('id') id: string,
    @Body() configuration: Record<string, any>,
  ): Promise<InstalledPlugin> {
    return this.pluginsService.updatePluginConfiguration(id, configuration);
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
    @Param('organizationId') organizationId: string,
  ): Promise<InstalledPlugin[]> {
    return this.pluginsService.getInstalledPlugins(organizationId);
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
    @Param('organizationId') organizationId: string,
  ): Promise<InstalledPlugin[]> {
    return this.pluginsService.getEnabledPlugins(organizationId);
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
    @Param('organizationId') organizationId: string,
  ): Promise<InstalledPlugin[]> {
    return this.pluginsService.getPluginsByType(
      organizationId,
      PluginCategory.PAYMENT,
    );
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
    @Param('organizationId') organizationId: string,
    @Param('type') type: string,
  ): Promise<InstalledPlugin[]> {
    return this.pluginsService.getPluginsByType(
      organizationId,
      type as PluginCategory,
    );
  }
}
