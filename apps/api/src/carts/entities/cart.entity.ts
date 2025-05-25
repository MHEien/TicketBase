import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../../events/entities/event.entity';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
  ACTIVE = 'active',
  ABANDONED = 'abandoned',
  CONVERTED = 'converted',
  EXPIRED = 'expired'
}

@Entity('carts')
export class Cart {
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

  @ApiProperty({ description: 'Session ID for tracking anonymous carts' })
  @Column({ name: 'session_id' })
  sessionId: string;

  @ApiProperty({ description: 'Cart items', type: [CartItem] })
  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, eager: true })
  items: CartItem[];

  @ApiProperty({ description: 'Customer information (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  customer: any;

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

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Expiration timestamp' })
  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ApiProperty({ description: 'Cart status', enum: CartStatus, enumName: 'CartStatus' })
  @Column({ 
    type: 'enum', 
    enum: CartStatus, 
    default: CartStatus.ACTIVE 
  })
  status: CartStatus;
} 