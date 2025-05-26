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
  ): Promise<PluginInstallationResponse> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/install`;
      const response = await firstValueFrom(
        this.httpService
          .post<PluginInstallationResponse>(url, installPluginDto)
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Install plugin ${installPluginDto.pluginId}`,
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
          `Install plugin ${installPluginDto.pluginId}`,
        );
      }
      throw error;
    }
  }

  async uninstallPlugin(id: string): Promise<void> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/uninstall`;
      await firstValueFrom(
        this.httpService.post(url, { pluginId: id }).pipe(
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
  ): Promise<InstalledPlugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/status`;
      const response = await firstValueFrom(
        this.httpService.put<InstalledPlugin>(url, { enabled }).pipe(
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
  ): Promise<InstalledPlugin> {
    try {
      const url = `${this.getPluginServerUrl()}/plugins/${id}/config`;
      const response = await firstValueFrom(
        this.httpService.put<InstalledPlugin>(url, configuration).pipe(
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
      const response = await firstValueFrom(
        this.httpService
          .get<InstalledPlugin[]>(url, {
            params: { organizationId },
            headers,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleHttpError(
                error,
                `Get installed plugins for organization ${organizationId}`,
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
}
