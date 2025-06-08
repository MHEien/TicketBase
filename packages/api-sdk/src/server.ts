import { ServerAuthService } from "./auth/server-auth";
import type { AuthUser, AuthTokens, LoginCredentials, RegisterData, LoginResponse, RegisterResponse } from "./auth/types";

let authService: ServerAuthService | null = null;

function getAuthService() {
  if (!authService) {
    const baseUrl =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4000";
    authService = new ServerAuthService(baseUrl);
  }
  return authService;
}

export async function getSession(
  accessToken?: string,
): Promise<AuthUser | null> {
  try {
    if (!accessToken) {
      const storedTokens =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("app_tokens")
          : null;
      if (!storedTokens) return null;
      const tokens = JSON.parse(storedTokens) as AuthTokens;
      accessToken = tokens.accessToken;
    }

    if (!accessToken) return null;

    const user = await getAuthService().getSession(accessToken);
    return user;
  } catch (error) {
    return null;
  }
}

export async function getUser(accessToken?: string): Promise<AuthUser | null> {
  return getSession(accessToken);
}

export async function validateSession(
  accessToken?: string,
  requiredRole?: string,
): Promise<{
  user: AuthUser | null;
  isValid: boolean;
  error?: string;
}> {
  try {
    const user = await getSession(accessToken);

    if (!user) {
      return {
        user: null,
        isValid: false,
        error: "session_expired",
      };
    }

    if (requiredRole && user.role !== requiredRole) {
      return {
        user,
        isValid: false,
        error: "unauthorized",
      };
    }

    return {
      user,
      isValid: true,
    };
  } catch (error) {
    return {
      user: null,
      isValid: false,
      error: "auth_error",
    };
  }
}

export async function refreshUserSession(refreshToken: string): Promise<{
  user: AuthUser | null;
  tokens: AuthTokens | null;
  error?: string;
}> {
  try {
    const tokens = await getAuthService().refreshTokens(refreshToken);
    const user = await getSession(tokens.accessToken);

    return {
      user,
      tokens,
    };
  } catch (error) {
    return {
      user: null,
      tokens: null,
      error: "refresh_failed",
    };
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await getAuthService().login(credentials);
  return response;
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await getAuthService().register(data);
  return response;
}