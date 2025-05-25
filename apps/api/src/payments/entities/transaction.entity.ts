import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

export enum TransactionType {
  PURCHASE = 'purchase',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback',
  PAYOUT = 'payout',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
export class Transaction {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Organization ID' })
  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ description: 'Order ID', required: false })
  @Column({ name: 'order_id', nullable: true })
  orderId: string;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({
    description: 'User ID (optional for guest checkout)',
    required: false,
  })
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    enumName: 'TransactionType',
  })
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.PURCHASE,
  })
  type: TransactionType;

  @ApiProperty({ description: 'Transaction amount', example: 235.97 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment method ID from provider',
    example: 'pm_1234567890',
  })
  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;

  @ApiProperty({
    description: 'Payment intent ID from provider',
    required: false,
    example: 'pi_1234567890',
  })
  @Column({ name: 'payment_intent_id', nullable: true })
  paymentIntentId: string;

  @ApiProperty({
    description: 'Transaction status',
    enum: TransactionStatus,
    enumName: 'TransactionStatus',
  })
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ApiProperty({ description: 'Gateway fee', required: false, example: 5.99 })
  @Column({
    name: 'gateway_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  gatewayFee: number;

  @ApiProperty({ description: 'Platform fee', required: false, example: 10.99 })
  @Column({
    name: 'platform_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  platformFee: number;

  @ApiProperty({ description: 'Additional metadata (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Error message (if transaction failed)',
    required: false,
  })
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
