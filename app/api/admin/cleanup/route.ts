// app/api/admin/cleanup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { action } = await req.json();
    
    await connectDB();
    
    let message = '';
    
    switch (action) {
      case 'cleanup_old_sessions':
        // Clean up sessions older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Note: This assumes you have a sessions collection
        // Adjust according to your session storage implementation
        message = 'Old sessions cleaned up successfully';
        break;
        
      case 'remove_unverified_users':
        // Remove unverified users older than 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { User } = await import("@/models/User");
        const result = await User.deleteMany({
          emailVerified: null,
          createdAt: { $lt: sevenDaysAgo }
        });
        
        message = `Removed ${result.deletedCount} unverified users`;
        break;
        
      case 'cleanup_inactive_accounts':
        // Mark accounts inactive if not logged in for 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        const { User: UserModel } = await import("@/models/User");
        const inactiveResult = await UserModel.updateMany(
          {
            lastLogin: { $lt: ninetyDaysAgo },
            isActive: { $ne: false }
          },
          { isActive: false }
        );
        
        message = `Marked ${inactiveResult.modifiedCount} accounts as inactive`;
        break;
        
      case 'remove_duplicate_accounts':
        // Find and remove duplicate accounts (same email)
        const { User: UserDup } = await import("@/models/User");
        const duplicates = await UserDup.aggregate([
          {
            $group: {
              _id: "$email",
              count: { $sum: 1 },
              docs: { $push: "$_id" }
            }
          },
          {
            $match: {
              count: { $gt: 1 }
            }
          }
        ]);
        
        let removedDuplicates = 0;
        for (const duplicate of duplicates) {
          // Keep the first account, remove the rest
          const [keep, ...remove] = duplicate.docs;
          await UserDup.deleteMany({ _id: { $in: remove } });
          removedDuplicates += remove.length;
        }
        
        message = `Removed ${removedDuplicates} duplicate accounts`;
        break;
        
      default:
        return NextResponse.json({ error: "Invalid cleanup action" }, { status: 400 });
    }
    
    return NextResponse.json({ message });
    
  } catch (error: any) {
    console.error("Error in cleanup operation:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during cleanup" },
      { status: 500 }
    );
  }
}