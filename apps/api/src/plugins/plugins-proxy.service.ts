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
import { Blob } from 'buffer';
import { FormData } from 'undici';
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

  /**
   * Proxy plugin bundle request to plugin server
   */
  async getPluginBundle(bundlePath: string): Promise<string> {
    try {
      this.logger.debug(`🔄 Proxying plugin bundle request: ${bundlePath}`);
      
      const pluginServerUrl = this.getPluginServerUrl();
      const bundleUrl = `${pluginServerUrl}/plugins/bundles/${bundlePath}`;
      
      const response = await firstValueFrom(
        this.httpService.get(bundleUrl, {
          responseType: 'text',
          headers: {
            'Accept': 'application/javascript, text/javascript, */*',
          },
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`❌ Failed to proxy plugin bundle: ${error.message}`, {
              bundlePath,
              status: error.response?.status,
              statusText: error.response?.statusText,
            });
            throw error;
          })
        )
      );

      this.logger.debug(`✅ Successfully proxied plugin bundle: ${bundlePath}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Plugin bundle not found: ${bundlePath}`);
      }
      
      this.logger.error(`❌ Error proxying plugin bundle: ${error.message}`, {
        bundlePath,
        error: error.stack,
      });
      
      throw new InternalServerErrorException(`Failed to load plugin bundle: ${error.message}`);
    }
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

  async getPluginConfiguration(
    id: string,
    authToken?: string,
  ): Promise<Record<string, any>> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/config`;
      const headers = this.createAuthHeaders(authToken);
      const response = await firstValueFrom(
        this.httpService.get<Record<string, any>>(url, { headers }).pipe(
          catchError((error: AxiosError) => {
            this.handleHttpError(error, `Get plugin configuration ${id}`);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Get plugin configuration ${id}`);
      }
      throw error;
    }
  }

  async savePluginConfiguration(
    id: string,
    configuration: Record<string, any>,
    authToken?: string,
  ): Promise<Record<string, any>> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/config`;
      const headers = this.createAuthHeaders(authToken);
      const response = await firstValueFrom(
        this.httpService
          .put<Record<string, any>>(url, configuration, { headers })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(error, `Save plugin configuration ${id}`);
              throw error;
            }),
          ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Save plugin configuration ${id}`);
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

  // Public endpoints for organization plugin data (no auth required)
  async getEnabledPluginsPublic(
    organizationId: string,
    extensionPoint?: string,
  ): Promise<InstalledPlugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/public/organizations/enabled`;
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);
      if (extensionPoint) {
        params.append('extensionPoint', extensionPoint);
      }

      const response = await firstValueFrom(
        this.httpService
          .get<InstalledPlugin[]>(`${url}?${params.toString()}`)
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Get enabled plugins for organization ${organizationId} (public)`,
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
          `Get enabled plugins for organization ${organizationId} (public)`,
        );
      }
      throw error;
    }
  }

  async getPaymentPluginsPublic(
    organizationId: string,
  ): Promise<InstalledPlugin[]> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/public/organizations/payment`;
      const params = new URLSearchParams();
      params.append('organizationId', organizationId);

      const response = await firstValueFrom(
        this.httpService
          .get<InstalledPlugin[]>(`${url}?${params.toString()}`)
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Get payment plugins for organization ${organizationId} (public)`,
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
          `Get payment plugins for organization ${organizationId} (public)`,
        );
      }
      throw error;
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

      // Create a Blob from the buffer
      const blob = new Blob([file], { type: 'application/javascript' });

      // Add the file as a blob
      formData.append('file', blob, filename);
      formData.append('pluginId', pluginId);
      formData.append('version', version);

      // Create headers
      const headers: Record<string, string> = {};

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
            remoteEntryUrl?: string;
            bundleUrl?: string; // Keep for backward compatibility
            pluginId: string;
            version: string;
            metadata?: {
              federationName: string;
              exposes: Record<string, string>;
              shared: Record<string, any>;
            };
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
        bundleUrl: response.data.remoteEntryUrl || response.data.bundleUrl,
        federationMetadata: response.data.metadata,
      });

      // Return bundleUrl for backward compatibility, but use remoteEntryUrl if available
      return {
        ...response.data,
        bundleUrl: response.data.remoteEntryUrl || response.data.bundleUrl || '',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Upload plugin storage ${pluginId}`);
      }
      throw error;
    }
  }

  async executePluginAction(
    tenantId: string,
    pluginId: string,
    action: string,
    parameters: any,
    metadata?: any,
    authToken?: string,
  ): Promise<any> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${pluginId}/actions`;
      const headers = this.createAuthHeaders(authToken);

      this.logger.debug('🔄 Executing plugin action:', {
        url,
        pluginId,
        action,
        tenantId,
        hasAuthToken: !!authToken,
      });

      const response = await firstValueFrom(
        this.httpService
          .post<any>(
            url,
            {
              action,
              parameters,
              metadata,
            },
            { headers },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('❌ Plugin action execution failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                url,
                pluginId,
                action,
              });
              this.handleHttpError(
                error,
                `Execute plugin action ${pluginId}:${action}`,
              );
              throw error;
            }),
          ),
      );

      this.logger.debug('✅ Plugin action execution successful:', {
        status: response.status,
        pluginId,
        action,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(
          error,
          `Execute plugin action ${pluginId}:${action}`,
        );
      }
      throw error;
    }
  }

  async uploadPluginForBuild(
    file: Buffer,
    filename: string,
    authToken?: string,
  ): Promise<{
    success: boolean;
    bundleUrl: string;
    fileName: string;
    pluginId: string;
    version: string;
    metadata: any;
    buildInfo: any;
  }> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/build`;

      // Create FormData for multipart upload
      const formData = new FormData();

      // Create a Blob from the buffer
      const blob = new Blob([file], { type: 'application/zip' });

      // Add the file as a blob
      formData.append('plugin', blob, filename);

      // Create headers
      const headers: Record<string, string> = {};

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      this.logger.debug('🔄 Uploading plugin for build:', {
        url,
        filename,
        fileSize: file.length,
        hasAuthToken: !!authToken,
      });

      const response = await firstValueFrom(
        this.httpService
          .post<{
            success: boolean;
            remoteEntryUrl?: string;
            bundleUrl?: string; // Keep for backward compatibility
            fileName: string;
            pluginId: string;
            version: string;
            metadata: any;
            buildInfo: any;
          }>(url, formData, { headers })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error('❌ Plugin build upload failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                url,
                filename,
              });
              this.handleHttpError(error, `Upload plugin for build ${filename}`);
              throw error;
            }),
          ),
      );

      this.logger.debug('✅ Plugin build upload successful:', {
        status: response.status,
        filename,
        pluginId: response.data.pluginId,
        bundleUrl: response.data.remoteEntryUrl || response.data.bundleUrl,
      });

      // Return with bundleUrl for backward compatibility, using remoteEntryUrl if available
      return {
        ...response.data,
        bundleUrl: response.data.remoteEntryUrl || response.data.bundleUrl || '',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleHttpError(error, `Upload plugin for build ${filename}`);
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
      extensionPoints?: string[];
      configSchema?: any;
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
