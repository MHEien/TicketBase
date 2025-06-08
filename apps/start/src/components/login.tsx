import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
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
import { useMutation } from "@tanstack/react-query";
import { loginFn } from "@/app/_authed";

type LoginSearchParams = {
  error?:
    | "session_expired"
    | "credentials_signin"
    | "invalid_credentials"
    | "auth_error";
};


const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login({ search }: { search: LoginSearchParams }) {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: async (ctx) => {
        if (!ctx.error) {
            await router.invalidate()
            router.navigate({ to: "/admin" })
            return
        }

        setLoginError(ctx.message || "Failed to sign in. Please check your credentials and try again.")
    },
    onError: (error) => {
        setLoginError(error.message || "Failed to sign in. Please check your credentials and try again.")
    }   
  })

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues, event?: React.FormEvent) {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log("Form submitted with:", { email: data.email });
    setLoginError(null);

    try {
      console.log("Calling login function...");
      loginMutation.mutateAsync({
        data: {
            email: data.email,
            password: data.password,
        }
      })


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
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
              }} 
              className="space-y-4"
            >
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
                        disabled={loginMutation.isPending}
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
                        disabled={loginMutation.isPending}
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
                disabled={loginMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit((data) => onSubmit(data))();
                }}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
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
