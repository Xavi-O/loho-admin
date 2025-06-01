// app/api/admin/send-notification/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

// Note: You'll need to create a Notification model
// This is a basic structure - adjust according to your needs
const NotificationModel = {
  create: async (data: any) => {
    // Implementation depends on your notification system
    // Could be in-app notifications, emails, etc.
    return data;
  }
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { 
      recipients, // 'all', 'admins', 'users', or array of user IDs
      title,
      message,
      type = 'info', // 'info', 'warning', 'success', 'error'
      priority = 'normal' // 'low', 'normal', 'high'
    } = await req.json();
    
    if (!title || !message) {
      return NextResponse.json({ 
        error: "Title and message are required" 
      }, { status: 400 });
    }
    
    await connectDB();
    
    let targetUsers = [];
    
    // Determine target users based on recipients
    if (recipients === 'all') {
      targetUsers = await User.find({ isActive: { $ne: false } }, '_id email name');
    } else if (recipients === 'admins') {
      targetUsers = await User.find({ 
        role: { $in: ['admin', 'superadmin'] },
        isActive: { $ne: false }
      }, '_id email name');
    } else if (recipients === 'users') {
      targetUsers = await User.find({ 
        role: { $nin: ['admin', 'superadmin'] },
        isActive: { $ne: false }
      }, '_id email name');
    } else if (Array.isArray(recipients)) {
      targetUsers = await User.find({ 
        _id: { $in: recipients },
        isActive: { $ne: false }
      }, '_id email name');
    } else {
      return NextResponse.json({ 
        error: "Invalid recipients parameter" 
      }, { status: 400 });
    }
    
    // Create notifications for each target user
    const notifications = [];
    for (const user of targetUsers) {
      const notification = await NotificationModel.create({
        userId: user._id,
        title,
        message,
        type,
        priority,
        isRead: false,
        createdBy: session.user.id,
        createdAt: new Date()
      });
      notifications.push(notification);
    }
    
    // You could also send emails here if needed
    // await sendEmailNotifications(targetUsers, title, message);
    
    return NextResponse.json({
      message: `Notification sent to ${targetUsers.length} users`,
      notificationCount: notifications.length,
      recipients: targetUsers.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name
      }))
    });
    
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while sending notification" },
      { status: 500 }
    );
  }
}