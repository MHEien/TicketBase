import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class TicketType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @ManyToOne(() => Event, event => event.ticketTypes)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  minPerOrder?: number;

  @Column({ nullable: true })
  maxPerOrder?: number;

  @Column('timestamp with time zone', { nullable: true })
  salesStartDate?: Date;

  @Column('timestamp with time zone', { nullable: true })
  salesEndDate?: Date;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: 0 })
  availableQuantity: number;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;
} 