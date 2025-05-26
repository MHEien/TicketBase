import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  /**
   * Get a plugin bundle by proxying the request to the plugins server
   */
  async getPluginBundle(pluginId: string): Promise<{
    file: StreamableFile;
    contentType: string;
    fileName: string;
  }> {
    const pluginServerUrl = this.configService.get<string>('plugins.serverUrl');

    if (!pluginServerUrl) {
      throw new InternalServerErrorException(
        'Plugin server URL not configured',
      );
    }

    try {
      this.logger.log(
        `Fetching plugin bundle from plugins server: ${pluginId}`,
      );

      const response = await firstValueFrom(
        this.httpService.get(
          `${pluginServerUrl}/api/plugins/${pluginId}/bundle`,
          {
            responseType: 'arraybuffer',
          },
        ),
      );

      // Extract filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${pluginId}-bundle.js`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      return {
        file: new StreamableFile(response.data),
        contentType:
          response.headers['content-type'] || 'application/javascript',
        fileName,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch plugin bundle from plugins server: ${error.message}`,
      );

      if (error.response?.status === 404) {
        throw new NotFoundException(`Plugin bundle for ${pluginId} not found`);
      }

      throw new InternalServerErrorException('Failed to fetch plugin bundle');
    }
  }
}
