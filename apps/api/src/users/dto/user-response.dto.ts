import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: string;

  @ApiProperty({ description: "User's full name" })
  name: string;

  @ApiProperty({ description: "User's email address" })
  email: string;

  @ApiProperty({ description: "User's avatar URL", required: false })
  avatar?: string;

  @ApiProperty({
    description: "User's role in the organization",
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({ description: "User's permissions" })
  permissions: string[];

  @ApiProperty({ description: 'ID of the organization the user belongs to' })
  organizationId: string;

  @ApiProperty({
    description: 'ID of the department the user belongs to',
    required: false,
  })
  departmentId?: string;

  @ApiProperty({ description: 'When the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the user was last active' })
  lastActive: Date;

  @ApiProperty({
    description: "User's status",
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty({ description: 'Whether two-factor authentication is enabled' })
  twoFactorEnabled: boolean;

  @ApiProperty({ description: 'Department information', required: false })
  department?: {
    id: string;
    name: string;
    slug: string;
  };
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ description: 'List of users', type: [UserResponseDto] })
  users: UserResponseDto[];

  @ApiProperty({ description: 'Total number of users' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
