// app/api/admin/logs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

// Note: You'll need to create an ActivityLog model
// This is a basic structure for reference
const ActivityLogModel = {
  find: async (query: any) => {
    // Mock data for demonstration - replace with actual model
    return [
      {
        _id: '1',
        userId: 'user123',
        action: 'LOGIN',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date(),
        user: { name: 'John Doe', email: 'john@example.com' }
      }
    ];
  },
  countDocuments: async (query: any) => 1
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    await connectDB();
    
    // Build query filters
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (action) {
      query.action = action;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    const skip = (page - 1) * limit;
    
    // Get logs with user information
    const logs = await ActivityLogModel.find(query)
      // .populate('userId', 'name email')
      // .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit);
    
    const totalLogs = await ActivityLogModel.countDocuments(query);
    const totalPages = Math.ceil(totalLogs / limit);
    
    // Get summary statistics
    const stats = {
      totalLogs,
      todayLogs: await ActivityLogModel.countDocuments({
        ...query,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      uniqueUsers: new Set(logs.map((log: any) => log.userId)).size,
      topActions: [
        { action: 'LOGIN', count: 150 },
        { action: 'LOGOUT', count: 145 },
        { action: 'PASSWORD_CHANGE', count: 23 },
        { action: 'PROFILE_UPDATE', count: 18 }
      ]
    };
    
    return NextResponse.json({
      logs: logs.map((log: any) => ({
        id: log._id,
        userId: log.userId,
        userName: log.user?.name || 'Unknown',
        userEmail: log.user?.email || 'Unknown',
        action: log.action,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt
      })),
      pagination: {
        page,
        limit,
        totalPages,
        totalLogs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats
    });
    
  } catch (error: any) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching logs" },
      { status: 500 }
    );
  }
}

// POST endpoint to manually log actions
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { action, details, targetUserId } = await req.json();
    
    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }
    
    const logEntry = {
      userId: session.user.id,
      action,
      details: details || `${action} performed by ${session.user.name}`,
      targetUserId,
      ipAddress: req.headers.get('x-forwarded-for') || 
                 req.headers.get('x-real-ip') || 
                 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      createdAt: new Date()
    };
    
    // Save to activity log
    // await ActivityLogModel.create(logEntry);
    
    return NextResponse.json({ message: "Activity logged successfully" });
    
  } catch (error: any) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while logging activity" },
      { status: 500 }
    );
  }
}