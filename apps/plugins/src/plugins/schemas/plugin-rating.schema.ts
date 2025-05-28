import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PluginRatingDocument = PluginRating & Document;

@Schema({ timestamps: true })
export class PluginRating {
  @Prop({ required: true })
  pluginId: string;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  review?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PluginRatingSchema = SchemaFactory.createForClass(PluginRating);

// Create compound index to ensure one rating per user per plugin
PluginRatingSchema.index({ pluginId: 1, tenantId: 1, userId: 1 }, { unique: true }); 