import { Controller, Get, Query, Param, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ActivitiesService,
  PaginatedActivitiesResponse,
} from './activities.service';
import { ActivityType, ActivityStatus } from './entities/activity.entity';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @Auth({ permissions: ['activities:view'] })
  @ApiOperation({ summary: 'Get organization activities with filtering' })
  @ApiQuery({ name: 'type', enum: ActivityType, required: false })
  @ApiQuery({ name: 'status', enum: ActivityStatus, required: false })
  @ApiQuery({ name: 'entityType', type: String, required: false })
  @ApiQuery({ name: 'entityId', type: String, required: false })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of activities',
  })
  async findAll(
    @Request() req: any,
    @Query('type') type?: ActivityType,
    @Query('status') status?: ActivityStatus,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedActivitiesResponse> {
    const organizationId = req.user?.organizationId;

    return this.activitiesService.findActivities({
      organizationId,
      type,
      status,
      entityType,
      entityId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page || 1,
      limit: limit || 50,
    });
  }

  @Get('user/:userId')
  @Auth({ permissions: ['activities:view'] })
  @ApiOperation({ summary: 'Get activities for a specific user' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({
    status: 200,
    description: 'User activities',
  })
  async getUserActivities(
    @Request() req: any,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedActivitiesResponse> {
    const organizationId = req.user?.organizationId;

    return this.activitiesService.getUserActivities(
      userId,
      organizationId,
      page || 1,
      limit || 50,
    );
  }

  @Get('entity/:entityType/:entityId')
  @Auth({ permissions: ['activities:view'] })
  @ApiOperation({ summary: 'Get activities for a specific entity' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity activities',
  })
  async getEntityActivities(
    @Request() req: any,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedActivitiesResponse> {
    const organizationId = req.user?.organizationId;

    return this.activitiesService.getEntityActivities(
      entityType,
      entityId,
      organizationId,
      page || 1,
      limit || 50,
    );
  }

  @Get('counts')
  @Auth({ permissions: ['activities:view'] })
  @ApiOperation({ summary: 'Get activity counts by type' })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiQuery({ name: 'dateRange', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'Activity counts by type',
  })
  async getActivityCounts(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('dateRange') dateRange?: string,
  ) {
    const organizationId = req.user?.organizationId;

    // Calculate date range if dateRange parameter is provided
    let calculatedStartDate: Date | undefined = startDate
      ? new Date(startDate)
      : undefined;
    let calculatedEndDate: Date | undefined = endDate
      ? new Date(endDate)
      : undefined;

    if (dateRange && !startDate && !endDate) {
      const now = new Date();
      calculatedEndDate = now;

      switch (dateRange) {
        case '1d':
          calculatedStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          calculatedStartDate = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          );
          break;
        case '30d':
          calculatedStartDate = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000,
          );
          break;
        case '90d':
          calculatedStartDate = new Date(
            now.getTime() - 90 * 24 * 60 * 60 * 1000,
          );
          break;
        default:
          calculatedStartDate = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          );
      }
    }

    const activities = await this.activitiesService.findActivities({
      organizationId,
      startDate: calculatedStartDate,
      endDate: calculatedEndDate,
      limit: 10000, // Large limit to get all activities for counting
    });

    // Count by type - map real activity types to frontend categories
    const counts = {
      total: activities.activities.length,
      financial: 0,
      eventManagement: 0,
      userManagement: 0,
      administrative: 0,
      security: 0,
      marketing: 0,
    };

    activities.activities.forEach((activity) => {
      if (activity.entityType === 'event') {
        counts.eventManagement++;
      } else if (
        activity.entityType === 'user' ||
        activity.type === ActivityType.LOGIN ||
        activity.type === ActivityType.LOGOUT
      ) {
        counts.userManagement++;
      } else if (activity.type === ActivityType.PERMISSION_CHANGE) {
        counts.security++;
      } else {
        counts.administrative++;
      }
    });

    return counts;
  }
}
