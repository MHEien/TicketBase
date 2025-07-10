import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ActivityType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VIEW = 'view',
  EXPORT = 'export',
  IMPORT = 'import',
  PUBLISH = 'publish',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  PERMISSION_CHANGE = 'permission_change',
}

export enum ActivityStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('activities')
@Index(['userId', 'createdAt'])
@Index(['organizationId', 'createdAt'])
@Index(['entityType', 'entityId'])
export class Activity {
  @ApiProperty({ description: 'Unique identifier for the activity' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the user who performed the action' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'ID of the organization' })
  @Column()
  organizationId: string;

  @ApiProperty({
    description: 'Type of activity performed',
    enum: ActivityType,
  })
  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @ApiProperty({ description: 'Human-readable description of the action' })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Type of entity that was acted upon',
    required: false,
  })
  @Column({ nullable: true })
  entityType?: string;

  @ApiProperty({
    description: 'ID of the entity that was acted upon',
    required: false,
  })
  @Column({ nullable: true })
  entityId?: string;

  @ApiProperty({
    description: 'Name or identifier of the entity',
    required: false,
  })
  @Column({ nullable: true })
  entityName?: string;

  @ApiProperty({
    description: 'Status of the activity',
    enum: ActivityStatus,
    default: ActivityStatus.SUCCESS,
  })
  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.SUCCESS,
  })
  status: ActivityStatus;

  @ApiProperty({
    description: 'Additional metadata about the action',
    required: false,
  })
  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'IP address of the user', required: false })
  @Column({ nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent string', required: false })
  @Column({ nullable: true })
  userAgent?: string;

  @ApiProperty({ description: 'When the activity occurred' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
