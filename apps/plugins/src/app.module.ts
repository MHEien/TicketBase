import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PluginsModule } from './plugins/plugins.module';
import { AssetsModule } from './assets/assets.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './common/auth/auth.module';
import { JwtAuthGuard } from './common/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://root:example@localhost:27017/plugin-server',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MinioModule,
    PluginsModule,
    AssetsModule,
    MarketplaceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Register JWT auth guard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Register roles guard globally
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
