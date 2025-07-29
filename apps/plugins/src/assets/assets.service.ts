import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AssetsService {
  private s3Client: AWS.S3;

  constructor(private configService: ConfigService) {
    // Initialize S3 client with options that work for both AWS S3 and MinIO
    this.s3Client = new AWS.S3({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      // Add MinIO specific configuration
      endpoint: configService.get('S3_ENDPOINT'), // MinIO server URL
      s3ForcePathStyle: true, // Needed for MinIO
      signatureVersion: 'v4',
    });
  }

  async uploadPluginAsset(
    pluginId: string,
    fileName: string,
    fileContent: Buffer,
    contentType: string,
    version: string = '1.0.0',
  ): Promise<string> {
    const bucket = this.configService.get('PLUGIN_ASSETS_BUCKET');
    const key = `${pluginId}/v${version}/${fileName}`;

    await this.s3Client
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    // Return API server proxy URL with correct /api prefix and versioning
    const apiServerUrl = this.configService.get('API_SERVER_URL', 'http://localhost:4000');
    return `${apiServerUrl}/api/plugins/bundles/${key}`;
  }

  getPluginAssetUrl(pluginId: string, fileName: string): Promise<string> {
    const bucket = this.configService.get('PLUGIN_ASSETS_BUCKET');
    const key = `${pluginId}/${fileName}`;

    // Generate a pre-signed URL for the asset
    const signedUrl = this.s3Client.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 3600, // URL expires in 1 hour
    });

    return Promise.resolve(signedUrl);
  }

  async deletePluginAssets(pluginId: string): Promise<void> {
    const bucket = this.configService.get('PLUGIN_ASSETS_BUCKET');
    const prefix = `plugins/${pluginId}/`;

    // List all objects with the plugin's prefix
    const listedObjects = await this.s3Client
      .listObjectsV2({
        Bucket: bucket,
        Prefix: prefix,
      })
      .promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return;
    }

    // Create a delete request for each object
    const deleteParams: AWS.S3.DeleteObjectsRequest = {
      Bucket: bucket,
      Delete: {
        Objects: listedObjects.Contents.map((object) => ({
          Key: object.Key,
        })),
      },
    };

    // Delete the objects
    await this.s3Client.deleteObjects(deleteParams).promise();

    // Check if there are more objects to delete (pagination)
    if (listedObjects.IsTruncated) {
      await this.deletePluginAssets(pluginId);
    }
  }
}
