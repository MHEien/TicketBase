import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { EventAnalytics } from './entities/event-analytics.entity';
import { SalesAnalytics } from './entities/sales-analytics.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('event/:eventId')
  getEventAnalytics(@Param('eventId') eventId: string): Promise<EventAnalytics> {
    return this.analyticsService.getEventAnalytics(eventId);
  }

  @Get('sales')
  getSalesAnalytics(
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ): Promise<SalesAnalytics[]> {
    const periodStart = new Date(startDate);
    const periodEnd = new Date(endDate);
    return this.analyticsService.getSalesAnalytics(periodStart, periodEnd);
  }

  // Add more endpoints as needed for your application
} 