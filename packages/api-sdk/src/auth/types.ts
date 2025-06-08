import { UserRole } from "../generated/api-client";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  organizationId: string;
  departmentId?: string;
  lastActive?: Date;
  onboardingCompleted?: boolean;
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

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<AuthTokens>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export interface AuthConfig {
  /**
   * Base URL for the API
   * @default process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
   */
  baseUrl?: string;

  /**
   * Storage key prefix for auth data
   * @default 'auth'
   */
  storageKeyPrefix?: string;

  /**
   * Whether to use secure cookies in production
   * @default process.env.NODE_ENV === 'production'
   */
  useSecureCookies?: boolean;

  /**
   * Whether to enable automatic token refresh
   * @default true
   */
  enableAutoRefresh?: boolean;

  /**
   * Refresh token before expiration (in seconds)
   * @default 60
   */
  refreshBeforeExpiration?: number;

  /**
   * Callback when authentication state changes
   */
  onAuthStateChange?: (state: AuthState) => void;

  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
}

// Response types that match the actual API responses
export interface SessionResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  organizationId: string;
  departmentId?: string;
  lastActive?: Date;
  onboardingCompleted?: boolean;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface RegisterResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
