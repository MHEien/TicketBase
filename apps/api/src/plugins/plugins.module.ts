import { Module } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { PluginsProxyService } from './plugins-proxy.service';
import { PluginsController } from './plugins.controller';
import { PluginProxyController } from './plugin-proxy.controller';
import { BundleProxyController } from './bundle-proxy.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [
    PluginsController,
    PluginProxyController,
    BundleProxyController, // Only the proxy controller, not the direct bundle controller
  ],
  providers: [
    PluginsService,
    PluginsProxyService,
    // Alias the new service as the old one for backward compatibility
    {
      provide: 'PluginsService',
      useExisting: PluginsProxyService,
    },
  ],
  exports: [PluginsService, PluginsProxyService],
})
export class PluginsModule {}
