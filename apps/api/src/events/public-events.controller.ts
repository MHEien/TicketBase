import {
  Controller,
  Get,
  Query,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Event, EventStatus } from './entities/event.entity';
import { PublicEventDto } from './dto/public-event.dto';

@ApiTags('Public Events')
@Controller('public/events')
export class PublicEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('by-organization')
  @ApiOperation({
    summary: 'Get published events by organization (public endpoint)',
    description:
      'Returns all published events for a specific organization. Used by storefront applications.',
  })
  @ApiQuery({
    name: 'organizationId',
    description: 'Organization ID to filter events',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'category',
    description: 'Filter by event category',
    required: false,
    example: 'Music',
  })
  @ApiQuery({
    name: 'search',
    description: 'Search events by title or description',
    required: false,
    example: 'concert',
  })
  @ApiQuery({
    name: 'upcoming',
    description: 'Filter to upcoming events only',
    required: false,
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'featured',
    description: 'Filter to featured events only',
    required: false,
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of events to return',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Number of events to skip for pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [PublicEventDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getEventsByOrganization(
    @Query('organizationId') organizationId: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('upcoming') upcoming?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PublicEventDto[]> {
    if (!organizationId) {
      throw new BadRequestException('organizationId parameter is required');
    }

    const options: any = {
      status: EventStatus.PUBLISHED, // Only return published events
    };

    // Apply filters
    if (category) options.category = category;
    if (search) options.search = search;
    if (upcoming === 'true') options.upcoming = true;
    if (featured === 'true') options.featured = true;
    if (limit && !isNaN(parseInt(limit))) options.limit = parseInt(limit);
    if (offset && !isNaN(parseInt(offset))) options.offset = parseInt(offset);

    try {
      const events = await this.eventsService.findAll(organizationId, options);

      // Transform to public DTOs (exclude sensitive admin data)
      return events.map((event) => this.transformToPublicDto(event));
    } catch {
      throw new NotFoundException(
        'Organization not found or no events available',
      );
    }
  }

  @Get('by-organization/:id')
  @ApiOperation({
    summary:
      'Get single published event by ID for organization (public endpoint)',
    description:
      'Returns a single published event by ID for a specific organization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    type: PublicEventDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventByIdForOrganization(
    @Param('id') eventId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<PublicEventDto> {
    if (!organizationId) {
      throw new BadRequestException('organizationId parameter is required');
    }

    try {
      const event = await this.eventsService.findOne(eventId, organizationId);

      // Only return published events to public
      if (event.status !== EventStatus.PUBLISHED) {
        throw new NotFoundException('Event not found or not published');
      }

      return this.transformToPublicDto(event);
    } catch {
      throw new NotFoundException('Event not found');
    }
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Get available event categories (public endpoint)',
    description: 'Returns list of available event categories for filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [String],
  })
  getEventCategories(): string[] {
    // For now, return static categories - could be enhanced with dynamic categories from DB
    return [
      'Music',
      'Conference',
      'Sports',
      'Arts',
      'Food',
      'Technology',
      'Business',
      'Community',
      'Entertainment',
      'Education',
      'Health',
      'Charity',
    ];
  }

  /**
   * Transform internal Event entity to public DTO
   * Excludes sensitive admin-only fields
   */
  private transformToPublicDto(event: Event): PublicEventDto {
    return {
      id: event.id,
      organizationId: event.organizationId,
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription,
      category: event.category,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      startTime: event.startTime,
      endTime: event.endTime,
      timeZone: event.timeZone,
      locationType: event.locationType,
      venueName: event.venueName,
      address: event.address,
      city: event.city,
      state: event.state,
      zipCode: event.zipCode,
      country: event.country,
      virtualEventUrl: event.virtualEventUrl,
      featuredImage: event.featuredImage,
      galleryImages: event.galleryImages,
      status: event.status,
      visibility: event.visibility,
      salesStartDate: event.salesStartDate?.toISOString(),
      salesEndDate: event.salesEndDate?.toISOString(),
      seoTitle: event.seoTitle,
      seoDescription: event.seoDescription,
      tags: event.tags,
      totalTicketsSold: event.totalTicketsSold,
      totalRevenue: event.totalRevenue,
      capacity: event.capacity,
      ticketTypes: event.ticketTypes
        ? event.ticketTypes.filter((tt) => !tt.isHidden)
        : [],
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
