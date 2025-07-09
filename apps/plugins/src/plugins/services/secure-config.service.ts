import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PluginConfig, PluginConfigDocument } from '../schemas/plugin-config.schema';

@Injectable()
export class SecureConfigService {
  private readonly logger = new Logger(SecureConfigService.name);
  private readonly encryptionKey: string;
  private readonly algorithm = 'aes-256-cbc';

  constructor(
    @InjectModel(PluginConfig.name)
    private configModel: Model<PluginConfigDocument>,
    private configService: ConfigService,
  ) {
    // Get encryption key from environment - should be stored securely
    this.encryptionKey = this.configService.get<string>('PLUGIN_ENCRYPTION_KEY');
    if (!this.encryptionKey) {
      throw new Error('PLUGIN_ENCRYPTION_KEY environment variable is required');
    }
  }

  /**
   * Encrypt sensitive configuration values
   */
  private encryptValue(value: string): { value: string; iv: string } {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      value: encrypted,
      iv: iv.toString('hex'),
    };
  }

  /**
   * Decrypt sensitive configuration values
   */
  private decryptValue(encryptedData: { value: string; iv: string }): string {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv);
    let decrypted = decipher.update(encryptedData.value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Save plugin configuration with proper encryption for sensitive fields
   */
  async savePluginConfig(
    tenantId: string,
    pluginId: string,
    version: string,
    config: Record<string, any>,
    configSchema?: any,
  ): Promise<PluginConfigDocument> {
    const sensitiveFields = configSchema?.sensitiveFields || [];
    
    // Separate sensitive and non-sensitive configuration
    const publicConfig: Record<string, any> = {};
    const secretsToEncrypt: Record<string, string> = {};

    for (const [key, value] of Object.entries(config)) {
      if (sensitiveFields.includes(key) && typeof value === 'string') {
        secretsToEncrypt[key] = value;
      } else {
        publicConfig[key] = value;
      }
    }

    // Encrypt sensitive values
    const encryptedSecrets: Record<string, any> = {};
    for (const [key, value] of Object.entries(secretsToEncrypt)) {
      const encrypted = this.encryptValue(value);
      encryptedSecrets[key] = {
        ...encrypted,
        algorithm: this.algorithm,
      };
    }

    // Upsert configuration
    const result = await this.configModel.findOneAndUpdate(
      { tenantId, pluginId },
      {
        tenantId,
        pluginId,
        version,
        publicConfig,
        encryptedSecrets,
        configSchema,
        lastValidated: new Date(),
        validationErrors: [],
      },
      { upsert: true, new: true },
    );

    this.logger.log(`Saved secure config for plugin ${pluginId} (tenant: ${tenantId})`);
    return result;
  }

  /**
   * Get plugin configuration with decrypted secrets
   */
  async getPluginConfig(
    tenantId: string,
    pluginId: string,
  ): Promise<Record<string, any> | null> {
    const config = await this.configModel.findOne({ tenantId, pluginId });
    if (!config) {
      return null;
    }

    // Merge public config with decrypted secrets
    const result = { ...config.publicConfig };

    // Decrypt sensitive values
    for (const [key, encryptedData] of Object.entries(config.encryptedSecrets)) {
      try {
        result[key] = this.decryptValue(encryptedData);
      } catch (error) {
        this.logger.error(`Failed to decrypt secret ${key} for plugin ${pluginId}:`, error);
        // Don't include the failed decryption in the result
      }
    }

    return result;
  }

  /**
   * Get only public configuration (no secrets)
   */
  async getPublicConfig(
    tenantId: string,
    pluginId: string,
  ): Promise<Record<string, any> | null> {
    const config = await this.configModel.findOne({ tenantId, pluginId });
    return config ? config.publicConfig : null;
  }

  /**
   * Validate configuration against schema
   */
  async validateConfig(
    tenantId: string,
    pluginId: string,
    config: Record<string, any>,
  ): Promise<{ valid: boolean; errors: Array<{ field: string; message: string }> }> {
    const configDoc = await this.configModel.findOne({ tenantId, pluginId });
    if (!configDoc?.configSchema) {
      return { valid: true, errors: [] };
    }

    const errors: Array<{ field: string; message: string }> = [];
    const schema = configDoc.configSchema;

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in config) || config[field] === null || config[field] === undefined) {
          errors.push({
            field,
            message: `Required field '${field}' is missing`,
          });
        }
      }
    }

    // Validate field types and constraints
    if (schema.properties) {
      for (const [field, fieldSchema] of Object.entries(schema.properties as Record<string, any>)) {
        const value = config[field];
        if (value !== undefined) {
          // Type validation
          if (fieldSchema.type && typeof value !== fieldSchema.type) {
            errors.push({
              field,
              message: `Field '${field}' must be of type ${fieldSchema.type}`,
            });
          }

          // Pattern validation for strings
          if (fieldSchema.pattern && typeof value === 'string') {
            const regex = new RegExp(fieldSchema.pattern);
            if (!regex.test(value)) {
              errors.push({
                field,
                message: `Field '${field}' does not match required pattern`,
              });
            }
          }

          // Min/max length for strings
          if (typeof value === 'string') {
            if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
              errors.push({
                field,
                message: `Field '${field}' must be at least ${fieldSchema.minLength} characters`,
              });
            }
            if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
              errors.push({
                field,
                message: `Field '${field}' must be no more than ${fieldSchema.maxLength} characters`,
              });
            }
          }
        }
      }
    }

    // Update validation results
    await this.configModel.updateOne(
      { tenantId, pluginId },
      {
        lastValidated: new Date(),
        validationErrors: errors,
      },
    );

    return { valid: errors.length === 0, errors };
  }

  /**
   * Delete plugin configuration
   */
  async deletePluginConfig(tenantId: string, pluginId: string): Promise<boolean> {
    const result = await this.configModel.deleteOne({ tenantId, pluginId });
    return result.deletedCount > 0;
  }

  /**
   * List all configurations for a tenant (public data only)
   */
  async listTenantConfigs(tenantId: string): Promise<Array<{
    pluginId: string;
    version: string;
    enabled: boolean;
    publicConfig: Record<string, any>;
    hasSecrets: boolean;
  }>> {
    const configs = await this.configModel.find({ tenantId });
    return configs.map(config => ({
      pluginId: config.pluginId,
      version: config.version,
      enabled: config.enabled,
      publicConfig: config.publicConfig,
      hasSecrets: Object.keys(config.encryptedSecrets).length > 0,
    }));
  }
} 