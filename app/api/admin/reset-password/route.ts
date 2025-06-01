// app/api/admin/reset-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { userId, action } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    let message = '';
    let tempPassword = '';
    
    if (action === 'reset_password') {
      // Generate a temporary password
      tempPassword = crypto.randomBytes(8).toString('hex');
      
      // Hash the temporary password
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      // Update user's password and mark as requiring password change
      user.password = hashedPassword;
      user.requirePasswordChange = true;
      await user.save();
      
      message = 'Password reset successfully';
    } else if (action === 'force_password_change') {
      // Force user to change password on next login
      user.requirePasswordChange = true;
      await user.save();
      
      message = 'User will be required to change password on next login';
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    return NextResponse.json({
      message,
      tempPassword: action === 'reset_password' ? tempPassword : undefined,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while resetting password" },
      { status: 500 }
    );
  }
}