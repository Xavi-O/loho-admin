// app/api/admin/system-settings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Note: You'll need to create a SystemSettings model
// This is a basic structure for reference
const SystemSettingsModel = {
  findOne: async () => ({
    _id: 'settings',
    registrationEnabled: true,
    emailVerificationRequired: true,
    adminApprovalRequired: false,
    maxLoginAttempts: 5,
    sessionTimeout: 24, // hours
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    maintenanceMode: false,
    maintenanceMessage: 'System is under maintenance',
    allowedDomains: [],
    blockedDomains: [],
    maxUsersPerRole: {
      user: 1000,
      admin: 10,
      superadmin: 3
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  findOneAndUpdate: async (query: any, update: any, options: any) => {
    return { ...update, updatedAt: new Date() };
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    
    let settings = await SystemSettingsModel.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      const now = new Date();
      settings = {
        _id: 'settings',
        registrationEnabled: true,
        emailVerificationRequired: true,
        adminApprovalRequired: false,
        maxLoginAttempts: 5,
        sessionTimeout: 24,
        passwordMinLength: 8,
        passwordRequireSpecialChars: true,
        maintenanceMode: false,
        maintenanceMessage: 'System is under maintenance',
        allowedDomains: [],
        blockedDomains: [],
        maxUsersPerRole: {
          user: 1000,
          admin: 10,
          superadmin: 3
        },
        createdAt: now,
        updatedAt: now
      };
    }

    return NextResponse.json({ settings });
    
  } catch (error: any) {
    console.error("Error fetching system settings:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const updates = await req.json();
    
    // Validate the updates
    const allowedFields = [
      'registrationEnabled',
      'emailVerificationRequired', 
      'adminApprovalRequired',
      'maxLoginAttempts',
      'sessionTimeout',
      'passwordMinLength',
      'passwordRequireSpecialChars',
      'maintenanceMode',
      'maintenanceMessage',
      'allowedDomains',
      'blockedDomains',
      'maxUsersPerRole'
    ];
    
    const validUpdates: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        validUpdates[key] = value;
      }
    }
    
    // Additional validation
    if (validUpdates.maxLoginAttempts && validUpdates.maxLoginAttempts < 1) {
      return NextResponse.json({ 
        error: "Max login attempts must be at least 1" 
      }, { status: 400 });
    }
    
    if (validUpdates.sessionTimeout && validUpdates.sessionTimeout < 1) {
      return NextResponse.json({ 
        error: "Session timeout must be at least 1 hour" 
      }, { status: 400 });
    }
    
    if (validUpdates.passwordMinLength && validUpdates.passwordMinLength < 6) {
      return NextResponse.json({ 
        error: "Password minimum length must be at least 6" 
      }, { status: 400 });
    }
    
    await connectDB();
    
    const settings = await SystemSettingsModel.findOneAndUpdate(
      {},
      { ...validUpdates, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    // Log the settings change
    const changeDetails = Object.keys(validUpdates)
      .map(key => `${key}: ${JSON.stringify(validUpdates[key])}`)
      .join(', ');
    
    // You can log this activity
    console.log(`System settings updated by ${session.user.email}: ${changeDetails}`);
    
    return NextResponse.json({
      message: "System settings updated successfully",
      settings
    });
    
  } catch (error: any) {
    console.error("Error updating system settings:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while updating settings" },
      { status: 500 }
    );
  }
}

// GET endpoint for specific setting categories
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { action } = await req.json();
    
    await connectDB();
    
    let result = {};
    
    switch (action) {
      case 'toggle_maintenance':
        const currentSettings = await SystemSettingsModel.findOne();
        const newMaintenanceMode = !currentSettings?.maintenanceMode;
        
        result = await SystemSettingsModel.findOneAndUpdate(
          {},
          { 
            maintenanceMode: newMaintenanceMode,
            updatedAt: new Date()
          },
          { new: true }
        );
        
        return NextResponse.json({
          message: `Maintenance mode ${newMaintenanceMode ? 'enabled' : 'disabled'}`,
          maintenanceMode: newMaintenanceMode
        });
        
      case 'reset_to_defaults':
        const defaultSettings = {
          registrationEnabled: true,
          emailVerificationRequired: true,
          adminApprovalRequired: false,
          maxLoginAttempts: 5,
          sessionTimeout: 24,
          passwordMinLength: 8,
          passwordRequireSpecialChars: true,
          maintenanceMode: false,
          maintenanceMessage: 'System is under maintenance',
          allowedDomains: [],
          blockedDomains: [],
          maxUsersPerRole: {
            user: 1000,
            admin: 10,
            superadmin: 3
          },
          updatedAt: new Date()
        };
        
        result = await SystemSettingsModel.findOneAndUpdate(
          {},
          defaultSettings,
          { upsert: true, new: true }
        );
        
        return NextResponse.json({
          message: "Settings reset to defaults",
          settings: result
        });
        
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error("Error in settings action:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while performing action" },
      { status: 500 }
    );
  }
}