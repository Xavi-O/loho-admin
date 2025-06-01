// components/auth/LoginForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle URL error parameters
  useEffect(() => {
    const urlError = searchParams.get("error");
    const isDisabled = searchParams.get("disabled");
    
    if (urlError) {
      switch (urlError) {
        case "AccountDisabled":
          setError("Your account has been disabled. Please contact an administrator.");
          break;
        case "AccountPending":
          setError("Your account is pending approval by an administrator.");
          break;
        case "SessionRequired":
          setError("Please log in to access this page.");
          break;
        default:
          setError("An error occurred. Please try logging in again.");
      }
      // Clear the error from URL
      router.replace("/login", { scroll: false });
    }
    
    if (isDisabled === 'true') {
      setError("Your account has been disabled. Please contact an administrator.");
      // Clear the disabled parameter from URL
      router.replace("/login", { scroll: false });
    }
  }, [searchParams, router]);

    async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    
    console.log("🔍 Login attempt for:", data.email);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("🔍 SignIn result:", result);

      if (result?.error) {
        console.log("❌ SignIn error:", result.error);
        // Handle specific error messages
        switch (result.error) {
          case "Account has been disabled":
            setError("Your account has been disabled. Please contact an administrator.");
            break;
          case "Your account is pending approval by an administrator":
            setError("Your account is pending approval by an administrator.");
            break;
          case "No user found with this email":
            setError("No user found with this email address.");
            break;
          case "Invalid password":
            setError("Invalid password. Please try again.");
            break;
          default:
            setError(result.error);
        }
        return;
      }

      if (result?.ok) {
        console.log("✅ Login successful, redirecting...");
        
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use window.location instead of router for more reliable redirect
        window.location.href = "/dashboard";
      } else {
        console.log("❌ Login failed - result not ok");
        setError("Login failed. Please try again.");
      }
      
    } catch (err: any) {
      console.error("🚨 Login exception:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Sign in to your admin dashboard account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} disabled={isLoading} />
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
                      <Input placeholder="******" type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}