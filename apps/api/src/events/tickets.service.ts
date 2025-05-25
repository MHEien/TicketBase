import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { TicketType } from './entities/ticket-type.entity';
import { Event } from './entities/event.entity';
import * as crypto from 'crypto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketType)
    private ticketTypesRepository: Repository<TicketType>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  // For demo purposes - in a real implementation this would connect to the order management system
  async generateTickets(
    organizationId: string,
    eventId: string,
    ticketTypeId: string, 
    quantity: number,
    orderId: string,
    orderItemId: string,
    attendeeInfo?: any,
  ): Promise<Ticket[]> {
    // Verify event exists and belongs to the organization
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, organizationId },
    });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    
    // Verify ticket type exists and belongs to the event
    const ticketType = await this.ticketTypesRepository.findOne({
      where: { id: ticketTypeId, eventId },
    });
    
    if (!ticketType) {
      throw new NotFoundException(`Ticket type with ID ${ticketTypeId} not found`);
    }
    
    // Check if enough tickets are available
    if (ticketType.availableQuantity < quantity) {
      throw new BadRequestException('Not enough tickets available');
    }
    
    // Create tickets
    const tickets: Ticket[] = [];
    for (let i = 0; i < quantity; i++) {
      const ticketCode = this.generateUniqueCode();
      const qrCode = this.generateQRCode(ticketCode);
      
      const ticket = this.ticketsRepository.create({
        organizationId,
        eventId,
        ticketTypeId,
        orderId,
        orderItemId,
        code: ticketCode,
        qrCode,
        status: TicketStatus.VALID,
        attendeeInfo,
      });
      
      tickets.push(ticket);
    }
    
    // Save tickets
    const savedTickets = await this.ticketsRepository.save(tickets);
    
    // Update ticket type available quantity
    ticketType.availableQuantity -= quantity;
    await this.ticketTypesRepository.save(ticketType);
    
    // Update event sold tickets count
    event.totalTicketsSold += quantity;
    event.totalRevenue = Number(event.totalRevenue) + (Number(ticketType.price) * quantity);
    await this.eventsRepository.save(event);
    
    return savedTickets;
  }

  async validateTicket(organizationId: string, code: string): Promise<{ valid: boolean; ticket: Ticket }> {
    const ticket = await this.ticketsRepository.findOne({
      where: { code, organizationId },
      relations: ['event', 'ticketType'],
    });
    
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    
    // Check if ticket is valid
    const valid = ticket.status === TicketStatus.VALID;
    
    return { valid, ticket };
  }

  async checkInTicket(organizationId: string, code: string, userId: string): Promise<Ticket> {
    const { valid, ticket } = await this.validateTicket(organizationId, code);
    
    if (!valid) {
      throw new BadRequestException(`Ticket is not valid. Current status: ${ticket.status}`);
    }
    
    // Update ticket status
    ticket.status = TicketStatus.USED;
    ticket.checkedInAt = new Date();
    ticket.checkedInBy = userId;
    
    return this.ticketsRepository.save(ticket);
  }

  private generateUniqueCode(): string {
    // In a real implementation, this would ensure uniqueness in the database
    return `TKT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  private generateQRCode(ticketCode: string): string {
    // In a real implementation, this would generate an actual QR code image or data
    // For this example, we'll just return the ticket code encoded in base64
    return Buffer.from(ticketCode).toString('base64');
  }
} 