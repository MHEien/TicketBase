// Custom authentication implementation for NestJS backend integration
// Maintains API compatibility with Better Auth while working directly with backend
import Cookies from "js-cookie";

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  organizationId?: string;
}

interface Session {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface LoginResponse {
  id: string;
  name?: string;
  email: string;
  role?: string;
  permissions?: string[];
  organizationId?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface SignInResult {
  error?: string;
  ok: boolean;
  status: number;
  url: string | null;
}

interface SignOutResult {
  url: string;
}

// Token storage keys
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_DATA_KEY = "auth_user_data";
const EXPIRES_AT_KEY = "auth_expires_at";

// Get API base URL
const getApiBaseUrl = () =>
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Secure token storage utilities
class TokenStorage {
  static setTokens(tokens: AuthTokens, user: User): void {
    if (typeof window === "undefined") return;

    const expiresAt = Math.floor(Date.now() / 1000) + tokens.expiresIn;

    // Set cookies with secure attributes
    Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
      secure: true,
      sameSite: "strict",
      expires: 7, // days
    });
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
      secure: true,
      sameSite: "strict",
      expires: 30, // days
    });
    Cookies.set(USER_DATA_KEY, JSON.stringify(user), {
      secure: true,
      sameSite: "strict",
      expires: 7, // days
    });
    Cookies.set(EXPIRES_AT_KEY, expiresAt.toString(), {
      secure: true,
      sameSite: "strict",
      expires: 7, // days
    });
  }

  static getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userData = Cookies.get(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static getExpiresAt(): number | null {
    if (typeof window === "undefined") return null;
    const expiresAt = Cookies.get(EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  static isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;

    // Consider token expired if it expires within the next 60 seconds
    return Date.now() / 1000 > expiresAt - 60;
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;

    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_DATA_KEY);
    Cookies.remove(EXPIRES_AT_KEY);
  }

  static hasValidSession(): boolean {
    return !!(
      this.getAccessToken() &&
      this.getUser() &&
      !this.isTokenExpired()
    );
  }
}

// Main auth class
class CustomAuth {
  private refreshPromise: Promise<AuthTokens> | null = null;

  // Sign in with credentials
  async signIn(
    provider: "credentials",
    options: {
      email: string;
      password: string;
      callbackUrl?: string;
      redirect?: boolean;
    },
  ): Promise<SignInResult> {
    try {
      console.log("Signing in with custom auth...");

      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: options.email,
          password: options.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Authentication failed:", errorText);

        return {
          error: "CredentialsSignin",
          ok: false,
          status: response.status,
          url: null,
        };
      }

      const data: LoginResponse = await response.json();

      // Store tokens and user data
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        permissions: data.permissions || [],
        organizationId: data.organizationId,
      };

      TokenStorage.setTokens(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn || 900,
        },
        user,
      );

      console.log("Sign in successful");

      // Handle redirect
      if (options.redirect !== false && options.callbackUrl) {
        window.location.href = options.callbackUrl;
      }

      return {
        error: undefined,
        ok: true,
        status: 200,
        url: options.callbackUrl || null,
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        error: "CredentialsSignin",
        ok: false,
        status: 500,
        url: null,
      };
    }
  }

  // Sign out
  async signOut(options?: {
    callbackUrl?: string;
    redirect?: boolean;
  }): Promise<SignOutResult> {
    try {
      console.log("Signing out with custom auth...");

      // Clear cookies
      TokenStorage.clearTokens();

      // Optionally call backend logout endpoint
      const refreshToken = TokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          await fetch(`${getApiBaseUrl()}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({ refreshToken }),
          });
        } catch (error) {
          console.warn(
            "Backend logout failed, but continuing with client logout:",
            error,
          );
        }
      }

      const redirectUrl = options?.callbackUrl || "/login";

      if (options?.redirect !== false) {
        window.location.href = redirectUrl;
      }

      return { url: redirectUrl };
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear tokens even if backend call fails
      TokenStorage.clearTokens();

      const redirectUrl = options?.callbackUrl || "/login";
      if (options?.redirect !== false) {
        window.location.href = redirectUrl;
      }

      return { url: redirectUrl };
    }
  }

  // Refresh access token
  private async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = TokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("Refreshing tokens...");

    const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token refresh failed:", response.status, errorText);

      // Clear invalid tokens
      TokenStorage.clearTokens();
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    console.log("Tokens refreshed successfully");

    const tokens: AuthTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || refreshToken,
      expiresIn: data.expiresIn || 900,
    };

    // Update stored tokens
    const user = TokenStorage.getUser();
    if (user) {
      TokenStorage.setTokens(tokens, user);
    }

    return tokens;
  }

  // Get current session
  async getSession(): Promise<{ data: Session | null }> {
    try {
      // Check if we have a valid session
      if (!TokenStorage.hasValidSession()) {
        // Try to refresh tokens if we have a refresh token
        const refreshToken = TokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            // Prevent multiple simultaneous refresh requests
            if (!this.refreshPromise) {
              this.refreshPromise = this.refreshTokens();
            }

            await this.refreshPromise;
            this.refreshPromise = null;
          } catch (error) {
            console.error("Failed to refresh session:", error);
            this.refreshPromise = null;
            return { data: null };
          }
        } else {
          return { data: null };
        }
      }

      const user = TokenStorage.getUser();
      const accessToken = TokenStorage.getAccessToken();
      const refreshToken = TokenStorage.getRefreshToken();
      const expiresAt = TokenStorage.getExpiresAt();

      if (!user || !accessToken) {
        return { data: null };
      }

      const session: Session = {
        user,
        accessToken,
        refreshToken: refreshToken || undefined,
        expiresAt: expiresAt || undefined,
      };

      return { data: session };
    } catch (error) {
      console.error("Get session error:", error);
      return { data: null };
    }
  }

  // Get session for external use (matches Better Auth API)
  async getSessionData(): Promise<Session | null> {
    const result = await this.getSession();
    return result.data;
  }

  // Get session with data wrapper (for compatibility with existing code)
  async getSessionWithData(): Promise<{ data: Session | null }> {
    return await this.getSession();
  }
}

// Create singleton instance
const customAuth = new CustomAuth();

// Create an auth client that matches Better Auth API exactly
export const authClient = {
  signIn: customAuth.signIn.bind(customAuth),
  signOut: customAuth.signOut.bind(customAuth),
  getSession: customAuth.getSession.bind(customAuth), // Returns { data: Session | null }
};

// Export functions that match NextAuth API
export const signIn = customAuth.signIn.bind(customAuth);
export const signOut = customAuth.signOut.bind(customAuth);
export const getSession = customAuth.getSessionData.bind(customAuth); // Returns Session | null

export default customAuth;
