import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSession } from './user-session.entity';
import { Organization } from './organization.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPPORT = 'support',
  ANALYST = 'analyst',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User\'s full name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'User\'s email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User\'s hashed password' })
  @Column()
  password: string;

  @ApiProperty({ description: 'User\'s avatar URL', required: false })
  @Column({ nullable: true })
  avatar?: string;

  @ApiProperty({ 
    description: 'User\'s role in the organization',
    enum: UserRole,
    default: UserRole.MANAGER
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MANAGER
  })
  role: UserRole;

  @ApiProperty({ description: 'User\'s permissions' })
  @Column('simple-array')
  permissions: string[];

  @ApiProperty({ description: 'ID of the organization the user belongs to' })
  @Column()
  organizationId: string;

  @ApiProperty({ description: 'When the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the user was last active' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;

  @ApiProperty({ 
    description: 'User\'s status',
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  status: UserStatus;

  @ApiProperty({ description: 'Whether two-factor authentication is enabled' })
  @Column({ default: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ description: 'Two-factor authentication secret', required: false })
  @Column({ nullable: true })
  twoFactorSecret?: string;

  @ManyToOne(() => Organization, organization => organization.users)
  organization: Organization;

  @OneToMany(() => UserSession, session => session.user)
  sessions?: UserSession[];
} 