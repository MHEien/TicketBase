import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Ticket } from '../../events/entities/ticket.entity';

export enum OrderItemType {
  TICKET = 'ticket',
  MERCHANDISE = 'merchandise',
  FEE = 'fee'
}

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'Unique identifier', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Order ID' })
  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'Ticket type ID', required: false })
  @Column({ name: 'ticket_type_id', nullable: true })
  ticketTypeId: string;

  @ApiProperty({ description: 'Item name', example: 'VIP Ticket' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 99.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({ description: 'Subtotal', example: 199.98 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ description: 'Item type', enum: OrderItemType, enumName: 'OrderItemType' })
  @Column({
    type: 'enum',
    enum: OrderItemType,
    default: OrderItemType.TICKET
  })
  type: OrderItemType;

  @ApiProperty({ description: 'Tickets associated with this order item', type: [Ticket], required: false })
  @OneToMany(() => Ticket, ticket => ticket.orderItemId)
  tickets: Ticket[];

  @ApiProperty({ description: 'Additional metadata (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
} 