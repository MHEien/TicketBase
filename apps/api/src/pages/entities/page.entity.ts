import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Organization } from '../../users/entities/organization.entity';

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('pages')
@Index(['organizationId', 'slug'], { unique: true })
@Index(['organizationId', 'status'])
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: false })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  content: Record<string, any>; // Reka.js state configuration

  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.DRAFT,
  })
  status: PageStatus;

  @Column({ name: 'is_homepage', default: false })
  isHomepage: boolean;

  @Column({ name: 'seo_title', length: 255, nullable: true })
  seoTitle?: string;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription?: string;

  @Column({ name: 'seo_keywords', type: 'text', nullable: true })
  seoKeywords?: string;

  @Column({ name: 'featured_image', nullable: true })
  featuredImage?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'created_by' })
  createdBy: string; // User ID

  @Column({ name: 'updated_by' })
  updatedBy: string; // User ID

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
