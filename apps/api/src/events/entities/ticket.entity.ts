import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Event } from './event.entity';
import { TicketType } from './ticket-type.entity';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus {
  VALID = 'valid',
  USED = 'used',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  ticketTypeId: string;

  @ManyToOne(() => TicketType)
  @JoinColumn({ name: 'ticketTypeId' })
  ticketType: TicketType;

  @Column()
  orderId: string;

  @Column()
  orderItemId: string;

  @Column({ unique: true })
  code: string;

  @Column()
  qrCode: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.VALID
  })
  status: TicketStatus;

  @Column('jsonb', { nullable: true })
  attendeeInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    additionalFields?: Record<string, any>;
  };

  @Column('timestamp with time zone', { nullable: true })
  checkedInAt?: Date;

  @Column({ nullable: true })
  checkedInBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'checkedInBy' })
  checkedInByUser?: User;

  @Column('timestamp with time zone', { nullable: true })
  transferredAt?: Date;

  @Column({ nullable: true })
  transferredFrom?: string;

  @Column({ nullable: true })
  transferredTo?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 