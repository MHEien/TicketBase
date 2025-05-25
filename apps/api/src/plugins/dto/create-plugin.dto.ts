import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUrl,
  IsArray,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PluginCategory } from '../entities/plugin.entity';

export class CreatePluginDto {
  @ApiProperty({ description: 'Plugin name', example: 'Stripe Payment Gateway' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Plugin version', example: '1.0.0' })
  @IsString()
  version: string;

  @ApiProperty({ description: 'Plugin description', example: 'Integrates Stripe payment processing' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Plugin category', enum: PluginCategory })
  @IsEnum(PluginCategory)
  category: PluginCategory;

  @ApiProperty({ description: 'URL to the plugin bundle' })
  @IsUrl()
  bundleUrl: string;

  @ApiProperty({
    description: 'List of extension points this plugin implements',
    type: [String],
    example: ['payment.gateway', 'checkout.form'],
  })
  @IsArray()
  @IsString({ each: true })
  extensionPoints: string[];

  @ApiProperty({
    description: 'Admin components provided by the plugin',
    example: {
      settings: 'StripeSettings',
      eventCreation: 'StripeEventOptions',
      dashboard: 'StripeDashboard',
    },
  })
  @IsObject()
  adminComponents: {
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
  })
  @IsObject()
  storefrontComponents: {
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
      paymentProvider: 'stripe',
      supportedMethods: ['credit_card', 'ach'],
      supportedCurrencies: ['USD', 'EUR']
    },
  })
  @IsObject()
  metadata: Record<string, any>;

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