// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
// Remove bcrypt import since we'll let the model handle hashing

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { resetToken, newPassword, confirmPassword } = await request.json();

    // Validate input
    if (!resetToken || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Reset token, new password, and confirmation are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Set the plain password - let the model's pre-save middleware handle hashing
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    
    // The User model's pre-save middleware will hash the password automatically
    await user.save();

    return NextResponse.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}