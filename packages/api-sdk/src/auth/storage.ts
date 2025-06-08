import type { AuthTokens } from "./types";

const STORAGE_PREFIX = "auth_";

interface StorageOptions {
  useSecureCookies?: boolean;
  cookieDomain?: string;
}

class TokenStorage {
  private prefix: string;
  private useSecureCookies: boolean;
  private cookieDomain?: string;

  constructor(options: StorageOptions = {}) {
    this.prefix = STORAGE_PREFIX;
    this.useSecureCookies = options.useSecureCookies ?? process.env.NODE_ENV === "production";
    this.cookieDomain = options.cookieDomain;
  }

  private getCookieOptions(): string {
    const secure = this.useSecureCookies ? "; Secure" : "";
    const domain = this.cookieDomain ? `; Domain=${this.cookieDomain}` : "";
    const sameSite = this.useSecureCookies ? "; SameSite=Strict" : "";
    return `Path=/; HttpOnly${secure}${domain}${sameSite}`;
  }

  setTokens(tokens: AuthTokens | null): void {
    if (typeof window === "undefined") return;

    if (tokens) {
      // Store refresh token in HttpOnly cookie
      if (tokens.refreshToken) {
        document.cookie = `${this.prefix}refresh_token=${tokens.refreshToken}; ${this.getCookieOptions()}; Max-Age=2592000`; // 30 days
      }

      // Store access token in memory and localStorage for persistence
      if (tokens.accessToken) {
        try {
          localStorage.setItem(
            `${this.prefix}access_token`,
            tokens.accessToken
          );
        } catch (error) {
          console.error("Failed to store access token:", error);
        }
      }
    } else {
      // Clear all tokens
      document.cookie = `${this.prefix}refresh_token=; ${this.getCookieOptions()}; Max-Age=0`;
      try {
        localStorage.removeItem(`${this.prefix}access_token`);
      } catch (error) {
        console.error("Failed to remove access token:", error);
      }
    }
  }

  getTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null;

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem(`${this.prefix}access_token`);
      
      // Get refresh token from cookie
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const refreshToken = cookies[`${this.prefix}refresh_token`];

      if (!accessToken || !refreshToken) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        expiresIn: 0, // This will be recalculated when token is used
      };
    } catch (error) {
      console.error("Failed to get tokens:", error);
      return null;
    }
  }

  clearTokens(): void {
    this.setTokens(null);
  }
}

export const tokenStorage = new TokenStorage(); 