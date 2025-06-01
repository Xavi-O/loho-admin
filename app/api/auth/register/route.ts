// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

interface SecurityQuestion {
  question: string;
  answer: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, securityQuestions } = await req.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    // Validate security questions
    if (!securityQuestions || !Array.isArray(securityQuestions) || securityQuestions.length !== 3) {
      return NextResponse.json(
        { error: "Exactly 3 security questions are required" },
        { status: 400 }
      );
    }

    // Validate each security question has both question and answer
    for (const sq of securityQuestions) {
      if (!sq.question || !sq.answer || sq.answer.trim().length === 0) {
        return NextResponse.json(
          { error: "All security questions must have valid answers" },
          { status: 400 }
        );
      }
    }

    // Check for duplicate questions
    const questions = securityQuestions.map((sq: SecurityQuestion) => sq.question);
    const uniqueQuestions = new Set(questions);
    if (uniqueQuestions.size !== questions.length) {
      return NextResponse.json(
        { error: "All security questions must be different" },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Create new user instance to access encryption method
    const newUser = new User({
      email,
      password,
      name,
      role: "user", // Default role
      isApproved: false, // Requires approval
      securityQuestions: [], // Will be populated below
    });

    // Encrypt security question answers
    const encryptedSecurityQuestions = securityQuestions.map((sq: SecurityQuestion) => ({
      question: sq.question,
      answer: newUser.encryptSecurityAnswer(sq.answer),
    }));

    // Set the encrypted security questions
    newUser.securityQuestions = encryptedSecurityQuestions;
    
    await newUser.save();
    
    return NextResponse.json(
      { 
        message: "Registration successful! Your account is pending approval by an administrator.",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          isApproved: newUser.isApproved
        }
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}