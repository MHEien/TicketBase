import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsArray, IsOptional } from 'class-validator';
import { CreatePluginDto } from './create-plugin.dto';
import { PluginCategory } from '../entities/plugin.entity';

export class RegisterPaymentPluginDto extends CreatePluginDto {
  @ApiProperty({ 
    description: 'Payment provider name',
    example: 'stripe',
    enum: ['stripe', 'paypal', 'authorize_net', 'square', 'braintree']
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    description: 'Supported payment methods',
    example: ['credit_card', 'ach', 'apple_pay', 'google_pay']
  })
  @IsArray()
  @IsString({ each: true })
  supportedMethods: string[];

  @ApiProperty({
    description: 'Supported currencies',
    example: ['USD', 'EUR', 'GBP']
  })
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies: string[];

  @ApiProperty({
    description: 'Gateway-specific configuration schema',
    example: {
      properties: {
        apiKey: { type: 'string', required: true },
        testMode: { type: 'boolean', default: false }
      }
    }
  })
  @IsObject()
  configurationSchema: Record<string, any>;

  @ApiProperty({
    description: 'Default plugin configuration',
    example: {
      testMode: true
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  defaultConfiguration?: Record<string, any>;

  constructor(partial: Partial<RegisterPaymentPluginDto>) {
    super();
    Object.assign(this, partial);
    // Set default category for payment plugins
    this.category = PluginCategory.PAYMENT;
    // Set extension points for payment plugins
    this.extensionPoints = this.extensionPoints || [
      'payment.gateway',
      'checkout.payment_method',
      'order.payment_processor'
    ];
  }
} 