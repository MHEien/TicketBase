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

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Returns client secret and payment provider information',
    schema: {
      type: 'object',
      properties: {
        clientSecret: { type: 'string' },
        paymentIntentId: { type: 'string' },
        providerName: { type: 'string' },
      },
    },
  })
  @ApiBody({ type: CreatePaymentIntentDto })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    providerName: string;
  }> {
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
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        paymentData: { type: 'object' },
      },
    },
  })
  @ApiBody({ type: ConfirmPaymentDto })
  async confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<{ status: string; paymentData: any }> {
    const result = await this.paymentsService.confirmPayment(
      confirmPaymentDto.organizationId,
      confirmPaymentDto.paymentIntentId,
    );
    return result;
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
