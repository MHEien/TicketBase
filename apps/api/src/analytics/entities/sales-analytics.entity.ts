import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../../users/entities/organization.entity';

export enum DateRangeType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

@Entity('sales_analytics')
export class SalesAnalytics {
  @ApiProperty({ description: 'Unique identifier', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Organization ID' })
  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ description: 'Date range type', enum: DateRangeType, enumName: 'DateRangeType' })
  @Column({
    name: 'date_range',
    type: 'enum',
    enum: DateRangeType
  })
  dateRange: DateRangeType;

  @ApiProperty({ description: 'Date of analytics data', type: Date })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Total sales count', example: 450 })
  @Column({ name: 'total_sales', default: 0 })
  totalSales: number;

  @ApiProperty({ description: 'Total revenue', example: 45000.75 })
  @Column({ name: 'total_revenue', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @ApiProperty({ description: 'Total tickets sold', example: 780 })
  @Column({ name: 'tickets_sold', default: 0 })
  ticketsSold: number;

  @ApiProperty({ description: 'Average order value', example: 100.25 })
  @Column({ name: 'average_order_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageOrderValue: number;

  @ApiProperty({ description: 'Refund amount', example: 500.00 })
  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @ApiProperty({ description: 'Service fees collected', example: 2250.50 })
  @Column({ name: 'fees_collected', type: 'decimal', precision: 10, scale: 2, default: 0 })
  feesCollected: number;

  @ApiProperty({ 
    description: 'Breakdown by event',
    example: {
      'event-1': { sales: 200, revenue: 20000, tickets: 350 },
      'event-2': { sales: 150, revenue: 15000.75, tickets: 230 },
      'event-3': { sales: 100, revenue: 10000, tickets: 200 }
    }
  })
  @Column({ name: 'event_breakdown', type: 'jsonb', default: {} })
  eventBreakdown: Record<string, {
    sales: number;
    revenue: number;
    tickets: number;
  }>;

  @ApiProperty({ 
    description: 'Breakdown by payment method',
    example: {
      'credit_card': { sales: 350, revenue: 35000 },
      'paypal': { sales: 80, revenue: 8000.75 },
      'bank_transfer': { sales: 20, revenue: 2000 }
    }
  })
  @Column({ name: 'payment_method_breakdown', type: 'jsonb', default: {} })
  paymentMethodBreakdown: Record<string, {
    sales: number;
    revenue: number;
  }>;

  @ApiProperty({ description: 'Creation/Update timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 