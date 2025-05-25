import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InstalledPluginDocument = InstalledPlugin & Document;

@Schema({ timestamps: true })
export class InstalledPlugin {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Plugin' })
  pluginId: string;

  @Prop({ required: true, default: true })
  enabled: boolean;

  @Prop({ type: Object, default: {} })
  configuration: Record<string, any>;

  @Prop()
  installedAt: Date;

  @Prop()
  updatedAt: Date;

  // Added for TypeScript - automatically populated by timestamps option
  createdAt: Date;
}

export const InstalledPluginSchema = SchemaFactory.createForClass(InstalledPlugin);
// Add compound index for tenantId + pluginId
InstalledPluginSchema.index({ tenantId: 1, pluginId: 1 }, { unique: true }); 