import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { PluginsController } from './plugins.controller';
import { PluginsService } from './plugins.service';
import { Plugin, PluginSchema } from './schemas/plugin.schema';
import {
  InstalledPlugin,
  InstalledPluginSchema,
} from './schemas/installed-plugin.schema';
import { PluginRating, PluginRatingSchema } from './schemas/plugin-rating.schema';
import { PluginProxyController } from './plugin-proxy.controller';
import { WebhookController } from './webhook.controller';
import { AssetsModule } from '../assets/assets.module';
import { CompatibilityService } from './services/compatibility.service';
import { PluginEventBus } from './services/plugin-event-bus.service';
import { BundleService } from './services/bundle.service';
import { PluginStorageService } from './services/plugin-storage.service';
import { PluginBundleController } from './bundle.controller';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plugin.name, schema: PluginSchema },
      { name: InstalledPlugin.name, schema: InstalledPluginSchema },
      { name: PluginRating.name, schema: PluginRatingSchema },
    ]),
    AssetsModule,
    MinioModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
      },
    }),
  ],
  controllers: [
    PluginsController,
    PluginProxyController,
    WebhookController,
    PluginBundleController, // This serves bundles directly from MinIO
  ],
  providers: [
    PluginsService,
    CompatibilityService,
    PluginEventBus,
    BundleService,
    PluginStorageService,
  ],
  exports: [
    PluginsService,
    CompatibilityService,
    PluginEventBus,
    PluginStorageService,
  ],
})
export class PluginsModule {}