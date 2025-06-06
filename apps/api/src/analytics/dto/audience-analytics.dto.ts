import { ApiProperty } from '@nestjs/swagger';

export class AudienceAnalyticsDto {
  @ApiProperty({
    description: 'Total number of unique visitors',
    type: Number,
  })
  totalVisitors: number;

  @ApiProperty({
    description: 'Age distribution of visitors',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      '18-24': 25,
      '25-34': 40,
      '35-44': 20,
      '45-54': 10,
      '55+': 5,
    },
  })
  ageDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Gender distribution of visitors',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      male: 48,
      female: 50,
      other: 2,
    },
  })
  genderDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Geographic distribution of visitors',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  geographicDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Device types used by visitors',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      mobile: 60,
      desktop: 35,
      tablet: 5,
    },
  })
  deviceDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Visitor engagement metrics',
    type: 'object',
    properties: {
      averageSessionDuration: { type: 'number' },
      bounceRate: { type: 'number' },
      returningVisitors: { type: 'number' },
    },
  })
  engagement: {
    averageSessionDuration: number;
    bounceRate: number;
    returningVisitors: number;
  };
}
