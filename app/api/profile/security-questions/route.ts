// app/api/profile/security-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      questions: user.securityQuestions?.map((sq: any) => ({
        question: sq.question,
        answer: '' // Never return actual answers
      })) || [],
      hasExisting: user.securityQuestions && user.securityQuestions.length > 0
    });
    
  } catch (error: any) {
    console.error("Security questions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { securityQuestions } = await req.json();
    
    // Validate security questions
    if (!securityQuestions || !Array.isArray(securityQuestions) || securityQuestions.length !== 3) {
      return NextResponse.json(
        { error: "Exactly 3 security questions are required" },
        { status: 400 }
      );
    }

    // Validate each security question
    for (const sq of securityQuestions) {
      if (!sq.question || !sq.answer || sq.answer.trim().length === 0) {
        return NextResponse.json(
          { error: "All security questions must have valid answers" },
          { status: 400 }
        );
      }
    }

    // Check for duplicate questions
    const questions = securityQuestions.map((sq: any) => sq.question);
    const uniqueQuestions = new Set(questions);
    if (uniqueQuestions.size !== questions.length) {
      return NextResponse.json(
        { error: "All security questions must be different" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Encrypt security question answers using the User model method
    const encryptedSecurityQuestions = securityQuestions.map((sq: any) => ({
      question: sq.question,
      answer: user.encryptSecurityAnswer(sq.answer),
    }));

    user.securityQuestions = encryptedSecurityQuestions;
    await user.save();
    
    return NextResponse.json({
      message: "Security questions updated successfully"
    });
    
  } catch (error: any) {
    console.error("Security questions update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}