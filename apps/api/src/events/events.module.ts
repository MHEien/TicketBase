import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { TicketType } from './entities/ticket-type.entity';
import { Ticket } from './entities/ticket.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TicketTypesService } from './ticket-types.service';
import { TicketTypesController } from './ticket-types.controller';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, TicketType, Ticket]),
    UsersModule,
  ],
  controllers: [EventsController, TicketTypesController, TicketsController],
  providers: [EventsService, TicketTypesService, TicketsService],
  exports: [EventsService, TicketTypesService, TicketsService],
})
export class EventsModule {} 