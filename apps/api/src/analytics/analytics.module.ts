import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { EventAnalytics } from './entities/event-analytics.entity';
import { SalesAnalytics } from './entities/sales-analytics.entity';
import { EventsModule } from '../events/events.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventAnalytics, SalesAnalytics]),
    EventsModule,
    OrdersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {} 