import { createAuthClient } from "better-auth/client";
import type { BetterAuthClientPlugin } from "better-auth/client";
import type { nestjsBackendPlugin } from "./auth";

// Custom client plugin for NestJS backend integration
const nestjsBackendClientPlugin = (): BetterAuthClientPlugin => {
  return {
    id: "nestjs-backend",
    $InferServerPlugin: {} as ReturnType<typeof nestjsBackendPlugin>,
  };
};

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  plugins: [nestjsBackendClientPlugin()],
});

// Export hooks and functions for easier migration from NextAuth
export const { useSession } = authClient;

// Custom sign in function that matches NextAuth's signIn
export const signIn = async (
  provider: "credentials",
  options: {
    email: string;
    password: string;
    callbackUrl?: string;
    redirect?: boolean;
  }
) => {
  try {
    const result = await authClient.$fetch("/sign-in/credentials", {
      method: "POST",
      body: {
        email: options.email,
        password: options.password,
      },
    });

    if (result.error) {
      return {
        error: result.error,
        ok: false,
        status: 401,
        url: null,
      };
    }

    // Handle redirect
    if (options.redirect !== false && options.callbackUrl) {
      window.location.href = options.callbackUrl;
    }

    return {
      error: null,
      ok: true,
      status: 200,
      url: options.callbackUrl || null,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      error: "CredentialsSignin",
      ok: false,
      status: 401,
      url: null,
    };
  }
};

// Custom sign out function that matches NextAuth's signOut
export const signOut = async (options?: {
  callbackUrl?: string;
  redirect?: boolean;
}) => {
  try {
    await authClient.signOut();

    if (options?.redirect !== false && options?.callbackUrl) {
      window.location.href = options.callbackUrl;
    }

    return {
      url: options?.callbackUrl || "/login",
    };
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

// Function to get session (equivalent to NextAuth's getSession)
export const getSession = async () => {
  try {
    const session = await authClient.getSession();
    return session.data;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
};

export { authClient as default }; 