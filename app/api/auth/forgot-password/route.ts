// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    console.log("🔍 Forgot password request for:", email);

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { error: "If this email exists in our system, you will receive further instructions." },
        { status: 404 }
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "This account has been disabled. Please contact an administrator." },
        { status: 403 }
      );
    }

    // Check if user has security questions set up
    if (!user.securityQuestions || user.securityQuestions.length !== 3) {
      return NextResponse.json(
        { error: "Security questions are not set up for this account. Please contact an administrator." },
        { status: 400 }
      );
    }

    // Return only the questions (not the answers)
    const securityQuestions = user.securityQuestions.map((sq: { question: string; answer: string }) => ({
      question: sq.question
    }));


    console.log("✅ Security questions retrieved for:", email);

    return NextResponse.json({
      message: "Security questions retrieved successfully",
      securityQuestions,
      userId: user._id.toString()
    });

  } catch (error) {
    console.error("🚨 Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}