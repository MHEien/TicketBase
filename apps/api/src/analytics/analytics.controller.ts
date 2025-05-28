import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { EventAnalytics } from './entities/event-analytics.entity';
import { SalesAnalytics } from './entities/sales-analytics.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    organizationId: string;
  };
}

@ApiTags('analytics')
@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview metrics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
  })
  @ApiQuery({
    name: 'start',
    required: false,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'end',
    required: false,
    type: String,
    description: 'End date (ISO string)',
  })
  async getDashboardMetrics(
    @Req() req: RequestWithUser,
    @Query('start') startDate?: string,
    @Query('end') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getDashboardMetrics(
      req.user.organizationId,
      start,
      end,
    );
  }

  @Get('revenue-chart')
  @ApiOperation({ summary: 'Get revenue chart data' })
  @ApiResponse({
    status: 200,
    description: 'Revenue chart data retrieved successfully',
  })
  @ApiQuery({
    name: 'start',
    required: true,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    type: String,
    description: 'End date (ISO string)',
  })
  @ApiQuery({
    name: 'granularity',
    required: false,
    enum: ['daily', 'weekly', 'monthly'],
    description: 'Data granularity',
  })
  async getRevenueChartData(
    @Req() req: RequestWithUser,
    @Query('start') startDate: string,
    @Query('end') endDate: string,
    @Query('granularity') granularity: 'daily' | 'weekly' | 'monthly' = 'daily',
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.analyticsService.getRevenueChartData(
      req.user.organizationId,
      start,
      end,
      granularity,
    );
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to return',
  })
  async getRecentActivity(
    @Req() req: RequestWithUser,
    @Query('limit') limit: number = 10,
  ) {
    return this.analyticsService.getRecentActivity(
      req.user.organizationId,
      limit,
    );
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics retrieved successfully',
  })
  async getPerformanceMetrics(@Req() req: RequestWithUser) {
    return this.analyticsService.getPerformanceMetrics(req.user.organizationId);
  }

  @Get('audience')
  @ApiOperation({ summary: 'Get audience demographics data' })
  @ApiResponse({
    status: 200,
    description: 'Audience data retrieved successfully',
  })
  async getAudienceData(@Req() req: RequestWithUser) {
    return this.analyticsService.getAudienceData(req.user.organizationId);
  }

  @Get('geographic')
  @ApiOperation({ summary: 'Get geographic distribution data' })
  @ApiResponse({
    status: 200,
    description: 'Geographic data retrieved successfully',
  })
  getGeographicData(@Req() req: RequestWithUser) {
    return this.analyticsService.getGeographicData(req.user.organizationId);
  }

  @Get('popular-plugins')
  @ApiOperation({ summary: 'Get popular plugins based on installation counts' })
  @ApiResponse({
    status: 200,
    description: 'Popular plugins retrieved successfully',
  })
  getPopularPlugins(@Req() req: RequestWithUser) {
    return this.analyticsService.getPopularPlugins(req.user.organizationId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get analytics for a specific event' })
  @ApiResponse({
    status: 200,
    description: 'Event analytics retrieved successfully',
    type: EventAnalytics,
  })
  getEventAnalytics(
    @Param('eventId') eventId: string,
  ): Promise<EventAnalytics> {
    return this.analyticsService.getEventAnalytics(eventId);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales analytics' })
  @ApiResponse({
    status: 200,
    description: 'Sales analytics retrieved successfully',
    type: [SalesAnalytics],
  })
  @ApiQuery({
    name: 'start',
    required: true,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    type: String,
    description: 'End date (ISO string)',
  })
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
