import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PluginsController } from './plugins.controller';
import { PluginsService } from './plugins.service';
import { PluginsProxyService } from './plugins-proxy.service';
import { PluginProxyController } from './plugin-proxy.controller';
import { BundleProxyController } from './bundle-proxy.controller';
import { BundleProxyService } from './bundle-proxy.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [
    PluginsController,
    PluginProxyController,
    BundleProxyController,
  ],
  providers: [PluginsService, PluginsProxyService, BundleProxyService],
  exports: [PluginsService],
})
export class PluginsModule {}
