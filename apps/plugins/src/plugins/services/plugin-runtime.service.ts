import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker } from 'worker_threads';
import * as path from 'path';
import {
  Plugin,
  PluginDocument,
} from '../schemas/plugin.schema';
import {
  InstalledPlugin,
  InstalledPluginDocument,
} from '../schemas/installed-plugin.schema';
import {
  PluginStorage,
  PluginStorageDocument,
} from '../schemas/plugin-storage.schema';
import { PluginStorageService } from './plugin-storage.service';
import { SecureConfigService } from './secure-config.service';
import { PluginEventBus } from './plugin-event-bus.service';

// =============================================================================
// TYPES
// =============================================================================

interface PluginWorkerMessage {
  type:
    | 'route-request'
    | 'hook-event'
    | 'lifecycle'
    | 'platform-api-call'
    | 'platform-api-response'
    | 'route-response'
    | 'hook-response'
    | 'lifecycle-response'
    | 'log'
    | 'error'
    | 'storage-request'
    | 'storage-response'
    | 'http-request'
    | 'http-response';
  id: string;
  payload: any;
}

interface LoadedPlugin {
  plugin: PluginDocument;
  code: string;
  backendRoutes: Array<{ method: string; path: string; handler: string }>;
  backendHooks: Array<{ event: string; handler: string }>;
}

interface RouteMatch {
  plugin: LoadedPlugin;
  route: { method: string; path: string; handler: string };
  params: Record<string, string>;
}

// =============================================================================
// PLUGIN RUNTIME SERVICE
// =============================================================================

