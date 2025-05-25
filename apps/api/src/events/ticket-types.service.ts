import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketType } from './entities/ticket-type.entity';
import { Event } from './entities/event.entity';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';

@Injectable()
export class TicketTypesService {
  constructor(
    @InjectRepository(TicketType)
    private ticketTypesRepository: Repository<TicketType>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(
    eventId: string,
    organizationId: string,
    createTicketTypeDto: CreateTicketTypeDto,
  ): Promise<TicketType> {
    // Verify event exists and belongs to the organization
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, organizationId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Create ticket type entity
    const ticketType = this.ticketTypesRepository.create({
      ...createTicketTypeDto,
      eventId,
      availableQuantity: createTicketTypeDto.quantity,
    });

    return this.ticketTypesRepository.save(ticketType);
  }

  async findAll(
    eventId: string,
    organizationId: string,
  ): Promise<TicketType[]> {
    // Verify event belongs to organization
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, organizationId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return this.ticketTypesRepository.find({
      where: { eventId },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(
    id: string,
    eventId: string,
    organizationId: string,
  ): Promise<TicketType> {
    // Verify event belongs to organization
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, organizationId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const ticketType = await this.ticketTypesRepository.findOne({
      where: { id, eventId },
    });

    if (!ticketType) {
      throw new NotFoundException(`Ticket type with ID ${id} not found`);
    }

    return ticketType;
  }

  async update(
    id: string,
    eventId: string,
    organizationId: string,
    updateTicketTypeDto: UpdateTicketTypeDto,
  ): Promise<TicketType> {
    // Fetch the ticket type ensuring it belongs to the organization's event
    const ticketType = await this.findOne(id, eventId, organizationId);

    // Handle quantity changes
    if (updateTicketTypeDto.quantity !== undefined) {
      const oldQuantity = ticketType.quantity;
      const newQuantity = updateTicketTypeDto.quantity;
      const soldTickets = oldQuantity - ticketType.availableQuantity;

      // Ensure new quantity is not less than sold tickets
      if (newQuantity < soldTickets) {
        throw new BadRequestException(
          `Cannot reduce quantity below sold tickets count (${soldTickets})`,
        );
      }

      // Update available quantity
      const newAvailableQuantity = newQuantity - soldTickets;
      const updatedTicketType = {
        ...ticketType,
        ...updateTicketTypeDto,
        availableQuantity: newAvailableQuantity,
      };

      return this.ticketTypesRepository.save(updatedTicketType);
    }

    // Update ticket type
    const updatedTicketType = {
      ...ticketType,
      ...updateTicketTypeDto,
    };

    return this.ticketTypesRepository.save(updatedTicketType);
  }

  async remove(
    id: string,
    eventId: string,
    organizationId: string,
  ): Promise<void> {
    // Fetch the ticket type ensuring it belongs to the organization's event
    const ticketType = await this.findOne(id, eventId, organizationId);

    // Check if tickets have been sold
    const soldTickets = ticketType.quantity - ticketType.availableQuantity;
    if (soldTickets > 0) {
      throw new BadRequestException(
        'Cannot delete ticket type with sold tickets',
      );
    }

    await this.ticketTypesRepository.remove(ticketType);
  }
}
