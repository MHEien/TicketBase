import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EventAnalytics } from './entities/event-analytics.entity';
import {
  SalesAnalytics,
  DateRangeType,
} from './entities/sales-analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(EventAnalytics)
    private eventAnalyticsRepository: Repository<EventAnalytics>,
    @InjectRepository(SalesAnalytics)
    private salesAnalyticsRepository: Repository<SalesAnalytics>,
    private httpService: HttpService,
  ) {}

  async getDashboardMetrics(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    // Calculate date range (default to last 30 days)
    const end = endDate || new Date();
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const periodLength = end.getTime() - start.getTime();

    // Get current period sales analytics
    const currentSalesData = await this.salesAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(start, end),
      },
    });

    // Get previous period sales analytics for comparison
    const previousPeriodStart = new Date(start.getTime() - periodLength);
    const previousPeriodEnd = start;
    const previousSalesData = await this.salesAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(previousPeriodStart, previousPeriodEnd),
      },
    });

    // Calculate current period metrics
    const totalRevenue = currentSalesData.reduce(
      (sum, record) => sum + Number(record.totalRevenue),
      0,
    );
    const ticketsSold = currentSalesData.reduce(
      (sum, record) => sum + record.ticketsSold,
      0,
    );
    const totalSales = currentSalesData.reduce(
      (sum, record) => sum + record.totalSales,
      0,
    );

    // Calculate previous period metrics
    const previousRevenue = previousSalesData.reduce(
      (sum, record) => sum + Number(record.totalRevenue),
      0,
    );
    const previousTicketsSold = previousSalesData.reduce(
      (sum, record) => sum + record.ticketsSold,
      0,
    );
    const previousTotalSales = previousSalesData.reduce(
      (sum, record) => sum + record.totalSales,
      0,
    );

    // Calculate percentage changes
    const revenueChange = this.calculatePercentageChange(
      previousRevenue,
      totalRevenue,
    );
    const ticketsChange = this.calculatePercentageChange(
      previousTicketsSold,
      ticketsSold,
    );

    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Get current period event analytics for conversion rate
    const currentEventData = await this.eventAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(start, end),
      },
    });

    // Get previous period event analytics
    const previousEventData = await this.eventAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(previousPeriodStart, previousPeriodEnd),
      },
    });

    const totalViews = currentEventData.reduce(
      (sum, record) => sum + record.totalViews,
      0,
    );
    const previousTotalViews = previousEventData.reduce(
      (sum, record) => sum + record.totalViews,
      0,
    );

    const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
    const previousConversionRate =
      previousTotalViews > 0
        ? (previousTotalSales / previousTotalViews) * 100
        : 0;

    // Calculate active events (events with recent activity)
    const activeEventsCount = await this.eventAnalyticsRepository
      .createQueryBuilder('ea')
      .select('COUNT(DISTINCT ea.eventId)', 'count')
      .where('ea.organizationId = :organizationId', { organizationId })
      .andWhere('ea.date >= :recentDate', {
        recentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      })
      .getRawOne();

    // Calculate previous period active events
    const previousActiveEventsCount = await this.eventAnalyticsRepository
      .createQueryBuilder('ea')
      .select('COUNT(DISTINCT ea.eventId)', 'count')
      .where('ea.organizationId = :organizationId', { organizationId })
      .andWhere('ea.date >= :previousStart', {
        previousStart: previousPeriodStart,
      })
      .andWhere('ea.date < :previousEnd', { previousEnd: previousPeriodEnd })
      .getRawOne();

    const activeEvents = parseInt(activeEventsCount?.count || '0');
    const previousActiveEvents = parseInt(
      previousActiveEventsCount?.count || '0',
    );
    const activeEventsChange = this.calculatePercentageChange(
      previousActiveEvents,
      activeEvents,
    );

    // Calculate new users (simplified - count of unique sales in period)
    const newUsersCount = await this.salesAnalyticsRepository
      .createQueryBuilder('sa')
      .select('COUNT(*)', 'count')
      .where('sa.organizationId = :organizationId', { organizationId })
      .andWhere('sa.date >= :start', { start })
      .andWhere('sa.date <= :end', { end })
      .getRawOne();

    const previousNewUsersCount = await this.salesAnalyticsRepository
      .createQueryBuilder('sa')
      .select('COUNT(*)', 'count')
      .where('sa.organizationId = :organizationId', { organizationId })
      .andWhere('sa.date >= :previousStart', {
        previousStart: previousPeriodStart,
      })
      .andWhere('sa.date < :previousEnd', { previousEnd: previousPeriodEnd })
      .getRawOne();

    const newUsers = parseInt(newUsersCount?.count || '0');
    const previousNewUsers = parseInt(previousNewUsersCount?.count || '0');
    const newUsersChange = this.calculatePercentageChange(
      previousNewUsers,
      newUsers,
    );

    // Calculate user retention
    const currentPeriodUsers = totalSales;
    const previousPeriodUsers = previousTotalSales;
    const userRetention =
      previousPeriodUsers > 0
        ? (currentPeriodUsers / previousPeriodUsers) * 100
        : 0;

    return {
      totalRevenue,
      ticketsSold,
      activeEvents,
      newUsers,
      conversionRate,
      averageOrderValue,
      userRetention,
      pluginUsage: 12, // TODO: Calculate from installed plugins table
      // Include percentage changes for frontend
      changes: {
        revenue: revenueChange,
        tickets: ticketsChange,
        activeEvents: activeEventsChange,
        newUsers: newUsersChange,
        conversionRate: this.calculatePercentageChange(
          previousConversionRate,
          conversionRate,
        ),
        averageOrderValue: this.calculatePercentageChange(
          previousTotalSales > 0 ? previousRevenue / previousTotalSales : 0,
          averageOrderValue,
        ),
        userRetention: this.calculatePercentageChange(100, userRetention),
        pluginUsage: '+0', // TODO: Calculate real plugin usage change
      },
    };
  }

  async getRevenueChartData(
    organizationId: string,
    startDate: Date,
    endDate: Date,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily',
  ) {
    // Map granularity to DateRangeType enum
    const dateRangeType = granularity as DateRangeType;

    const salesData = await this.salesAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(startDate, endDate),
        dateRange: dateRangeType,
      },
      order: { date: 'ASC' },
    });

    return salesData.map((record) => ({
      date: record.date.toISOString().split('T')[0],
      revenue: Number(record.totalRevenue),
      tickets: record.ticketsSold,
      sales: record.totalSales,
    }));
  }

  async getRecentActivity(organizationId: string, limit: number = 10) {
    // Get recent sales analytics as activity indicators
    const recentSales = await this.salesAnalyticsRepository.find({
      where: {
        organizationId,
        date: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // Last 7 days
      },
      order: { date: 'DESC' },
      take: limit,
    });

    // Transform sales data into activity format
    return recentSales.map((sale, index) => ({
      id: sale.id,
      user: `User ${index + 1}`, // TODO: Get actual user names from user table
      action: `generated $${Number(sale.totalRevenue).toFixed(2)} in revenue`,
      time: this.formatTimeAgo(sale.date),
      avatar: '/placeholder.svg',
    }));
  }

  async getPerformanceMetrics(organizationId: string) {
    // Get recent sales data for calculations (last 30 days)
    const recentDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const currentSalesData = await this.salesAnalyticsRepository.find({
      where: {
        organizationId,
        date: MoreThan(recentDate),
      },
    });

    // Get previous period data (30 days before that)
    const previousPeriodStart = new Date(
      recentDate.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const previousSalesData = await this.salesAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(previousPeriodStart, recentDate),
      },
    });

    // Get current period event data for conversion rate
    const currentEventData = await this.eventAnalyticsRepository.find({
      where: {
        organizationId,
        date: MoreThan(recentDate),
      },
    });

    // Get previous period event data
    const previousEventData = await this.eventAnalyticsRepository.find({
      where: {
        organizationId,
        date: Between(previousPeriodStart, recentDate),
      },
    });

    // Calculate current period metrics
    const totalRevenue = currentSalesData.reduce(
      (sum, record) => sum + Number(record.totalRevenue),
      0,
    );
    const totalSales = currentSalesData.reduce(
      (sum, record) => sum + record.totalSales,
      0,
    );
    const totalViews = currentEventData.reduce(
      (sum, record) => sum + record.totalViews,
      0,
    );

    // Calculate previous period metrics
    const previousRevenue = previousSalesData.reduce(
      (sum, record) => sum + Number(record.totalRevenue),
      0,
    );
    const previousSales = previousSalesData.reduce(
      (sum, record) => sum + record.totalSales,
      0,
    );
    const previousViews = previousEventData.reduce(
      (sum, record) => sum + record.totalViews,
      0,
    );

    // Calculate current metrics
    const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Calculate previous metrics
    const previousConversionRate =
      previousViews > 0 ? (previousSales / previousViews) * 100 : 0;
    const previousAOV = previousSales > 0 ? previousRevenue / previousSales : 0;

    // Calculate changes
    const conversionChange = this.calculatePercentageChange(
      previousConversionRate,
      conversionRate,
    );
    const aovChange = this.calculatePercentageChange(
      previousAOV,
      averageOrderValue,
    );

    // Calculate user retention (simplified - ratio of current to previous sales)
    const userRetention =
      previousSales > 0 ? (totalSales / previousSales) * 100 : 0;
    const retentionChange = this.calculatePercentageChange(100, userRetention);

    // TODO: Calculate actual plugin usage from installed plugins table
    const pluginUsage = 12;
    const pluginChange = '+3'; // TODO: Calculate real plugin usage change

    return [
      {
        name: 'Conversion Rate',
        value: `${conversionRate.toFixed(1)}%`,
        change: conversionChange,
        icon: 'TrendingUp',
      },
      {
        name: 'Avg. Order Value',
        value: `$${averageOrderValue.toFixed(2)}`,
        change: aovChange,
        icon: 'Ticket',
      },
      {
        name: 'User Retention',
        value: `${userRetention.toFixed(1)}%`,
        change: retentionChange,
        icon: 'Users',
      },
      {
        name: 'Plugin Usage',
        value: `${pluginUsage} active`,
        change: pluginChange,
        icon: 'Layers',
      },
    ];
  }

  async getAudienceData(organizationId: string) {
    // Get event analytics data for audience insights
    const eventData = await this.eventAnalyticsRepository.find({
      where: {
        organizationId,
        date: MoreThan(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // Last 90 days
      },
    });

    // Aggregate referrer data
    const referrerTotals: Record<string, number> = {};
    eventData.forEach((event) => {
      Object.entries(event.referrers || {}).forEach(([source, count]) => {
        referrerTotals[source] = (referrerTotals[source] || 0) + count;
      });
    });

    // Convert to percentage-based data
    const totalReferrers = Object.values(referrerTotals).reduce(
      (sum, count) => sum + count,
      0,
    );
    const referrerPercentages = Object.entries(referrerTotals).map(
      ([source, count]) => ({
        name: source,
        value:
          totalReferrers > 0 ? Math.round((count / totalReferrers) * 100) : 0,
      }),
    );

    return {
      ageGroups: [
        { name: '18-24', value: 20 }, // TODO: Implement with actual user demographics
        { name: '25-34', value: 35 },
        { name: '35-44', value: 25 },
        { name: '45-54', value: 15 },
        { name: '55+', value: 5 },
      ],
      interests: referrerPercentages.slice(0, 4), // Top 4 traffic sources as interests
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGeographicData(_organizationId: string) {
    // TODO: Implement actual geographic tracking
    // For now, return mock data structure that would be populated from real geographic data
    // When implementing, you would query sales data with geographic breakdown like this:
    // const salesData = await this.salesAnalyticsRepository.find({
    //   where: {
    //     organizationId,
    //     date: MoreThan(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // Last 90 days
    //   },
    // });

    return {
      countries: [
        { name: 'United States', value: 45 },
        { name: 'Canada', value: 20 },
        { name: 'United Kingdom', value: 15 },
        { name: 'Germany', value: 10 },
        { name: 'Others', value: 10 },
      ],
      cities: [
        { name: 'New York', value: 25, lat: 40.7128, lng: -74.006 },
        { name: 'Los Angeles', value: 20, lat: 34.0522, lng: -118.2437 },
        { name: 'Toronto', value: 15, lat: 43.6532, lng: -79.3832 },
        { name: 'London', value: 12, lat: 51.5074, lng: -0.1278 },
        { name: 'Berlin', value: 10, lat: 52.52, lng: 13.405 },
      ],
    };
  }

  async getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    return this.eventAnalyticsRepository.findOne({
      where: { eventId },
    });
  }

  async getSalesAnalytics(
    periodStart: Date,
    periodEnd: Date,
  ): Promise<SalesAnalytics[]> {
    return this.salesAnalyticsRepository.find({
      where: {
        date: Between(periodStart, periodEnd),
      },
    });
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  }

  private calculatePercentageChange(previous: number, current: number): string {
    if (previous === 0) {
      return current > 0 ? '+100%' : '0%';
    }
    const change = ((current - previous) / previous) * 100;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPopularPlugins(_organizationId: string) {
    try {
      // Get all plugins from the plugins microservice
      const pluginsResponse = await firstValueFrom(
        this.httpService.get(
          `${process.env.PLUGINS_SERVICE_URL || 'http://localhost:3002'}/api/plugins`,
        ),
      );
      const allPlugins = pluginsResponse.data;

      // Get installation counts for each plugin
      const pluginPopularity = await Promise.all(
        allPlugins.map(async (plugin: any) => {
          try {
            // Get installation count for this plugin across all tenants
            const installationsResponse = await firstValueFrom(
              this.httpService.get(
                `${process.env.PLUGINS_SERVICE_URL || 'http://localhost:3002'}/api/plugins/${plugin.id}/installations/count`,
              ),
            );
            const installationCount = installationsResponse.data.count || 0;

            return {
              id: plugin.id,
              name: plugin.name,
              description: plugin.description,
              category: plugin.category,
              installationCount,
              iconUrl: plugin.metadata?.iconUrl || '/placeholder.svg',
              version: plugin.version,
              author: plugin.metadata?.author || 'Unknown',
            };
          } catch {
            // If we can't get installation count, default to 0
            return {
              id: plugin.id,
              name: plugin.name,
              description: plugin.description,
              category: plugin.category,
              installationCount: 0,
              iconUrl: plugin.metadata?.iconUrl || '/placeholder.svg',
              version: plugin.version,
              author: plugin.metadata?.author || 'Unknown',
            };
          }
        }),
      );

      // Sort by installation count (most popular first) and return top 6
      return pluginPopularity
        .sort((a, b) => b.installationCount - a.installationCount)
        .slice(0, 6)
        .map((plugin, index) => ({
          id: plugin.id,
          name: plugin.name,
          description: plugin.description,
          installs: plugin.installationCount,
          rating: 4.5 + Math.random() * 0.5, // Generate rating between 4.5-5.0
          category: plugin.category,
          icon: plugin.iconUrl,
          version: plugin.version,
          author: plugin.author,
          rank: index + 1,
        }));
    } catch (error) {
      // If plugins service is unavailable, return empty array
      console.error('Failed to fetch popular plugins:', error.message);
      return [];
    }
  }
}
