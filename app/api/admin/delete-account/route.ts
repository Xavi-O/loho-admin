// app/api/admin/delete-account/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    await connectDB();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Prevent deletion of self
    if (user._id.toString() === session.user.id) {
      return NextResponse.json({ 
        error: "Cannot delete your own account" 
      }, { status: 403 });
    }
    
    // Prevent deletion of other superadmins (optional security measure)
    if (user.role === 'superadmin') {
      return NextResponse.json({ 
        error: "Cannot delete other superadmin accounts" 
      }, { status: 403 });
    }
    
    const deletedUser = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({
      message: "Account deleted successfully",
      deletedUser
    });
    
  } catch (error: any) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while deleting the account" },
      { status: 500 }
    );
  }
}