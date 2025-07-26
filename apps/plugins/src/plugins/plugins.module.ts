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
import {
  PluginRating,
  PluginRatingSchema,
} from './schemas/plugin-rating.schema';
import { PluginProxyController } from './plugin-proxy.controller';
import { WebhookController } from './webhook.controller';
import { AssetsModule } from '../assets/assets.module';
import { CompatibilityService } from './services/compatibility.service';
import { PluginEventBus } from './services/plugin-event-bus.service';
import { BundleService } from './services/bundle.service';
import { PluginStorageService } from './services/plugin-storage.service';
import { PluginBundleController } from './bundle.controller';
import { MinioModule } from '../minio/minio.module';
import { DebugController } from './debug.controller';
import {
  PluginConfig,
  PluginConfigSchema,
} from './schemas/plugin-config.schema';
import { ConfigAudit, ConfigAuditSchema } from './schemas/config-audit.schema';
import { SecureConfigService } from './services/secure-config.service';
import { PluginActionService } from './services/plugin-action.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plugin.name, schema: PluginSchema },
      { name: InstalledPlugin.name, schema: InstalledPluginSchema },
      { name: PluginRating.name, schema: PluginRatingSchema },
      { name: PluginConfig.name, schema: PluginConfigSchema },
      { name: ConfigAudit.name, schema: ConfigAuditSchema },
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
    DebugController,
  ],
  providers: [
    PluginsService,
    CompatibilityService,
    PluginEventBus,
    BundleService,
    PluginStorageService,
    SecureConfigService,
    PluginActionService,
  ],
  exports: [
    PluginsService,
    CompatibilityService,
    PluginEventBus,
    PluginStorageService,
    SecureConfigService,
    PluginActionService,
  ],
})
export class PluginsModule {}
