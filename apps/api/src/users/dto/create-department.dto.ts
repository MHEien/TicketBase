import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class DepartmentNotificationPreferencesDto {
  @ApiProperty({ description: 'Notify on new tickets', required: false })
  @IsOptional()
  @IsBoolean()
  newTicket?: boolean;

  @ApiProperty({ description: 'Notify on ticket assignments', required: false })
  @IsOptional()
  @IsBoolean()
  ticketAssigned?: boolean;

  @ApiProperty({ description: 'Notify on ticket closures', required: false })
  @IsOptional()
  @IsBoolean()
  ticketClosed?: boolean;

  @ApiProperty({ description: 'Send daily summary', required: false })
  @IsOptional()
  @IsBoolean()
  dailySummary?: boolean;
}

class DepartmentCustomFieldDto {
  @ApiProperty({ description: 'Field key' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ description: 'Field label' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Field type',
    enum: ['text', 'number', 'date', 'boolean', 'select'],
  })
  @IsNotEmpty()
  @IsString()
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';

  @ApiProperty({
    description: 'Field options for select type',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: 'Whether the field is required',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}

class DepartmentSettingsDto {
  @ApiProperty({ description: 'Department color', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Department icon', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Contact email', required: false })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone', required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ description: 'Department location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Default ticket assignee ID', required: false })
  @IsOptional()
  @IsString()
  defaultTicketAssignee?: string;

  @ApiProperty({ description: 'Auto-assign tickets', required: false })
  @IsOptional()
  @IsBoolean()
  autoAssignTickets?: boolean;

  @ApiProperty({ description: 'Notification preferences', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DepartmentNotificationPreferencesDto)
  notificationPreferences?: DepartmentNotificationPreferencesDto;

  @ApiProperty({
    description: 'Custom fields',
    required: false,
    type: [DepartmentCustomFieldDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DepartmentCustomFieldDto)
  customFields?: DepartmentCustomFieldDto[];
}

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Department description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL-friendly identifier' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Department head user ID', required: false })
  @IsOptional()
  @IsUUID()
  headId?: string;

  @ApiProperty({ description: 'Parent department ID', required: false })
  @IsOptional()
  @IsUUID()
  parentDepartmentId?: string;

  @ApiProperty({
    description: 'Department code or identifier',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Department settings', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DepartmentSettingsDto)
  settings?: DepartmentSettingsDto;

  @ApiProperty({
    description: 'Whether the department is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
