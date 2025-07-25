import { ApiProperty } from '@nestjs/swagger';

export class PublicPluginDto {
  @ApiProperty({ description: 'Plugin ID' })
  id: string;

  @ApiProperty({ description: 'Plugin name' })
  name: string;

  @ApiProperty({ description: 'Plugin version' })
  version: string;

  @ApiProperty({ description: 'Plugin description' })
  description: string;

  @ApiProperty({ description: 'Plugin author' })
  author: string;

  @ApiProperty({
    description: 'Plugin category',
    enum: ['payment', 'analytics', 'marketing', 'integration', 'other'],
  })
  category: string;

  @ApiProperty({ description: 'Display name for the plugin' })
  displayName: string;

  @ApiProperty({ description: 'Plugin priority for ordering' })
  priority: number;

  @ApiProperty({
    description: 'Plugin status',
    enum: ['active', 'inactive', 'deprecated', 'removed'],
  })
  status: string;

  @ApiProperty({
    description: 'Extension points this plugin supports',
    type: [String],
  })
  extensionPoints: string[];

  @ApiProperty({
    description: 'Public metadata (no sensitive data)',
    type: 'object',
    additionalProperties: true,
  })
  metadata: {
    displayName?: string;
    iconUrl?: string;
    paymentProvider?: string;
    supportedMethods?: string[];
    supportedCurrencies?: string[];
    [key: string]: any;
  };

  @ApiProperty({ description: 'Bundle URL for loading plugin code' })
  bundleUrl?: string;

  @ApiProperty({ description: 'Plugin creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Plugin last update date' })
  updatedAt: string;
}

export class PublicInstalledPluginDto {
  @ApiProperty({ description: 'Installation ID' })
  id: string;

  @ApiProperty({ description: 'Plugin ID' })
  pluginId: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Whether the plugin is enabled' })
  isEnabled: boolean;

  @ApiProperty({ description: 'Installation date' })
  installedAt: string;

  @ApiProperty({ description: 'Last update date' })
  lastUpdated: string;

  @ApiProperty({ description: 'Plugin details', type: PublicPluginDto })
  plugin: PublicPluginDto;

  // NOTE: Configuration is intentionally excluded for security
  // The storefront should never have access to sensitive plugin config
}
