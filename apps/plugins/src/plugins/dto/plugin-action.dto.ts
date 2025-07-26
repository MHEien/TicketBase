import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExecutePluginActionDto {
  @ApiProperty({
    description: 'The action to execute',
    example: 'create-checkout-session',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Parameters for the action',
    example: {
      amount: 2000,
      currency: 'usd',
      items: [{ name: 'Event Ticket', quantity: 1, price: 2000 }],
    },
  })
  @IsObject()
  parameters: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Optional metadata for the action',
    example: { orderId: '12345', userId: 'user-123' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class PluginActionResponseDto {
  @ApiProperty({ description: 'Whether the action was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data from the action' })
  data?: any;

  @ApiProperty({ description: 'Error message if action failed' })
  error?: string;

  @ApiProperty({ description: 'Action type that was executed' })
  action: string;
}
