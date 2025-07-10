import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'New password', minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class AdminUpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'New password', required: false, minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
