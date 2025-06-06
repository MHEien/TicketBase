import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventStatus } from './entities/event.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EventResponseDto } from './dto/event-response.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('api/events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: EventResponseDto,
  })
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.create(organizationId, userId, createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events for the organization' })
  @ApiResponse({
    status: 200,
    description: 'List of events.',
    type: [EventResponseDto],
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: '#/components/schemas/EventResponseDto' },
        },
      },
    },
  })
  @ApiQuery({ name: 'status', enum: EventStatus, required: false })
  @ApiQuery({ name: 'category', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  findAll(@Request() req, @Query() query) {
    const organizationId = req.user.organizationId;
    const options = {};

    if (query.status && Object.values(EventStatus).includes(query.status)) {
      options['status'] = query.status;
    }

    if (query.category) {
      options['category'] = query.category;
    }

    if (query.search) {
      options['search'] = query.search;
    }

    if (query.startDate && !isNaN(new Date(query.startDate).getTime())) {
      options['startDate'] = new Date(query.startDate);
    }

    if (query.endDate && !isNaN(new Date(query.endDate).getTime())) {
      options['endDate'] = new Date(query.endDate);
    }

    return this.eventsService.findAll(organizationId, options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by ID' })
  @ApiResponse({
    status: 200,
    description: 'The event has been found.',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  findOne(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return this.eventsService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.update(
      id,
      organizationId,
      userId,
      updateEventDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully deleted.',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  remove(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return this.eventsService.remove(id, organizationId);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully published.',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  publish(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.publish(id, organizationId, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully cancelled.',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  cancel(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.cancel(id, organizationId, userId);
  }
}
