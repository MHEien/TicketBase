import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PluginDocument = Plugin & Document;

// Define the component types to match the DTOs
export interface AdminComponents {
  settings?: string;
  eventCreation?: string;
  dashboard?: string;
  [key: string]: string | undefined;
}

export interface StorefrontComponents {
  checkout?: string;
  eventDetail?: string;
  ticketSelection?: string;
  widgets?: {
    sidebar?: string;
    footer?: string;
    [key: string]: string | undefined;
  };
  [key: string]: string | object | undefined;
}

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

  @Prop({ required: false })
  remoteEntry: string;

  @Prop({ required: false })
  scope: string;

  @Prop([String])
  extensionPoints: string[];

  @Prop({ type: Object, default: {} })
  adminComponents: AdminComponents;

  @Prop({ type: Object, default: {} })
  storefrontComponents: StorefrontComponents;

  @Prop({ type: Object, default: {} })
  metadata: {
    author?: string;
    authorEmail?: string;
    repositoryUrl?: string;
    submittedAt?: string;
    status?: string; // pending, approved, rejected
    priority?: number;
    displayName?: string;
    iconUrl?: string;
    [key: string]: any;
  };

  @Prop([String])
  requiredPermissions: string[];
}

export const PluginSchema = SchemaFactory.createForClass(Plugin);
