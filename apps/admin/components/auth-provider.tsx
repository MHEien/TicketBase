import { auth } from "@/lib/auth";
import { AuthStatus } from "./ui/auth-status";

export async function AuthProvider() {
  const session = await auth();
  return <AuthStatus user={session?.user} />;
}
