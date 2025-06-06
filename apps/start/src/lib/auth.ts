import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

// Add interface for registration data
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
}

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Better Auth configuration that integrates with your NestJS backend
export const auth = betterAuth({
  // Basic configuration
  appName: "Your App Name",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  
  // Trust your frontend and API domains
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:4000",
    process.env.NEXT_PUBLIC_API_URL,
    process.env.BETTER_AUTH_URL,
  ].filter(Boolean) as string[],

  // Use environment secret or generate one
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,

  // Since you're using your own NestJS backend, we'll use in-memory storage
  // and rely on your existing session management
  secondaryStorage: {
    get: async (key: string) => {
      // For session data, we'll let your NestJS backend handle it
      return null;
    },
    set: async (key: string, value: any, ttl?: number) => {
      // No-op since we're using your backend
    },
    delete: async (key: string) => {
      // No-op since we're using your backend
    },
  },

  // Session configuration to work with your NestJS backend
  session: {
    expiresIn: 900, // 15 minutes - matches your access token expiry
    updateAge: 300, // 5 minutes - more frequent updates for better UX
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes
    },
  },

  // Configure email/password to use your NestJS backend
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
      },
      permissions: {
        type: "string", // JSON string of permissions array
        required: false,
      },
      organizationId: {
        type: "string",
        required: true,
      },
      lastActive: {
        type: "date",
        required: false,
      },
      onboardingCompleted: {
        type: "boolean",
        required: false,
      },
    },
  },

  // Advanced configuration
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    generateId: () => {
      // Use crypto.randomUUID for better compatibility
      return crypto.randomUUID();
    },
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.COOKIE_DOMAIN,
    },
  },

  // Rate limiting
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60, // 1 minute
    max: 30, // 30 requests per minute
    customRules: {
      "/sign-in": {
        window: 60,
        max: 10, // Stricter for login attempts
      },
      "/sign-up": {
        window: 60,
        max: 5, // Stricter for registration
      },
    },
  },

  // Custom authentication hooks to integrate with your NestJS backend
  hooks: {
    before: async (inputContext) => {
      const { request, asResponse } = inputContext;
      // Add any pre-processing logic here
      console.log(`Auth request: ${request?.method} ${request?.url}`);
    },
  },

  // Error handling
  onAPIError: {
    throw: false, // Don't throw errors, handle them gracefully
    onError: (error, ctx) => {
      console.error("Better Auth error:", error);
      
      // Log detailed error information for debugging
      if (process.env.NODE_ENV !== "production") {
        console.error("Error context:", ctx);
      }
    },
    errorURL: "/auth/error",
  },

  // Plugins
  plugins: [
    // Bearer token plugin for API authentication
    bearer({
      // This will handle bearer token validation
      // We'll integrate it with your NestJS JWT validation
    }),
    // Next.js cookies plugin
      reactStartCookies(),
  ],

  // Database hooks to integrate with your NestJS backend
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          // Cast userData to our registration interface
          const registrationData: RegistrationData = {
            name: userData.name,
            email: userData.email,
            password: (userData as any).password, // We know this exists during registration
            organizationName: (userData as any).organizationName || `${userData.name}'s Organization`,
          };

          // Call your NestJS registration endpoint
          try {
            const response = await fetch(`${apiBaseUrl}/auth/register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(registrationData),
            });

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Registration failed: ${errorData}`);
            }

            const nestResult = await response.json();
            
            // Return the user data in Better Auth format
            return {
              data: {
                id: nestResult.user.id,
                name: nestResult.user.name,
                email: nestResult.user.email,
                role: nestResult.user.role,
                permissions: JSON.stringify(nestResult.user.permissions || []),
                organizationId: nestResult.organization.id,
                emailVerified: true, // Assuming auto-verified for now
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            };
          } catch (error) {
            console.error("NestJS registration error:", error);
            throw error;
          }
        },
      },
      update: {
        before: async (userData) => {
          // Handle user updates through your NestJS backend
          return { data: userData };
        },
      },
    },
    session: {
      create: {
        before: async (sessionData) => {
          // Let your NestJS backend handle session creation
          return { data: sessionData };
        },
      },
    },
  },
});

// Custom authentication functions that integrate with your NestJS backend
export const nestAuthHelpers = {
  // Sign in with your NestJS backend
  async signInWithNestJS(email: string, password: string) {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Login failed: ${errorData}`);
      }

      const result = await response.json();
      
      // Store tokens securely (you might want to use httpOnly cookies)
      if (typeof window !== "undefined") {
        // Store access token in memory or secure storage
        sessionStorage.setItem("accessToken", result.accessToken);
        sessionStorage.setItem("refreshToken", result.refreshToken);
      }

      return {
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
          permissions: result.permissions,
          organizationId: result.organizationId,
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
        },
      };
    } catch (error) {
      console.error("NestJS login error:", error);
      throw error;
    }
  },

  // Refresh token with your NestJS backend
  async refreshToken(refreshToken: string) {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Token refresh failed: ${errorData}`);
      }

      const result = await response.json();
      
      // Update stored tokens
      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", result.accessToken);
        sessionStorage.setItem("refreshToken", result.refreshToken);
      }

      return result;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  // Get current user session from NestJS backend
  async getCurrentUser(accessToken: string) {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get current user");
      }

      return await response.json();
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // Logout from NestJS backend
  async logout(accessToken: string, logoutAll: boolean = false) {
    try {
      const endpoint = logoutAll ? "/auth/logout-all" : "/auth/logout";
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Clear local tokens regardless of response
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      }

      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      // Clear tokens even if logout request fails
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      }
      return false;
    }
  },

  // Check token status (diagnostic)
  async checkTokenStatus(refreshToken: string) {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/check-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to check token status");
      }

      return await response.json();
    } catch (error) {
      console.error("Check token status error:", error);
      throw error;
    }
  },

  // Get session diagnostic info
  async getSessionInfo(accessToken: string) {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/session-info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get session info");
      }

      return await response.json();
    } catch (error) {
      console.error("Get session info error:", error);
      throw error;
    }
  },
};

// Type definitions for better TypeScript support
export interface NestJSUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId: string;
  lastActive?: Date;
  onboardingCompleted?: boolean;
}

export interface NestJSTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface NestJSAuthResult {
  user: NestJSUser;
  tokens: NestJSTokens;
}

// Export the auth instance
export default auth;