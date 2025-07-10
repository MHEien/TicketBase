import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { EventAnalytics } from './entities/event-analytics.entity';
import { SalesAnalytics } from './entities/sales-analytics.entity';
import { Event } from '../events/entities/event.entity';
import { EventsModule } from '../events/events.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventAnalytics, SalesAnalytics, Event]),
    HttpModule,
    EventsModule,
    OrdersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
