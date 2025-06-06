export * from './config';
export * from './generated/api-client';

// Re-export the axios factory for the generated client
import { getAxiosInstance } from './config';
import { setAxiosFactory } from './generated/api-client';

// Configure the generated client to use our axios instance
setAxiosFactory(getAxiosInstance); 