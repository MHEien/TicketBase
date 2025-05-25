import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePluginDto {
  @ApiProperty({
    description: 'Unique identifier for the plugin',
    example: 'payment-gateway',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Display name of the plugin',
    example: 'Payment Gateway Plugin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Semantic version of the plugin',
    example: '1.0.0',
  })
  @IsString()
  version: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the plugin functionality',
    example:
      'Integrates with popular payment processors to enable credit card payments',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Category the plugin belongs to',
    example: 'payments',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Plugin source code (JavaScript)',
    example: 'export default function() { /* plugin code */ }',
  })
  @IsString()
  sourceCode: string;

  @ApiPropertyOptional({
    description: 'URL to the plugin bundle (if already hosted)',
    example: 'https://example.com/plugins/payment-gateway/bundle.js',
  })
  @IsUrl()
  @IsOptional()
  bundleUrl?: string;

  @ApiPropertyOptional({
    description: 'List of permissions required by the plugin',
    example: ['read:orders', 'write:transactions'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  requiredPermissions?: string[];
}
