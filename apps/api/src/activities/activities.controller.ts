import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ActivitiesService,
  CreateActivityDto,
  GetActivitiesDto,
} from './activities.service';
import { ActivityType, ActivitySeverity } from './entities/activity.entity';

interface RequestWithUser {
  user: {
    id: string;
    organizationId: string;
  };
}

@ApiTags('activities')
@Controller('activities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully',
  })
  async createActivity(
    @Body()
    createActivityDto: Omit<CreateActivityDto, 'organizationId' | 'userId'>,
    @Req() req: RequestWithUser,
  ) {
    return this.activitiesService.createActivity({
      ...createActivityDto,
      organizationId: req.user.organizationId,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get activities with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in description, user name, or email',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ActivityType,
    description: 'Filter by activity type',
  })
  @ApiQuery({
    name: 'severity',
    required: false,
    enum: ActivitySeverity,
    description: 'Filter by activity severity',
  })
  @ApiQuery({
    name: 'dateRange',
    required: false,
    type: String,
    description: 'Date range filter (1d, 7d, 30d, 90d)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of activities to skip',
  })
  async getActivities(
    @Req() req: RequestWithUser,
    @Query('search') search?: string,
    @Query('type') type?: ActivityType,
    @Query('severity') severity?: ActivitySeverity,
    @Query('dateRange') dateRange?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const getActivitiesDto: GetActivitiesDto = {
      organizationId: req.user.organizationId,
      search,
      type,
      severity,
      dateRange,
      limit,
      offset,
    };

    return this.activitiesService.getActivities(getActivitiesDto);
  }

  @Get('counts')
  @ApiOperation({ summary: 'Get activity counts by type' })
  @ApiResponse({
    status: 200,
    description: 'Activity counts retrieved successfully',
  })
  @ApiQuery({
    name: 'dateRange',
    required: false,
    type: String,
    description: 'Date range filter (1d, 7d, 30d, 90d)',
  })
  async getActivityCounts(
    @Req() req: RequestWithUser,
    @Query('dateRange') dateRange?: string,
  ) {
    return this.activitiesService.getActivityCounts(
      req.user.organizationId,
      dateRange,
    );
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to return',
  })
  async getRecentActivities(
    @Req() req: RequestWithUser,
    @Query('limit') limit?: number,
  ) {
    return this.activitiesService.getRecentActivities(
      req.user.organizationId,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity retrieved successfully',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Activity ID',
  })
  async getActivityById(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.activitiesService.getActivityById(id, req.user.organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity by ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity deleted successfully',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Activity ID',
  })
  async deleteActivity(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.activitiesService.deleteActivity(id, req.user.organizationId);
    return { message: 'Activity deleted successfully' };
  }
}
