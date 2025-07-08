import { Login } from "@/components/login";

type LoginSearchParams = {
  error?:
    | "session_expired"
    | "credentials_signin"
    | "invalid_credentials"
    | "auth_error";
};

export const Route = createFileRoute({
  component: LoginPage,

});

function LoginPage() {
  return <Login />;
}
