import { getSession } from "@repo/api-sdk";
import { AuthStatus } from "./auth-status";

export async function AuthProvider() {
  const session = await getSession();
  return <AuthStatus user={session} />;
}
