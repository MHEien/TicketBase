import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiClient, defaultApiClient } from './api-client';

// Legacy axios instance for backwards compatibility
export const AXIOS_INSTANCE = Axios.create({ baseURL: 'http://localhost:4000' });

// Global API client instance
let globalApiClient: ApiClient = defaultApiClient;

// Function to set the global API client (useful for initialization)
export const setGlobalApiClient = (client: ApiClient): void => {
  globalApiClient = client;
};

// Function to get the current global API client
export const getGlobalApiClient = (): ApiClient => {
  return globalApiClient;
};

// Enhanced custom instance that uses our API client
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  
  // Use the global API client's axios instance
  const axiosInstance = globalApiClient.getAxiosInstance();
  
  const promise = axiosInstance({ 
    ...config, 
    cancelToken: source.token 
  }).then(({ data }) => data);

  // @ts-ignore - Add cancel method for React Query compatibility
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// Alternative instance that directly uses API client methods
export const apiInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return globalApiClient.request<T>(config);
};

export default customInstance;

export interface ErrorType<Error> extends AxiosError<Error> {}

// Re-export for convenience
export { ApiClient, defaultApiClient };