import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessRefundDto {
  @ApiProperty({ 
    description: 'Organization ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'Payment intent ID',
    example: 'pi_3NtX5ELkdIwHu7ix0SjgrdUm',
  })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty({
    description: 'Amount to refund (leave empty for full refund)',
    required: false,
    example: 50.00,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  amount?: number;
} 