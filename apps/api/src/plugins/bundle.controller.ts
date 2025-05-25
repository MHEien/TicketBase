import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  Logger,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { BundleService } from './bundle.service';

@ApiTags('plugin-bundles')
@Controller('api/plugins/bundles')
export class BundleController {
  private readonly logger = new Logger(BundleController.name);
  
  constructor(private readonly bundleService: BundleService) {}
  
  @Get(':pluginId')
  @ApiOperation({ summary: 'Serve a plugin bundle' })
  @ApiParam({ name: 'pluginId', description: 'Plugin ID to serve' })
  async serveBundle(
    @Param('pluginId') pluginId: string,
    @Headers('accept-encoding') acceptEncoding: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { file, contentType, fileName } = await this.bundleService.getPluginBundle(pluginId);
      
      // Set appropriate headers
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
      });

      // Add appropriate encoding headers if compression is supported
      if (acceptEncoding && acceptEncoding.includes('gzip')) {
        res.set('Content-Encoding', 'gzip');
      }
      
      return file;
    } catch (error) {
      this.logger.error(`Error serving plugin bundle: ${error.message}`);
      throw new NotFoundException(`Plugin bundle not found: ${error.message}`);
    }
  }
} 