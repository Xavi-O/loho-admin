// app/api/admin/email-verification/route.ts

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
    
    const { userId, action } = await req.json();
    
    if (!userId || !action) {
      return NextResponse.json({ error: "User ID and action are required" }, { status: 400 });
    }
    
    const validActions = ['verify', 'unverify', 'resend'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    await connectDB();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    let message = '';
    
    switch (action) {
      case 'verify':
        user.emailVerified = new Date();
        await user.save();
        message = 'Email marked as verified';
        break;
        
      case 'unverify':
        user.emailVerified = null;
        await user.save();
        message = 'Email verification status removed';
        break;
        
      case 'resend':
        // Here you would typically trigger your email verification system
        // For now, we'll just return a success message
        message = 'Verification email resent (implementation needed)';
        break;
    }
    
    return NextResponse.json({
      message,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: !!user.emailVerified,
        emailVerifiedAt: user.emailVerified
      }
    });
    
  } catch (error: any) {
    console.error("Error managing email verification:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while managing email verification" },
      { status: 500 }
    );
  }
}