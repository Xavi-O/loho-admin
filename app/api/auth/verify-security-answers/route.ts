// app/api/auth/verify-security-answers/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { userId, answers } = await request.json();

    // Validate input
    if (!userId || !answers || !Array.isArray(answers) || answers.length !== 3) {
      return NextResponse.json(
        { error: "User ID and 3 security answers are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has security questions
    if (!user.securityQuestions || user.securityQuestions.length !== 3) {
      return NextResponse.json(
        { error: "Security questions not set up for this user" },
        { status: 400 }
      );
    }

    // Verify each answer using bcrypt
    let allAnswersCorrect = true;
    for (let i = 0; i < 3; i++) {
      const providedAnswer = answers[i].toLowerCase().trim();
      const storedHashedAnswer = user.securityQuestions[i].answer;
      
      // Compare using bcrypt
      const isCorrect = await bcrypt.compare(providedAnswer, storedHashedAnswer);
      if (!isCorrect) {
        allAnswersCorrect = false;
        break;
      }
    }

    if (!allAnswersCorrect) {
      return NextResponse.json(
        { error: "One or more security answers are incorrect" },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetExpiry;
    await user.save();

    return NextResponse.json({
      message: "Security answers verified successfully",
      resetToken
    });

  } catch (error) {
    console.error("Security verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}