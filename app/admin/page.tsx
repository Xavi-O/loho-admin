// app/admin/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PendingUsersTable } from "@/components/admin/PendingUsersTable";
import { AdminStats } from "@/components/admin/AdminStats";
import { AccountsTable } from "@/components/admin/AccountsTable";

export const metadata: Metadata = {
  title: "Admin Panel - User Management",
  description: "Manage user accounts and approvals",
};

export default async function AdminPage() {
  // Get the user session
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is a superadmin
  if (!session || session.user.role !== "superadmin") {
    redirect("/dashboard");
  }
  
  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      
      <AdminStats />
      
      <div className="grid gap-6">
        <PendingUsersTable />
        <AccountsTable />
      </div>
    </div>
  );
}