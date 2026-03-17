// =============================================================================
// STRIPE PAYMENTS PLUGIN - Backend
// Uses the plugin SDK's defineBackendPlugin for type-safe route/hook handlers.
// All handlers receive a PlatformContext with http, platform APIs, secrets,
// scoped storage, and a structured logger.
// =============================================================================

import {
  defineBackendPlugin,
  jsonResponse,
  errorResponse,
  type PlatformContext,
  type PluginRequest,
  type HookPayload,
} from 'ticketsplatform-plugin-sdk/server';

// =============================================================================
// HELPERS
// =============================================================================

const STRIPE_API = 'https://api.stripe.com/v1';

/** Build Stripe-compatible form-encoded headers */
function stripeHeaders(secretKey: string) {
  return {
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

/** Encode an object as application/x-www-form-urlencoded */
function formEncode(data: Record<string, any>, prefix = ''): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        parts.push(formEncode(value, fullKey));
      } else {
        parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`);
      }
    }
  }
  return parts.join('&');
}

/** Call the Stripe API using the platform HTTP client */
async function stripePost(
  ctx: PlatformContext,
  endpoint: string,
  params: Record<string, any>,
) {
  const secretKey = ctx.secrets.secretKey;
  if (!secretKey) {
    throw new Error('Stripe secret key not configured');
  }

  return ctx.http.post(`${STRIPE_API}${endpoint}`, formEncode(params), {
    headers: stripeHeaders(secretKey),
  } as any);
}

async function stripeGet(ctx: PlatformContext, endpoint: string) {
  const secretKey = ctx.secrets.secretKey;
  if (!secretKey) {
    throw new Error('Stripe secret key not configured');
  }

  return ctx.http.get(`${STRIPE_API}${endpoint}`, {
    headers: stripeHeaders(secretKey),
  } as any);
}

// =============================================================================
// PLUGIN DEFINITION
// =============================================================================

export default defineBackendPlugin({
  // -------------------------------------------------------------------------
  // ROUTE HANDLERS
  // -------------------------------------------------------------------------
  handlers: {
    /**
     * POST /checkout/create-session
     * Creates a Stripe Checkout Session and returns the URL to redirect the user.
     */
    async createCheckoutSession(req: PluginRequest, ctx: PlatformContext) {
      const { amount, currency = 'usd', orderId, successUrl, cancelUrl, metadata } = req.body;

      if (!amount || amount <= 0) {
        return errorResponse('Amount is required and must be positive', 400);
      }

      ctx.logger.info(`Creating checkout session for order ${orderId}, amount: ${amount} ${currency}`);

      try {
        const session = await stripePost(ctx, '/checkout/sessions', {
          'payment_method_types[]': 'card',
          mode: 'payment',
          'line_items[0][price_data][currency]': currency,
          'line_items[0][price_data][unit_amount]': amount,
          'line_items[0][price_data][product_data][name]': 'Event Ticket',
          'line_items[0][quantity]': 1,
          success_url: successUrl || `${req.headers['origin'] || ''}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.headers['origin'] || ''}/checkout/cancel`,
          ...(metadata && { 'metadata[orderId]': orderId }),
          ...(metadata?.customerId && { 'metadata[customerId]': metadata.customerId }),
        });

        // Store session mapping for later verification
        await ctx.storage.set(`session:${session.id}`, {
          orderId,
          amount,
          currency,
          createdAt: new Date().toISOString(),
        });

        return jsonResponse({
          sessionId: session.id,
          checkoutUrl: session.url,
        });
      } catch (error: any) {
        ctx.logger.error(`Failed to create checkout session: ${error.message}`);
        return errorResponse(`Stripe error: ${error.message}`, 502);
      }
    },

    /**
     * POST /checkout/verify
     * Verifies a completed checkout session and returns payment details.
     */
    async verifyPayment(req: PluginRequest, ctx: PlatformContext) {
      const { sessionId } = req.body;

      if (!sessionId) {
        return errorResponse('sessionId is required', 400);
      }

      try {
        const session = await stripeGet(ctx, `/checkout/sessions/${sessionId}`);

        // Look up stored session data
        const storedData = await ctx.storage.get(`session:${sessionId}`);

        return jsonResponse({
          status: session.payment_status,
          amountTotal: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_details?.email,
          paymentIntentId: session.payment_intent,
          orderId: storedData?.orderId,
        });
      } catch (error: any) {
        ctx.logger.error(`Failed to verify payment: ${error.message}`);
        return errorResponse(`Verification failed: ${error.message}`, 502);
      }
    },

    /**
     * POST /webhooks/stripe
     * Handles incoming Stripe webhook events. This route is public (no JWT).
     */
    async handleWebhook(req: PluginRequest, ctx: PlatformContext) {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = ctx.secrets.webhookSecret;

      // Parse the event — in production you'd verify the signature
      let event: any;
      try {
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch {
        return errorResponse('Invalid webhook payload', 400);
      }

      ctx.logger.info(`Webhook received: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const storedData = await ctx.storage.get(`session:${session.id}`);

          if (storedData?.orderId) {
            // Update the order status via platform API
            try {
              await ctx.platform.orders.update(storedData.orderId, {
                paymentStatus: 'paid',
                paymentProvider: 'stripe',
                paymentIntentId: session.payment_intent,
                paidAt: new Date().toISOString(),
              });
              ctx.logger.info(`Order ${storedData.orderId} marked as paid`);
            } catch (error: any) {
              ctx.logger.error(`Failed to update order: ${error.message}`);
            }
          }

          // Track revenue
          await trackRevenue(ctx, session.amount_total, session.currency);
          break;
        }

        case 'payment_intent.payment_failed': {
          const pi = event.data.object;
          ctx.logger.warn(`Payment failed: ${pi.id} — ${pi.last_payment_error?.message}`);

          // Find the related session
          const keys = await ctx.storage.list('session:');
          for (const key of keys) {
            const data = await ctx.storage.get(key);
            if (data?.orderId) {
              // Could update order status if we track payment intent → session mapping
            }
          }
          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object;
          ctx.logger.info(`Charge refunded: ${charge.id}, amount: ${charge.amount_refunded}`);
          break;
        }

        default:
          ctx.logger.debug(`Unhandled event type: ${event.type}`);
      }

      return jsonResponse({ received: true });
    },

    /**
     * POST /refunds
     * Creates a refund for a payment intent.
     */
    async createRefund(req: PluginRequest, ctx: PlatformContext) {
      const { paymentIntentId, amount, reason } = req.body;

      if (!paymentIntentId) {
        return errorResponse('paymentIntentId is required', 400);
      }

      ctx.logger.info(`Creating refund for ${paymentIntentId}, amount: ${amount || 'full'}`);

      try {
        const refundParams: Record<string, any> = {
          payment_intent: paymentIntentId,
        };
        if (amount) refundParams.amount = amount;
        if (reason) refundParams.reason = reason;

        const refund = await stripePost(ctx, '/refunds', refundParams);

        return jsonResponse({
          refundId: refund.id,
          status: refund.status,
          amount: refund.amount,
          currency: refund.currency,
        });
      } catch (error: any) {
        ctx.logger.error(`Failed to create refund: ${error.message}`);
        return errorResponse(`Refund failed: ${error.message}`, 502);
      }
    },

    /**
     * GET /revenue/summary
     * Returns revenue summary from plugin storage (populated by webhooks).
     */
    async getRevenueSummary(req: PluginRequest, ctx: PlatformContext) {
      const totalRevenue = (await ctx.storage.get('stats:totalRevenue')) || 0;
      const totalTransactions = (await ctx.storage.get('stats:totalTransactions')) || 0;
      const revenueByDay = (await ctx.storage.get('stats:revenueByDay')) || {};

      return jsonResponse({
        totalRevenue,
        totalTransactions,
        revenueByDay,
        currency: 'usd', // TODO: multi-currency
      });
    },

    // -----------------------------------------------------------------------
    // HOOK HANDLERS (platform events)
    // -----------------------------------------------------------------------

    /**
     * Triggered when a new order is created on the platform.
     * Could auto-create a Stripe payment intent.
     */
    async onOrderCreated(payload: HookPayload, ctx: PlatformContext) {
      const order = payload.data;
      ctx.logger.info(`New order created: ${order.id}, total: ${order.total}`);

      // Store pending order for later payment
      await ctx.storage.set(`pending-order:${order.id}`, {
        total: order.total,
        currency: order.currency || 'usd',
        customerId: order.customerId,
        createdAt: payload.timestamp,
      });
    },

    /**
     * Triggered when an order is cancelled.
     * Auto-refunds if payment was already captured.
     */
    async onOrderCancelled(payload: HookPayload, ctx: PlatformContext) {
      const order = payload.data;
      ctx.logger.info(`Order cancelled: ${order.id}`);

      if (order.paymentIntentId && order.paymentStatus === 'paid') {
        ctx.logger.info(`Auto-refunding payment intent ${order.paymentIntentId}`);
        try {
          await stripePost(ctx, '/refunds', {
            payment_intent: order.paymentIntentId,
          });
          ctx.logger.info(`Refund issued for order ${order.id}`);
        } catch (error: any) {
          ctx.logger.error(`Auto-refund failed for order ${order.id}: ${error.message}`);
        }
      }

      // Clean up pending order
      await ctx.storage.delete(`pending-order:${order.id}`);
    },
  },

  // -------------------------------------------------------------------------
  // LIFECYCLE HOOKS
  // -------------------------------------------------------------------------

  async onInstall(ctx) {
    ctx.logger.info('Stripe Payments plugin installed');
    // Initialize stats counters
    await ctx.storage.set('stats:totalRevenue', 0);
    await ctx.storage.set('stats:totalTransactions', 0);
    await ctx.storage.set('stats:revenueByDay', {});
  },

  async onUninstall(ctx) {
    ctx.logger.info('Stripe Payments plugin uninstalled — cleaning up storage');
    // Clean up all plugin storage
    const keys = await ctx.storage.list();
    for (const key of keys) {
      await ctx.storage.delete(key);
    }
  },

  async onEnable(ctx) {
    ctx.logger.info('Stripe Payments plugin enabled');
  },

  async onDisable(ctx) {
    ctx.logger.info('Stripe Payments plugin disabled');
  },
});

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

async function trackRevenue(ctx: PlatformContext, amount: number, currency: string) {
  const totalRevenue = ((await ctx.storage.get('stats:totalRevenue')) || 0) + amount;
  const totalTransactions = ((await ctx.storage.get('stats:totalTransactions')) || 0) + 1;

  await ctx.storage.set('stats:totalRevenue', totalRevenue);
  await ctx.storage.set('stats:totalTransactions', totalTransactions);

  // Track by day
  const today = new Date().toISOString().split('T')[0];
  const revenueByDay = (await ctx.storage.get('stats:revenueByDay')) || {};
  revenueByDay[today] = (revenueByDay[today] || 0) + amount;
  await ctx.storage.set('stats:revenueByDay', revenueByDay);
}
