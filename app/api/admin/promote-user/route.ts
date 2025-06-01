// app/api/admin/promote-user/route.ts

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
    
    const { userId, role } = await req.json();
    
    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 });
    }
    
    // Validate role
    const validRoles = ['user', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    
    await connectDB();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Prevent demotion of self
    if (user._id.toString() === session.user.id && role !== 'superadmin') {
      return NextResponse.json({ 
        error: "Cannot demote yourself from superadmin" 
      }, { status: 403 });
    }
    
    const oldRole = user.role;
    user.role = role;
    await user.save();
    
    return NextResponse.json({
      message: `User role updated from ${oldRole || 'user'} to ${role}`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        oldRole
      }
    });
    
  } catch (error: any) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while updating user role" },
      { status: 500 }
    );
  }
}