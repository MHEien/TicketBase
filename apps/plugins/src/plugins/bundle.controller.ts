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
  @Get(':pluginId/v:version/:filename')
  @Header('Content-Type', 'application/javascript')
  @Header('Cache-Control', 'max-age=31536000, immutable') // 1 year cache, immutable
  async servePluginBundle(
    @Param('pluginId') pluginId: string,
    @Param('version') version: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const objectKey = `${pluginId}/v${version}/${filename}`;
      this.logger.debug(`Serving plugin bundle: ${objectKey}`);

      // Get bundle stream from MinIO
      const stream =
        await this.pluginStorageService.getPluginBundleStream(objectKey);

      // Return the stream as a StreamableFile
      return new StreamableFile(stream);
    } catch (error) {
      this.logger.error(`Error serving plugin bundle: ${error.message}`, error);

      if (error.code === 'NoSuchKey') {
        throw new NotFoundException(`Plugin bundle not found`);
      }

      throw new InternalServerErrorException(`Error serving plugin bundle`);
    }
  }

  // Legacy path format support
  @ApiOperation({ summary: 'Serve plugin bundle with legacy path format' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin bundle JavaScript file',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin bundle not found',
  })
  @ApiParam({
    name: 'objectKey',
    description: 'Full path to the bundle file in storage',
    type: 'string',
  })
  @Get('*objectKey')
  @Header('Content-Type', 'application/javascript')
  @Header('Cache-Control', 'max-age=31536000, immutable')
  async servePluginBundleLegacy(
    @Param('objectKey') objectKey: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      this.logger.debug(`Serving plugin bundle with legacy path: ${objectKey}`);

      // Get bundle stream from MinIO
      const stream =
        await this.pluginStorageService.getPluginBundleStream(objectKey);

      // Return the stream as a StreamableFile
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
