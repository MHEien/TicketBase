import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../events/entities/event.entity';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund'
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Unique identifier', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Organization ID' })
  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ description: 'Event ID' })
  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ApiProperty({ description: 'User ID (optional for guest checkout)', required: false })
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Cart ID that was converted to order' })
  @Column({ name: 'cart_id' })
  cartId: string;

  @ApiProperty({ description: 'Human-readable order number', example: 'ORD-12345678' })
  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @ApiProperty({ description: 'Customer information (JSON)' })
  @Column({ type: 'jsonb' })
  customer: any;

  @ApiProperty({ description: 'Order items', type: [OrderItem] })
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true, eager: true })
  items: OrderItem[];

  @ApiProperty({ description: 'Subtotal amount', example: 199.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @ApiProperty({ description: 'Service fees amount', example: 19.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fees: number;

  @ApiProperty({ description: 'Tax amount', example: 15.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxes: number;

  @ApiProperty({ description: 'Total amount', example: 235.97 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Discount code (if applied)', required: false })
  @Column({ nullable: true })
  discountCode: string;

  @ApiProperty({ description: 'Discount amount', required: false, example: 20.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount: number;

  @ApiProperty({ description: 'Order status', enum: OrderStatus, enumName: 'OrderStatus' })
  @Column({ 
    type: 'enum', 
    enum: OrderStatus, 
    default: OrderStatus.PENDING 
  })
  status: OrderStatus;

  @ApiProperty({ description: 'Payment ID from payment provider', required: false })
  @Column({ nullable: true })
  paymentId: string;

  @ApiProperty({ description: 'Payment method', example: 'credit_card', required: false })
  @Column({ nullable: true })
  paymentMethod: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus, enumName: 'PaymentStatus' })
  @Column({ 
    type: 'enum', 
    enum: PaymentStatus, 
    default: PaymentStatus.PENDING 
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Refunded amount', required: false, example: 50.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundedAmount: number;

  @ApiProperty({ description: 'Order notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string;
} 