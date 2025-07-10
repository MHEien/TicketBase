import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { EventAnalytics } from './entities/event-analytics.entity';
import {
  SalesAnalytics,
  DateRangeType,
} from './entities/sales-analytics.entity';
import { Event, EventStatus } from '../events/entities/event.entity';
import { Plugin, PluginStatus } from '../plugins/entities/plugin.entity';
import { InstalledPlugin } from '../plugins/entities/installed-plugin.entity';
import { Activity, ActivityType } from '../activities/entities/activity.entity';
import { ActivitiesService } from '../activities/activities.service';

export interface PopularPlugin {
  id: string;
  name: string;
  description: string;
  installs: number;
  rating: number;
  category: string;
  icon: string;
  version: string;
  author: string;
  rank: number;
}

export interface EnhancedRecentActivity {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  description: string;
  time: string;
  type: ActivityType;
  entityType?: string;
  entityName?: string;
  status: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(EventAnalytics)
    private eventAnalyticsRepository: Repository<EventAnalytics>,
    @InjectRepository(SalesAnalytics)
    private salesAnalyticsRepository: Repository<SalesAnalytics>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Plugin)
    private pluginRepository: Repository<Plugin>,
    @InjectRepository(InstalledPlugin)
    private installedPluginRepository: Repository<InstalledPlugin>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private activitiesService: ActivitiesService,
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

    // Calculate active events (published events that are ongoing)
    const now = new Date();
    const activeEventsCount = await this.eventsRepository
      .createQueryBuilder('event')
      .select('COUNT(*)', 'count')
      .where('event.organizationId = :organizationId', { organizationId })
      .andWhere('event.status = :status', { status: EventStatus.PUBLISHED })
      .andWhere('event.endDate >= :now', { now })
      .getRawOne();

    // Calculate previous period active events (for comparison)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const previousActiveEventsCount = await this.eventsRepository
      .createQueryBuilder('event')
      .select('COUNT(*)', 'count')
      .where('event.organizationId = :organizationId', { organizationId })
      .andWhere('event.status = :status', { status: EventStatus.PUBLISHED })
      .andWhere('event.endDate >= :sevenDaysAgo', { sevenDaysAgo })
      .andWhere('event.endDate < :now', { now })
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

  async getRecentActivity(
    organizationId: string,
    limit: number = 10,
  ): Promise<EnhancedRecentActivity[]> {
    try {
      // Get recent activities with user information
      const activities = await this.activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.user', 'user')
        .where('activity.organizationId = :organizationId', { organizationId })
        .andWhere('activity.createdAt >= :recentDate', {
          recentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        })
        .orderBy('activity.createdAt', 'DESC')
        .limit(limit)
        .getMany();

      return activities.map((activity) => ({
        id: activity.id,
        user: activity.user?.name || 'Unknown User',
        userAvatar: activity.user?.avatar || '/placeholder.svg',
        action: this.formatActivityAction(activity),
        description: activity.description,
        time: this.formatTimeAgo(activity.createdAt),
        type: activity.type,
        entityType: activity.entityType,
        entityName: activity.entityName,
        status: activity.status as 'success' | 'failed' | 'pending',
        metadata: activity.metadata,
      }));
    } catch (error) {
      console.error('Failed to fetch recent activities:', error.message);
      // Fallback to empty array if activities system fails
      return [];
    }
  }

  /**
   * Format activity action into user-friendly text
   */
  private formatActivityAction(activity: Activity): string {
    const { type, entityType, entityName } = activity;

    switch (type) {
      case ActivityType.CREATE:
        if (entityType === 'event') return `Created event "${entityName}"`;
        if (entityType === 'user') return `Added new user "${entityName}"`;
        if (entityType === 'plugin') return `Installed plugin "${entityName}"`;
        return `Created ${entityType || 'item'}`;

      case ActivityType.UPDATE:
        if (entityType === 'event') return `Updated event "${entityName}"`;
        if (entityType === 'user') return `Updated user "${entityName}"`;
        return `Updated ${entityType || 'item'}`;

      case ActivityType.DELETE:
        if (entityType === 'event') return `Deleted event "${entityName}"`;
        if (entityType === 'user') return `Removed user "${entityName}"`;
        return `Deleted ${entityType || 'item'}`;

      case ActivityType.PUBLISH:
        if (entityType === 'event') return `Published event "${entityName}"`;
        return `Published ${entityType || 'item'}`;

      case ActivityType.LOGIN:
        return 'Signed in';

      case ActivityType.LOGOUT:
        return 'Signed out';

      case ActivityType.VIEW:
        if (entityType === 'event') return `Viewed event "${entityName}"`;
        return `Viewed ${entityType || 'item'}`;

      case ActivityType.EXPORT:
        return `Exported ${entityType || 'data'}`;

      case ActivityType.IMPORT:
        return `Imported ${entityType || 'data'}`;

      case ActivityType.ARCHIVE:
        return `Archived ${entityType || 'item'}`;

      case ActivityType.RESTORE:
        return `Restored ${entityType || 'item'}`;

      case ActivityType.PERMISSION_CHANGE:
        return `Changed permissions for "${entityName}"`;

      default:
        return activity.description || 'Performed action';
    }
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

  // Get upcoming events with sales data
  async getUpcomingEvents(
    organizationId: string,
    limit: number = 5,
  ): Promise<
    Array<{
      id: string;
      name: string;
      date: string;
      tickets: number;
      sold: number;
      revenue: number;
    }>
  > {
    // Get upcoming events from the events repository
    const events = await this.eventsRepository.find({
      where: {
        organizationId,
        status: EventStatus.PUBLISHED,
        endDate: MoreThan(new Date()),
      },
      order: { startDate: 'ASC' },
      take: limit,
      relations: ['ticketTypes'],
    });

    // Transform events to UpcomingEvent format
    return events.map((event) => ({
      id: event.id,
      name: event.title,
      date: event.startDate.toISOString(),
      tickets:
        event.ticketTypes?.reduce(
          (total, ticketType) => total + ticketType.quantity,
          0,
        ) || 0,
      sold: event.totalTicketsSold,
      revenue: Number(event.totalRevenue),
    }));
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

  async getPopularPlugins(): Promise<PopularPlugin[]> {
    try {
      // Get all active plugins with their installation data
      const pluginsWithInstallations = await this.pluginRepository
        .createQueryBuilder('plugin')
        .leftJoinAndSelect('plugin.installations', 'installation')
        .where('plugin.status = :status', { status: PluginStatus.ACTIVE })
        .getMany();

      if (pluginsWithInstallations.length === 0) {
        return [];
      }

      // Calculate popularity scores for each plugin
      const pluginScores = await Promise.all(
        pluginsWithInstallations.map(async (plugin) => {
          const score = await this.calculatePluginPopularityScore(plugin);
          return {
            plugin,
            score,
          };
        }),
      );

      // Sort by score (highest first) and format the response
      const popularPlugins = pluginScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 6) // Top 6 plugins
        .map((item, index) => ({
          id: item.plugin.id,
          name: item.plugin.name,
          description: item.plugin.description,
          installs: item.plugin.installations?.length || 0,
          rating: this.calculatePluginRating(item.plugin),
          category: item.plugin.category,
          icon: item.plugin.metadata?.iconUrl || '/placeholder.svg',
          version: item.plugin.version,
          author: item.plugin.metadata?.author || 'Unknown',
          rank: index + 1,
        }));

      return popularPlugins;
    } catch (error) {
      console.error('Failed to calculate popular plugins:', error.message);
      return [];
    }
  }

  /**
   * Sophisticated algorithm to calculate plugin popularity score
   * Takes into account multiple factors to determine what makes plugins "shine"
   */
  private async calculatePluginPopularityScore(
    plugin: Plugin,
  ): Promise<number> {
    const installations = plugin.installations || [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Factor 1: Installation Count (40% weight)
    // More installations = more popular
    const installationCount = installations.length;
    const installationScore = Math.min(installationCount * 10, 100); // Cap at 100

    // Factor 2: Recent Installation Activity (25% weight)
    // Plugins with recent installations get a boost
    const recentInstallations = installations.filter(
      (install) => install.installedAt >= thirtyDaysAgo,
    ).length;
    const recentActivityScore = Math.min(recentInstallations * 20, 100);

    // Factor 3: Retention Rate (20% weight)
    // Plugins that stay enabled and configured are more valuable
    const enabledInstallations = installations.filter(
      (install) => install.enabled,
    ).length;
    const retentionRate =
      installationCount > 0
        ? (enabledInstallations / installationCount) * 100
        : 0;

    // Factor 4: Configuration Activity (10% weight)
    // Plugins with non-empty configurations are actively used
    const configuredInstallations = installations.filter(
      (install) =>
        install.configuration && Object.keys(install.configuration).length > 0,
    ).length;
    const configurationScore =
      installationCount > 0
        ? (configuredInstallations / installationCount) * 100
        : 0;

    // Factor 5: Category Diversity Bonus (5% weight)
    // Bonus for plugins in underrepresented categories
    const categoryBonus = await this.getCategoryDiversityBonus(plugin.category);

    // Calculate weighted total score
    const totalScore =
      installationScore * 0.4 +
      recentActivityScore * 0.25 +
      retentionRate * 0.2 +
      configurationScore * 0.1 +
      categoryBonus * 0.05;

    return Math.round(totalScore);
  }

  /**
   * Calculate a rating for the plugin based on usage patterns
   */
  private calculatePluginRating(plugin: Plugin): number {
    const installations = plugin.installations || [];
    if (installations.length === 0) return 0;

    // Calculate rating based on retention and configuration
    const enabledRate =
      installations.filter((i) => i.enabled).length / installations.length;
    const configuredRate =
      installations.filter(
        (i) => i.configuration && Object.keys(i.configuration).length > 0,
      ).length / installations.length;

    // Simple rating algorithm: 1-5 stars based on usage quality
    const qualityScore = (enabledRate * 0.7 + configuredRate * 0.3) * 5;
    return Math.max(1, Math.round(qualityScore * 10) / 10); // Round to 1 decimal, min 1 star
  }

  /**
   * Provide bonus points for plugins in underrepresented categories
   * to ensure diversity in popular plugins
   */
  private async getCategoryDiversityBonus(category: string): Promise<number> {
    // Get total installations per category
    const categoryStats = await this.installedPluginRepository
      .createQueryBuilder('installation')
      .leftJoin('installation.plugin', 'plugin')
      .select('plugin.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('plugin.status = :status', { status: PluginStatus.ACTIVE })
      .groupBy('plugin.category')
      .getRawMany();

    const totalInstallations = categoryStats.reduce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (sum, stat) => sum + parseInt(stat.count),
      0,
    );

    if (totalInstallations === 0) return 0;

    // Find current category's installation count
    const currentCategoryStat = categoryStats.find(
      (stat) => stat.category === category,
    );
    const categoryInstallations = currentCategoryStat
      ? parseInt(currentCategoryStat.count)
      : 0;

    // Calculate diversity bonus (inverse popularity)
    // Less popular categories get higher bonus (up to 20 points)
    const categoryPopularity = categoryInstallations / totalInstallations;
    const diversityBonus = (1 - categoryPopularity) * 20;

    return Math.round(diversityBonus);
  }
}
