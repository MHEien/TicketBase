import { createServerFn } from "@tanstack/react-start";
import { setCookie, getCookie } from "@tanstack/react-start/server";

export type AdminAuthData = {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  organizationId?: string;
  expiresAt?: number;
  timestamp: number;
};

const AUTH_COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Server function to set auth cookie
 */
export const setAuthServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      accessToken: string;
      refreshToken?: string;
      userId: string;
      email?: string;
      name?: string;
      role?: string;
      organizationId?: string;
      expiresAt?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const authData: AdminAuthData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
      organizationId: data.organizationId,
      expiresAt: data.expiresAt,
      timestamp: Date.now(),
    };

    const encodedData = btoa(JSON.stringify(authData));

    setCookie(AUTH_COOKIE_NAME, encodedData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return { success: true };
  });

/**
 * Server function to get auth data from cookie
 */
export const getAuthServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const cookieValue = getCookie(AUTH_COOKIE_NAME);
      if (!cookieValue) {
        return null;
      }

      const decodedData = atob(cookieValue);
      const authData: AdminAuthData = JSON.parse(decodedData);

      // Check if cookie is expired (7 days)
      const now = Date.now();
      const cookieAge = now - authData.timestamp;
      const maxAge = COOKIE_MAX_AGE * 1000; // Convert to milliseconds

      if (cookieAge > maxAge) {
        return null;
      }

      // Check if access token is expired based on expiresAt if available
      if (authData.expiresAt && Date.now() / 1000 > authData.expiresAt - 60) {
        return null; // Token expired or expires within 60 seconds
      }

      return authData;
    } catch (error) {
      console.error("Error parsing admin auth cookie:", error);
      return null;
    }
  },
);

/**
 * Server function to clear auth cookie
 */
export const clearAuthServerFn = createServerFn({ method: "POST" }).handler(
  async () => {
    setCookie(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return { success: true };
  },
);

/**
 * Client-side utility to read auth token from cookie
 * This is a fallback for client-side operations when localStorage is not available
 */
export function getAuthFromClientCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    // For client-side, we primarily use js-cookie or localStorage
    // This function is here for compatibility but may not work with httpOnly cookies
    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`),
    );

    if (!authCookie) {
      return null;
    }

    const cookieValue = authCookie.split("=")[1];
    if (!cookieValue) {
      return null;
    }

    // Note: HttpOnly cookies are not accessible via document.cookie
    // This function will only work if the cookie is not HttpOnly
    // For production, rely on server-side functions or client-side storage
    const decodedData = atob(decodeURIComponent(cookieValue));
    const authData: AdminAuthData = JSON.parse(decodedData);

    return authData.accessToken;
  } catch (error) {
    console.error("Error reading auth cookie on client:", error);
    return null;
  }
} 