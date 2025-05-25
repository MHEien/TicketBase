import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { Plugin, PluginSchema } from '../plugins/schemas/plugin.schema';
import { AssetsModule } from '../assets/assets.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plugin.name, schema: PluginSchema }]),
    AssetsModule,
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
