import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cart } from './cart.entity';

export enum CartItemType {
  TICKET = 'ticket',
  MERCHANDISE = 'merchandise',
  FEE = 'fee',
}

@Entity('cart_items')
export class CartItem {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Cart ID' })
  @Column({ name: 'cart_id' })
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

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

  @ApiProperty({
    description: 'Item type',
    enum: CartItemType,
    enumName: 'CartItemType',
  })
  @Column({
    type: 'enum',
    enum: CartItemType,
    default: CartItemType.TICKET,
  })
  type: CartItemType;

  @ApiProperty({ description: 'Additional metadata (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
