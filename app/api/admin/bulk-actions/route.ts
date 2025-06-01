// app/api/admin/bulk-actions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { userIds, action, value } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "User IDs array is required" }, { status: 400 });
    }
    
    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }
    
    await connectDB();
    
    // Prevent actions on self
    if (userIds.includes(session.user.id)) {
      return NextResponse.json({ 
        error: "Cannot perform bulk actions on your own account" 
      }, { status: 403 });
    }
    
    let updateQuery: any = {};
    let message = '';
    
    switch (action) {
      case 'approve':
        updateQuery = { isApproved: true };
        message = `${userIds.length} users approved`;
        break;
        
      case 'disapprove':
        updateQuery = { isApproved: false };
        message = `${userIds.length} users disapproved`;
        break;
        
      case 'activate':
        updateQuery = { isActive: true };
        message = `${userIds.length} users activated`;
        break;
        
      case 'deactivate':
        updateQuery = { isActive: false };
        message = `${userIds.length} users deactivated`;
        break;
        
      case 'verify-email':
        updateQuery = { emailVerified: new Date() };
        message = `${userIds.length} users email verified`;
        break;
        
      case 'unverify-email':
        updateQuery = { emailVerified: null };
        message = `${userIds.length} users email unverified`;
        break;
        
      case 'change-role':
        if (!value) {
          return NextResponse.json({ error: "Role value is required" }, { status: 400 });
        }
        const validRoles = ['user', 'admin', 'superadmin'];
        if (!validRoles.includes(value)) {
          return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        updateQuery = { role: value };
        message = `${userIds.length} users role changed to ${value}`;
        break;
        
      case 'delete':
        // Prevent deletion of superadmins
        const superAdmins = await User.find({ 
          _id: { $in: userIds }, 
          role: 'superadmin' 
        }).select('_id');
        
        if (superAdmins.length > 0) {
          return NextResponse.json({ 
            error: "Cannot delete superadmin accounts" 
          }, { status: 403 });
        }
        
        const deleteResult = await User.deleteMany({ 
          _id: { $in: userIds },
          role: { $ne: 'superadmin' }
        });
        
        return NextResponse.json({
          message: `${deleteResult.deletedCount} accounts deleted`,
          deletedCount: deleteResult.deletedCount
        });
        
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    if (action !== 'delete') {
      const result = await User.updateMany(
        { _id: { $in: userIds }, role: { $ne: 'superadmin' } },
        updateQuery
      );
      
      return NextResponse.json({
        message,
        modifiedCount: result.modifiedCount
      });
    }
    
  } catch (error: any) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while performing bulk action" },
      { status: 500 }
    );
  }
}