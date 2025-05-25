import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PluginStorageService {
  private readonly logger = new Logger(PluginStorageService.name);
  private readonly bucketName: string;
  private readonly serverUrl: string;

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get(
      'PLUGIN_ASSETS_BUCKET',
      'plugin-bundles',
    );
    this.serverUrl = this.configService.get(
      'PLUGIN_SERVER_URL',
      'http://localhost:4000',
    );

    // Ensure bucket exists
    this.initBucket().catch((err) => {
      this.logger.error(
        `Failed to initialize Minio bucket: ${err.message}`,
        err,
      );
    });
  }

  private async initBucket() {
    try {
      const exists = await this.minioService.client.bucketExists(
        this.bucketName,
      );
      if (!exists) {
        this.logger.log(`Creating bucket ${this.bucketName}`);
        await this.minioService.client.makeBucket(this.bucketName);
        this.logger.log(`Bucket ${this.bucketName} created successfully`);
      }
    } catch (error) {
      this.logger.error(`Error initializing bucket: ${error.message}`, error);
      throw error;
    }
  }

  async storePluginBundle(
    pluginId: string,
    version: string,
    bundleBuffer: Buffer,
    contentType = 'application/javascript',
  ): Promise<string> {
    try {
      const objectKey = `${pluginId}/v${version}/bundle-${uuid()}.js`;

      await this.minioService.client.putObject(
        this.bucketName,
        objectKey,
        bundleBuffer,
        bundleBuffer.length,
        {
          'Content-Type': contentType,
          'Cache-Control': 'max-age=31536000, immutable', // Long cache for versioned bundles
        },
      );

      // Generate public URL for the plugin bundle
      const bundleUrl = `${this.serverUrl}/plugins/bundles/${objectKey}`;

      this.logger.log(
        `Stored plugin bundle for ${pluginId} v${version} at ${bundleUrl}`,
      );
      return bundleUrl;
    } catch (error) {
      this.logger.error(
        `Failed to store plugin bundle for ${pluginId} v${version}: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async getPluginBundleStream(objectKey: string) {
    try {
      return await this.minioService.client.getObject(
        this.bucketName,
        objectKey,
      );
    } catch (error) {
      this.logger.error(`Failed to get plugin bundle: ${error.message}`, error);
      throw error;
    }
  }

  async deletePluginBundle(pluginId: string, version?: string): Promise<void> {
    try {
      const prefix = version ? `${pluginId}/v${version}/` : `${pluginId}/`;

      // List all objects with the plugin's prefix
      const objectsList = await this.listObjects(prefix);

      if (objectsList.length === 0) {
        this.logger.log(`No objects found for ${prefix}`);
        return;
      }

      // Delete each object
      for (const obj of objectsList) {
        await this.minioService.client.removeObject(this.bucketName, obj.name);
      }

      this.logger.log(`Deleted ${objectsList.length} objects for ${prefix}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete plugin bundle: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  private async listObjects(prefix: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const objects: any[] = [];
      const stream = this.minioService.client.listObjectsV2(
        this.bucketName,
        prefix,
        true,
      );

      stream.on('data', (obj) => objects.push(obj));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(objects));
    });
  }

  /**
   * Checks if MinIO storage is properly configured and accessible
   * @returns Object with status and optional error message
   */
  async checkStorageConnection(): Promise<{
    isConnected: boolean;
    message?: string;
  }> {
    try {
      // Try to check if bucket exists as a simple connectivity test
      await this.minioService.client.bucketExists(this.bucketName);
      return { isConnected: true };
    } catch (error) {
      this.logger.error(
        `MinIO connection check failed: ${error.message}`,
        error,
      );
      return {
        isConnected: false,
        message: `MinIO connection failed: ${error.message}. Check your configuration and make sure MinIO is running.`,
      };
    }
  }
}
