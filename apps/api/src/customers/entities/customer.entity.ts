import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('customers')
export class Customer {
  @ApiProperty({ description: 'Unique identifier', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Email address', example: 'customer@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'First name', example: 'John', required: false })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ 
    description: 'Address information',
    required: false,
    example: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    }
  })
  @Column({ type: 'jsonb', nullable: true })
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  @ApiProperty({ description: 'Marketing consent', required: false })
  @Column({ default: false })
  marketing: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 