@Injectable()
export class PluginRuntimeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PluginRuntimeService.name);

  /** Cache of loaded plugin code keyed by pluginId */
  private loadedPlugins = new Map<string, LoadedPlugin>();

  /** Active workers keyed by tenantId:pluginId */
  private workers = new Map<string, Worker>();

  /** Pending responses keyed by request ID */
  private pendingRequests = new Map<
    string,
    { resolve: (value: any) => void; reject: (err: any) => void }
  >();

  constructor(
    @InjectModel(Plugin.name) private pluginModel: Model<PluginDocument>,
    @InjectModel(InstalledPlugin.name)
    private installedPluginModel: Model<InstalledPluginDocument>,
    @InjectModel(PluginStorage.name)
    private pluginStorageModel: Model<PluginStorageDocument>,
    private pluginStorageService: PluginStorageService,
    private secureConfigService: SecureConfigService,
    private eventBus: PluginEventBus,
  ) {}

  async onModuleInit() {
    this.logger.log('Plugin Runtime Service initialized');
  }

  async onModuleDestroy() {
    // Terminate all workers on shutdown
    for (const [key, worker] of this.workers) {
      this.logger.log(`Terminating worker: ${key}`);
      await worker.terminate();
    }
    this.workers.clear();
  }

  // =============================================================================
  // ROUTE HANDLING
  // =============================================================================

  /**
   * Route an incoming HTTP request to the appropriate plugin handler.
   * Called by the webhook/proxy controllers.
   */
  async handleRoute(
    tenantId: string,
    pluginId: string,
    method: string,
    pluginPath: string,
    body: any,
    query: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<{ status: number; body: any; headers?: Record<string, string> }> {
    // 1. Verify plugin is installed and enabled for this tenant
    const installed = await this.verifyPluginInstalled(tenantId, pluginId);
    if (!installed.enabled) {
      throw new BadRequestException(`Plugin ${pluginId} is disabled`);
    }

    // 2. Load the plugin if not cached
    const loadedPlugin = await this.ensurePluginLoaded(pluginId);

    // 3. Find matching route
    const routeMatch = this.matchRoute(
      loadedPlugin,
      method.toUpperCase(),
      pluginPath,
    );
    if (!routeMatch) {
      throw new NotFoundException(
        `No route found for ${method.toUpperCase()} ${pluginPath} in plugin ${pluginId}`,
      );
    }

    // 4. Build the platform context
    const secrets = await this.getPluginSecrets(tenantId, pluginId);

    // 5. Execute the handler in-process (Phase 1: direct execution)
    return this.executeRouteHandler(
      tenantId,
      pluginId,
      loadedPlugin,
      routeMatch,
      {
        method: method.toUpperCase(),
        path: pluginPath,
        body,
        query,
        headers,
        params: routeMatch.params,
      },
      secrets,
    );
  }

  /**
   * Dispatch a platform event to all plugins that listen for it.
   */
  async dispatchHook(
    tenantId: string,
    event: string,
    data: any,
  ): Promise<void> {
    // Find all installed plugins for this tenant
    const installedPlugins = await this.installedPluginModel
      .find({ tenantId, enabled: true })
      .exec();

    for (const installed of installedPlugins) {
      const plugin = await this.pluginModel
        .findById(installed.pluginId)
        .exec();
      if (!plugin) continue;

      // Check if this plugin has a hook for this event
      const hookDef = (plugin.backendHooks || []).find(
        (h) => h.event === event,
      );
      if (!hookDef) continue;

      try {
        const loadedPlugin = await this.ensurePluginLoaded(plugin.id);
        const secrets = await this.getPluginSecrets(tenantId, plugin.id);

        await this.executeHookHandler(
          tenantId,
          plugin.id,
          loadedPlugin,
          hookDef.handler,
          { event, data, timestamp: new Date().toISOString() },
          secrets,
        );
      } catch (error) {
        this.logger.error(
          `Hook ${event} failed for plugin ${plugin.id}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Execute a lifecycle hook (onInstall, onUninstall, onEnable, onDisable)
   */
  async executeLifecycle(
    tenantId: string,
    pluginId: string,
    lifecycle: 'onInstall' | 'onUninstall' | 'onEnable' | 'onDisable',
  ): Promise<void> {
    try {
      const loadedPlugin = await this.ensurePluginLoaded(pluginId);
      const secrets = await this.getPluginSecrets(tenantId, pluginId);

      const ctx = await this.buildPlatformContext(tenantId, pluginId, secrets);

      // Try to find the lifecycle handler in the plugin code
      const pluginModule = this.loadPluginModule(loadedPlugin.code);
      if (pluginModule && typeof pluginModule[lifecycle] === 'function') {
        await pluginModule[lifecycle](ctx);
        this.logger.log(
          `Lifecycle ${lifecycle} executed for plugin ${pluginId}`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Lifecycle ${lifecycle} failed for plugin ${pluginId}: ${error.message}`,
      );
    }
  }

  // =============================================================================
  // PLUGIN LOADING
  // =============================================================================

  /**
   * Ensure a plugin's code is loaded and cached.
   */
  private async ensurePluginLoaded(pluginId: string): Promise<LoadedPlugin> {
    if (this.loadedPlugins.has(pluginId)) {
      return this.loadedPlugins.get(pluginId)!;
    }

    const plugin = await this.pluginModel.findOne({ id: pluginId }).exec();
    if (!plugin) {
      throw new NotFoundException(`Plugin ${pluginId} not found`);
    }

    const code = await this.loadPluginCode(plugin);

    const loaded: LoadedPlugin = {
      plugin,
      code,
      backendRoutes: plugin.backendRoutes || [],
      backendHooks: plugin.backendHooks || [],
    };

    this.loadedPlugins.set(pluginId, loaded);
    this.logger.log(
      `Plugin ${pluginId} loaded (${loaded.backendRoutes.length} routes, ${loaded.backendHooks.length} hooks)`,
    );

    return loaded;
  }

  /**
   * Load plugin source code from MinIO storage.
   */
  private async loadPluginCode(plugin: PluginDocument): Promise<string> {
    if (!plugin.bundleUrl) {
      throw new BadRequestException(
        `Plugin ${plugin.id} has no bundle URL`,
      );
    }

    try {
      // Extract the bundle path from the URL
      const bundlePath = this.extractBundlePath(plugin.bundleUrl);
      const stream =
        await this.pluginStorageService.getPluginBundleStream(bundlePath);

      return new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () =>
          resolve(Buffer.concat(chunks).toString('utf-8')),
        );
        stream.on('error', reject);
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to load plugin code for ${plugin.id}: ${error.message}`,
      );
    }
  }

  private extractBundlePath(url: string): string {
    const match = url.match(/\/plugins\/bundles\/(.+)$/);
    return match ? match[1] : url;
  }

  /**
   * Invalidate the cached plugin code (e.g., after an update).
   */
  invalidatePlugin(pluginId: string): void {
    this.loadedPlugins.delete(pluginId);
    // Also terminate any running workers for this plugin
    for (const [key, worker] of this.workers) {
      if (key.endsWith(`:${pluginId}`)) {
        worker.terminate();
        this.workers.delete(key);
      }
    }
    this.logger.log(`Plugin ${pluginId} cache invalidated`);
  }

  // =============================================================================
  // ROUTE MATCHING
  // =============================================================================

  private matchRoute(
    loadedPlugin: LoadedPlugin,
    method: string,
    requestPath: string,
  ): RouteMatch | null {
    for (const route of loadedPlugin.backendRoutes) {
      if (route.method.toUpperCase() !== method) continue;

      const params = this.matchPath(route.path, requestPath);
      if (params !== null) {
        return { plugin: loadedPlugin, route, params };
      }
    }
    return null;
  }

  /**
   * Match a route pattern against a request path, extracting params.
   * Supports :param syntax (e.g., /orders/:orderId).
   */
  private matchPath(
    pattern: string,
    requestPath: string,
  ): Record<string, string> | null {
    const patternParts = pattern.split('/').filter(Boolean);
    const requestParts = requestPath.split('/').filter(Boolean);

    if (patternParts.length !== requestParts.length) return null;

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = requestParts[i];
      } else if (patternParts[i] !== requestParts[i]) {
        return null;
      }
    }

    return params;
  }

  // =============================================================================
  // EXECUTION (Phase 1: In-process with Function constructor)
  // =============================================================================

  private async executeRouteHandler(
    tenantId: string,
    pluginId: string,
    loadedPlugin: LoadedPlugin,
    routeMatch: RouteMatch,
    request: any,
    secrets: Record<string, string>,
  ): Promise<{ status: number; body: any; headers?: Record<string, string> }> {
    const ctx = await this.buildPlatformContext(tenantId, pluginId, secrets);

    const pluginModule = this.loadPluginModule(loadedPlugin.code);
    if (!pluginModule?.handlers?.[routeMatch.route.handler]) {
      throw new NotFoundException(
        `Handler '${routeMatch.route.handler}' not found in plugin ${pluginId}`,
      );
    }

    const handler = pluginModule.handlers[routeMatch.route.handler];
    const result = await handler(request, ctx);

    // Normalize the response
    if (result && typeof result === 'object' && 'status' in result) {
      return {
        status: result.status || 200,
        body: result.body,
        headers: result.headers,
      };
    }

    // If the handler returns a plain value, wrap it
    return { status: 200, body: result };
  }

  private async executeHookHandler(
    tenantId: string,
    pluginId: string,
    loadedPlugin: LoadedPlugin,
    handlerName: string,
    payload: any,
    secrets: Record<string, string>,
  ): Promise<void> {
    const ctx = await this.buildPlatformContext(tenantId, pluginId, secrets);

    const pluginModule = this.loadPluginModule(loadedPlugin.code);
    if (!pluginModule?.handlers?.[handlerName]) {
      this.logger.warn(
        `Hook handler '${handlerName}' not found in plugin ${pluginId}`,
      );
      return;
    }

    await pluginModule.handlers[handlerName](payload, ctx);
  }

  /**
   * Load a plugin module from its source code.
   * Uses Function constructor for basic isolation.
   * Phase 2 will replace this with worker_threads or isolated-vm.
   */
  private loadPluginModule(code: string): any {
    try {
      // Create a module-like environment
      const moduleExports: any = {};
      const moduleObj = { exports: moduleExports };

      // Wrap the code to capture exports
      const wrappedCode = `
        (function(module, exports) {
          ${code}
        })
      `;

      const fn = new Function('return ' + wrappedCode)();
      fn(moduleObj, moduleExports);

      // Support both default export and named export patterns
      return moduleObj.exports.default || moduleObj.exports;
    } catch (error) {
      this.logger.error(`Failed to load plugin module: ${error.message}`);
      return null;
    }
  }

  // =============================================================================
  // PLATFORM CONTEXT
  // =============================================================================

  private async buildPlatformContext(
    tenantId: string,
    pluginId: string,
    secrets: Record<string, string>,
  ): Promise<any> {
    return {
      tenantId,
      pluginId,
      secrets,

      http: {
        get: async (url: string, options?: any) =>
          this.proxyHttpRequest('GET', url, undefined, options),
        post: async (url: string, body: any, options?: any) =>
          this.proxyHttpRequest('POST', url, body, options),
        put: async (url: string, body: any, options?: any) =>
          this.proxyHttpRequest('PUT', url, body, options),
        delete: async (url: string, options?: any) =>
          this.proxyHttpRequest('DELETE', url, undefined, options),
        patch: async (url: string, body: any, options?: any) =>
          this.proxyHttpRequest('PATCH', url, body, options),
      },

      platform: {
        orders: this.createPlatformAPIProxy(tenantId, 'orders'),
        customers: this.createPlatformAPIProxy(tenantId, 'customers'),
        events: this.createPlatformAPIProxy(tenantId, 'events'),
        tickets: this.createPlatformAPIProxy(tenantId, 'tickets'),
      },

      storage: {
        get: (key: string) =>
          this.storageGet(tenantId, pluginId, key),
        set: (key: string, value: any) =>
          this.storageSet(tenantId, pluginId, key, value),
        delete: (key: string) =>
          this.storageDelete(tenantId, pluginId, key),
        list: (prefix?: string) =>
          this.storageList(tenantId, pluginId, prefix),
      },

      logger: {
        info: (msg: string, ...args: any[]) =>
          this.logger.log(`[${pluginId}] ${msg}`, ...args),
        warn: (msg: string, ...args: any[]) =>
          this.logger.warn(`[${pluginId}] ${msg}`, ...args),
        error: (msg: string, ...args: any[]) =>
          this.logger.error(`[${pluginId}] ${msg}`, ...args),
        debug: (msg: string, ...args: any[]) =>
          this.logger.debug(`[${pluginId}] ${msg}`, ...args),
      },
    };
  }

  // =============================================================================
  // HTTP PROXY (for plugin external API calls)
  // =============================================================================

  private async proxyHttpRequest(
    method: string,
    url: string,
    body?: any,
    options?: any,
  ): Promise<any> {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    if (body && method !== 'GET') {
      fetchOptions.body =
        typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  // =============================================================================
  // PLATFORM API PROXY
  // =============================================================================

  private createPlatformAPIProxy(tenantId: string, resource: string) {
    const apiBaseUrl =
      process.env.API_SERVER_URL || 'http://localhost:4000';

    return {
      list: async (params?: Record<string, any>) => {
        const queryString = params
          ? '?' + new URLSearchParams(params as any).toString()
          : '';
        return this.proxyHttpRequest(
          'GET',
          `${apiBaseUrl}/api/${resource}${queryString}`,
          undefined,
          {
            headers: { 'x-tenant-id': tenantId },
          },
        );
      },
      get: async (id: string) => {
        return this.proxyHttpRequest(
          'GET',
          `${apiBaseUrl}/api/${resource}/${id}`,
          undefined,
          {
            headers: { 'x-tenant-id': tenantId },
          },
        );
      },
      create: async (data: Record<string, any>) => {
        return this.proxyHttpRequest(
          'POST',
          `${apiBaseUrl}/api/${resource}`,
          data,
          {
            headers: { 'x-tenant-id': tenantId },
          },
        );
      },
      update: async (id: string, data: Record<string, any>) => {
        return this.proxyHttpRequest(
          'PATCH',
          `${apiBaseUrl}/api/${resource}/${id}`,
          data,
          {
            headers: { 'x-tenant-id': tenantId },
          },
        );
      },
      validate: async (code: string) => {
        return this.proxyHttpRequest(
          'POST',
          `${apiBaseUrl}/api/${resource}/validate`,
          { code },
          {
            headers: { 'x-tenant-id': tenantId },
          },
        );
      },
    };
  }

  // =============================================================================
  // PLUGIN-SCOPED STORAGE
  // =============================================================================

  private async storageGet(
    tenantId: string,
    pluginId: string,
    key: string,
  ): Promise<any | null> {
    const doc = await this.pluginStorageModel
      .findOne({ tenantId, pluginId, key })
      .exec();
    return doc ? doc.value : null;
  }

  private async storageSet(
    tenantId: string,
    pluginId: string,
    key: string,
    value: any,
  ): Promise<void> {
    await this.pluginStorageModel
      .updateOne(
        { tenantId, pluginId, key },
        { $set: { value } },
        { upsert: true },
      )
      .exec();
  }

  private async storageDelete(
    tenantId: string,
    pluginId: string,
    key: string,
  ): Promise<void> {
    await this.pluginStorageModel
      .deleteOne({ tenantId, pluginId, key })
      .exec();
  }

  private async storageList(
    tenantId: string,
    pluginId: string,
    prefix?: string,
  ): Promise<string[]> {
    const filter: any = { tenantId, pluginId };
    if (prefix) {
      filter.key = { $regex: `^${prefix}` };
    }
    const docs = await this.pluginStorageModel.find(filter, { key: 1 }).exec();
    return docs.map((d) => d.key);
  }

  // =============================================================================
  // HELPERS
  // =============================================================================

  private async verifyPluginInstalled(
    tenantId: string,
    pluginId: string,
  ): Promise<InstalledPluginDocument> {
    const plugin = await this.pluginModel.findOne({ id: pluginId }).exec();
    if (!plugin) {
      throw new NotFoundException(`Plugin ${pluginId} not found`);
    }

    const installed = await this.installedPluginModel
      .findOne({ tenantId, pluginId: plugin._id })
      .exec();

    if (!installed) {
      throw new NotFoundException(
        `Plugin ${pluginId} is not installed for tenant ${tenantId}`,
      );
    }

    return installed;
  }

  private async getPluginSecrets(
    tenantId: string,
    pluginId: string,
  ): Promise<Record<string, string>> {
    try {
      const config = await this.secureConfigService.getPluginConfig(
        tenantId,
        pluginId,
      );
      return config || {};
    } catch {
      return {};
    }
  }

  /**
   * Get all registered routes across all loaded plugins.
   * Useful for debugging and the admin UI.
   */
  getRegisteredRoutes(): Array<{
    pluginId: string;
    method: string;
    path: string;
    handler: string;
  }> {
    const routes: Array<{
      pluginId: string;
      method: string;
      path: string;
      handler: string;
    }> = [];

    for (const [pluginId, loaded] of this.loadedPlugins) {
      for (const route of loaded.backendRoutes) {
        routes.push({
          pluginId,
          method: route.method,
          path: route.path,
          handler: route.handler,
        });
      }
    }

    return routes;
  }
}
