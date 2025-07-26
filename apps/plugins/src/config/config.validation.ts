import { plainToInstance, Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  MONGODB_URI: string;

  @IsOptional()
  @IsString()
  PLUGIN_SERVER_URL?: string = 'http://localhost:5000';

  @IsOptional()
  @IsString()
  AWS_REGION?: string = 'us-east-1';

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  S3_ENDPOINT: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  S3_PORT?: number = 9000;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  S3_USE_SSL?: boolean = false;

  @IsOptional()
  @IsString()
  PLUGIN_ASSETS_BUCKET?: string = 'plugin-bundles';

  @IsString()
  GITHUB_TOKEN: string;

  @IsString()
  GITHUB_OWNER: string;

  @IsString()
  GITHUB_REPO: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missingVars = errors.map((error) => error.property).join(', ');
    throw new Error(
      `Configuration validation failed. Missing or invalid environment variables: ${missingVars}.\n` +
        'Please ensure your .env file includes all required variables. See MINIO_SETUP.md for details.\n' +
        'Required variables: MONGODB_URI, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_ENDPOINT',
    );
  }

  return validatedConfig;
}
