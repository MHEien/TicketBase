import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BundleProxyService {
  private readonly logger = new Logger(BundleProxyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async proxyBundleRequest(path: string): Promise<StreamableFile> {
    try {
      const pluginServerUrl =
        this.configService.get<string>('plugins.serverUrl');

      if (!pluginServerUrl) {
        throw new Error('Plugin server URL not configured');
      }

      this.logger.debug(`Proxying bundle request: ${path}`);
      this.logger.debug(`Plugin server URL: ${pluginServerUrl}`);

      // Construct the target URL - make sure it matches the plugin server's route
      const targetUrl = `${pluginServerUrl}/plugins/bundles/${path}`;

      this.logger.debug(`Target URL: ${targetUrl}`);

      const response = await firstValueFrom(
        this.httpService.get(targetUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: {
            Accept: 'application/javascript, */*',
          },
        }),
      );

      this.logger.debug(`Successfully proxied bundle request for: ${path}`);

      return new StreamableFile(response.data);
    } catch (error) {
      this.logger.error(
        `Error proxying bundle request for path ${path}: ${error.message}`,
      );
      this.logger.error(`Error details:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data?.toString?.(),
        url: error.config?.url,
      });

      throw new NotFoundException(`Bundle not found: ${error.message}`);
    }
  }
}
