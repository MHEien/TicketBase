import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigAuditDocument = ConfigAudit & Document;

@Schema({ timestamps: true })
export class ConfigAudit {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  pluginId: string;

  @Prop({ required: false })
  userId?: string; // Optional, extracted from JWT if available

  @Prop({ required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW'] })
  action: string;

  @Prop({ type: Object })
  previousConfig?: Record<string, any>; // Previous config (for updates)

  @Prop({ type: Object })
  newConfig?: Record<string, any>; // New config (for creates/updates)

  @Prop({ type: [String] })
  changedFields?: string[]; // List of fields that changed

  @Prop({ type: [String] })
  sensitiveFieldsAccessed?: string[]; // Track which sensitive fields were accessed

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  timestamp: Date;

  @Prop()
  success: boolean;

  @Prop()
  errorMessage?: string;
}

export const ConfigAuditSchema = SchemaFactory.createForClass(ConfigAudit);

// Add indexes for efficient querying
ConfigAuditSchema.index({ tenantId: 1, pluginId: 1, timestamp: -1 });
ConfigAuditSchema.index({ userId: 1, timestamp: -1 });
ConfigAuditSchema.index({ action: 1, timestamp: -1 });
