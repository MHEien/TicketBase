import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { TicketType } from './entities/ticket-type.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { OrganizationsService } from '../users/organizations.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(TicketType)
    private ticketTypesRepository: Repository<TicketType>,
    private organizationsService: OrganizationsService,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    // Verify organization exists
    const organization =
      await this.organizationsService.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Create event entity
    const event = this.eventsRepository.create({
      ...createEventDto,
      organizationId,
      createdBy: userId,
      updatedBy: userId,
      status: EventStatus.DRAFT,
      totalTicketsSold: 0,
      totalRevenue: 0,
    });

    // Save the event
    const savedEvent = await this.eventsRepository.save(event);

    // Create ticket types if provided
    if (createEventDto.ticketTypes && createEventDto.ticketTypes.length > 0) {
      const ticketTypes = createEventDto.ticketTypes.map((ticketTypeDto) =>
        this.ticketTypesRepository.create({
          ...ticketTypeDto,
          eventId: savedEvent.id,
          availableQuantity: ticketTypeDto.quantity,
        }),
      );
      const savedTicketTypes =
        await this.ticketTypesRepository.save(ticketTypes);
      savedEvent.ticketTypes = savedTicketTypes;
    }

    return savedEvent;
  }

  async findAll(
    organizationId: string,
    options?: {
      status?: EventStatus;
      category?: string;
      search?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Event[]> {
    const queryBuilder = this.eventsRepository
      .createQueryBuilder('event')
      .where('event.organizationId = :organizationId', { organizationId });

    // Apply filters if provided
    if (options?.status) {
      queryBuilder.andWhere('event.status = :status', {
        status: options.status,
      });
    }

    if (options?.category) {
      queryBuilder.andWhere('event.category = :category', {
        category: options.category,
      });
    }

    if (options?.search) {
      queryBuilder.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options?.startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options?.endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', {
        endDate: options.endDate,
      });
    }

    // Order by start date
    queryBuilder.orderBy('event.startDate', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: string, organizationId: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id, organizationId },
      relations: ['ticketTypes'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(
    id: string,
    organizationId: string,
    userId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id, organizationId);

    // Update event fields
    const updatedEvent = {
      ...event,
      ...updateEventDto,
      updatedBy: userId,
    };

    // Ensure we keep the proper typing for status
    if (updateEventDto.status) {
      updatedEvent.status = updateEventDto.status;
    }

    // Save the updated event
    return this.eventsRepository.save(updatedEvent);
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const event = await this.findOne(id, organizationId);

    // Check if event has sold tickets
    if (event.totalTicketsSold > 0) {
      throw new BadRequestException('Cannot delete event with sold tickets');
    }

    await this.eventsRepository.remove(event);
  }

  async publish(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Event> {
    const event = await this.findOne(id, organizationId);

    // Verify event has all required fields for publishing
    if (!event.ticketTypes || event.ticketTypes.length === 0) {
      throw new BadRequestException(
        'Event must have at least one ticket type before publishing',
      );
    }

    // Update status to published
    event.status = EventStatus.PUBLISHED;
    event.updatedBy = userId;

    return this.eventsRepository.save(event);
  }

  async cancel(
    id: string,
    organizationId: string,
    userId: string,
  ): Promise<Event> {
    const event = await this.findOne(id, organizationId);

    // Update status to cancelled
    event.status = EventStatus.CANCELLED;
    event.updatedBy = userId;

    return this.eventsRepository.save(event);
  }

  /**
   * Find a ticket type by ID and verify it belongs to the specified event and organization
   */
  async findTicketType(
    eventId: string,
    ticketTypeId: string,
    organizationId: string,
  ): Promise<TicketType> {
    // First verify the event exists and belongs to the organization
    const event = await this.findOne(eventId, organizationId);

    // Find the ticket type
    const ticketType = await this.ticketTypesRepository.findOne({
      where: {
        id: ticketTypeId,
        eventId: event.id,
      },
    });

    if (!ticketType) {
      throw new NotFoundException(
        `Ticket type with ID ${ticketTypeId} not found`,
      );
    }

    return ticketType;
  }
}
