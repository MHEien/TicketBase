// =============================================================================
// PLUGIN BACKEND SDK - Server-side types and helpers for plugin developers
// =============================================================================

// =============================================================================
// ROUTE & HOOK DEFINITIONS
// =============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: string;
}

export interface HookDefinition {
  /** Platform event name, e.g. "order.created", "ticket.scanned" */
  event: string;
  /** Name of the handler function in the handlers object */
  handler: string;
}

// =============================================================================
// PLATFORM CONTEXT - What plugin handlers receive
// =============================================================================

export interface PluginHttpClient {
  get(url: string, options?: RequestInit): Promise<any>;
  post(url: string, body: any, options?: RequestInit): Promise<any>;
  put(url: string, body: any, options?: RequestInit): Promise<any>;
  delete(url: string, options?: RequestInit): Promise<any>;
  patch(url: string, body: any, options?: RequestInit): Promise<any>;
}

export interface PlatformOrdersAPI {
  list(params?: Record<string, any>): Promise<any[]>;
  get(orderId: string): Promise<any>;
  update(orderId: string, data: Record<string, any>): Promise<any>;
}

export interface PlatformCustomersAPI {
  list(params?: Record<string, any>): Promise<any[]>;
  get(customerId: string): Promise<any>;
  create(data: Record<string, any>): Promise<any>;
  update(customerId: string, data: Record<string, any>): Promise<any>;
}

export interface PlatformEventsAPI {
  list(params?: Record<string, any>): Promise<any[]>;
  get(eventId: string): Promise<any>;
}

export interface PlatformTicketsAPI {
  list(params?: Record<string, any>): Promise<any[]>;
  get(ticketId: string): Promise<any>;
  validate(code: string): Promise<any>;
}

export interface PluginStorageAPI {
  get(key: string): Promise<any | null>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

export interface PluginLogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export interface PlatformContext {
  /** HTTP client for external API calls (e.g., Stripe, SendGrid) */
  http: PluginHttpClient;

  /** Scoped access to platform APIs */
  platform: {
    orders: PlatformOrdersAPI;
    customers: PlatformCustomersAPI;
    events: PlatformEventsAPI;
    tickets: PlatformTicketsAPI;
  };

  /** Plugin secrets (decrypted, e.g. STRIPE_SECRET_KEY) */
  secrets: Record<string, string>;

  /** Key-value storage scoped to this plugin + tenant */
  storage: PluginStorageAPI;

  /** Structured logger */
  logger: PluginLogger;

  /** Current tenant ID */
  tenantId: string;

  /** Plugin ID */
  pluginId: string;
}

// =============================================================================
// REQUEST / RESPONSE TYPES
// =============================================================================

export interface PluginRequest {
  method: HttpMethod;
  path: string;
  body: any;
  query: Record<string, string>;
  headers: Record<string, string>;
  params: Record<string, string>;
}

export interface PluginResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

export interface HookPayload {
  event: string;
  data: any;
  timestamp: string;
}

// =============================================================================
// HANDLER TYPES
// =============================================================================

export type RouteHandler = (
  req: PluginRequest,
  ctx: PlatformContext,
) => Promise<PluginResponse | any>;

export type HookHandler = (
  payload: HookPayload,
  ctx: PlatformContext,
) => Promise<void>;

export type LifecycleHandler = (ctx: PlatformContext) => Promise<void>;

// =============================================================================
// BACKEND PLUGIN DEFINITION
// =============================================================================

export interface BackendPluginDefinition {
  /** HTTP routes this plugin handles */
  routes?: RouteDefinition[];

  /** Platform events this plugin listens to */
  hooks?: HookDefinition[];

  /** Handler implementations keyed by handler name */
  handlers: Record<string, RouteHandler | HookHandler>;

  /** Called when the plugin is installed */
  onInstall?: LifecycleHandler;

  /** Called when the plugin is uninstalled */
  onUninstall?: LifecycleHandler;

  /** Called when the plugin is enabled */
  onEnable?: LifecycleHandler;

  /** Called when the plugin is disabled */
  onDisable?: LifecycleHandler;
}

// =============================================================================
// MANIFEST EXTENSION
// =============================================================================

export interface BackendManifest {
  /** Entry point file within the bundle for server-side code */
  backendEntryPoint?: string;

  /** HTTP routes the plugin handles */
  backendRoutes?: RouteDefinition[];

  /** Platform events the plugin listens to */
  backendHooks?: HookDefinition[];

  /** Secret keys the plugin needs (e.g., ["STRIPE_SECRET_KEY"]) */
  requiredSecrets?: string[];

  /** Platform API permissions (e.g., ["orders:read", "orders:write"]) */
  requiredPermissions?: string[];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Define a backend plugin with type-safe routes, hooks, and handlers.
 *
 * @example
 * ```typescript
 * import { defineBackendPlugin } from '@ticketsplatform/plugin-sdk/server';
 *
 * export default defineBackendPlugin({
 *   routes: [
 *     { method: 'POST', path: '/webhooks', handler: 'handleWebhook' },
 *     { method: 'POST', path: '/create-payment', handler: 'createPayment' },
 *   ],
 *   hooks: [
 *     { event: 'order.created', handler: 'onOrderCreated' },
 *   ],
 *   handlers: {
 *     async handleWebhook(req, ctx) {
 *       ctx.logger.info('Received webhook');
 *       const event = JSON.parse(req.body);
 *       await ctx.platform.orders.update(event.orderId, { status: 'paid' });
 *       return { status: 200, body: { received: true } };
 *     },
 *     async createPayment(req, ctx) {
 *       const { amount, currency } = req.body;
 *       const result = await ctx.http.post('https://api.stripe.com/v1/payment_intents', {
 *         amount, currency
 *       });
 *       return { status: 200, body: { clientSecret: result.client_secret } };
 *     },
 *     async onOrderCreated(payload, ctx) {
 *       ctx.logger.info(`Order created: ${payload.data.id}`);
 *     },
 *   },
 * });
 * ```
 */
export function defineBackendPlugin(
  definition: BackendPluginDefinition,
): BackendPluginDefinition {
  return definition;
}

/**
 * Helper to create a standard JSON response
 */
export function jsonResponse(
  body: any,
  status: number = 200,
  headers?: Record<string, string>,
): PluginResponse {
  return {
    status,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
}

/**
 * Helper to create an error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
): PluginResponse {
  return {
    status,
    body: { error: message },
    headers: { 'Content-Type': 'application/json' },
  };
}
