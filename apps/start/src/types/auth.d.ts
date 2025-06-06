import { User } from "./department";

declare module "@repo/api-sdk/auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      permissions: string[];
      organizationId: string;
    } & Partial<User>;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User {
    id: string;
    role: string;
    permissions: string[];
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }

  interface AuthError {
    code: string;
    message: string;
    name: string;
  }

  interface SignInOptions {
    email: string;
    password: string;
    redirectTo?: string;
  }

  interface SignUpOptions {
    name: string;
    email: string;
    password: string;
    organizationName?: string;
    redirectTo?: string;
  }
}
