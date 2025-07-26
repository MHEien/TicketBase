import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PluginsService } from '../plugins.service';
import { SecureConfigService } from './secure-config.service';
import { PluginStorageService } from './plugin-storage.service';
import * as vm from 'vm';

@Injectable()
export class PluginActionService {
  private readonly logger = new Logger(PluginActionService.name);

  constructor(
    private readonly pluginsService: PluginsService,
    private readonly secureConfigService: SecureConfigService,
    private readonly pluginStorageService: PluginStorageService,
  ) {}

  /**
   * Execute a plugin-defined action with secure configuration access
   */
  async executeAction(
    tenantId: string,
    pluginId: string,
    action: string,
    parameters: any,
    metadata?: any,
    auditContext?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<any> {
    try {
      // 1. Verify plugin is installed and enabled
      const installedPlugins =
        await this.pluginsService.getInstalledPlugins(tenantId);
      const installedPlugin = installedPlugins.find(
        (p) => p.plugin.id === pluginId,
      );

      if (!installedPlugin) {
        throw new NotFoundException(
          `Plugin ${pluginId} is not installed for this organization`,
        );
      }

      if (!installedPlugin.enabled) {
        throw new BadRequestException(`Plugin ${pluginId} is not enabled`);
      }

      // 2. Get plugin details
      const plugin = await this.pluginsService.findById(pluginId);

      // 3. Get secure configuration with audit logging
      const config = await this.secureConfigService.getPluginConfig(
        tenantId,
        pluginId,
        auditContext,
      );

      if (!config) {
        throw new NotFoundException(
          `Configuration not found for plugin ${pluginId}`,
        );
      }

      // 4. Load and execute plugin's backend handler
      const result = await this.executePluginBackendAction(
        plugin,
        action,
        parameters,
        config,
        metadata,
      );

      this.logger.log(
        `Action ${pluginId}:${action} completed successfully for tenant ${tenantId}`,
      );

      return {
        success: true,
        action,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Action execution failed: ${error.message}`, error);
      return {
        success: false,
        action,
        error: error.message,
      };
    }
  }

  /**
   * Execute plugin's backend action handler dynamically
   */
  private async executePluginBackendAction(
    plugin: any,
    action: string,
    parameters: any,
    config: any,
    metadata?: any,
  ): Promise<any> {
    // Get plugin bundle source code
    const pluginCode = await this.getPluginSourceCode(plugin);

    // Create secure execution context
    const context = this.createSecureContext(config, parameters, metadata);

    // Execute plugin in sandboxed environment
    return this.executeInSandbox(pluginCode, action, context);
  }

  /**
   * Get plugin source code from bundle URL
   */
  private async getPluginSourceCode(plugin: any): Promise<string> {
    try {
      if (plugin.bundleUrl) {
        // If it's a MinIO/local storage URL, get from storage service
        if (
          plugin.bundleUrl.includes('localhost:5000') ||
          plugin.bundleUrl.includes('minio')
        ) {
          const bundlePath = this.extractBundlePathFromUrl(plugin.bundleUrl);
          const bundleStream =
            await this.pluginStorageService.getPluginBundleStream(bundlePath);

          // Convert stream to string
          return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            bundleStream.on('data', (chunk) => chunks.push(chunk));
            bundleStream.on('end', () =>
              resolve(Buffer.concat(chunks).toString('utf-8')),
            );
            bundleStream.on('error', reject);
          });
        } else {
          // External URL - fetch via HTTP
          const response = await fetch(plugin.bundleUrl);
          return await response.text();
        }
      }

      throw new Error('No bundle URL found for plugin');
    } catch (error) {
      throw new BadRequestException(
        `Failed to load plugin code: ${error.message}`,
      );
    }
  }

  /**
   * Extract bundle path from MinIO URL
   */
  private extractBundlePathFromUrl(url: string): string {
    // Extract path after /plugins/bundles/
    const match = url.match(/\/plugins\/bundles\/(.+)$/);
    return match ? match[1] : '';
  }

  /**
   * Create secure execution context for plugin
   */
  private createSecureContext(config: any, parameters: any, metadata?: any) {
    return {
      // Plugin's secure configuration (with decrypted secrets)
      config,

      // Action parameters
      parameters,

      // Optional metadata
      metadata,

      // Safe utilities plugins can use
      utils: {
        fetch: require('node-fetch'), // For HTTP requests
        crypto: require('crypto'), // For hashing, etc.
      },

      // Console for debugging (could be disabled in production)
      console: {
        log: (...args: any[]) => this.logger.debug('[Plugin]', ...args),
        error: (...args: any[]) => this.logger.error('[Plugin]', ...args),
      },

      // Required modules that plugins might need
      require: (moduleName: string) => {
        // Whitelist of allowed modules
        const allowedModules = ['stripe', 'axios', 'lodash', 'moment'];
        if (allowedModules.includes(moduleName)) {
          return require(moduleName);
        }
        throw new Error(`Module '${moduleName}' is not allowed`);
      },
    };
  }

  /**
   * Execute plugin code in secure sandbox
   */
  private async executeInSandbox(
    pluginCode: string,
    action: string,
    context: any,
  ): Promise<any> {
    try {
      // Create VM context with limited access
      const vmContext = vm.createContext({
        ...context,
        // Add global objects plugins might expect
        global: {},
        process: {
          env: {}, // Empty env for security
        },
      });

      // Execute the plugin code to get the plugin object
      const script = new vm.Script(`
        ${pluginCode}
        
        // Extract backend actions from the plugin
        // Try multiple export patterns to support different plugin structures
        let backendActions = null;
        
        // Pattern 1: Default export with backendActions property  
        if (typeof module !== 'undefined' && module.exports && module.exports.default && module.exports.default.backendActions) {
          backendActions = module.exports.default.backendActions;
        }
        // Pattern 2: Named export backendActions
        else if (typeof module !== 'undefined' && module.exports && module.exports.backendActions) {
          backendActions = module.exports.backendActions;
        }
        // Pattern 3: Legacy backendHandlers support
        else if (typeof module !== 'undefined' && module.exports && module.exports.backendHandlers) {
          backendActions = module.exports.backendHandlers;
        }
        // Pattern 4: Window global (browser-style export)
        else if (typeof window !== 'undefined' && window.pluginBackendActions) {
          backendActions = window.pluginBackendActions;
        }
        // Pattern 5: Legacy window global
        else if (typeof window !== 'undefined' && window.pluginBackendHandlers) {
          backendActions = window.pluginBackendHandlers;
        }
        
        if (!backendActions) {
          throw new Error('Plugin does not export backend actions. Expected: module.exports.default.backendActions or module.exports.backendActions');
        }
        
        backendActions;
      `);

      const backendActions = script.runInContext(vmContext, {
        timeout: 10000, // 10 second timeout
        displayErrors: true,
      });

      if (!backendActions || typeof backendActions !== 'object') {
        throw new Error('Plugin backend actions not found or invalid');
      }

      // Find and execute the requested action
      const actionHandler = backendActions[action];
      if (!actionHandler || typeof actionHandler !== 'function') {
        throw new BadRequestException(
          `Action '${action}' not found in plugin backend actions`,
        );
      }

      // Execute the action handler
      return await actionHandler(
        context.parameters,
        context.config,
        context.metadata,
      );
    } catch (error) {
      this.logger.error(`Plugin execution error: ${error.message}`, error);
      throw new BadRequestException(
        `Plugin execution failed: ${error.message}`,
      );
    }
  }
}
