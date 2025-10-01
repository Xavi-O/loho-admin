// File: app/register/page.tsx
// app/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Admin Dashboard",
  description: "Register for the admin dashboard",
};

export default function RegisterPage() {
  return <RegisterForm />;
}