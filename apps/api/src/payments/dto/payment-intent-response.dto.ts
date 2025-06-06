import { ApiProperty } from '@nestjs/swagger';

export class PaymentIntentResponseDto {
  @ApiProperty({
    description: 'Client secret for the payment intent',
    example: 'pi_1234_secret_5678',
  })
  clientSecret: string;

  @ApiProperty({
    description: 'ID of the payment intent',
    example: 'pi_1234567890',
  })
  paymentIntentId: string;

  @ApiProperty({
    description: 'Name of the payment provider',
    example: 'stripe',
  })
  providerName: string;
}

export class PaymentConfirmationResponseDto {
  @ApiProperty({
    description: 'Status of the payment',
    example: 'succeeded',
    enum: [
      'succeeded',
      'processing',
      'requires_payment_method',
      'requires_confirmation',
      'canceled',
    ],
  })
  status: string;

  @ApiProperty({
    description: 'Additional payment data from the provider',
    type: 'object',
    additionalProperties: true,
  })
  paymentData: Record<string, any>;
}
