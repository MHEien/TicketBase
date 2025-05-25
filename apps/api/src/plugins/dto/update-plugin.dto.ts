import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUrl,
  IsArray,
  IsObject,
  IsOptional,
} from 'class-validator';
import { PluginCategory } from '../entities/plugin.entity';

export class UpdatePluginDto {
  @ApiProperty({
    description: 'Plugin name',
    example: 'Stripe Payment Gateway',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Plugin version',
    example: '1.0.1',
    required: false,
  })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({
    description: 'Plugin description',
    example: 'Integrates Stripe payment processing',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Plugin category',
    enum: PluginCategory,
    required: false,
  })
  @IsEnum(PluginCategory)
  @IsOptional()
  category?: PluginCategory;

  @ApiProperty({ description: 'URL to the plugin bundle', required: false })
  @IsUrl()
  @IsOptional()
  bundleUrl?: string;

  @ApiProperty({
    description: 'List of extension points this plugin implements',
    type: [String],
    example: ['payment.gateway', 'checkout.form'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  extensionPoints?: string[];

  @ApiProperty({
    description: 'Admin components provided by the plugin',
    example: {
      settings: 'StripeSettings',
      eventCreation: 'StripeEventOptions',
      dashboard: 'StripeDashboard',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  adminComponents?: {
    settings?: string;
    eventCreation?: string;
    dashboard?: string;
  };

  @ApiProperty({
    description: 'Storefront components provided by the plugin',
    example: {
      checkout: 'StripeCheckout',
      widgets: {
        paymentMethods: 'StripePaymentMethods',
      },
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  storefrontComponents?: {
    checkout?: string;
    eventDetail?: string;
    ticketSelection?: string;
    widgets?: Record<string, string>;
  };

  @ApiProperty({
    description: 'Metadata about the plugin',
    example: {
      priority: 100,
      displayName: 'Stripe Payments',
      author: 'Stripe Inc.',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: {
    priority?: number;
    displayName?: string;
    author?: string;
  };

  @ApiProperty({
    description: 'Required permissions for this plugin',
    type: [String],
    required: false,
    example: ['payments.read', 'payments.write'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredPermissions?: string[];
}
