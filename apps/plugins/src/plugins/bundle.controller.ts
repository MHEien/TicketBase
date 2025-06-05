import {
  Controller,
  Get,
  Req,
  Res,
  StreamableFile,
  NotFoundException,
  Logger,
  Header,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PluginStorageService } from './services/plugin-storage.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/auth/decorators/public.decorator';

@ApiTags('plugin-bundles')
@Controller('plugins/bundles')
export class PluginBundleController {
  private readonly logger = new Logger(PluginBundleController.name);

  constructor(private readonly pluginStorageService: PluginStorageService) {}

  @ApiOperation({ summary: 'Serve plugin bundle files' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plugin bundle JavaScript file',
  })
  @ApiResponse({
    status: 404,
    description: 'Plugin bundle not found',
  })
  @Public()
  @Get('*')
  @Header('Content-Type', 'application/javascript')
  @Header('Cache-Control', 'max-age=31536000, immutable')
  @Header('Access-Control-Allow-Origin', '*')
  async servePluginBundle(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Handle OPTIONS requests for CORS
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).send();
      }

      // Extract the path after /plugins/bundles/
      const fullRequestPath = req.path;
      const bundlesPath = '/plugins/bundles/';
      const fullPath = fullRequestPath.startsWith(bundlesPath)
        ? fullRequestPath.substring(bundlesPath.length)
        : fullRequestPath;

      this.logger.debug(`Serving plugin bundle: ${fullPath}`);
      this.logger.debug(`Original request path: ${fullRequestPath}`);

      // Validate the path parameter
      if (!fullPath) {
        this.logger.error(`Invalid bundle path: ${fullPath}`);
        throw new NotFoundException(`Invalid bundle path format`);
      }

      // Parse the path to extract object key
      // Expected format: pluginId/vVersion/filename.js
      const pathParts = fullPath.split('/');

      if (pathParts.length < 3) {
        this.logger.error(`Invalid bundle path format: ${fullPath}`);
        throw new NotFoundException(`Invalid bundle path format`);
      }

      // Reconstruct the object key for MinIO
      const objectKey = fullPath; // Use the full path as the object key

      this.logger.debug(`Looking for object with key: ${objectKey}`);

      const stream =
        await this.pluginStorageService.getPluginBundleStream(objectKey);

      // Set additional headers
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

      this.logger.debug(`Successfully serving bundle: ${fullPath}`);

      return new StreamableFile(stream);
    } catch (error) {
      this.logger.error(`Error serving plugin bundle: ${error.message}`, {
        fullPath: req.path,
        error: error.stack,
      });

      if (
        error.code === 'NoSuchKey' ||
        error.message.includes('does not exist')
      ) {
        throw new NotFoundException(`Plugin bundle not found: ${req.path}`);
      }

      throw new InternalServerErrorException(
        `Error serving plugin bundle: ${error.message}`,
      );
    }
  }
}
