import { useSession } from "@tanstack/react-start/server";
import type { AuthControllerGetSessionQueryResult } from "@repo/api-sdk";

type SessionUser = {
    userEmail?: string
    userId?: string
    userName?: string
    userRole?: string
    organizationId?: string
    accessToken?: string
    refreshToken?: string
    permissions?: string[]
    expiresIn?: number
}

export function useAppSession() {
    return useSession<SessionUser>({
        password: process.env.AUTH_SECRET!,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        },
    });
}