import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class InstallPluginDto {
  @ApiProperty({ description: 'Plugin ID to install' })
  @IsUUID()
  @IsNotEmpty()
  pluginId: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'User ID who is installing the plugin' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
} 