import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstallPluginDto {
  @ApiProperty({
    description: 'ID of the plugin to install',
    example: 'payment-gateway'
  })
  @IsNotEmpty()
  @IsString()
  pluginId: string;
} 