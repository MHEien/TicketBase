import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PluginDocument = Plugin & Document;

@Schema({ timestamps: true })
export class Plugin {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false })
  bundleUrl: string;

  @Prop([String])
  extensionPoints: string[];

  @Prop({ type: Object, default: {} })
  metadata: {
    author?: string;
    priority?: number;
    displayName?: string;
    iconUrl?: string;
    [key: string]: any;
  };

  @Prop([String])
  requiredPermissions: string[];
}

export const PluginSchema = SchemaFactory.createForClass(Plugin); 