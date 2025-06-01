// app/api/admin/export-users/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    
    const users = await User.find({})
      .select('email name role isActive isApproved emailVerified createdAt lastLogin')
      .sort({ createdAt: -1 });
    
    // Convert to CSV
    const csvHeaders = [
      'Email',
      'Name', 
      'Role',
      'Status',
      'Approved',
      'Email Verified',
      'Created At',
      'Last Login'
    ].join(',');
    
    const csvRows = users.map(user => [
      user.email,
      user.name || '',
      user.role || 'user',
      user.isActive !== false ? 'Active' : 'Disabled',
      user.isApproved ? 'Yes' : 'No',
      user.emailVerified ? 'Yes' : 'No',
      user.createdAt.toISOString(),
      user.lastLogin ? user.lastLogin.toISOString() : ''
    ].map(field => `"${field}"`).join(','));
    
    const csv = [csvHeaders, ...csvRows].join('\n');
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
    
  } catch (error: any) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export users" },
      { status: 500 }
    );
  }
}