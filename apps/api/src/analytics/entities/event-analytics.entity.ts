import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../events/entities/event.entity';
import { Organization } from '../../users/entities/organization.entity';

@Entity('event_analytics')
export class EventAnalytics {
  @ApiProperty({ description: 'Unique identifier', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Event ID' })
  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ApiProperty({ description: 'Organization ID' })
  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ description: 'Date of analytics data', type: Date })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Total page views', example: 1500 })
  @Column({ name: 'total_views', default: 0 })
  totalViews: number;

  @ApiProperty({ description: 'Unique page views', example: 750 })
  @Column({ name: 'unique_views', default: 0 })
  uniqueViews: number;

  @ApiProperty({ description: 'Total sales count', example: 120 })
  @Column({ name: 'total_sales', default: 0 })
  totalSales: number;

  @ApiProperty({ description: 'Number of tickets sold', example: 200 })
  @Column({ name: 'tickets_sold', default: 0 })
  ticketsSold: number;

  @ApiProperty({ description: 'Conversion rate (percentage)', example: 5.2 })
  @Column({ name: 'conversion_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @ApiProperty({ description: 'Total revenue', example: 12500.50 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @ApiProperty({ 
    description: 'Breakdown of ticket types sold',
    example: {
      'vip-ticket': { quantity: 50, revenue: 5000 },
      'regular-ticket': { quantity: 150, revenue: 7500.50 }
    }
  })
  @Column({ name: 'ticket_type_breakdown', type: 'jsonb', default: {} })
  ticketTypeBreakdown: Record<string, {
    quantity: number;
    revenue: number;
  }>;

  @ApiProperty({ description: 'Number of refunds', example: 5 })
  @Column({ default: 0 })
  refunds: number;

  @ApiProperty({ 
    description: 'Traffic referrers',
    example: {
      'google': 350,
      'facebook': 200,
      'direct': 150,
      'email': 50
    }
  })
  @Column({ type: 'jsonb', default: {} })
  referrers: Record<string, number>;

  @ApiProperty({ description: 'Creation/Update timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 