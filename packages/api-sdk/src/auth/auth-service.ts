import axios, { AxiosInstance } from "axios";
import * as AuthController from "../generated/api-client/AuthControllerClient";
import { setBaseUrl } from "../generated/api-client/helpers";
import type {
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RegisterDto,
  TokenResponseDto,
} from "../generated/api-client";
import type {
  AuthConfig,
  AuthState,
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RegisterData,
  SessionResponse,
  LoginResponse,
  TokenResponse,
} from "./types";
import { decodeJwt } from "./utils";
import { tokenStorage } from "./storage";

export class AuthService {
  private config: Required<AuthConfig>;
  private state: AuthState = {
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
  };
  private refreshTimeout?: NodeJS.Timeout;
  private axiosInstance: AxiosInstance;

  constructor(config: AuthConfig = {}) {
    console.log("Initializing AuthService with config:", {
      baseUrl: config.baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
      enableAutoRefresh: config.enableAutoRefresh !== false,
      refreshBeforeExpiration: config.refreshBeforeExpiration || 60,
    });

    // Set default config values
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
      storageKeyPrefix: "auth",
      useSecureCookies: process.env.NODE_ENV === "production",
      enableAutoRefresh: true,
      refreshBeforeExpiration: 60,
      onAuthStateChange: () => {},
      onError: console.error,
      ...config,
    };

