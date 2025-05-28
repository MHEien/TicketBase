import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ActivityType {
  FINANCIAL = 'FINANCIAL',
  EVENT_MANAGEMENT = 'EVENT_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SECURITY = 'SECURITY',
  MARKETING = 'MARKETING',
}

export enum ActivitySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('activities')
@Index(['organizationId', 'createdAt'])
@Index(['organizationId', 'type'])
@Index(['organizationId', 'severity'])
@Index(['userId'])
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column({
    type: 'enum',
    enum: ActivitySeverity,
    default: ActivitySeverity.LOW,
  })
  severity: ActivitySeverity;

  @Column('text')
  description: string;

  @Column('uuid')
  organizationId: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  relatedEntityId: string;

  @Column({ nullable: true })
  relatedEntityType: string;

  @Column({ nullable: true })
  relatedEntityName: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 