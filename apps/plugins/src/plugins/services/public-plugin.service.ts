import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plugin, PluginDocument } from '../schemas/plugin.schema';
import { InstalledPlugin, InstalledPluginDocument } from '../schemas/installed-plugin.schema';
import { PluginSecurityService } from './plugin-security.service';
import { SecureConfigService } from './secure-config.service';

export interface PublicPluginInfo {
  id: string;
  name: string;
  version: string;
  displayName: string;
  category: string;
  bundleUrl: string;
  extensionPoints: string[];
  publicConfig: Record<string, any>;
  enabled: boolean;
}

@Injectable()
export class PublicPluginService {
  private readonly logger = new Logger(PublicPluginService.name);

  constructor(
    @InjectModel(Plugin.name)
    private pluginModel: Model<PluginDocument>,
    @InjectModel(InstalledPlugin.name)
    private installedPluginModel: Model<InstalledPluginDocument>,
    private secureConfigService: SecureConfigService,
    private pluginSecurityService: PluginSecurityService,
    private configService: ConfigService,
  ) {}

  /**
   * Get public plugin information for storefront/checkout
   * This method is safe to call without authentication
   */
  async getPublicPluginInfo(
    tenantId: string,
    pluginId: string,
    extensionPoint?: string,
  ): Promise<PublicPluginInfo | null> {
    try {
      // Get the plugin metadata
      const plugin = await this.pluginModel.findOne({ id: pluginId });
      if (!plugin) {
        return null;
      }

      // Get the installed plugin for this tenant
      const installedPlugin = await this.installedPluginModel.findOne({
        tenantId,
        pluginId,
      });

      if (!installedPlugin || !installedPlugin.enabled) {
        return null;
      }

      // Check if plugin supports the requested extension point
      if (extensionPoint && !plugin.extensionPoints.includes(extensionPoint)) {
        return null;
      }

      // Get public configuration (sensitive fields are automatically excluded)
      const publicConfig = await this.secureConfigService.getPublicConfig(
        tenantId,
        pluginId,
      );

      // Validate bundle URL for security
      if (!this.pluginSecurityService.validatePluginUrl(plugin.bundleUrl)) {
        this.logger.warn(
          `Invalid bundle URL for plugin ${pluginId}: ${plugin.bundleUrl}`,
        );
        return null;
      }

      return {
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        displayName: plugin.metadata?.displayName || plugin.name,
        category: plugin.category,
        bundleUrl: plugin.bundleUrl,
        extensionPoints: plugin.extensionPoints,
        publicConfig: publicConfig || {},
        enabled: installedPlugin.enabled,
      };
    } catch (error) {
      this.logger.error(
        `Error getting public plugin info for ${pluginId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Get all public plugins for a tenant by category
   * Safe for unauthenticated access
   */
  async getPublicPluginsByCategory(
    tenantId: string,
    category: string,
    extensionPoint?: string,
  ): Promise<PublicPluginInfo[]> {
    try {
      // Get all enabled plugins for this tenant
      const installedPlugins = await this.installedPluginModel.find({
        tenantId,
        enabled: true,
      });

      if (installedPlugins.length === 0) {
        return [];
      }

      const pluginIds = installedPlugins.map(p => p.pluginId);

      // Get plugin metadata
      const plugins = await this.pluginModel.find({
        id: { $in: pluginIds },
        category,
      });

      const publicPlugins: PublicPluginInfo[] = [];

      for (const plugin of plugins) {
        const installedPlugin = installedPlugins.find(
          p => p.pluginId === plugin.id,
        );

        if (!installedPlugin || !installedPlugin.enabled) {
          continue;
        }

        // Check if plugin supports the requested extension point
        if (extensionPoint && !plugin.extensionPoints.includes(extensionPoint)) {
          continue;
        }

        // Validate bundle URL for security
        if (!this.pluginSecurityService.validatePluginUrl(plugin.bundleUrl)) {
          this.logger.warn(
            `Invalid bundle URL for plugin ${plugin.id}: ${plugin.bundleUrl}`,
          );
          continue;
        }

        // Get public configuration
        const publicConfig = await this.secureConfigService.getPublicConfig(
          tenantId,
          plugin.id,
        );

        publicPlugins.push({
          id: plugin.id,
          name: plugin.name,
          version: plugin.version,
          displayName: plugin.metadata?.displayName || plugin.name,
          category: plugin.category,
          bundleUrl: plugin.bundleUrl,
          extensionPoints: plugin.extensionPoints,
          publicConfig: publicConfig || {},
          enabled: installedPlugin.enabled,
        });
      }

      return publicPlugins;
    } catch (error) {
      this.logger.error(
        `Error getting public plugins for tenant ${tenantId}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Get payment plugins for public checkout
   * Specifically for storefront checkout without authentication
   */
  async getPaymentPluginsForCheckout(
    tenantId: string,
  ): Promise<PublicPluginInfo[]> {
    return this.getPublicPluginsByCategory(tenantId, 'payment', 'payment-methods');
  }

  /**
   * Validate that a plugin is safe for public access
   * Additional security check for public-facing plugins
   */
  async validatePublicPluginAccess(
    tenantId: string,
    pluginId: string,
    extensionPoint: string,
  ): Promise<boolean> {
    try {
      // Check if plugin is enabled for this tenant
      const installedPlugin = await this.installedPluginModel.findOne({
        tenantId,
        pluginId,
        enabled: true,
      });

      if (!installedPlugin) {
        return false;
      }

      // Get plugin metadata
      const plugin = await this.pluginModel.findOne({ id: pluginId });
      if (!plugin) {
        return false;
      }

      // Check if plugin supports the extension point
      if (!plugin.extensionPoints.includes(extensionPoint)) {
        return false;
      }

      // Validate bundle URL
      if (!this.pluginSecurityService.validatePluginUrl(plugin.bundleUrl)) {
        return false;
      }

      // Additional security checks for public-facing plugins
      const publicExtensionPoints = [
        'payment-methods',
        'checkout-confirmation',
        'storefront-widgets',
      ];

      if (!publicExtensionPoints.includes(extensionPoint)) {
        this.logger.warn(
          `Extension point ${extensionPoint} is not allowed for public access`,
        );
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Error validating public plugin access for ${pluginId}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Get Content Security Policy for public plugin loading
   */
  getPublicPluginCSP(): string {
    return this.pluginSecurityService.generatePluginCSP();
  }

  /**
   * Sanitize plugin configuration for public access
   */
  sanitizeConfigForPublic(
    config: Record<string, any>,
    configSchema: any,
  ): Record<string, any> {
    return this.pluginSecurityService.sanitizePluginConfigForPublic(
      config,
      configSchema,
    );
  }
}