import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ApiConfig {
  baseURL: string;
  getAccessToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => void;
}

let axiosInstance: AxiosInstance | null = null;
let currentConfig: ApiConfig | null = null;

export const configureApi = (config: ApiConfig) => {
  currentConfig = config;
  axiosInstance = axios.create({
    baseURL: config.baseURL,
  });

  // Add request interceptor for authentication
  axiosInstance.interceptors.request.use(async (config) => {
    if (currentConfig?.getAccessToken) {
      const token = await currentConfig.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Add response interceptor for handling unauthorized errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && currentConfig?.onUnauthorized) {
        currentConfig.onUnauthorized();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    throw new Error('API client not configured. Call configureApi first.');
  }
  return axiosInstance;
}; 