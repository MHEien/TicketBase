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
  Request
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
  ApiBearerAuth
} from '@nestjs/swagger';
import { Public } from '../common/auth/decorators/public.decorator';
import { Roles } from '../common/auth/decorators/roles.decorator';

@ApiTags('plugins')
@Controller('plugins')
@ApiBearerAuth()
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @ApiOperation({ summary: 'Get all available plugins' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of all plugins available in the system' 
  })
  @Public() // No auth required for public catalog
  @Get('available')
  async getAvailablePlugins() {
    return this.pluginsService.findAll();
  }

  @ApiOperation({ summary: 'Get all installed plugins for a tenant' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of plugins installed for the tenant' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Authentication required' 
  })
  @Get('installed')
  async getInstalledPlugins(@Request() req) {
    // Tenant ID is now automatically extracted from the JWT token
    const tenantId = req.user.tenantId;
    return this.pluginsService.getInstalledPlugins(tenantId);
  }

  @ApiOperation({ summary: 'Install a plugin for a tenant' })
  @ApiResponse({ 
    status: 201, 
    description: 'Plugin successfully installed' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Authentication required' 
  })
  @ApiBody({ type: InstallPluginDto })
  @Roles('admin') // Only admins can install plugins
  @Post('install')
  async installPlugin(
    @Request() req,
    @Body() installDto: InstallPluginDto
  ) {
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
          example: true
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Authentication required' 
  })
  @ApiBody({ type: InstallPluginDto })
  @Roles('admin') // Only admins can uninstall plugins
  @Post('uninstall')
  async uninstallPlugin(
    @Request() req,
    @Body() installDto: InstallPluginDto
  ) {
    const tenantId = req.user.tenantId;
    await this.pluginsService.uninstallPlugin(tenantId, installDto.pluginId);
    return { success: true };
  }

  @ApiOperation({ summary: 'Update plugin configuration' })
  @ApiResponse({ 
    status: 200, 
    description: 'Plugin configuration successfully updated' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Authentication required' 
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true
  })
  @ApiBody({
    description: 'Plugin configuration',
    schema: {
      type: 'object',
      additionalProperties: true
    }
  })
  @Roles('admin') // Only admins can update plugin configuration
  @Put(':id/config')
  async updatePluginConfig(
    @Request() req,
    @Param('id') pluginId: string,
    @Body() config: Record<string, any>
  ) {
    const tenantId = req.user.tenantId;
    return this.pluginsService.updatePluginConfig(tenantId, pluginId, config);
  }

  @ApiOperation({ summary: 'Enable or disable a plugin' })
  @ApiResponse({ 
    status: 200, 
    description: 'Plugin status successfully updated' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Authentication required' 
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true
  })
  @Roles('admin') // Only admins can enable/disable plugins
  @Put(':id/status')
  async setPluginEnabled(
    @Request() req,
    @Param('id') pluginId: string,
    @Body() statusDto: UpdatePluginStatusDto
  ) {
    const tenantId = req.user.tenantId;
    return this.pluginsService.setPluginEnabled(tenantId, pluginId, statusDto.enabled);
  }

  @ApiOperation({ summary: 'Create a new plugin' })
  @ApiResponse({ 
    status: 201, 
    description: 'Plugin successfully created' 
  })
  @ApiBody({ type: CreatePluginDto })
  @Roles('admin') // Only system admins can create new plugins
  @Post()
  async createPlugin(@Body() createDto: CreatePluginDto) {
    return this.pluginsService.createPlugin(
      createDto.id,
      createDto.name,
      createDto.version,
      createDto.description,
      createDto.category,
      createDto.sourceCode,
      createDto.requiredPermissions,
      createDto.bundleUrl,
    );
  }

  @ApiOperation({ summary: 'Update an existing plugin' })
  @ApiResponse({ 
    status: 200, 
    description: 'Plugin successfully updated' 
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true
  })
  @ApiBody({ type: UpdatePluginDto })
  @Put(':id')
  async updatePlugin(
    @Param('id') id: string,
    @Body() updateDto: UpdatePluginDto
  ) {
    return this.pluginsService.updatePlugin(id, updateDto);
  }

  @ApiOperation({ summary: 'Get plugins by extension point' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of plugins that implement the specified extension point' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Extension point parameter is required' 
  })
  @ApiQuery({
    name: 'point',
    description: 'Extension point identifier',
    required: true
  })
  @Get('by-extension-point')
  async getPluginsByExtensionPoint(@Query('point') extensionPoint: string) {
    if (!extensionPoint) {
      throw new UnauthorizedException('Extension point parameter is required');
    }
    return this.pluginsService.getPluginsByExtensionPoint(extensionPoint);
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
          description: 'Optional: Direct URL to the bundle (if not uploading a file)' 
        },
        requiredPermissions: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'Required permissions'
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadPlugin(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: {
      id: string;
      name: string;
      version: string;
      description: string;
      category: string;
      bundleUrl?: string;
      requiredPermissions?: string;
    }
  ) {
    // Parse requiredPermissions if it's a JSON string
    let requiredPermissionsArray: string[] = [];
    if (createDto.requiredPermissions) {
      try {
        requiredPermissionsArray = JSON.parse(createDto.requiredPermissions);
      } catch (e) {
        // If not valid JSON, treat as a comma-separated string
        requiredPermissionsArray = createDto.requiredPermissions.split(',').map(p => p.trim());
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
          file.buffer
        );
      } catch (error) {
        throw new BadRequestException(
          `Failed to store plugin bundle: ${error.message}. ` +
          `Make sure MinIO is running and properly configured.`
        );
      }
    } else if (!bundleUrl) {
      throw new BadRequestException('Either a file upload or a bundleUrl must be provided');
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

  @ApiOperation({ summary: 'Check MinIO storage health' })
  @ApiResponse({ 
    status: 200, 
    description: 'Storage health status',
    schema: {
      type: 'object',
      properties: {
        isConnected: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  @Get('storage-health')
  async checkStorageHealth() {
    return this.pluginsService.checkStorageHealth();
  }
} 