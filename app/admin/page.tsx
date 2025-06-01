// app/admin/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PendingUsersTable } from "@/components/admin/PendingUsersTable";
import { AdminStats } from "@/components/admin/AdminStats";
import { AccountsTable } from "@/components/admin/AccountsTable";
import { AdminActions } from "@/components/admin/AdminActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <AdminActions />
      </div>
      
      <AdminStats />
      
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">All Accounts</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          <AccountsTable />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <PendingUsersTable />
        </TabsContent>
        
        <TabsContent value="admins" className="space-y-4">
          <AccountsTable filterByRole="admin" />
        </TabsContent>
      </Tabs>
    </div>
  );
}