import { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/user-data";
import "next-auth";
import { User } from "./department";

declare module "next-auth" {
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
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    permissions: string[];
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
    lastRefreshAttempt?: number;
  }
}
