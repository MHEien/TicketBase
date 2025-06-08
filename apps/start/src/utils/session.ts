import { useSession } from "@tanstack/react-start/server";
import type { AuthUser } from "@repo/api-sdk";

type SessionUser = {
    userEmail: AuthUser["email"];
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