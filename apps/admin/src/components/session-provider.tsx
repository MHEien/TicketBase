// Re-export from the custom session provider to maintain compatibility
export { SessionProvider, useSession } from "@/lib/custom-session-provider";
export type {
  Session,
  SessionContextType,
  User,
} from "@/lib/custom-session-provider";
