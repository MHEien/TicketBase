import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import FormData from 'form-data';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { InstallPluginDto } from './dto/install-plugin.dto';
import {
  Plugin,
  InstalledPlugin,
  PluginStatus,
  PluginCategory,
  PluginInstallationResponse,
  PluginHealthStatus,
} from './types/plugin.types';

@Injectable()
export class PluginsProxyService {
  private readonly logger = new Logger(PluginsProxyService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private getPluginServerUrl(): string {
    const url = this.configService.get<string>('plugins.serverUrl');
    if (!url) {
      throw new InternalServerErrorException(
        'Plugin server URL not configured',
      );
    }
    return url;
  }

  private createAuthHeaders(authToken?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  }

  private handleHttpError(error: AxiosError, operation: string): never {
    this.logger.error(`${operation} failed:`, error.message);

    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      switch (status) {
        case 400:
          throw new BadRequestException(message);
        case 404:
          throw new NotFoundException(message);
        case 500:
        default:
          throw new InternalServerErrorException(
            `Plugin server error: ${message}`,
          );
      }
    }

    throw new InternalServerErrorException(
      `Failed to communicate with plugin server: ${error.message}`,
    );
  }

  async create(createPluginDto: CreatePluginDto): Promise<Plugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins`;
      const response = await firstValueFrom(
        this.httpService.post<Plugin>(url, createPluginDto).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, 'Create plugin');
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, 'Create plugin');
      }
      throw error;
    }
  }

  async findAll(status?: PluginStatus): Promise<Plugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/available`;
      const params = status ? { status } : {};
      const response = await firstValueFrom(
        this.httpService.get<Plugin[]>(url, { params }).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, 'Find all plugins');
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, 'Find all plugins');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<Plugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}`;
      const response = await firstValueFrom(
        this.httpService.get<Plugin>(url).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Find plugin ${id}`);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Find plugin ${id}`);
      }
      throw error;
    }
  }

  async update(id: string, updatePluginDto: UpdatePluginDto): Promise<Plugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}`;
      const response = await firstValueFrom(
        this.httpService.patch<Plugin>(url, updatePluginDto).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Update plugin ${id}`);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Update plugin ${id}`);
      }
      throw error;
    }
  }

  async deprecate(id: string): Promise<Plugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/deprecate`;
      const response = await firstValueFrom(
        this.httpService.patch<Plugin>(url).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Deprecate plugin ${id}`);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Deprecate plugin ${id}`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Plugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}`;
      const response = await firstValueFrom(
        this.httpService.delete<Plugin>(url).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Remove plugin ${id}`);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Remove plugin ${id}`);
      }
      throw error;
    }
  }

  async findByCategory(category: PluginCategory): Promise<Plugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/available`;
      const response = await firstValueFrom(
        this.httpService.get<Plugin[]>(url, { params: { category } }).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Find plugins by category ${category}`);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Find plugins by category ${category}`);
      }
      throw error;
    }
  }

  async findByExtensionPoint(extensionPoint: string): Promise<Plugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/available`;
      const response = await firstValueFrom(
        this.httpService
          .get<Plugin[]>(url, { params: { extensionPoint } })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Find plugins by extension point ${extensionPoint}`,
              );
              throw error;
            }),
          ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Find plugins by extension point ${extensionPoint}`,
        );
      }
      throw error;
    }
  }

  async installPlugin(
    installPluginDto: InstallPluginDto,
    authToken?: string,
  ): Promise<PluginInstallationResponse> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/install`;
      const headers = this.createAuthHeaders(authToken);

      // Only send pluginId to the plugins server - it gets tenant info from JWT
      const pluginServerPayload = {
        pluginId: installPluginDto.pluginId,
      };

      this.logger.debug('🔧 Installing plugin on plugin server:', {
        url,
        originalPluginId: installPluginDto.pluginId,
        pluginIdType: typeof installPluginDto.pluginId,
        pluginIdLength: installPluginDto.pluginId?.length,
        organizationId: installPluginDto.organizationId,
        hasAuthToken: !!authToken,
        payload: pluginServerPayload,
        payloadStringified: JSON.stringify(pluginServerPayload),
        headers: {
          ...headers,
          Authorization: headers.Authorization ? '[REDACTED]' : undefined,
        },
      });

      const response = await firstValueFrom(
        this.httpService
          .post<PluginInstallationResponse>(url, pluginServerPayload, {
            headers,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('❌ Plugin installation failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                url,
                pluginId: installPluginDto.pluginId,
              });
              this.handleHttpError(
                error,
                `Install plugin ${installPluginDto.pluginId}`,
              );
              throw error;
            }),
          ),
      );

      this.logger.debug('✅ Plugin installation successful:', {
        status: response.status,
        pluginId: installPluginDto.pluginId,
        organizationId: installPluginDto.organizationId,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Install plugin ${installPluginDto.pluginId}`,
        );
      }
      throw error;
    }
  }

  async uninstallPlugin(id: string, authToken?: string): Promise<void> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/uninstall`;
      const headers = this.createAuthHeaders(authToken);

      // Only send pluginId to the plugins server - it gets tenant info from JWT
      const pluginServerPayload = { pluginId: id };

      await firstValueFrom(
        this.httpService.post(url, pluginServerPayload, { headers }).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Uninstall plugin ${id}`);
            throw error;
          }),
        ),
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Uninstall plugin ${id}`);
      }
      throw error;
    }
  }

  async togglePluginStatus(
    id: string,
    enabled: boolean,
    authToken?: string,
  ): Promise<InstalledPlugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/status`;
      const headers = this.createAuthHeaders(authToken);
      const response = await firstValueFrom(
        this.httpService
          .put<InstalledPlugin>(url, { enabled }, { headers })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(error, `Toggle plugin status ${id}`);
              throw error;
            }),
          ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Toggle plugin status ${id}`);
      }
      throw error;
    }
  }

  async updatePluginConfiguration(
    id: string,
    configuration: Record<string, unknown>,
    authToken?: string,
  ): Promise<InstalledPlugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/config`;
      const headers = this.createAuthHeaders(authToken);
      const response = await firstValueFrom(
        this.httpService
          .put<InstalledPlugin>(url, configuration, { headers })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(error, `Update plugin configuration ${id}`);
              throw error;
            }),
          ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Update plugin configuration ${id}`);
      }
      throw error;
    }
  }

  async getInstalledPlugins(
    organizationId: string,
    authToken?: string,
  ): Promise<InstalledPlugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/installed`;
      const headers = this.createAuthHeaders(authToken);

      this.logger.debug('🔍 Fetching installed plugins from plugin server:', {
        url,
        organizationId,
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length,
        headers: {
          ...headers,
          Authorization: headers.Authorization ? '[REDACTED]' : undefined,
        },
      });

      const response = await firstValueFrom(
        this.httpService
          .get<InstalledPlugin[]>(url, {
            params: { organizationId },
            headers,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('❌ Plugin server request failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                url,
                organizationId,
              });
              this.handleHttpError(
                error,
                `Get installed plugins for organization ${organizationId}`,
              );
              throw error;
            }),
          ),
      );

      this.logger.debug('✅ Plugin server response received:', {
        status: response.status,
        dataLength: response.data?.length || 0,
        organizationId,
      });
      return response.data;
    } catch (error) {
      this.logger.error('❌ Failed to get installed plugins:', {
        error: error.message,
        organizationId,
        hasAuthToken: !!authToken,
      });
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Get installed plugins for organization ${organizationId}`,
        );
      }
      throw error;
    }
  }

  async getEnabledPlugins(
    organizationId: string,
    authToken?: string,
  ): Promise<InstalledPlugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/installed`;
      const headers = this.createAuthHeaders(authToken);
      const response = await firstValueFrom(
        this.httpService
          .get<InstalledPlugin[]>(url, {
            params: { organizationId, enabled: true },
            headers,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Get enabled plugins for organization ${organizationId}`,
              );
              throw error;
            }),
          ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Get enabled plugins for organization ${organizationId}`,
        );
      }
      throw error;
    }
  }

  async getPluginsByType(
    organizationId: string,
    type: PluginCategory,
    authToken?: string,
  ): Promise<InstalledPlugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/installed`;
      const headers = this.createAuthHeaders(authToken);
      const response = await firstValueFrom(
        this.httpService
          .get<InstalledPlugin[]>(url, {
            params: { organizationId, type },
            headers,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Get plugins by type ${type} for organization ${organizationId}`,
              );
              throw error;
            }),
          ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Get plugins by type ${type} for organization ${organizationId}`,
        );
      }
      throw error;
    }
  }

  async checkPluginServerHealth(): Promise<PluginHealthStatus> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/storage-health`;
      const response = await firstValueFrom(
        this.httpService.get<PluginHealthStatus>(url).pipe(
          catchError((error: AxiosError) => {
            this.logger.warn(
              'Plugin server health check failed:',
              error.message,
            );
            return Promise.resolve({
              data: {
                isConnected: false,
                message: `Plugin server unreachable: ${error.message}`,
                timestamp: new Date(),
              },
            } as any);
          }),
        ),
      );
      return {
        ...response.data,
        timestamp: new Date(),
      } as PluginHealthStatus;
    } catch (error) {
      return {
        isConnected: false,
        message: `Plugin server health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
    }
  }

  async uploadPluginStorage(
    file: Buffer,
    filename: string,
    pluginId: string,
    version: string,
    authToken?: string,
  ): Promise<{ bundleUrl: string; pluginId: string; version: string }> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/storage/upload`;

      // Create FormData for multipart upload
      const formData = new FormData();

      // Add the file as a stream
      formData.append('file', file, {
        filename,
        contentType: 'application/javascript',
      });
      formData.append('pluginId', pluginId);
      formData.append('version', version);

      // Create headers including the FormData boundary
      const headers = {
        ...formData.getHeaders(),
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      this.logger.debug('🔄 Uploading plugin to storage:', {
        url,
        pluginId,
        version,
        filename,
        fileSize: file.length,
        hasAuthToken: !!authToken,
      });

      const response = await firstValueFrom(
        this.httpService
          .post<{
            bundleUrl: string;
            pluginId: string;
            version: string;
          }>(url, formData, { headers })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('❌ Plugin storage upload failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                url,
                pluginId,
                version,
              });
              this.handleHttpError(error, `Upload plugin storage ${pluginId}`);
              throw error;
            }),
          ),
      );

      this.logger.debug('✅ Plugin storage upload successful:', {
        status: response.status,
        pluginId,
        version,
        bundleUrl: response.data.bundleUrl,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Upload plugin storage ${pluginId}`);
      }
      throw error;
    }
  }

  async createPluginMetadata(
    createPluginDto: {
      id: string;
      name: string;
      version: string;
      description: string;
      category: string;
      sourceCode: string;
      bundleUrl: string;
      requiredPermissions?: string[];
    },
    authToken?: string,
  ): Promise<Plugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins`;
      const headers = this.createAuthHeaders(authToken);

      this.logger.debug('🔄 Creating plugin metadata:', {
        url,
        pluginId: createPluginDto.id,
        name: createPluginDto.name,
        version: createPluginDto.version,
        bundleUrl: createPluginDto.bundleUrl,
        hasAuthToken: !!authToken,
      });

      const response = await firstValueFrom(
        this.httpService.post<Plugin>(url, createPluginDto, { headers }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error('❌ Plugin metadata creation failed:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message,
              url,
              pluginId: createPluginDto.id,
            });
            this.handleHttpError(
              error,
              `Create plugin metadata ${createPluginDto.id}`,
            );
            throw error;
          }),
        ),
      );

      this.logger.debug('✅ Plugin metadata creation successful:', {
        status: response.status,
        pluginId: createPluginDto.id,
        name: createPluginDto.name,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Create plugin metadata ${createPluginDto.id}`,
        );
      }
      throw error;
    }
  }
}
