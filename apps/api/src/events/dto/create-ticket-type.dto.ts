import { IsNotEmpty, IsString, IsDateString, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class CreateTicketTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  minPerOrder?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxPerOrder?: number;

  @IsDateString()
  @IsOptional()
  salesStartDate?: string;

  @IsDateString()
  @IsOptional()
  salesEndDate?: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean = false;

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean = false;

  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;
} 