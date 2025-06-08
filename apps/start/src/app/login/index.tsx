import { useState } from "react";
import Link from "next/link";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@repo/api-sdk";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Alert, AlertDescription } from "@repo/ui/alert";

type LoginSearchParams = {
  error?:
    | "session_expired"
    | "credentials_signin"
    | "invalid_credentials"
    | "auth_error";
};

export const Route = createFileRoute({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
    return {
      error: search.error as LoginSearchParams["error"],
    };
  },
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  console.log("Auth context state:", {
    isLoading: auth.isLoading,
    hasLogin: !!auth.login,
    hasUser: !!auth.user,
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const search = Route.useSearch();

  async function onSubmit(data: LoginFormValues) {
    console.log("Form submitted with:", { email: data.email });
    setLoginError(null);

    if (!auth.login) {
      console.error("Login function is not available in auth context");
      setLoginError("Authentication service is not available");
      return;
    }

    try {
      console.log("Calling login function...");
      await auth.login({
        email: data.email,
        password: data.password,
      });

      console.log("Login successful, checking auth state:", {
        user: !!auth.user,
        tokens: !!auth.tokens,
      });

      // If we get here, login was successful
      router.navigate({ to: "/admin" });
    } catch (error: any) {
      console.error("Login error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Set a user-friendly error message
      setLoginError(
        error.message ||
          "Failed to sign in. Please check your credentials and try again.",
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Sign in to your account
          </CardTitle>
          <CardDescription>
            Enter your email and password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {(search.error || loginError) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {loginError || getErrorMessage(search.error)}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        autoComplete="email"
                        disabled={auth.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        autoComplete="current-password"
                        disabled={auth.isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={auth.isLoading}
                onClick={() => console.log("Submit button clicked")}
              >
                {auth.isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function getErrorMessage(error: LoginSearchParams["error"]) {
  switch (error) {
    case "session_expired":
      return "Your session has expired. Please sign in again.";
    case "invalid_credentials":
      return "Invalid email or password.";
    case "auth_error":
      return "An error occurred during authentication. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}
