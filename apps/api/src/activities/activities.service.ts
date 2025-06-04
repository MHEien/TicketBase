import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, FindOptionsWhere } from 'typeorm';
import {
  Activity,
  ActivityType,
  ActivitySeverity,
} from './entities/activity.entity';

export interface CreateActivityDto {
  type: ActivityType;
  severity?: ActivitySeverity;
  description: string;
  organizationId: string;
  userId: string;
  metadata?: Record<string, any>;
  relatedEntityId?: string;
  relatedEntityType?: string;
  relatedEntityName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface GetActivitiesDto {
  organizationId: string;
  search?: string;
  type?: ActivityType;
  severity?: ActivitySeverity;
  dateRange?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async createActivity(
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      severity: createActivityDto.severity || ActivitySeverity.LOW,
    });

    return await this.activityRepository.save(activity);
  }

  async getActivities(getActivitiesDto: GetActivitiesDto): Promise<{
    activities: Activity[];
    total: number;
  }> {
    const {
      organizationId,
      search,
      type,
      severity,
      dateRange = '7d',
      limit = 50,
      offset = 0,
    } = getActivitiesDto;

    const where: FindOptionsWhere<Activity> = {
      organizationId,
    };

    // Apply type filter
    if (type) {
      where.type = type;
    }

    // Apply severity filter
    if (severity) {
      where.severity = severity;
    }

    // Apply date range filter
    const now = new Date();
    let startDate: Date;
    switch (dateRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    where.createdAt = MoreThan(startDate);

    const queryBuilder = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .where(where);

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(activity.description ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const activities = await queryBuilder
      .orderBy('activity.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return { activities, total };
  }

  async getActivityCounts(
    organizationId: string,
    dateRange: string = '7d',
  ): Promise<{
    total: number;
    financial: number;
    eventManagement: number;
    userManagement: number;
    administrative: number;
    security: number;
    marketing: number;
  }> {
    const now = new Date();
    let startDate: Date;
    switch (dateRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const baseQuery = this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.organizationId = :organizationId', { organizationId })
      .andWhere('activity.createdAt > :startDate', { startDate });

    const [
      total,
      financial,
      eventManagement,
      userManagement,
      administrative,
      security,
      marketing,
    ] = await Promise.all([
      baseQuery.getCount(),
      baseQuery
        .clone()
        .andWhere('activity.type = :type', { type: ActivityType.FINANCIAL })
        .getCount(),
      baseQuery
        .clone()
        .andWhere('activity.type = :type', {
          type: ActivityType.EVENT_MANAGEMENT,
        })
        .getCount(),
      baseQuery
        .clone()
        .andWhere('activity.type = :type', {
          type: ActivityType.USER_MANAGEMENT,
        })
        .getCount(),
      baseQuery
        .clone()
        .andWhere('activity.type = :type', {
          type: ActivityType.ADMINISTRATIVE,
        })
        .getCount(),
      baseQuery
        .clone()
        .andWhere('activity.type = :type', { type: ActivityType.SECURITY })
        .getCount(),
      baseQuery
        .clone()
        .andWhere('activity.type = :type', { type: ActivityType.MARKETING })
        .getCount(),
    ]);

    return {
      total,
      financial,
      eventManagement,
      userManagement,
      administrative,
      security,
      marketing,
    };
  }

  async getRecentActivities(
    organizationId: string,
    limit: number = 10,
  ): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }

  async deleteActivity(id: string, organizationId: string): Promise<void> {
    await this.activityRepository.delete({ id, organizationId });
  }

  async getActivityById(
    id: string,
    organizationId: string,
  ): Promise<Activity | null> {
    return await this.activityRepository.findOne({
      where: { id, organizationId },
      relations: ['user'],
    });
  }

  // Helper method to log activities from other services
  async logActivity(
    type: ActivityType,
    description: string,
    organizationId: string,
    userId: string,
    options?: {
      severity?: ActivitySeverity;
      metadata?: Record<string, any>;
      relatedEntityId?: string;
      relatedEntityType?: string;
      relatedEntityName?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<Activity> {
    return await this.createActivity({
      type,
      description,
      organizationId,
      userId,
      severity: options?.severity || ActivitySeverity.LOW,
      metadata: options?.metadata,
      relatedEntityId: options?.relatedEntityId,
      relatedEntityType: options?.relatedEntityType,
      relatedEntityName: options?.relatedEntityName,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    });
  }
}
