import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('departments')
export class Department {
  @ApiProperty({ description: 'Unique identifier for the department' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Department name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Department description', required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ description: 'URL-friendly identifier' })
  @Column()
  slug: string;

  @ApiProperty({
    description: 'ID of the organization the department belongs to',
  })
  @Column()
  organizationId: string;

  @ApiProperty({ description: 'Department head user ID', required: false })
  @Column({ nullable: true })
  headId?: string;

  @ApiProperty({ description: 'Parent department ID', required: false })
  @Column({ nullable: true })
  parentDepartmentId?: string;

  @ApiProperty({
    description: 'Department code or identifier',
    required: false,
  })
  @Column({ nullable: true })
  code?: string;

  @ApiProperty({ description: 'When the department was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the department was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Department settings and metadata' })
  @Column({ type: 'jsonb', default: {} })
  settings: {
    color?: string;
    icon?: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
    defaultTicketAssignee?: string;
    autoAssignTickets?: boolean;
    notificationPreferences?: {
      newTicket?: boolean;
      ticketAssigned?: boolean;
      ticketClosed?: boolean;
      dailySummary?: boolean;
    };
    customFields?: {
      key: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'boolean' | 'select';
      options?: string[];
      required?: boolean;
    }[];
  };

  @ApiProperty({ description: 'Whether the department is active' })
  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Organization, (organization) => organization.departments)
  organization: Organization;

  @ManyToOne(() => Department, (department) => department.childDepartments)
  parentDepartment?: Department;

  @OneToMany(() => Department, (department) => department.parentDepartment)
  childDepartments?: Department[];

  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
