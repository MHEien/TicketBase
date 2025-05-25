import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { InstalledPlugin } from './installed-plugin.entity';

export enum PluginCategory {
  PAYMENT = 'payment',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  SOCIAL = 'social',
  TICKETING = 'ticketing',
  LAYOUT = 'layout',
  SEATING = 'seating'
}

export enum PluginStatus {
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  REMOVED = 'removed'
}

@Entity('plugins')
export class Plugin {
  @ApiProperty({ description: 'Unique identifier', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Plugin name', example: 'Stripe Payment Gateway' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Plugin version', example: '1.0.0' })
  @Column()
  version: string;

  @ApiProperty({ description: 'Plugin description', example: 'Integrates Stripe payment processing' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Plugin category', enum: PluginCategory, enumName: 'PluginCategory' })
  @Column({
    type: 'enum',
    enum: PluginCategory
  })
  category: PluginCategory;

  @ApiProperty({ description: 'URL to the plugin bundle' })
  @Column({ name: 'bundle_url' })
  bundleUrl: string;

  @ApiProperty({ description: 'List of extension points this plugin implements', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  extensionPoints: string[];

  @ApiProperty({ 
    description: 'Admin components provided by the plugin',
    example: {
      settings: 'StripeSettings',
      eventCreation: 'StripeEventOptions',
      dashboard: 'StripeDashboard'
    }
  })
  @Column({ type: 'jsonb', default: {} })
  adminComponents: {
    settings?: string;
    eventCreation?: string;
    dashboard?: string;
  };

  @ApiProperty({ 
    description: 'Storefront components provided by the plugin',
    example: {
      checkout: 'StripeCheckout',
      widgets: {
        paymentMethods: 'StripePaymentMethods'
      }
    }
  })
  @Column({ type: 'jsonb', default: {} })
  storefrontComponents: {
    checkout?: string;
    eventDetail?: string;
    ticketSelection?: string;
    widgets?: Record<string, string>;
  };

  @ApiProperty({ 
    description: 'Metadata about the plugin',
    example: {
      priority: 100,
      displayName: 'Stripe Payments',
      author: 'Stripe Inc.',
      paymentProvider: 'stripe',
      supportedMethods: ['credit_card', 'ach'],
      supportedCurrencies: ['USD', 'EUR']
    }
  })
  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'Required permissions for this plugin', type: [String], required: false })
  @Column({ type: 'jsonb', nullable: true })
  requiredPermissions?: string[];

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Plugin status', enum: PluginStatus, enumName: 'PluginStatus' })
  @Column({
    type: 'enum',
    enum: PluginStatus,
    default: PluginStatus.ACTIVE
  })
  status: PluginStatus;

  @OneToMany(() => InstalledPlugin, installedPlugin => installedPlugin.plugin)
  installations: InstalledPlugin[];
} 