import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { createAuthEndpoint } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { saveRefreshTokenBackup } from "./api/auth-api";

// Configure API URL based on environment
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Custom plugin to integrate with existing NestJS backend
export const nestjsBackendPlugin = (): BetterAuthPlugin => {
  return {
    id: "nestjs-backend",
    endpoints: {
      signInCredentials: createAuthEndpoint("/sign-in/credentials", {
        method: "POST",
      }, async (ctx) => {
        const { email, password } = ctx.body as { email: string; password: string };
        
        try {
          const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            console.error("Authentication failed:", await response.text());
            throw new Error("Invalid credentials");
          }

          const data = await response.json();

          const user = {
            id: data.id || data.sub,
            name: data.name,
            email: data.email,
            role: data.role,
            permissions: data.permissions || [],
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + (data.expiresIn || 900),
          };

          // Save refresh token backup for debugging in dev mode
          if (process.env.NODE_ENV !== "production") {
            saveRefreshTokenBackup(data.refreshToken);
          }

          return ctx.json({ user });
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      }),
      
      refreshToken: createAuthEndpoint("/refresh-token", {
        method: "POST",
      }, async (ctx) => {
        const { refreshToken } = ctx.body as { refreshToken: string };
        
        if (!refreshToken) {
          throw new Error("No refresh token provided");
        }

        try {
          console.log("Refreshing token, API URL:", apiBaseUrl);

          const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({ refreshToken }),
            credentials: "include",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Failed to refresh token: ${response.status} ${response.statusText}`,
              errorText,
            );
            throw new Error("Invalid refresh token");
          }

          const refreshedTokens = await response.json();
          console.log("Token refreshed successfully");

          // Save the new refresh token backup
          if (process.env.NODE_ENV !== "production" && refreshedTokens.refreshToken) {
            saveRefreshTokenBackup(refreshedTokens.refreshToken);
          }

          return ctx.json({
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken ?? refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + (refreshedTokens.expiresIn || 900),
          });
        } catch (error) {
          console.error("Error refreshing access token:", error);
          throw new Error("Token refresh failed");
        }
      }),
    },
  };
};

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:", // Use in-memory storage for sessions only
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    nestjsBackendPlugin(),
    reactStartCookies(), // Must be last plugin for Tanstack Start
  ],
});
