import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
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
}
