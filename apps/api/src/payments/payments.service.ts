import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from './entities/transaction.entity';
import { PluginsService } from '../plugins/plugins.service';
import { PluginCategory } from '../plugins/entities/plugin.entity';

// Payment provider interface - defines what methods a payment plugin must implement
export interface PaymentProviderResponse {
  success: boolean;
  data?: any;
  error?: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private configService: ConfigService,
    private pluginsService: PluginsService,
  ) {}

  /**
   * Creates a payment intent using the organization's configured payment provider
   */
  async createPaymentIntent(
    organizationId: string,
    amount: number,
    currency: string = 'usd',
    metadata: any = {},
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    providerName: string;
  }> {
    try {
      // Find the enabled payment plugin for this organization
      const paymentPlugins = await this.pluginsService.getPluginsByType(
        organizationId,
        PluginCategory.PAYMENT,
      );

      if (!paymentPlugins || paymentPlugins.length === 0) {
        throw new BadRequestException(
          'No payment provider is configured for this organization',
        );
      }

      // Use the first enabled payment plugin (in the future, could allow selection)
      const paymentPlugin = paymentPlugins[0];
      const providerName =
        paymentPlugin.plugin.metadata?.paymentProvider || 'unknown';

      // Make the plugin request through the plugin proxy service
      // This would call the plugin's createPaymentIntent method
      const response = await this.makePluginRequest(
        paymentPlugin.id,
        'createPaymentIntent',
        {
          amount,
          currency,
          metadata,
        },
      );

      if (!response.success) {
        throw new BadRequestException(
          `Failed to create payment intent: ${response.error}`,
        );
      }

      return {
        clientSecret: response.data.clientSecret,
        paymentIntentId: response.data.paymentIntentId,
        providerName,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Confirms a payment using the organization's configured payment provider
   */
  async confirmPayment(
    organizationId: string,
    paymentIntentId: string,
  ): Promise<{ status: string; paymentData: any }> {
    try {
      // Find the enabled payment plugin for this organization
      const paymentPlugins = await this.pluginsService.getPluginsByType(
        organizationId,
        PluginCategory.PAYMENT,
      );

      if (!paymentPlugins || paymentPlugins.length === 0) {
        throw new BadRequestException(
          'No payment provider is configured for this organization',
        );
      }

      // Use the first enabled payment plugin
      const paymentPlugin = paymentPlugins[0];

      // Make the plugin request
      const response = await this.makePluginRequest(
        paymentPlugin.id,
        'confirmPayment',
        { paymentIntentId },
      );

      if (!response.success) {
        throw new BadRequestException(
          `Failed to confirm payment: ${response.error}`,
        );
      }

      return {
        status: response.data.status,
        paymentData: response.data.paymentData,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to confirm payment: ${error.message}`,
      );
    }
  }

  /**
   * Processes a refund using the organization's configured payment provider
   */
  async processRefund(
    organizationId: string,
    paymentIntentId: string,
    amount?: number,
  ): Promise<any> {
    try {
      // Find the enabled payment plugin for this organization
      const paymentPlugins = await this.pluginsService.getPluginsByType(
        organizationId,
        PluginCategory.PAYMENT,
      );

      if (!paymentPlugins || paymentPlugins.length === 0) {
        throw new BadRequestException(
          'No payment provider is configured for this organization',
        );
      }

      // Use the first enabled payment plugin
      const paymentPlugin = paymentPlugins[0];

      // Make the plugin request
      const response = await this.makePluginRequest(
        paymentPlugin.id,
        'processRefund',
        { paymentIntentId, amount },
      );

      if (!response.success) {
        throw new BadRequestException(
          `Failed to process refund: ${response.error}`,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to process refund: ${error.message}`,
      );
    }
  }

  /**
   * Helper method to make requests to payment plugins
   * This would use your plugin system's method of calling plugin methods
   */
  private async makePluginRequest(
    pluginId: string,
    method: string,
    params: any,
  ): Promise<PaymentProviderResponse> {
    // In a real implementation, this would use your plugin system's API to call the method
    // This is a placeholder that would need to be implemented based on your plugin architecture

    // Example implementation using a hypothetical plugin proxy service:
    try {
      // This would be replaced with your actual plugin proxy mechanism
      // const response = await this.pluginProxyService.callPluginMethod(pluginId, method, params);
      // return response;

      // For now, we'll throw an error to indicate this needs implementation
      throw new Error('Plugin proxy method not implemented');
    } catch (error) {
      return {
        success: false,
        error:
          error.message || 'Unknown error occurred when calling payment plugin',
      };
    }
  }

  async createTransaction(
    organizationId: string,
    orderId: string,
    userId: string,
    amount: number,
    currency: string,
    paymentMethod: string,
    paymentMethodId: string,
    paymentIntentId?: string,
    type: TransactionType = TransactionType.PURCHASE,
  ): Promise<Transaction> {
    try {
      // Find the enabled payment plugin to get fee information
      const paymentPlugins = await this.pluginsService.getPluginsByType(
        organizationId,
        PluginCategory.PAYMENT,
      );

      // Default fees if no plugin is found or plugin doesn't provide fee information
      let gatewayFee = amount * 0.029 + 0.3; // Default: 2.9% + $0.30
      let platformFee = amount * 0.02; // Default: 2% platform fee

      // If we have a payment plugin, get the fee structure from its configuration
      if (paymentPlugins && paymentPlugins.length > 0) {
        const paymentPlugin = paymentPlugins[0];
        const pluginConfig = paymentPlugin.configuration || {};

        // Override with plugin-provided fee structure if available
        if (pluginConfig.feeStructure) {
          if (
            typeof pluginConfig.feeStructure.calculateGatewayFee === 'function'
          ) {
            gatewayFee = pluginConfig.feeStructure.calculateGatewayFee(amount);
          } else if (pluginConfig.feeStructure.gatewayFeePercent) {
            gatewayFee =
              (amount * pluginConfig.feeStructure.gatewayFeePercent) / 100 +
              (pluginConfig.feeStructure.gatewayFeeFixed || 0);
          }

          if (pluginConfig.feeStructure.platformFeePercent) {
            platformFee =
              (amount * pluginConfig.feeStructure.platformFeePercent) / 100;
          }
        }
      }

      const transaction = this.transactionsRepository.create({
        organizationId,
        orderId,
        userId,
        amount,
        currency,
        paymentMethod,
        paymentMethodId,
        paymentIntentId,
        type,
        status: TransactionStatus.PENDING,
        gatewayFee,
        platformFee,
      });

      return this.transactionsRepository.save(transaction);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create transaction: ${error.message}`,
      );
    }
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
    errorMessage?: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new BadRequestException(`Transaction with ID ${id} not found`);
    }

    transaction.status = status;
    if (errorMessage) {
      transaction.errorMessage = errorMessage;
    }

    return this.transactionsRepository.save(transaction);
  }

  async getTransactionsByOrder(orderId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTransactionsByOrganization(
    organizationId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<Transaction[]> {
    const queryBuilder = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.organizationId = :organizationId', {
        organizationId,
      });

    if (fromDate) {
      queryBuilder.andWhere('transaction.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('transaction.createdAt <= :toDate', { toDate });
    }

    return queryBuilder.orderBy('transaction.createdAt', 'DESC').getMany();
  }

  async createRefundTransaction(
    originalTransaction: Transaction,
    amount: number,
    refundId: string,
  ): Promise<Transaction> {
    return this.createTransaction(
      originalTransaction.organizationId,
      originalTransaction.orderId,
      originalTransaction.userId,
      amount,
      originalTransaction.currency,
      originalTransaction.paymentMethod,
      originalTransaction.paymentMethodId,
      refundId,
      TransactionType.REFUND,
    );
  }
}
