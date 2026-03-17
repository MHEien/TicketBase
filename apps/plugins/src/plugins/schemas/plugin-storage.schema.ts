import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PluginStorageDocument = PluginStorage & Document;

/**
 * Key-value storage scoped to a specific plugin + tenant.
 * Plugins use this to persist data without direct database access.
 */
@Schema({ timestamps: true })
export class PluginStorage {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  pluginId: string;

  @Prop({ required: true })
  key: string;

  @Prop({ type: Object })
  value: any;
}

export const PluginStorageSchema = SchemaFactory.createForClass(PluginStorage);

// Compound index for efficient lookups
PluginStorageSchema.index(
  { tenantId: 1, pluginId: 1, key: 1 },
  { unique: true },
);
// Index for listing keys by prefix
PluginStorageSchema.index({ tenantId: 1, pluginId: 1 });
