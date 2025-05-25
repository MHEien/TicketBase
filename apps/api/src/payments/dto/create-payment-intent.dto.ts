import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsObject, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Organization ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Amount to charge', example: 99.99 })
  @IsNumber()
  @Min(0.5)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'usd', default: 'usd' })
  @IsString()
  @IsOptional()
  currency?: string = 'usd';

  @ApiProperty({
    description: 'Additional metadata for the payment intent',
    required: false,
    example: { orderId: '123e4567-e89b-12d3-a456-426614174000' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 