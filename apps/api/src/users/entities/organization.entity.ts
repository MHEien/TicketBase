import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

@Entity('organizations')
export class Organization {
  @ApiProperty({ description: 'Unique identifier for the organization' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Organization name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'URL-friendly identifier' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ description: 'Organization email' })
  @Column()
  email: string;

  @ApiProperty({ description: 'Organization phone', required: false })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Organization website', required: false })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ description: 'Organization address', required: false })
  @Column({ type: 'jsonb', nullable: true })
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };

  @ApiProperty({ description: 'Organization logo URL', required: false })
  @Column({ nullable: true })
  logo?: string;

  @ApiProperty({ description: 'Organization favicon URL', required: false })
  @Column({ nullable: true })
  favicon?: string;

  @ApiProperty({ description: 'When the organization was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the organization was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Organization plan type',
    enum: PlanType,
    default: PlanType.FREE,
  })
  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.FREE,
  })
  plan: PlanType;

  @ApiProperty({ description: 'Organization settings' })
  @Column({ type: 'jsonb', default: {} })
  settings: {
    defaultCurrency?: string;
    emailNotifications?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill';
    fontFamily?: string;
    headerStyle?: 'centered' | 'left' | 'right' | 'full-width';
    footerLinks?: {
      text: string;
      url: string;
    }[];
    socialLinks?: {
      platform: string;
      url: string;
    }[];
    allowGuestCheckout?: boolean;
    serviceFeePercentage?: number;
    serviceFeeFixed?: number;
    ticketTransfersEnabled?: boolean;
    refundPolicy?: string;
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
    customStylesheet?: string;
    customHeadHtml?: string;
    customScripts?: string[];
    themeName?: string;
  };

  @ApiProperty({ description: 'Subscription ID', required: false })
  @Column({ nullable: true })
  subscriptionId?: string;

  @ApiProperty({ description: 'Custom domain', required: false })
  @Column({ nullable: true })
  customDomain?: string;

  @ApiProperty({ description: 'Domain verification status', required: false })
  @Column({ default: false })
  domainVerified?: boolean;

  @ApiProperty({ description: 'Domain verification token', required: false })
  @Column({ nullable: true })
  domainVerificationToken?: string;

  @ApiProperty({ description: 'Default checkout message', required: false })
  @Column({ nullable: true, type: 'text' })
  checkoutMessage?: string;

  @ApiProperty({
    description: 'Default confirmation email template',
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  emailTemplate?: string;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
