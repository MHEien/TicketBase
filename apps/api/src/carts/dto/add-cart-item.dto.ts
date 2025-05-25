import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsEnum,
  Min,
  IsObject,
} from 'class-validator';
import { CartItemType } from '../entities/cart-item.entity';
import { Type } from 'class-transformer';

export class AddCartItemDto {
  @ApiProperty({
    description: 'Ticket type ID (for ticket items)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  ticketTypeId?: string;

  @ApiProperty({ description: 'Item name', example: 'VIP Ticket' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantity', example: 2, default: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 99.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice: number;

  @ApiProperty({
    description: 'Item type',
    enum: CartItemType,
    default: CartItemType.TICKET,
  })
  @IsEnum(CartItemType)
  type: CartItemType;

  @ApiProperty({ description: 'Additional metadata (JSON)', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
