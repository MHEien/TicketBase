import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { AssetsService } from '../assets/assets.service';
import { PublishPluginDto } from './dto/publish-plugin.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiQuery 
} from '@nestjs/swagger';

// In a real app, you would have proper auth guards
class AdminGuard {}

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(
    private readonly marketplaceService: MarketplaceService,
    private readonly assetsService: AssetsService,
  ) {}

  @ApiOperation({ summary: 'Get available plugins from the marketplace' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of plugins available in the marketplace' 
  })
  @ApiQuery({
    name: 'category',
    description: 'Filter plugins by category',
    required: false
  })
  @ApiQuery({
    name: 'search',
    description: 'Search plugins by name or description',
    required: false
  })
  @Get()
  async getPlugins(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.marketplaceService.getMarketplacePlugins(category, search);
  }

  @ApiOperation({ summary: 'Get all plugin categories' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a list of all plugin categories' 
  })
  @Get('categories')
  async getCategories() {
    return this.marketplaceService.getPluginCategories();
  }

  @ApiOperation({ summary: 'Get plugin details by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns details of the specified plugin' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Plugin not found' 
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true
  })
  @Get(':id')
  async getPluginById(@Param('id') id: string) {
    const plugin = await this.marketplaceService.getPluginById(id);
    if (!plugin) {
      throw new NotFoundException(`Plugin with ID ${id} not found`);
    }
    return plugin;
  }

  @ApiOperation({ summary: 'Publish a plugin to the marketplace' })
  @ApiResponse({ 
    status: 201, 
    description: 'Plugin successfully published' 
  })
  @ApiBody({ type: PublishPluginDto })
  @Post()
  @UseGuards(AdminGuard)
  async publishPlugin(@Body() pluginData: PublishPluginDto) {
    return this.marketplaceService.publishPlugin(pluginData);
  }

  @ApiOperation({ summary: 'Remove a plugin from the marketplace' })
  @ApiResponse({ 
    status: 200, 
    description: 'Plugin successfully removed',
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
    status: 404, 
    description: 'Plugin not found' 
  })
  @ApiParam({
    name: 'id',
    description: 'Plugin ID',
    required: true
  })
  @Delete(':id')
  @UseGuards(AdminGuard)
  async removePlugin(@Param('id') id: string) {
    const plugin = await this.marketplaceService.getPluginById(id);
    if (!plugin) {
      throw new NotFoundException(`Plugin with ID ${id} not found`);
    }

    // Delete any associated assets
    await this.assetsService.deletePluginAssets(id);

    // Remove the plugin from the database
    const success = await this.marketplaceService.removePlugin(id);
    return { success };
  }
}
