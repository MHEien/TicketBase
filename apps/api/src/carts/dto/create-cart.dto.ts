import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ description: 'Event ID' })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: 'User ID (optional for guest checkout)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Session ID for tracking anonymous carts',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;
}
