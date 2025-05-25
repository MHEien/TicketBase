import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';

@Controller('api/tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Note: In a real application, ticket generation would likely be handled by
  // the order management system, not directly exposed as an API endpoint.
  @Post('generate')
  generateTickets(
    @Request() req, 
    @Body() body: {
      eventId: string;
      ticketTypeId: string;
      quantity: number;
      orderId: string;
      orderItemId: string;
      attendeeInfo?: any;
    }
  ) {
    const organizationId = req.user.organizationId;
    return this.ticketsService.generateTickets(
      organizationId,
      body.eventId,
      body.ticketTypeId,
      body.quantity,
      body.orderId,
      body.orderItemId,
      body.attendeeInfo
    );
  }

  @Get('validate/:code')
  validateTicket(
    @Request() req,
    @Param('code') code: string
  ) {
    const organizationId = req.user.organizationId;
    return this.ticketsService.validateTicket(organizationId, code);
  }

  @Post('check-in/:code')
  checkInTicket(
    @Request() req,
    @Param('code') code: string
  ) {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    return this.ticketsService.checkInTicket(organizationId, code, userId);
  }
} 