// components/auth/ForgotPasswordForm.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Step 1: Email input schema
const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Step 2: Security questions schema
const securitySchema = z.object({
  answer1: z.string().min(1, {
    message: "Please provide an answer to the first security question.",
  }),
  answer2: z.string().min(1, {
    message: "Please provide an answer to the second security question.",
  }),
  answer3: z.string().min(1, {
    message: "Please provide an answer to the third security question.",
  }),
});

// Step 3: Password reset schema
const passwordSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password confirmation is required.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface SecurityQuestion {
  question: string;
}

type Step = 'email' | 'security' | 'password' | 'success';

export function ForgotPasswordForm() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const router = useRouter();

  // Initialize forms
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      answer1: "",
      answer2: "",
      answer3: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Helper function to safely parse JSON response
  const safeJsonParse = async (response: Response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON parse error:", error);
      console.error("Response text:", text);
      throw new Error("Invalid response format from server");
    }
  };

  // Step 1: Submit email to get security questions
  async function onSubmitEmail(data: EmailFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Submitting email:", data.email);
      
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      const result = await safeJsonParse(response);
      console.log("📡 Response data:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to retrieve security questions");
      }

      if (!result.securityQuestions || !Array.isArray(result.securityQuestions)) {
        throw new Error("Invalid security questions format received");
      }

      setSecurityQuestions(result.securityQuestions);
      setUserId(result.userId);
      setCurrentStep('security');
      
    } catch (err: any) {
      console.error("❌ Email submission error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Submit security answers
  async function onSubmitSecurity(data: SecurityFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const answers = [data.answer1, data.answer2, data.answer3];
      
      console.log("🔍 Submitting security answers for userId:", userId);
      
      const response = await fetch("/api/auth/verify-security-answers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          answers,
        }),
      });

      const result = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(result.error || "Security answers verification failed");
      }

      if (!result.resetToken) {
        throw new Error("Reset token not received");
      }

      setResetToken(result.resetToken);
      setCurrentStep('password');
      
    } catch (err: any) {
      console.error("❌ Security verification error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 3: Submit new password
  async function onSubmitPassword(data: PasswordFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Submitting password reset with token");
      
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(result.error || "Password reset failed");
      }

      setSuccess(result.message || "Password reset successfully");
      setCurrentStep('success');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: any) {
      console.error("❌ Password reset error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const renderEmailStep = () => (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  type="email" 
                  {...field} 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Retrieving Questions..." : "Continue"}
        </Button>
      </form>
    </Form>
  );

  const renderSecurityStep = () => (
    <Form {...securityForm}>
      <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please answer the following security questions to verify your identity:
          </p>
          
          {securityQuestions.map((sq, index) => (
            <FormField
              key={index}
              control={securityForm.control}
              name={`answer${index + 1}` as keyof SecurityFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{sq.question}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your answer" 
                      {...field} 
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep('email')}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Answers"}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderPasswordStep = () => (
    <Form {...passwordForm}>
      <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-green-600 mb-4">
            Security questions verified! Please enter your new password.
          </p>
          
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="******" 
                    type="password" 
                    {...field} 
                    disabled={isLoading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="******" 
                    type="password" 
                    {...field} 
                    disabled={isLoading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="text-green-600 text-lg font-semibold">
        Password Reset Successfully!
      </div>
      <p className="text-gray-600">
        Your password has been updated. You will be redirected to the login page shortly.
      </p>
      <Button onClick={() => router.push("/login")} className="w-full">
        Go to Login
      </Button>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Forgot Password';
      case 'security':
        return 'Security Questions';
      case 'password':
        return 'Reset Password';
      case 'success':
        return 'Success';
      default:
        return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'email':
        return 'Enter your email address to begin password recovery';
      case 'security':
        return 'Answer your security questions to verify your identity';
      case 'password':
        return 'Create a new password for your account';
      case 'success':
        return 'Your password has been successfully reset';
      default:
        return '';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 'email' && renderEmailStep()}
          {currentStep === 'security' && renderSecurityStep()}
          {currentStep === 'password' && renderPasswordStep()}
          {currentStep === 'success' && renderSuccessStep()}
          
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
          
          {currentStep !== 'success' && (
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}