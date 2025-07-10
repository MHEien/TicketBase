import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Activity,
  ActivityType,
  ActivityStatus,
} from './entities/activity.entity';

export interface CreateActivityDto {
  userId: string;
  organizationId: string;
  type: ActivityType;
  description: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  status?: ActivityStatus;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ActivityQueryParams {
  userId?: string;
  organizationId: string;
  entityType?: string;
  entityId?: string;
  type?: ActivityType;
  status?: ActivityStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedActivitiesResponse {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  async logActivity(activityData: CreateActivityDto): Promise<Activity> {
    const activity = this.activitiesRepository.create({
      ...activityData,
      status: activityData.status || ActivityStatus.SUCCESS,
    });

    return this.activitiesRepository.save(activity);
  }

  async findActivities(
    queryParams: ActivityQueryParams,
  ): Promise<PaginatedActivitiesResponse> {
    const {
      userId,
      organizationId,
      entityType,
      entityId,
      type,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = queryParams;

    const queryBuilder = this.activitiesRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user');

    // Organization filter (required)
    queryBuilder.andWhere('activity.organizationId = :organizationId', {
      organizationId,
    });

    // Optional filters
    if (userId) {
      queryBuilder.andWhere('activity.userId = :userId', { userId });
    }

    if (entityType) {
      queryBuilder.andWhere('activity.entityType = :entityType', {
        entityType,
      });
    }

    if (entityId) {
      queryBuilder.andWhere('activity.entityId = :entityId', { entityId });
    }

    if (type) {
      queryBuilder.andWhere('activity.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('activity.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('activity.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('activity.createdAt <= :endDate', { endDate });
    }

    // Order by most recent first
    queryBuilder.orderBy('activity.createdAt', 'DESC');

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [activities, total] = await queryBuilder.getManyAndCount();

    return {
      activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserActivities(
    userId: string,
    organizationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedActivitiesResponse> {
    return this.findActivities({
      userId,
      organizationId,
      page,
      limit,
    });
  }

  async getEntityActivities(
    entityType: string,
    entityId: string,
    organizationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedActivitiesResponse> {
    return this.findActivities({
      entityType,
      entityId,
      organizationId,
      page,
      limit,
    });
  }

  async deleteOldActivities(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.activitiesRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  // Helper methods for common activities
  async logUserLogin(
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Activity> {
    return this.logActivity({
      userId,
      organizationId,
      type: ActivityType.LOGIN,
      description: 'User logged in',
      ipAddress,
      userAgent,
    });
  }

  async logUserLogout(
    userId: string,
    organizationId: string,
  ): Promise<Activity> {
    return this.logActivity({
      userId,
      organizationId,
      type: ActivityType.LOGOUT,
      description: 'User logged out',
    });
  }

  async logUserCreated(
    createdById: string,
    newUserId: string,
    newUserName: string,
    organizationId: string,
  ): Promise<Activity> {
    return this.logActivity({
      userId: createdById,
      organizationId,
      type: ActivityType.CREATE,
      description: `Created user: ${newUserName}`,
      entityType: 'user',
      entityId: newUserId,
      entityName: newUserName,
    });
  }

  async logUserUpdated(
    updatedById: string,
    targetUserId: string,
    targetUserName: string,
    organizationId: string,
    changes?: Record<string, any>,
  ): Promise<Activity> {
    return this.logActivity({
      userId: updatedById,
      organizationId,
      type: ActivityType.UPDATE,
      description: `Updated user: ${targetUserName}`,
      entityType: 'user',
      entityId: targetUserId,
      entityName: targetUserName,
      metadata: { changes },
    });
  }

  async logUserDeleted(
    deletedById: string,
    targetUserId: string,
    targetUserName: string,
    organizationId: string,
  ): Promise<Activity> {
    return this.logActivity({
      userId: deletedById,
      organizationId,
      type: ActivityType.DELETE,
      description: `Deleted user: ${targetUserName}`,
      entityType: 'user',
      entityId: targetUserId,
      entityName: targetUserName,
    });
  }

  async logPermissionChange(
    changedById: string,
    targetUserId: string,
    targetUserName: string,
    organizationId: string,
    changes: Record<string, any>,
  ): Promise<Activity> {
    return this.logActivity({
      userId: changedById,
      organizationId,
      type: ActivityType.PERMISSION_CHANGE,
      description: `Changed permissions for user: ${targetUserName}`,
      entityType: 'user',
      entityId: targetUserId,
      entityName: targetUserName,
      metadata: { changes },
    });
  }
}
