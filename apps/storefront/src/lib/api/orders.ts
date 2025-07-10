import { apiClient } from '../api-client';
import { CartItem } from '../../contexts/CartContext';

export interface OrderItem {
  id: string;
  orderId: string;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  eventTitle: string;
  ticketTypeName: string;
}

export interface Order {
  id: string;
  organizationId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentIntentId?: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  specialRequests?: string;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    eventId: string;
    ticketTypeId: string;
    quantity: number;
  }>;
  specialRequests?: string;
  marketingConsent?: boolean;
}

export interface PaymentIntentRequest {
  orderId: string;
  paymentMethod: string;
  paymentDetails?: Record<string, any>;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret?: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  paymentMethod: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface ConfirmPaymentRequest {
  orderId: string;
  paymentIntentId: string;
  paymentMethod: string;
  paymentDetails?: Record<string, any>;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  order: Order;
  paymentDetails?: Record<string, any>;
  tickets?: Array<{
    id: string;
    ticketNumber: string;
    eventId: string;
    ticketTypeId: string;
    qrCode?: string;
  }>;
}

export const ordersApi = {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', orderData);
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  // Get orders by customer email
  async getOrdersByCustomer(email: string): Promise<Order[]> {
    return apiClient.get<Order[]>(`/orders/customer/${encodeURIComponent(email)}`);
  },

  // Create payment intent
  async createPaymentIntent(paymentData: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    return apiClient.post<PaymentIntentResponse>('/orders/payment-intent', paymentData);
  },

  // Confirm payment
  async confirmPayment(confirmData: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
    return apiClient.post<ConfirmPaymentResponse>('/orders/confirm-payment', confirmData);
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<Order> {
    return apiClient.post<Order>(`/orders/${orderId}/cancel`);
  },

  // Refund order
  async refundOrder(orderId: string, reason?: string): Promise<Order> {
    return apiClient.post<Order>(`/orders/${orderId}/refund`, { reason });
  },

  // Get order tickets
  async getOrderTickets(orderId: string): Promise<Array<{
    id: string;
    ticketNumber: string;
    eventId: string;
    ticketTypeId: string;
    qrCode?: string;
    isUsed: boolean;
  }>> {
    return apiClient.get(`/orders/${orderId}/tickets`);
  },

  // Helper function to create order from cart
  async createOrderFromCart(
    cartItems: CartItem[],
    customerInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    },
    specialRequests?: string,
    marketingConsent?: boolean
  ): Promise<Order> {
    const orderData: CreateOrderRequest = {
      customerInfo,
      items: cartItems.map(item => ({
        eventId: item.eventId,
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
      })),
      specialRequests,
      marketingConsent,
    };

    return this.createOrder(orderData);
  },
}; 