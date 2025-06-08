export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  organizationId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
}

export interface ApiConfig {
  baseURL: string;
  storagePrefix?: string;
}
