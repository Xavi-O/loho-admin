// app/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Admin Dashboard",
  description: "Login to access the admin dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}