import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventLocationType, EventVisibility } from '../entities/event.entity';
import { CreateTicketTypeDto } from './create-ticket-type.dto';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  timeZone: string;

  @IsEnum(EventLocationType)
  locationType: EventLocationType;

  @IsString()
  @IsOptional()
  venueName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  virtualEventUrl?: string;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  galleryImages?: string[];

  @IsEnum(EventVisibility)
  @IsOptional()
  visibility?: EventVisibility = EventVisibility.PUBLIC;

  @IsDateString()
  @IsOptional()
  salesStartDate?: string;

  @IsDateString()
  @IsOptional()
  salesEndDate?: string;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  capacity?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTypeDto)
  @IsOptional()
  ticketTypes?: CreateTicketTypeDto[];
}
