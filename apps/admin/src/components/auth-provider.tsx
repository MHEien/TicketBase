import { auth } from "@/lib/auth";
import { AuthStatus } from "./ui/auth-status";
import { authClient } from "@/lib/auth-client";

export async function AuthProvider() {
  const session = await authClient.getSession();
  return <AuthStatus user={session?.data?.user} />;
}
