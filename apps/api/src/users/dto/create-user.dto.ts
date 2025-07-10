import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  MinLength,
  IsUUID,
} from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: "User's full name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "User's email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password", minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: "User's avatar URL", required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: "User's role in the organization",
    enum: UserRole,
    default: UserRole.MANAGER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: "User's permissions", type: [String] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({
    description: 'ID of the organization the user belongs to',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiProperty({
    description: 'ID of the department the user belongs to',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({
    description: "User's status",
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({
    description: 'Whether two-factor authentication is enabled',
    default: false,
  })
  @IsBoolean()
  twoFactorEnabled: boolean;
}
