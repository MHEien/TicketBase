import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseURL?: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  onTokenExpired?: () => void | Promise<void>;
  onUnauthorized?: (error: AxiosError) => void | Promise<void>;
  onNetworkError?: (error: AxiosError) => void | Promise<void>;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
  originalError?: AxiosError;
}

export class ApiClient {
  private instance: AxiosInstance;
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || 'http://localhost:4000',
      getAccessToken: config.getAccessToken || (() => null),
      onTokenExpired: config.onTokenExpired || (() => {}),
      onUnauthorized: config.onUnauthorized || (() => {}),
      onNetworkError: config.onNetworkError || (() => {}),
      enableRetry: config.enableRetry ?? true,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
    };

    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token injection
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await this.config.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(this.transformError(error))
    );

    // Response interceptor for error handling and retries
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

        // Handle 401 - Token expired
        if (error.response?.status === 401) {
          await this.config.onTokenExpired();
          await this.config.onUnauthorized(error);
        }

        // Handle network errors and retries
        if (this.config.enableRetry && this.shouldRetry(error) && !originalRequest._retry) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          if (originalRequest._retryCount <= this.config.maxRetries) {
            await this.delay(this.config.retryDelay * originalRequest._retryCount);
            return this.instance(originalRequest);
          }
        }

        // Handle network errors
        if (!error.response) {
          await this.config.onNetworkError(error);
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    if (!error.response) {
      // Network error, retry
      return true;
    }

    const status = error.response.status;
    // Retry on 5xx errors and some 4xx errors (but not 401, 403, 404)
    return status >= 500 || status === 408 || status === 429;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private transformError(error: AxiosError): ApiError {
    const apiError: ApiError = new Error(error.message) as ApiError;
    apiError.status = error.response?.status;
    apiError.code = error.code;
    apiError.details = error.response?.data;
    apiError.originalError = error;

    // Add user-friendly messages
    if (!error.response) {
      apiError.message = 'Network error. Please check your connection.';
    } else if (error.response.status >= 500) {
      apiError.message = 'Server error. Please try again later.';
    } else if (error.response.status === 401) {
      apiError.message = 'Authentication required. Please log in.';
    } else if (error.response.status === 403) {
      apiError.message = 'Access denied. Insufficient permissions.';
    } else if (error.response.status === 404) {
      apiError.message = 'Resource not found.';
    } else if (error.response.status === 429) {
      apiError.message = 'Too many requests. Please try again later.';
    }

    return apiError;
  }

  // Method to make requests with the configured instance
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance(config);
    return response.data;
  }

  // Convenience methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Get the underlying axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  // Update configuration
  updateConfig(config: Partial<ApiClientConfig>) {
    Object.assign(this.config, config);
  }
}

// Create a default instance
export const defaultApiClient = new ApiClient(); 