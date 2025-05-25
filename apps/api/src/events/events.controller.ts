import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from './entities/event.entity';

@Controller('api/events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.create(organizationId, userId, createEventDto);
  }

  @Get()
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
  findOne(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return this.eventsService.findOne(id, organizationId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.update(id, organizationId, userId, updateEventDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return this.eventsService.remove(id, organizationId);
  }

  @Post(':id/publish')
  publish(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.publish(id, organizationId, userId);
  }

  @Post(':id/cancel')
  cancel(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.eventsService.cancel(id, organizationId, userId);
  }
} 