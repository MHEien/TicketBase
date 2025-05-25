import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemType } from '../entities/cart-item.entity';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Item name', example: 'VIP Ticket', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Quantity', example: 2, required: false })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ description: 'Unit price', example: 99.99, required: false })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ description: 'Item type', enum: CartItemType, required: false })
  @IsEnum(CartItemType)
  @IsOptional()
  type?: CartItemType;

  @ApiProperty({ description: 'Additional metadata (JSON)', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 