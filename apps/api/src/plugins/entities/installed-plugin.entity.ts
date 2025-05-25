import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Plugin } from './plugin.entity';
import { Organization } from '../../users/entities/organization.entity';
import { User } from '../../users/entities/user.entity';

@Entity('installed_plugins')
export class InstalledPlugin {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Plugin ID' })
  @Column({ name: 'plugin_id' })
  pluginId: string;

  @ManyToOne(() => Plugin, (plugin) => plugin.installations)
  @JoinColumn({ name: 'plugin_id' })
  plugin: Plugin;

  @ApiProperty({ description: 'Organization ID' })
  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ description: 'Is the plugin enabled' })
  @Column({ default: true })
  enabled: boolean;

  @ApiProperty({ description: 'Plugin configuration', required: false })
  @Column({ type: 'jsonb', default: {} })
  configuration: Record<string, any>;

  @ApiProperty({ description: 'Installation timestamp' })
  @CreateDateColumn({ name: 'installed_at' })
  installedAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'User ID who installed the plugin' })
  @Column({ name: 'installed_by' })
  installedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'installed_by' })
  installedByUser: User;

  @ApiProperty({ description: 'Plugin version', example: '1.0.0' })
  @Column()
  version: string;
}
