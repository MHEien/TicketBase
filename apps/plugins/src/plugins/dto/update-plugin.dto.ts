import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePluginDto {
  @ApiPropertyOptional({
    description: 'Display name of the plugin',
    example: 'Updated Payment Gateway Plugin'
  })
  @IsString()
  @IsOptional()
  name?: string;
  
  @ApiPropertyOptional({
    description: 'Semantic version of the plugin',
    example: '1.0.1'
  })
  @IsString()
  @IsOptional()
  version?: string;
  
  @ApiPropertyOptional({
    description: 'Detailed description of the plugin functionality',
    example: 'Updated plugin that integrates with popular payment processors'
  })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiPropertyOptional({
    description: 'Category the plugin belongs to',
    example: 'payments'
  })
  @IsString()
  @IsOptional()
  category?: string;
  
  @ApiPropertyOptional({
    description: 'Plugin source code (JavaScript)',
    example: 'export default function() { /* updated plugin code */ }'
  })
  @IsString()
  @IsOptional()
  sourceCode?: string;
  
  @ApiPropertyOptional({
    description: 'List of permissions required by the plugin',
    example: ['read:orders', 'write:transactions', 'read:customers'],
    type: [String]
  })
  @IsArray()
  @IsOptional()
  requiredPermissions?: string[];
} 