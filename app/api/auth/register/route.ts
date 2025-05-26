// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
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
    
    // Create new user
    const newUser = new User({
      email,
      password,
      name,
      role: "user", // Default role
      isApproved: false, // Requires approval
    });
    
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