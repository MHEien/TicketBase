import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Transaction } from './entities/transaction.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ProcessRefundDto } from './dto/process-refund.dto';
import {
  PaymentIntentResponseDto,
  PaymentConfirmationResponseDto,
} from './dto/payment-intent-response.dto';

@ApiTags('payments')
@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Returns client secret and payment provider information',
    type: PaymentIntentResponseDto,
  })
  @ApiBody({ type: CreatePaymentIntentDto })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<PaymentIntentResponseDto> {
    return this.paymentsService.createPaymentIntent(
      createPaymentIntentDto.organizationId,
      createPaymentIntentDto.amount,
      createPaymentIntentDto.currency,
      createPaymentIntentDto.metadata,
    );
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm a payment' })
  @ApiResponse({
    status: 200,
    description: 'Returns the status of the payment intent',
    type: PaymentConfirmationResponseDto,
  })
  @ApiBody({ type: ConfirmPaymentDto })
  async confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<PaymentConfirmationResponseDto> {
    return this.paymentsService.confirmPayment(
      confirmPaymentDto.organizationId,
      confirmPaymentDto.paymentIntentId,
    );
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a refund' })
  @ApiResponse({
    status: 200,
    description: 'Returns the refund details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        amount: { type: 'number' },
      },
    },
  })
  @ApiBody({ type: ProcessRefundDto })
  async processRefund(
    @Body() processRefundDto: ProcessRefundDto,
  ): Promise<any> {
    const refund = await this.paymentsService.processRefund(
      processRefundDto.organizationId,
      processRefundDto.paymentIntentId,
      processRefundDto.amount,
    );

    return refund;
  }

  @Get('transactions/order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions by order ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all transactions for the order',
    type: [Transaction],
  })
  @ApiParam({ name: 'orderId', required: true, type: String })
  async getTransactionsByOrder(
    @Param('orderId') orderId: string,
  ): Promise<Transaction[]> {
    return this.paymentsService.getTransactionsByOrder(orderId);
  }

  @Get('transactions/organization/:organizationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions by organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all transactions for the organization',
    type: [Transaction],
  })
  @ApiParam({ name: 'organizationId', required: true, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  async getTransactionsByOrganization(
    @Param('organizationId') organizationId: string,
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
  ): Promise<Transaction[]> {
    return this.paymentsService.getTransactionsByOrganization(
      organizationId,
      fromDate,
      toDate,
    );
  }
}
