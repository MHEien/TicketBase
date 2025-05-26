import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule as NestMinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const endpoint = configService.get('S3_ENDPOINT');

        // Validate required environment variables
        if (!endpoint) {
          throw new Error(
            'S3_ENDPOINT environment variable is required for MinIO configuration. ' +
              'Please check your .env file and ensure it includes all required MinIO settings. ' +
              'See MINIO_SETUP.md for configuration details.',
          );
        }

        const accessKey = configService.get('AWS_ACCESS_KEY_ID');
        const secretKey = configService.get('AWS_SECRET_ACCESS_KEY');

        if (!accessKey || !secretKey) {
          throw new Error(
            'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required for MinIO configuration. ' +
              'Please check your .env file and ensure it includes all required MinIO settings. ' +
              'See MINIO_SETUP.md for configuration details.',
          );
        }

        // Parse the endpoint to extract domain without protocol
        const endPointWithoutProtocol = endpoint.replace(/^https?:\/\//, '');

        // Check if endpoint already includes a port
        const hasPort = endPointWithoutProtocol.includes(':');
        const portFromConfig = parseInt(configService.get('S3_PORT', '9000'));

        return {
          endPoint: hasPort
            ? endPointWithoutProtocol.split(':')[0]
            : endPointWithoutProtocol,
          port: hasPort
            ? parseInt(endPointWithoutProtocol.split(':')[1])
            : endpoint.includes('.dev') ||
                endpoint.includes('.com') ||
                endpoint.includes('.io') ||
                endpoint.includes('.net')
              ? undefined // Skip port for custom domains
              : portFromConfig,
          useSSL:
            endpoint.startsWith('https://') ||
            configService.get('S3_USE_SSL', 'false') === 'true',
          accessKey,
          secretKey,
          region: configService.get('AWS_REGION', 'us-east-1'),
        };
      },
    }),
  ],
  exports: [NestMinioModule],
})
export class MinioModule {}
