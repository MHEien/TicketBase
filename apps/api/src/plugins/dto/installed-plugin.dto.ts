import { ApiProperty } from '@nestjs/swagger';
import { PluginCategory, PluginStatus } from '../types/plugin.types';

export class InstalledPluginDto {
  @ApiProperty({
    description: 'Unique identifier for the installed plugin',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Plugin ID reference',
    example: '507f1f77bcf86cd799439012',
  })
  pluginId: string;

  @ApiProperty({
    description: 'Organization ID that installed the plugin',
    example: '507f1f77bcf86cd799439013',
  })
  organizationId: string;

  @ApiProperty({
    description: 'Plugin name',
    example: 'Stripe Payment Gateway',
  })
  name: string;

  @ApiProperty({
    description: 'Plugin version',
    example: '1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Plugin description',
    example: 'Integrates Stripe payment processing',
  })
  description: string;

  @ApiProperty({
    description: 'Plugin category',
    enum: PluginCategory,
  })
  category: PluginCategory;

  @ApiProperty({
    description: 'Plugin status',
    enum: PluginStatus,
  })
  status: PluginStatus;

  @ApiProperty({
    description: 'Whether the plugin is enabled',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'Plugin configuration',
    example: {
      apiKey: 'sk_test_...',
      webhookSecret: 'whsec_...',
    },
  })
  configuration: Record<string, unknown>;

  @ApiProperty({
    description: 'Installation date',
    example: '2023-12-01T10:00:00Z',
  })
  installedAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-12-01T10:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Plugin metadata',
    example: {
      priority: 100,
      displayName: 'Stripe Payments',
      author: 'Stripe Inc.',
    },
  })
  metadata: Record<string, unknown>;
}
