import { Module } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { PluginsProxyService } from './plugins-proxy.service';
import { PluginsController } from './plugins.controller';
import { PluginProxyController } from './plugin-proxy.controller';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';
import { BundleProxyController } from './bundle-proxy.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [
    PluginsController,
    PluginProxyController,
    BundleController,
    BundleProxyController,
  ],
  providers: [
    PluginsService,
    PluginsProxyService,
    BundleService,
    // Alias the new service as the old one for backward compatibility
    {
      provide: 'PluginsService',
      useExisting: PluginsProxyService,
    },
  ],
  exports: [PluginsService, PluginsProxyService, BundleService],
})
export class PluginsModule {}
