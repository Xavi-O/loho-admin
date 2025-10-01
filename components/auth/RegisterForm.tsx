// File: components/auth/RegisterForm.tsx
{/*
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Predefined security questions
const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What was your childhood nickname?"
];

// Create a schema for form validation
const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password confirmation is required.",
  }),
  securityQuestion1: z.string().min(1, {
    message: "Please select the first security question.",
  }),
  securityAnswer1: z.string().min(1, {
    message: "Please provide an answer to the first security question.",
  }),
  securityQuestion2: z.string().min(1, {
    message: "Please select the second security question.",
  }),
  securityAnswer2: z.string().min(1, {
    message: "Please provide an answer to the second security question.",
  }),
  securityQuestion3: z.string().min(1, {
    message: "Please select the third security question.",
  }),
  securityAnswer3: z.string().min(1, {
    message: "Please provide an answer to the third security question.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const questions = [data.securityQuestion1, data.securityQuestion2, data.securityQuestion3];
  const uniqueQuestions = new Set(questions);
  return uniqueQuestions.size === questions.length;
}, {
  message: "Please select three different security questions",
  path: ["securityQuestion3"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;
*/}
export function RegisterForm() {
  {/*
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Initialize the form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion1: "",
      securityAnswer1: "",
      securityQuestion2: "",
      securityAnswer2: "",
      securityQuestion3: "",
      securityAnswer3: "",
    },
  });

  // Get selected questions to disable them in other selects
  const selectedQuestions = [
    form.watch("securityQuestion1"),
    form.watch("securityQuestion2"),
    form.watch("securityQuestion3")
  ].filter(Boolean);

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const securityQuestions = [
        { question: data.securityQuestion1, answer: data.securityAnswer1 },
        { question: data.securityQuestion2, answer: data.securityAnswer2 },
        { question: data.securityQuestion3, answer: data.securityAnswer3 },
      ];

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          securityQuestions,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setSuccess(result.message);
      form.reset();
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Create a new account to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              // Basic Information
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              // Security Questions Section
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-4">Security Questions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose 3 different security questions for account recovery
                </p>

                // Security Question 1
                <FormField
                  control={form.control}
                  name="securityQuestion1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Question 1</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a security question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map((question) => (
                            <SelectItem 
                              key={question} 
                              value={question}
                              disabled={selectedQuestions.includes(question) && question !== field.value}
                            >
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityAnswer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Your answer" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                // Security Question 2
                <FormField
                  control={form.control}
                  name="securityQuestion2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Question 2</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a security question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map((question) => (
                            <SelectItem 
                              key={question} 
                              value={question}
                              disabled={selectedQuestions.includes(question) && question !== field.value}
                            >
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityAnswer2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Your answer" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                // Security Question 3
                <FormField
                  control={form.control}
                  name="securityQuestion3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Question 3</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a security question" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map((question) => (
                            <SelectItem 
                              key={question} 
                              value={question}
                              disabled={selectedQuestions.includes(question) && question !== field.value}
                            >
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityAnswer3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer 3</FormLabel>
                      <FormControl>
                        <Input placeholder="Your answer" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mt-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
  */}

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 max-w-md text-center shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Registration Disabled</h1>
        <p>
          New user registration is currently disabled. Please contact an admin if you need access.
        </p>
      </div>
    </div>
  );
}
