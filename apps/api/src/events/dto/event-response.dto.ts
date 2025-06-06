import { ApiProperty } from '@nestjs/swagger';
import {
  Event,
  EventLocationType,
  EventStatus,
  EventVisibility,
} from '../entities/event.entity';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { TicketType } from '../entities/ticket-type.entity';

export class EventResponseDto implements Partial<Event> {
  @ApiProperty({ description: 'Unique identifier of the event' })
  id: string;

  @ApiProperty({ description: 'Organization ID that owns this event' })
  organizationId: string;

  @ApiProperty({ description: 'Organization that owns this event' })
  organization: Organization;

  @ApiProperty({ description: 'Title of the event' })
  title: string;

  @ApiProperty({ description: 'Full description of the event' })
  description: string;

  @ApiProperty({
    description: 'Short description for previews',
    required: false,
  })
  shortDescription?: string;

  @ApiProperty({ description: 'Category of the event' })
  category: string;

  @ApiProperty({ description: 'Start date of the event' })
  startDate: Date;

  @ApiProperty({ description: 'End date of the event' })
  endDate: Date;

  @ApiProperty({ description: 'Start time in HH:mm format' })
  startTime: string;

  @ApiProperty({ description: 'End time in HH:mm format' })
  endTime: string;

  @ApiProperty({ description: 'Timezone of the event' })
  timeZone: string;

  @ApiProperty({
    description: 'Type of event location',
    enum: EventLocationType,
    default: EventLocationType.PHYSICAL,
  })
  locationType: EventLocationType;

  @ApiProperty({ description: 'Name of the venue', required: false })
  venueName?: string;

  @ApiProperty({
    description: 'Physical address of the venue',
    required: false,
  })
  address?: string;

  @ApiProperty({ description: 'City of the venue', required: false })
  city?: string;

  @ApiProperty({ description: 'State/Province of the venue', required: false })
  state?: string;

  @ApiProperty({ description: 'Postal/ZIP code of the venue', required: false })
  zipCode?: string;

  @ApiProperty({ description: 'Country of the venue', required: false })
  country?: string;

  @ApiProperty({ description: 'URL for virtual events', required: false })
  virtualEventUrl?: string;

  @ApiProperty({ description: 'URL of the featured image', required: false })
  featuredImage?: string;

  @ApiProperty({
    description: 'URLs of additional event images',
    type: [String],
    required: false,
  })
  galleryImages?: string[];

  @ApiProperty({
    description: 'Current status of the event',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @ApiProperty({
    description: 'Visibility setting of the event',
    enum: EventVisibility,
    default: EventVisibility.PUBLIC,
  })
  visibility: EventVisibility;

  @ApiProperty({ description: 'When the event was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the event was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID of the user who created the event' })
  createdBy: string;

  @ApiProperty({ description: 'ID of the user who last updated the event' })
  updatedBy: string;

  @ApiProperty({ description: 'User who created the event' })
  creator: User;

  @ApiProperty({ description: 'User who last updated the event' })
  updater: User;

  @ApiProperty({
    description: 'Available ticket types for this event',
    type: [TicketType],
  })
  ticketTypes: TicketType[];

  @ApiProperty({ description: 'When ticket sales begin', required: false })
  salesStartDate?: Date;

  @ApiProperty({ description: 'When ticket sales end', required: false })
  salesEndDate?: Date;

  @ApiProperty({ description: 'SEO optimized title', required: false })
  seoTitle?: string;

  @ApiProperty({ description: 'SEO optimized description', required: false })
  seoDescription?: string;

  @ApiProperty({
    description: 'Event tags for categorization',
    type: [String],
    required: false,
  })
  tags?: string[];

  @ApiProperty({ description: 'Total number of tickets sold', default: 0 })
  totalTicketsSold: number;

  @ApiProperty({
    description: 'Total revenue from ticket sales',
    type: 'number',
    default: 0,
  })
  totalRevenue: number;

  @ApiProperty({ description: 'Maximum number of attendees', default: 0 })
  capacity: number;
}
