// app/api/admin/accounts/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await connectDB();
  const accounts = await User.find({})
    .select('_id email name role isActive isApproved createdAt lastLogin')
    .sort({ createdAt: -1 });
  
  return NextResponse.json({
    accounts: accounts.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      isActive: user.isActive !== false,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }))
  });
}