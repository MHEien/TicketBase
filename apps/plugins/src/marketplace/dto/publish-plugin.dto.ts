import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
  IsEmail,
  IsUrl,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AdminComponentsDto {
  @ApiPropertyOptional({
    description: 'Settings component path in the plugin bundle',
    example: './Settings',
  })
  @IsOptional()
  @IsString()
  settings?: string;

  @ApiPropertyOptional({
    description: 'Event creation component path in the plugin bundle',
    example: './EventCreation',
  })
  @IsOptional()
  @IsString()
  eventCreation?: string;

  @ApiPropertyOptional({
    description: 'Dashboard component path in the plugin bundle',
    example: './Dashboard',
  })
  @IsOptional()
  @IsString()
  dashboard?: string;
}

class StorefrontComponentsDto {
  @ApiPropertyOptional({
    description: 'Checkout component path in the plugin bundle',
    example: './Checkout',
  })
  @IsOptional()
  @IsString()
  checkout?: string;

  @ApiPropertyOptional({
    description: 'Event detail component path in the plugin bundle',
    example: './EventDetail',
  })
  @IsOptional()
  @IsString()
  eventDetail?: string;

  @ApiPropertyOptional({
    description: 'Ticket selection component path in the plugin bundle',
    example: './TicketSelection',
  })
  @IsOptional()
  @IsString()
  ticketSelection?: string;

  @ApiPropertyOptional({
    description: 'Widget components mapping',
    example: {
      sidebar: './SidebarWidget',
      footer: './FooterWidget',
    },
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  @IsOptional()
  @IsObject()
  widgets?: Record<string, string>;
}

class PluginMetadataDto {
  @ApiPropertyOptional({
    description: 'Plugin author name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Plugin author email',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @ApiPropertyOptional({
    description: 'Repository URL for the plugin source code',
    example: 'https://github.com/johndoe/payment-plugin',
  })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiPropertyOptional({
    description: 'Plugin submission timestamp',
    example: '2023-12-01T10:00:00Z',
  })
  @IsOptional()
  @IsString()
  submittedAt?: string;

  @ApiPropertyOptional({
    description: 'Plugin submission status',
    example: 'pending',
    enum: ['pending', 'approved', 'rejected'],
  })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Plugin priority for ordering',
    example: 100,
  })
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({
    description: 'Display name for the plugin',
    example: 'Stripe Payments',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'URL to the plugin icon',
    example: 'https://example.com/icon.svg',
  })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}

export class PublishPluginDto {
  @ApiProperty({
    description: 'Unique identifier for the plugin',
    example: 'payment-gateway',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Display name of the plugin',
    example: 'Payment Gateway Plugin',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Semantic version of the plugin',
    example: '1.0.0',
  })
  @IsNotEmpty()
  @IsString()
  version: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the plugin functionality',
    example:
      'Integrates with popular payment processors to enable credit card payments',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Category the plugin belongs to',
    example: 'payments',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'URL to the remote entry file for Module Federation',
    example:
      'https://cdn.example.com/plugins/payment-gateway/v1.0.0/remoteEntry.js',
  })
  @IsNotEmpty()
  @IsString()
  remoteEntry: string;

  @ApiProperty({
    description: 'Module Federation scope name',
    example: 'payment_gateway',
  })
  @IsNotEmpty()
  @IsString()
  scope: string;

  @ApiPropertyOptional({
    description: 'Components for the admin panel',
    type: AdminComponentsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AdminComponentsDto)
  adminComponents?: AdminComponentsDto;

  @ApiPropertyOptional({
    description: 'Components for the storefront',
    type: StorefrontComponentsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => StorefrontComponentsDto)
  storefrontComponents?: StorefrontComponentsDto;

  @ApiPropertyOptional({
    description: 'List of permissions required by the plugin',
    example: ['read:orders', 'write:transactions'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredPermissions?: string[];

  @ApiPropertyOptional({
    description: 'Plugin metadata including author information and submission details',
    type: PluginMetadataDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PluginMetadataDto)
  metadata?: PluginMetadataDto;
}
