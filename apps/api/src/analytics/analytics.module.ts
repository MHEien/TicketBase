import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { EventAnalytics } from './entities/event-analytics.entity';
import { SalesAnalytics } from './entities/sales-analytics.entity';
import { Event } from '../events/entities/event.entity';
import { Plugin } from '../plugins/entities/plugin.entity';
import { InstalledPlugin } from '../plugins/entities/installed-plugin.entity';
import { Activity } from '../activities/entities/activity.entity';
import { EventsModule } from '../events/events.module';
import { OrdersModule } from '../orders/orders.module';
import { ActivitiesService } from '../activities/activities.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventAnalytics,
      SalesAnalytics,
      Event,
      Plugin,
      InstalledPlugin,
      Activity,
    ]),
    HttpModule,
    EventsModule,
    OrdersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ActivitiesService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
