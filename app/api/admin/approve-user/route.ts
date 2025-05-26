// app/api/admin/approve-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get the session to check if user is authenticated and a superadmin
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only superadmin can approve users
    if (session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
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
    
    // Update the user approval status
    user.isApproved = true;
    await user.save();
    
    return NextResponse.json({
      message: "User approved successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isApproved: user.isApproved
      }
    });
    
  } catch (error: any) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while approving the user" },
      { status: 500 }
    );
  }
}