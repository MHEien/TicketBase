import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginsService } from './plugins.service';
import { PluginsController } from './plugins.controller';
import { Plugin } from './entities/plugin.entity';
import { InstalledPlugin } from './entities/installed-plugin.entity';
import { PluginProxyController } from './plugin-proxy.controller';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Plugin, InstalledPlugin]), HttpModule],
  controllers: [PluginsController, PluginProxyController, BundleController],
  providers: [PluginsService, BundleService],
  exports: [PluginsService, BundleService],
})
export class PluginsModule {}
