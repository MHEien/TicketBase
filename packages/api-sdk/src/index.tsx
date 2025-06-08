// Re-export server-side utilities
export { ServerAuthService } from "./auth/server-auth";
export { AuthService } from "./auth/auth-service";
export {
  getSession,
  getUser,
  validateSession,
  refreshUserSession,
} from "./server";

// Re-export types
export type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthConfig,
  AuthState,
  AuthContextValue,
  SessionResponse,
  LoginResponse,
  TokenResponse,
} from "./auth/types";

// Re-export client-side components and hooks
export {
  AuthProvider,
  useAuth,
  useUser,
  useIsAuthenticated,
  useHasPermission,
  useHasRole,
  useSession,
} from "./auth/auth-context";

// Re-export generated API client
export * from "./generated/api-client";

// Re-export utility functions
export { decodeJwt } from "./auth/utils";
