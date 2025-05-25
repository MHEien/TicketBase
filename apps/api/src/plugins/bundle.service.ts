import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plugin } from './entities/plugin.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as Minio from 'minio';
import { Readable } from 'stream';

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);
  private minioClient: Minio.Client;

  constructor(
    @InjectRepository(Plugin)
    private pluginsRepository: Repository<Plugin>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    // Initialize MinIO client
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>(
        'plugins.minioEndpoint',
        'localhost',
      ),
      port: this.configService.get<number>('plugins.minioPort', 9000),
      useSSL: this.configService.get<boolean>('plugins.minioUseSSL', false),
      accessKey: this.configService.get<string>('plugins.minioAccessKey', ''),
      secretKey: this.configService.get<string>('plugins.minioSecretKey', ''),
    });
  }

  /**
   * Get a plugin bundle as a streamable file
   */
  async getPluginBundle(pluginId: string): Promise<{
    file: StreamableFile;
    contentType: string;
    fileName: string;
  }> {
    // Find the plugin
    const plugin = await this.pluginsRepository.findOne({
      where: { id: pluginId },
    });

    if (!plugin) {
      throw new NotFoundException(`Plugin with ID ${pluginId} not found`);
    }

    // Construct expected file name and path
    const fileName = `${plugin.name}-${plugin.version}.js`;
    const minioBucket = this.configService.get<string>(
      'plugins.minioBucket',
      'plugins',
    );
    const minioObjectName = `${plugin.category}/${fileName}`;

    try {
      // Check if the plugin bundle exists in MinIO
      const stat = await this.minioClient
        .statObject(minioBucket, minioObjectName)
        .catch(() => null);

      if (stat) {
        this.logger.log(
          `Fetching plugin bundle from MinIO: ${minioObjectName}`,
        );

        // Get the object stream from MinIO
        const stream = await this.minioClient.getObject(
          minioBucket,
          minioObjectName,
        );

        // Convert to a NodeJS Readable stream for StreamableFile
        const readableStream = new Readable();
        readableStream._read = () => {}; // Required but unused

        // Pipe the MinIO stream to our readable stream
        stream.on('data', (chunk) => readableStream.push(chunk));
        stream.on('end', () => readableStream.push(null));
        stream.on('error', (err) => {
          this.logger.error(`Error streaming from MinIO: ${err.message}`);
          readableStream.destroy(err);
        });

        return {
          file: new StreamableFile(readableStream),
          contentType: 'application/javascript',
          fileName,
        };
      }
    } catch (error) {
      this.logger.error(`Error accessing MinIO: ${error.message}`);
      throw new InternalServerErrorException('Failed to access plugin storage');
    }

    // If the bundle isn't in MinIO, check if it's a direct URL
    if (plugin.bundleUrl.startsWith('http')) {
      try {
        this.logger.log(
          `Fetching remote plugin bundle from URL: ${plugin.bundleUrl}`,
        );
        const response = await firstValueFrom(
          this.httpService.get(plugin.bundleUrl, {
            responseType: 'arraybuffer',
          }),
        );

        return {
          file: new StreamableFile(response.data),
          contentType: 'application/javascript',
          fileName,
        };
      } catch (error) {
        this.logger.error(
          `Failed to fetch plugin bundle from URL: ${error.message}`,
        );
        throw new NotFoundException(
          `Plugin bundle for ${plugin.name} could not be retrieved`,
        );
      }
    }

    // If we get here, the bundle wasn't found
    throw new NotFoundException(
      `Plugin bundle for ${plugin.name} not found in storage or at URL`,
    );
  }
}
