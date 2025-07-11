import { ApiProperty } from '@nestjs/swagger';
import { TicketType } from '../entities/ticket-type.entity';

export class PublicEventDto {
  @ApiProperty({ description: 'Event ID' })
  id: string;

  @ApiProperty({ description: 'Organization ID that owns this event' })
  organizationId: string;

  @ApiProperty({ description: 'Event title' })
  title: string;

  @ApiProperty({ description: 'Event description' })
  description: string;

  @ApiProperty({
    description: 'Short description for listings',
    required: false,
  })
  shortDescription?: string;

  @ApiProperty({ description: 'Event category' })
  category: string;

  @ApiProperty({ description: 'Event start date' })
  startDate: string;

  @ApiProperty({ description: 'Event end date' })
  endDate: string;

  @ApiProperty({ description: 'Event start time' })
  startTime: string;

  @ApiProperty({ description: 'Event end time' })
  endTime: string;

  @ApiProperty({ description: 'Event timezone' })
  timeZone: string;

  @ApiProperty({
    description: 'Location type',
    enum: ['physical', 'virtual', 'hybrid'],
  })
  locationType: 'physical' | 'virtual' | 'hybrid';

  @ApiProperty({ description: 'Venue name', required: false })
  venueName?: string;

  @ApiProperty({ description: 'Event address', required: false })
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  city?: string;

  @ApiProperty({ description: 'State/Province', required: false })
  state?: string;

  @ApiProperty({ description: 'ZIP/Postal code', required: false })
  zipCode?: string;

  @ApiProperty({ description: 'Country', required: false })
  country?: string;

  @ApiProperty({ description: 'Virtual event URL', required: false })
  virtualEventUrl?: string;

  @ApiProperty({ description: 'Featured image URL', required: false })
  featuredImage?: string;

  @ApiProperty({ description: 'Gallery image URLs', required: false })
  galleryImages?: string[];

  @ApiProperty({
    description: 'Event status',
    enum: ['draft', 'published', 'cancelled', 'completed'],
  })
  status: 'draft' | 'published' | 'cancelled' | 'completed';

  @ApiProperty({
    description: 'Event visibility',
    enum: ['public', 'private', 'unlisted'],
  })
  visibility: 'public' | 'private' | 'unlisted';

  @ApiProperty({ description: 'Ticket sales start date', required: false })
  salesStartDate?: string;

  @ApiProperty({ description: 'Ticket sales end date', required: false })
  salesEndDate?: string;

  @ApiProperty({ description: 'SEO title', required: false })
  seoTitle?: string;

  @ApiProperty({ description: 'SEO description', required: false })
  seoDescription?: string;

  @ApiProperty({ description: 'Event tags', required: false })
  tags?: string[];

  @ApiProperty({ description: 'Total tickets sold' })
  totalTicketsSold: number;

  @ApiProperty({ description: 'Total revenue generated' })
  totalRevenue: number;

  @ApiProperty({ description: 'Event capacity' })
  capacity: number;

  @ApiProperty({ description: 'Available ticket types', type: [TicketType] })
  ticketTypes: TicketType[];

  @ApiProperty({ description: 'Event creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Event last update date' })
  updatedAt: string;
}
