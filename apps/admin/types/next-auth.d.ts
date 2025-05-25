import { DefaultSession } from "next-auth"
import { UserRole } from "@/lib/user-data"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      permissions: string[]
    } & DefaultSession["user"]
    accessToken: string
  }

  interface User {
    id: string
    role: string
    permissions: string[]
    accessToken: string
    refreshToken: string
    expiresAt: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    permissions: string[]
    accessToken: string
    refreshToken: string
    expiresAt: number
    error?: string
  }
} 