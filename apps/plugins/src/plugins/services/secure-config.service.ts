import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PluginConfig, PluginConfigDocument } from '../schemas/plugin-config.schema';
import { ConfigAudit, ConfigAuditDocument } from '../schemas/config-audit.schema';

@Injectable()
export class SecureConfigService {
  private readonly logger = new Logger(SecureConfigService.name);
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey: string;

  constructor(
    @InjectModel(PluginConfig.name)
    private configModel: Model<PluginConfigDocument>,
    @InjectModel(ConfigAudit.name)
    private auditModel: Model<ConfigAuditDocument>,
    private configService: ConfigService,
  ) {
    const rawKey = this.configService.get<string>('PLUGIN_CONFIG_SECRET') || 'your-default-secret-key-change-this';
    
    // Ensure key is exactly 32 bytes for AES-256-CBC
    const crypto = require('crypto');
    this.secretKey = crypto.createHash('sha256').update(rawKey).digest();
    
    if (rawKey === 'your-default-secret-key-change-this') {
      this.logger.warn('⚠️  Using default secret key for plugin config encryption. Set PLUGIN_CONFIG_SECRET in production!');
    }
  }

  /**
   * Encrypt sensitive configuration values
   */
  private encryptValue(value: string): { value: string; iv: string } {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.secretKey, iv);
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
    const decipher = createDecipheriv(this.algorithm, this.secretKey, iv);
    let decrypted = decipher.update(encryptedData.value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Log audit trail for configuration operations
   */
  private async logAudit(params: {
    tenantId: string;
    pluginId: string;
    userId?: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';
    previousConfig?: Record<string, any>;
    newConfig?: Record<string, any>;
    changedFields?: string[];
    sensitiveFieldsAccessed?: string[];
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await this.auditModel.create({
        ...params,
        timestamp: new Date(),
      });
    } catch (error) {
      this.logger.error('Failed to log audit entry:', error);
      // Don't throw - audit logging shouldn't break the main operation
    }
  }

  /**
   * Compare two configurations to find changed fields
   */
  private findChangedFields(
    oldConfig: Record<string, any>,
    newConfig: Record<string, any>,
  ): string[] {
    const changedFields: string[] = [];
    const allKeys = new Set([...Object.keys(oldConfig), ...Object.keys(newConfig)]);

    for (const key of allKeys) {
      if (oldConfig[key] !== newConfig[key]) {
        changedFields.push(key);
      }
    }

    return changedFields;
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
    auditContext?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<PluginConfigDocument> {
    const sensitiveFields = configSchema?.sensitiveFields || [];
    let previousConfig: Record<string, any> = {};
    let isUpdate = false;

    try {
      // Get existing configuration for audit trail
      const existingConfig = await this.configModel.findOne({ tenantId, pluginId });
      if (existingConfig) {
        isUpdate = true;
        // Reconstruct the previous config with decrypted values
        previousConfig = { ...existingConfig.publicConfig };
        for (const [key, encryptedData] of Object.entries(existingConfig.encryptedSecrets)) {
          try {
            previousConfig[key] = this.decryptValue(encryptedData);
          } catch (error) {
            this.logger.warn(`Failed to decrypt previous value for field ${key}`);
          }
        }
      }

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

      // Calculate changed fields for audit
      const changedFields = isUpdate ? this.findChangedFields(previousConfig, config) : Object.keys(config);
      const sensitiveFieldsAccessed = sensitiveFields.filter((field: string) => config.hasOwnProperty(field));

      // Log successful audit entry
      await this.logAudit({
        tenantId,
        pluginId,
        userId: auditContext?.userId,
        action: isUpdate ? 'UPDATE' : 'CREATE',
        previousConfig: isUpdate ? previousConfig : undefined,
        newConfig: config,
        changedFields,
        sensitiveFieldsAccessed,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        success: true,
      });

      this.logger.log(`Saved secure config for plugin ${pluginId} (tenant: ${tenantId})`);
      return result;
    } catch (error) {
      // Log failed audit entry
      await this.logAudit({
        tenantId,
        pluginId,
        userId: auditContext?.userId,
        action: isUpdate ? 'UPDATE' : 'CREATE',
        previousConfig: isUpdate ? previousConfig : undefined,
        newConfig: config,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      this.logger.error(`Failed to save secure config for plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get plugin configuration with decrypted secrets
   */
  async getPluginConfig(
    tenantId: string,
    pluginId: string,
    auditContext?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<Record<string, any> | null> {
    try {
      const config = await this.configModel.findOne({ tenantId, pluginId });
      if (!config) {
        // Log audit entry for failed access
        await this.logAudit({
          tenantId,
          pluginId,
          userId: auditContext?.userId,
          action: 'VIEW',
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          success: false,
          errorMessage: 'Configuration not found',
        });
        return null;
      }

      // Merge public config with decrypted secrets
      const result = { ...config.publicConfig };
      const sensitiveFieldsAccessed: string[] = [];

      // Decrypt sensitive values
      for (const [key, encryptedData] of Object.entries(config.encryptedSecrets)) {
        try {
          result[key] = this.decryptValue(encryptedData);
          sensitiveFieldsAccessed.push(key);
        } catch (error) {
          this.logger.error(`Failed to decrypt secret ${key} for plugin ${pluginId}:`, error);
          // Don't include the failed decryption in the result
        }
      }

      // Log successful audit entry
      await this.logAudit({
        tenantId,
        pluginId,
        userId: auditContext?.userId,
        action: 'VIEW',
        sensitiveFieldsAccessed,
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        success: true,
      });

      return result;
    } catch (error) {
      // Log failed audit entry
      await this.logAudit({
        tenantId,
        pluginId,
        userId: auditContext?.userId,
        action: 'VIEW',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      this.logger.error(`Failed to get secure config for plugin ${pluginId}:`, error);
      throw error;
    }
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
   * Delete plugin configuration and log the operation
   */
  async deletePluginConfig(
    tenantId: string,
    pluginId: string,
    auditContext?: { userId?: string; ipAddress?: string; userAgent?: string },
  ): Promise<boolean> {
    try {
      const existingConfig = await this.configModel.findOne({ tenantId, pluginId });
      if (!existingConfig) {
        await this.logAudit({
          tenantId,
          pluginId,
          userId: auditContext?.userId,
          action: 'DELETE',
          ipAddress: auditContext?.ipAddress,
          userAgent: auditContext?.userAgent,
          success: false,
          errorMessage: 'Configuration not found',
        });
        return false;
      }

      // Delete the configuration
      await this.configModel.deleteOne({ tenantId, pluginId });

      // Log successful audit entry
      await this.logAudit({
        tenantId,
        pluginId,
        userId: auditContext?.userId,
        action: 'DELETE',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        success: true,
      });

      this.logger.log(`Deleted secure config for plugin ${pluginId} (tenant: ${tenantId})`);
      return true;
    } catch (error) {
      // Log failed audit entry
      await this.logAudit({
        tenantId,
        pluginId,
        userId: auditContext?.userId,
        action: 'DELETE',
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      this.logger.error(`Failed to delete secure config for plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get audit logs for a plugin configuration
   */
  async getConfigAuditLogs(
    tenantId: string,
    pluginId?: string,
    limit: number = 100,
    skip: number = 0,
  ): Promise<ConfigAuditDocument[]> {
    const query: any = { tenantId };
    if (pluginId) {
      query.pluginId = pluginId;
    }

    return this.auditModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  /**
   * Get configuration validation errors
   */
  async validateConfiguration(
    config: Record<string, any>,
    configSchema: any,
  ): Promise<{ isValid: boolean; errors: Array<{ field: string; message: string }> }> {
    const errors: Array<{ field: string; message: string }> = [];

    if (!configSchema) {
      return { isValid: true, errors: [] };
    }

    const { properties, required = [] } = configSchema;

    // Check required fields
    for (const requiredField of required) {
      if (!config.hasOwnProperty(requiredField) || config[requiredField] === undefined || config[requiredField] === '') {
        errors.push({
          field: requiredField,
          message: `${requiredField} is required`,
        });
      }
    }

    // Validate field types and patterns
    for (const [field, value] of Object.entries(config)) {
      const fieldSchema = properties?.[field];
      if (!fieldSchema) continue;

      // Type validation
      if (fieldSchema.type === 'string' && typeof value !== 'string') {
        errors.push({
          field,
          message: `${field} must be a string`,
        });
        continue;
      }

      if (fieldSchema.type === 'boolean' && typeof value !== 'boolean') {
        errors.push({
          field,
          message: `${field} must be a boolean`,
        });
        continue;
      }

      // Pattern validation for strings
      if (fieldSchema.pattern && typeof value === 'string') {
        const regex = new RegExp(fieldSchema.pattern);
        if (!regex.test(value)) {
          errors.push({
            field,
            message: `${field} does not match the required pattern`,
          });
        }
      }

      // Min length validation
      if (fieldSchema.minLength && typeof value === 'string' && value.length < fieldSchema.minLength) {
        errors.push({
          field,
          message: `${field} must be at least ${fieldSchema.minLength} characters long`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Health check for the secure config service
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    details: {
      database: boolean;
      encryption: boolean;
    };
  }> {
    const details = {
      database: false,
      encryption: false,
    };

    try {
      // Test database connection
      await this.configModel.findOne().limit(1).exec();
      details.database = true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
    }

    try {
      // Test encryption/decryption
      const testValue = 'test-encryption-value';
      const encrypted = this.encryptValue(testValue);
      const decrypted = this.decryptValue(encrypted);
      details.encryption = decrypted === testValue;
    } catch (error) {
      this.logger.error('Encryption health check failed:', error);
    }

    const status = details.database && details.encryption ? 'healthy' : 'unhealthy';

    return {
      status,
      timestamp: new Date(),
      details,
    };
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