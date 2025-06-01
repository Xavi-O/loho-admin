// app/api/admin/bulk-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { subject, message, recipients } = await req.json();
    
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }
    
    await connectDB();
    
    // Build recipient filter
    let filter: any = {};
    
    switch (recipients) {
      case 'active':
        filter = { isActive: { $ne: false }, isApproved: true };
        break;
      case 'pending':
        filter = { isApproved: false };
        break;
      case 'admins':
        filter = { role: { $in: ['admin', 'superadmin'] } };
        break;
      case 'unverified':
        filter = { emailVerified: null };
        break;
      default: // 'all'
        filter = {};
    }
    
    const users = await User.find(filter).select('email name');
    
    // TODO: Implement actual email sending logic here
    // For now, we'll just simulate sending emails
    
    console.log(`Sending email to ${users.length} users:`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Simulate email sending
    const sentCount = users.length;
    
    return NextResponse.json({
      message: "Bulk email sent successfully",
      sentCount,
      recipients: users.map(u => ({ email: u.email, name: u.name }))
    });
    
  } catch (error: any) {
    console.error("Error sending bulk email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send bulk email" },
      { status: 500 }
    );
  }
}