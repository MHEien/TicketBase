import axios from "axios";
import * as AuthController from "../generated/api-client/AuthControllerClient";
import { setBaseUrl } from "../generated/api-client/helpers";
import type {
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthUser,
  SessionResponse,
} from "./types";

export class ServerAuthService {
  constructor(private baseUrl: string) {
    setBaseUrl(baseUrl);
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const response = await axios.post<{ user: AuthUser } & AuthTokens>(
      `${this.baseUrl}/auth/login`,
      credentials,
    );
    return {
      user: response.data.user,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      },
    };
  }

  async register(
    data: RegisterData,
  ): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const response = await axios.post<{ user: AuthUser } & AuthTokens>(
      `${this.baseUrl}/auth/register`,
      data,
    );
    return {
      user: response.data.user,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const response = await axios.post<AuthTokens>(
      `${this.baseUrl}/auth/refresh`,
      {
        refreshToken,
      },
    );
    return response.data;
  }

  async getSession(accessToken: string): Promise<AuthUser> {
    const response = await axios.get<SessionResponse>(
      `${this.baseUrl}/auth/session`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      role: response.data.role,
      permissions: response.data.permissions,
      organizationId: response.data.organizationId,
      departmentId: response.data.departmentId,
      lastActive: response.data.lastActive,
      onboardingCompleted: response.data.onboardingCompleted,
    };
  }

  async logout(accessToken: string): Promise<void> {
    await axios.post(
      `${this.baseUrl}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }
}
