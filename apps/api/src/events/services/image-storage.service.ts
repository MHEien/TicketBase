import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageStorageService {
  private readonly logger = new Logger(ImageStorageService.name);
  private readonly bucketName: string;
  private readonly serverUrl: string;

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get(
      'EVENT_IMAGES_BUCKET',
      'event-images',
    );
    // Use the main API server URL for serving images
    this.serverUrl = this.configService.get(
      'API_SERVER_URL',
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
      } else {
        this.logger.log(`Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      this.logger.error(`Error initializing bucket: ${error.message}`, error);
      throw error;
    }
  }

  async storeEventImage(
    organizationId: string,
    eventId: string,
    imageBuffer: Buffer,
    originalFilename: string,
    contentType: string,
  ): Promise<string> {
    try {
      // Validate content type
      if (!contentType.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Generate unique filename with organization and event context
      const fileExtension = this.getFileExtension(originalFilename);
      const objectKey = `organizations/${organizationId}/events/${eventId}/images/${uuid()}${fileExtension}`;

      this.logger.debug(`Storing image with key: ${objectKey}`);
      this.logger.debug(`Buffer size: ${imageBuffer.length} bytes`);

      await this.minioService.client.putObject(
        this.bucketName,
        objectKey,
        imageBuffer,
        imageBuffer.length,
        {
          'Content-Type': contentType,
          'Cache-Control': 'max-age=31536000, public',
        },
      );

      // Generate public URL for the image [[memory:2836404]]
      const imageUrl = `${this.serverUrl}/api/events/images/${objectKey}`;

      this.logger.log(`Stored event image for event ${eventId} at ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      this.logger.error(
        `Failed to store event image for ${eventId}: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async getEventImageStream(objectKey: string) {
    try {
      this.logger.debug(`Retrieving image stream for key: ${objectKey}`);
      this.logger.debug(`From bucket: ${this.bucketName}`);

      // First check if the object exists
      try {
        const stat = await this.minioService.client.statObject(
          this.bucketName,
          objectKey,
        );
        this.logger.debug(
          `Object found - Size: ${stat.size}, Type: ${stat.metaData?.['content-type']}`,
        );
      } catch (statError) {
        this.logger.error(`Object not found: ${objectKey}`, statError);
        throw new Error(
          `Object ${objectKey} does not exist in bucket ${this.bucketName}`,
        );
      }

      const stream = await this.minioService.client.getObject(
        this.bucketName,
        objectKey,
      );

      this.logger.debug(`Successfully retrieved stream for: ${objectKey}`);
      return stream;
    } catch (error) {
      this.logger.error(`Failed to get event image: ${error.message}`, {
        objectKey,
        bucketName: this.bucketName,
        error: error.stack,
      });
      throw error;
    }
  }

  async deleteEventImages(
    organizationId: string,
    eventId: string,
  ): Promise<void> {
    try {
      const prefix = `organizations/${organizationId}/events/${eventId}/images/`;

      this.logger.debug(`Deleting images with prefix: ${prefix}`);

      // List all objects with the event's image prefix
      const objectsList = await this.listObjects(prefix);

      if (objectsList.length === 0) {
        this.logger.log(`No images found for event ${eventId}`);
        return;
      }

      // Delete each object
      for (const obj of objectsList) {
        await this.minioService.client.removeObject(this.bucketName, obj.name);
        this.logger.debug(`Deleted image: ${obj.name}`);
      }

      this.logger.log(
        `Deleted ${objectsList.length} images for event ${eventId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete event images: ${error.message}`,
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

      stream.on('data', (obj) => {
        this.logger.debug(`Found object: ${obj.name}`);
        objects.push(obj);
      });
      stream.on('error', (err) => {
        this.logger.error(`Error listing objects: ${err.message}`, err);
        reject(err);
      });
      stream.on('end', () => {
        this.logger.debug(
          `Listed ${objects.length} objects with prefix: ${prefix}`,
        );
        resolve(objects);
      });
    });
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
  }

  /**
   * Checks if image storage is properly configured and accessible
   * @returns Object with status and optional error message
   */
  async checkStorageConnection(): Promise<{
    isConnected: boolean;
    message?: string;
  }> {
    try {
      // Try to check if bucket exists as a simple connectivity test
      await this.minioService.client.bucketExists(this.bucketName);
      this.logger.debug(`Image storage connection check successful`);
      return { isConnected: true };
    } catch (error) {
      this.logger.error(
        `MinIO connection check failed: ${error.message}`,
        error,
      );
      return {
        isConnected: false,
        message: `Storage connection failed: ${error.message}`,
      };
    }
  }
}
