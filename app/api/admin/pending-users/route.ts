// app/api/admin/pending-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get the session to check if user is authenticated and a superadmin
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only superadmin can view pending users
    if (session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }
    
    await connectDB();
    
    // Find all users where isApproved is false
    const pendingUsers = await User.find({ isApproved: false })
      .select('_id email name createdAt')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      pendingUsers: pendingUsers.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }))
    });
    
  } catch (error: any) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching pending users" },
      { status: 500 }
    );
  }
}