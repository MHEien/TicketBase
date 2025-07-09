import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PluginConfigDocument = PluginConfig & Document;

@Schema({ timestamps: true })
export class PluginConfig {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  pluginId: string;

  @Prop({ required: true })
  version: string;

  // Public configuration (non-sensitive)
  @Prop({ type: Object, default: {} })
  publicConfig: Record<string, any>;

  // Encrypted sensitive configuration
  @Prop({ type: Object, default: {} })
  encryptedSecrets: {
    [key: string]: {
      value: string; // AES encrypted value
      iv: string; // Initialization vector
      algorithm: string; // Encryption algorithm used
    };
  };

  // Configuration schema validation
  @Prop({ type: Object })
  configSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    sensitiveFields?: string[]; // Fields that should be encrypted
  };

  @Prop({ default: true })
  enabled: boolean;

  @Prop()
  lastValidated: Date;

  @Prop({ type: Object })
  validationErrors: {
    field: string;
    message: string;
  }[];
}

export const PluginConfigSchema = SchemaFactory.createForClass(PluginConfig);

// Compound index for efficient tenant+plugin lookups
PluginConfigSchema.index({ tenantId: 1, pluginId: 1 }, { unique: true }); 