import { ApiProperty } from '@nestjs/swagger';

export enum PluginStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
  REMOVED = 'removed',
}

export enum PluginCategory {
  PAYMENT = 'payment',
  NOTIFICATION = 'notification',
  ANALYTICS = 'analytics',
  INTEGRATION = 'integration',
  UI = 'ui',
  WORKFLOW = 'workflow',
}

export class PluginResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({
    description: 'Plugin name',
    example: 'Stripe Payment Gateway',
  })
  name: string;

  @ApiProperty({ description: 'Plugin version', example: '1.0.0' })
  version: string;

  @ApiProperty({
    description: 'Plugin description',
    example: 'Integrates Stripe payment processing',
  })
  description: string;

  @ApiProperty({
    description: 'Plugin category',
    enum: PluginCategory,
    enumName: 'PluginCategory',
  })
  category: PluginCategory;

  @ApiProperty({
    description: 'Plugin status',
    enum: PluginStatus,
    enumName: 'PluginStatus',
  })
  status: PluginStatus;

  @ApiProperty({
    description: 'URL to the plugin bundle',
    required: false,
  })
  bundleUrl?: string;

  @ApiProperty({
    description: 'List of extension points this plugin implements',
    type: [String],
  })
  extensionPoints: string[];

  @ApiProperty({
    description: 'Required permissions for this plugin',
    type: [String],
  })
  requiredPermissions: string[];

  @ApiProperty({
    description: 'Metadata about the plugin',
    required: false,
    example: {
      priority: 100,
      displayName: 'Stripe Payments',
      author: 'Stripe Inc.',
    },
  })
  metadata?: Record<string, unknown>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