    // Create our own axios instance to avoid circular dependencies
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
    });

    // Set up interceptors
    this.setupAxiosInterceptors();

    // Set the base URL for the API client
    setBaseUrl(this.config.baseUrl);
    console.log("Set API client base URL to:", this.config.baseUrl);

    // Try to restore auth state from storage
    this.restoreAuthState();
  }

  private setupAxiosInterceptors() {
    this.axiosInstance.interceptors.request.use(async (config) => {
      const tokens = tokenStorage.getTokens();
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        console.log("Added authorization header to request");
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error("API request failed:", {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
        });

        if (error.response?.status === 401) {
          console.log("Received 401 response, clearing auth state");
          this.clearAuthState();
        }
        return Promise.reject(error);
      },
    );
  }

  async restoreAuthState(): Promise<void> {
    try {
      const storedTokens = tokenStorage.getTokens();
      if (!storedTokens) return;

      // Validate access token
      const decoded = decodeJwt(storedTokens.accessToken);
      if (!decoded || this.isTokenExpired(decoded.exp)) {
        // If access token is expired, try to refresh
        if (storedTokens.refreshToken) {
          await this.refreshTokens();
        } else {
          this.clearAuthState();
        }
        return;
      }

      // Set tokens and fetch user data
      this.setTokens(storedTokens);
      await this.fetchUser();
    } catch (error) {
      this.handleError(error);
      this.clearAuthState();
    }
  }

  private setTokens(tokens: AuthTokens | null) {
    this.state.tokens = tokens;
    tokenStorage.setTokens(tokens);

    if (tokens?.accessToken && this.config.enableAutoRefresh) {
      const decoded = decodeJwt(tokens.accessToken);
      if (decoded?.exp) {
        const expiresIn = decoded.exp * 1000 - Date.now();
        const refreshIn = Math.max(
          0,
          expiresIn - this.config.refreshBeforeExpiration * 1000,
        );

        if (this.refreshTimeout) {
          clearTimeout(this.refreshTimeout);
        }

        this.refreshTimeout = setTimeout(() => {
          this.refreshTokens().catch(this.handleError);
        }, refreshIn);

        console.log(
          "Refresh timer set for",
          new Date(Date.now() + refreshIn),
        );
      }
    } else if (!tokens) {
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
      }
    }
  }

  private isTokenExpired(exp?: number): boolean {
    if (!exp) return true;
    // Add 1 minute buffer
    return Date.now() >= exp * 1000 - 60000;
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.config.onAuthStateChange(this.state);
  }

  private handleError(error: any) {
    const errorObj = new Error(
      error.response?.data?.message || error.message || "An error occurred",
    );
    this.setState({ error: errorObj });
    this.config.onError(errorObj);
    throw errorObj;
  }

  private clearAuthState() {
    tokenStorage.clearTokens();
    this.setState({
      user: null,
      tokens: null,
      error: null,
    });
  }

  private async fetchUser(): Promise<void> {
    try {
      const response =
        (await AuthController.getSession()) as unknown as SessionResponse;
      if (response) {
        const user: AuthUser = {
          id: response.id,
          email: response.email,
          name: response.name,
          role: response.role,
          permissions: response.permissions,
          organizationId: response.organizationId,
          departmentId: response.departmentId,
          lastActive: response.lastActive,
          onboardingCompleted: response.onboardingCompleted,
        };
        this.setState({ user });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    console.log("Attempting login for email:", credentials.email);
    try {
      this.setState({ isLoading: true, error: null });

      const loginDto: LoginDto = {
        email: credentials.email,
        password: credentials.password,
        init: () => loginDto,
        toJSON: () => ({
          email: credentials.email,
          password: credentials.password,
        }),
      };

      console.log("Sending login request to API");
      const response = await AuthController.login(loginDto);
      console.log("Received login response:", { 
        success: !!response,
        hasAccessToken: !!response?.accessToken,
        hasRefreshToken: !!response?.refreshToken,
      });

      if (!response) {
        throw new Error("No response received from login endpoint");
      }

      // First set the tokens to ensure they're available immediately
      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      };

      // Validate tokens before storing
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error("Invalid token data received from server");
      }

      console.log("Setting tokens in state and storage");
      this.setTokens(tokens);

      // Then set user state
      const user: AuthUser = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        permissions: response.permissions,
        organizationId: response.organizationId,
      };

      this.setState({ user });

      console.log("Login successful, tokens stored and user state updated");
    } catch (error: any) {
      console.error("Login failed:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      this.handleError(error);
      // Clear any partial state on error
      this.clearAuthState();
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const registerDto: RegisterDto = {
        name: data.name,
        email: data.email,
        password: data.password,
        organizationName: data.organizationName || "",
        init: () => registerDto,
        toJSON: () => ({
          name: data.name,
          email: data.email,
          password: data.password,
          organizationName: data.organizationName || "",
        }),
      };

      const response = (await AuthController.register(
        registerDto,
      )) as unknown as TokenResponseDto;
      if (response) {
        const tokens: AuthTokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        };
        await this.setTokens(tokens);
        await this.fetchUser();
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async logout(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      if (this.state.tokens?.accessToken) {
        await AuthController.logout();
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.clearAuthState();
      this.setState({ isLoading: false });
    }
  }

  async refreshTokens(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const storedTokens = tokenStorage.getTokens();
      if (!storedTokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: storedTokens.refreshToken,
        init: () => refreshTokenDto,
        toJSON: () => ({
          refreshToken: storedTokens.refreshToken,
        }),
      };

      const response = (await AuthController.refreshToken(
        refreshTokenDto,
      )) as unknown as TokenResponseDto;

      if (response) {
        const tokens: AuthTokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        };

        // Validate tokens before storing
        if (!tokens.accessToken || !tokens.refreshToken) {
          throw new Error("Invalid token data received from server");
        }

        this.setTokens(tokens);
        await this.fetchUser();

        console.log("Tokens refreshed successfully");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearAuthState();
      this.handleError(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  getState(): AuthState {
    return this.state;
  }

  isAuthenticated(): boolean {
    return !!this.state.user && !!this.state.tokens?.accessToken;
  }

  getUser(): AuthUser | null {
    return this.state.user;
  }

  hasPermission(permission: string): boolean {
    const user = this.state.user;
    if (!user) return false;

    // Owner has all permissions
    if (user.role === "owner") return true;

    return user.permissions.some((p) => {
      // Check for exact match
      if (p === permission) return true;

      // Check for wildcard match
      const wildcard = p.endsWith(".*");
      if (wildcard) {
        const base = p.slice(0, -2);
        return permission.startsWith(base);
      }

      return false;
    });
  }

  hasRole(role: string): boolean {
    return this.state.user?.role === role;
  }
}
