import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EventAnalytics } from './entities/event-analytics.entity';
import { SalesAnalytics } from './entities/sales-analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(EventAnalytics)
    private eventAnalyticsRepository: Repository<EventAnalytics>,
    @InjectRepository(SalesAnalytics)
    private salesAnalyticsRepository: Repository<SalesAnalytics>,
  ) {}

  async getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    return this.eventAnalyticsRepository.findOne({
      where: { eventId },
    });
  }

  async getSalesAnalytics(periodStart: Date, periodEnd: Date): Promise<SalesAnalytics[]> {
    return this.salesAnalyticsRepository.find({
      where: {
        date: Between(periodStart, periodEnd),
      },
    });
  }

  // Add more methods as needed for your application
} 