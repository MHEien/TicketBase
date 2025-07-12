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
import { PluginSecurityService } from './services/plugin-security.service';
import { PublicPluginService } from './services/public-plugin.service';

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
        fileSize: 5 * 1024 * 1024, // 5MB max file size (reduced from 10MB)
        files: 1, // Only one file at a time
      },
      fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedMimeTypes = ['application/javascript', 'application/zip', 'text/javascript'];
        const allowedExtensions = ['.js', '.mjs', '.zip', '.ts', '.tsx'];
        
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new Error('Invalid file type. Only JavaScript and ZIP files are allowed.'), false);
        }
        
        const ext = file.originalname.toLowerCase().match(/\.[^.]*$/);
        if (!ext || !allowedExtensions.includes(ext[0])) {
          return cb(new Error('Invalid file extension. Only .js, .mjs, .zip, .ts, .tsx files are allowed.'), false);
        }
        
        // Basic filename validation
        if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
          return cb(new Error('Invalid filename. Path traversal not allowed.'), false);
        }
        
        cb(null, true);
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
    PluginSecurityService,
    PublicPluginService,
  ],
  exports: [
    PluginsService,
    CompatibilityService,
    PluginEventBus,
    PluginStorageService,
    SecureConfigService,
    PluginSecurityService,
    PublicPluginService,
  ],
})
export class PluginsModule {}
