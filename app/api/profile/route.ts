// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

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
    
    const user = await User.findOne({ email: session.user.email }).select('-password -passwordResetToken -passwordResetExpiry');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
    
  } catch (error: any) {
    console.error("Profile fetch error:", error);
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

    const { name, email } = await req.json();
    
    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await User.findOne({
          email: email,
          _id: { $ne: session.user.id } // or session.user._id if available
        });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already taken" },
          { status: 409 }
        );
      }
    }
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, email },
      { new: true }
    ).select('-password -passwordResetToken -passwordResetExpiry');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
    
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}