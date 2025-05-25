import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { TicketType } from './ticket-type.entity';

export enum EventLocationType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual',
  HYBRID = 'hybrid'
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted'
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  shortDescription?: string;

  @Column()
  category: string;

  @Column('timestamp with time zone')
  startDate: Date;

  @Column('timestamp with time zone')
  endDate: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  timeZone: string;

  @Column({
    type: 'enum',
    enum: EventLocationType,
    default: EventLocationType.PHYSICAL
  })
  locationType: EventLocationType;

  @Column({ nullable: true })
  venueName?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  virtualEventUrl?: string;

  @Column({ nullable: true })
  featuredImage?: string;

  @Column('simple-array', { nullable: true })
  galleryImages?: string[];

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT
  })
  status: EventStatus;

  @Column({
    type: 'enum',
    enum: EventVisibility,
    default: EventVisibility.PUBLIC
  })
  visibility: EventVisibility;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  updater: User;

  @OneToMany(() => TicketType, ticketType => ticketType.event)
  ticketTypes: TicketType[];

  @Column('timestamp with time zone', { nullable: true })
  salesStartDate?: Date;

  @Column('timestamp with time zone', { nullable: true })
  salesEndDate?: Date;

  @Column({ nullable: true })
  seoTitle?: string;

  @Column({ nullable: true })
  seoDescription?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column({ default: 0 })
  totalTicketsSold: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ default: 0 })
  capacity: number;
} 