// app/api/admin/stats/route.ts

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
  
  const [totalUsers, pendingApprovals, activeUsers, disabledUsers] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isApproved: false }),
    User.countDocuments({ isActive: { $ne: false }, isApproved: true }),
    User.countDocuments({ isActive: false })
  ]);
  
  return NextResponse.json({
    totalUsers,
    pendingApprovals,
    activeUsers,
    disabledUsers
  });
}