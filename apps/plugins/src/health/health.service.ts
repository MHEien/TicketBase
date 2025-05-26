import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class HealthService implements OnModuleInit {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async onModuleInit() {
    await this.checkMinioConnection();
    await this.ensureBucketExists();
  }

  private async checkMinioConnection(): Promise<void> {
    try {
      // Test MinIO connection by listing buckets
      await this.minioService.client.listBuckets();
      this.logger.log('✅ MinIO connection successful');
    } catch (error) {
      this.logger.error('❌ MinIO connection failed:', error.message);
      this.logger.error(
        'Please ensure MinIO is running and the configuration in .env is correct. ' +
          'See MINIO_SETUP.md for setup instructions.',
      );
      throw new Error(`MinIO connection failed: ${error.message}`);
    }
  }

  private async ensureBucketExists(): Promise<void> {
    const bucketName = this.configService.get(
      'PLUGIN_ASSETS_BUCKET',
      'plugin-bundles',
    );

    try {
      const bucketExists =
        await this.minioService.client.bucketExists(bucketName);

      if (!bucketExists) {
        this.logger.warn(
          `Bucket '${bucketName}' does not exist. Creating it...`,
        );
        await this.minioService.client.makeBucket(bucketName);
        this.logger.log(`✅ Created bucket '${bucketName}'`);
      } else {
        this.logger.log(`✅ Bucket '${bucketName}' exists`);
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to check/create bucket '${bucketName}':`,
        error.message,
      );
      throw new Error(`Bucket operation failed: ${error.message}`);
    }
  }

  async getHealthStatus() {
    const status = {
      minio: 'unknown',
      bucket: 'unknown',
      timestamp: new Date().toISOString(),
    };

    try {
      await this.minioService.client.listBuckets();
      status.minio = 'healthy';
    } catch (error) {
      status.minio = 'unhealthy';
    }

    try {
      const bucketName = this.configService.get(
        'PLUGIN_ASSETS_BUCKET',
        'plugin-bundles',
      );
      const bucketExists =
        await this.minioService.client.bucketExists(bucketName);
      status.bucket = bucketExists ? 'exists' : 'missing';
    } catch (error) {
      status.bucket = 'error';
    }

    return status;
  }
}
