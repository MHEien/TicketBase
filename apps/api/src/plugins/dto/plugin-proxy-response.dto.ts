import { ApiProperty } from '@nestjs/swagger';

export class PluginProxyResponseDto {
  @ApiProperty({
    description: 'HTTP status code of the proxied response',
    type: Number,
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: 'Response data from the plugin',
    type: 'object',
    additionalProperties: true,
  })
  data: Record<string, any>;

  @ApiProperty({
    description: 'Response headers from the plugin',
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  headers: Record<string, string>;
}
