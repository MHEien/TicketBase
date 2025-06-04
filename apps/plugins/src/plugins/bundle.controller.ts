import {
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
  NotFoundException,
  Logger,
  Header,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { PluginStorageService } from './services/plugin-storage.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/auth/decorators/public.decorator';

@ApiTags('plugin-bundles')
@Controller('plugins/bundles')
export class PluginBundleController {
  private readonly logger = new Logger(PluginBundleController.name);

  constructor(private readonly pluginStorageService: PluginStorageService) {}

  @ApiOperation({ summary: 'Serve plugin bundle with versioned path format' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin bundle JavaScript file',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin bundle not found',
  })
  @ApiParam({ name: 'pluginId', description: 'Plugin ID' })
  @ApiParam({
    name: 'version',
    description: 'Plugin version (without v prefix)',
  })
  @ApiParam({ name: 'filename', description: 'Bundle filename' })
  @Public()
  @Get(':pluginId/v:version/:filename')
  @Header('Content-Type', 'application/javascript')
  @Header('Cache-Control', 'max-age=31536000, immutable')
  async servePluginBundle(
    @Param('pluginId') pluginId: string,
    @Param('version') version: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const objectKey = `${pluginId}/v${version}/${filename}`;
      this.logger.debug(`Serving plugin bundle: ${objectKey}`);

      const stream =
        await this.pluginStorageService.getPluginBundleStream(objectKey);

      return new StreamableFile(stream);
    } catch (error) {
      this.logger.error(`Error serving plugin bundle: ${error.message}`, error);

      if (error.code === 'NoSuchKey') {
        throw new NotFoundException(`Plugin bundle not found`);
      }

      throw new InternalServerErrorException(`Error serving plugin bundle`);
    }
  }

  @ApiOperation({ summary: 'Serve plugin bundle - alternative pattern without v prefix' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin bundle JavaScript file',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin bundle not found',
  })
  @ApiParam({ name: 'pluginId', description: 'Plugin ID' })
  @ApiParam({
    name: 'version',
    description: 'Plugin version (may or may not have v prefix)',
  })
  @ApiParam({ name: 'filename', description: 'Bundle filename' })
  @Public()
  @Get(':pluginId/:version/:filename')
  @Header('Content-Type', 'application/javascript')
  @Header('Cache-Control', 'max-age=31536000, immutable')
  async servePluginBundleAlternative(
    @Param('pluginId') pluginId: string,
    @Param('version') version: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Handle both versioned (v1.0.0) and non-versioned (1.0.0) formats
      const versionKey = version.startsWith('v') ? version : `v${version}`;
      const objectKey = `${pluginId}/${versionKey}/${filename}`;
      
      this.logger.debug(`Serving plugin bundle (alternative): ${objectKey}`);

      const stream =
        await this.pluginStorageService.getPluginBundleStream(objectKey);

      return new StreamableFile(stream);
    } catch (error) {
      this.logger.error(`Error serving plugin bundle: ${error.message}`, error);

      if (error.code === 'NoSuchKey') {
        throw new NotFoundException(`Plugin bundle not found`);
      }

      throw new InternalServerErrorException(`Error serving plugin bundle`);
    }
  }
}