// app/api/admin/accounts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  
  await connectDB();
  
  // Build query filter
  const filter: any = {};
  
  if (role && role !== 'all') {
    filter.role = role;
  }
  
  if (status) {
    if (status === 'active') filter.isActive = { $ne: false };
    else if (status === 'disabled') filter.isActive = false;
    else if (status === 'verified') filter.emailVerified = { $ne: null };
    else if (status === 'unverified') filter.emailVerified = null;
    else if (status === 'approved') filter.isApproved = true;
    else if (status === 'pending') filter.isApproved = false;
  }
  
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const [accounts, total] = await Promise.all([
    User.find(filter)
      .select('_id email name role isActive isApproved emailVerified createdAt lastLogin image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter)
  ]);
  
  return NextResponse.json({
    accounts: accounts.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      isActive: user.isActive !== false,
      isApproved: user.isApproved,
      emailVerified: !!user.emailVerified,
      emailVerifiedAt: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      image: user.image
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}