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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TicketTypesService } from './ticket-types.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';

@Controller('events/:eventId/ticket-types')
@UseGuards(JwtAuthGuard)
export class TicketTypesController {
  constructor(private readonly ticketTypesService: TicketTypesService) {}

  @Post()
  create(
    @Request() req,
    @Param('eventId') eventId: string,
    @Body() createTicketTypeDto: CreateTicketTypeDto,
  ) {
    const organizationId = req.user.organizationId;
    return this.ticketTypesService.create(
      eventId,
      organizationId,
      createTicketTypeDto,
    );
  }

  @Get()
  findAll(@Request() req, @Param('eventId') eventId: string) {
    const organizationId = req.user.organizationId;
    return this.ticketTypesService.findAll(eventId, organizationId);
  }

  @Get(':id')
  findOne(
    @Request() req,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    const organizationId = req.user.organizationId;
    return this.ticketTypesService.findOne(id, eventId, organizationId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateTicketTypeDto: UpdateTicketTypeDto,
  ) {
    const organizationId = req.user.organizationId;
    return this.ticketTypesService.update(
      id,
      eventId,
      organizationId,
      updateTicketTypeDto,
    );
  }

  @Delete(':id')
  remove(
    @Request() req,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    const organizationId = req.user.organizationId;
    return this.ticketTypesService.remove(id, eventId, organizationId);
  }
}
