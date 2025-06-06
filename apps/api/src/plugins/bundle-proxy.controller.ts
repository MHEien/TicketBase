import { Controller, Get, Param, Logger, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BundleProxyService } from './bundle-proxy.service';

@ApiTags('plugin-bundle-proxy')
@Controller('api/plugins/bundles')
export class BundleProxyController {
  private readonly logger = new Logger(BundleProxyController.name);

  constructor(private readonly bundleProxyService: BundleProxyService) {}

  @Get('/*path')
  @ApiOperation({ summary: 'Proxy bundle requests to plugin server' })
  @ApiParam({ name: 'path', description: 'Full bundle path with version' })
  async proxyBundleRequest(
    @Param('path') path: string,
  ): Promise<StreamableFile> {
    this.logger.debug(`Proxying bundle request for path: ${path}`);
    return this.bundleProxyService.proxyBundleRequest(path);
  }
}
