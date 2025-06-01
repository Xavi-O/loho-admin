// app/api/admin/create-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, email, role, sendInvite } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      isApproved: true, // Auto-approve admin-created users
      isActive: true,
      emailVerified: new Date(), // Auto-verify admin-created users
    });
    
    await newUser.save();
    
    // TODO: Send invitation email with temporary password if sendInvite is true
    if (sendInvite) {
      // Implement email sending logic here
      console.log(`Send invitation to ${email} with temp password: ${tempPassword}`);
    }
    
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      ...(sendInvite && { tempPassword }) // Only include in response for demo
    });
    
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}