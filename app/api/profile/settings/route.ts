// app/api/profile/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Transform user model settings to frontend format
const transformToFrontendSettings = (userSettings: any) => {
  if (!userSettings) {
    return {
      notifications: {
        email: true,
        push: false,
        marketing: false
      },
      privacy: {
        profileVisibility: 'private',
        showEmail: false,
        showLastSeen: true
      },
      preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'UTC'
      }
    };
  }

  return {
    notifications: {
      email: userSettings.emailNotifications?.security ?? true,
      push: false, // Not in your model, default to false
      marketing: userSettings.emailNotifications?.marketing ?? false
    },
    privacy: {
      profileVisibility: userSettings.privacy?.profileVisibility === 'friends' ? 'private' : userSettings.privacy?.profileVisibility ?? 'private',
      showEmail: userSettings.privacy?.showEmail ?? false,
      showLastSeen: userSettings.privacy?.showLastSeen ?? true
    },
    preferences: {
      theme: userSettings.theme ?? 'system',
      language: userSettings.language ?? 'en',
      timezone: userSettings.timezone ?? 'UTC'
    }
  };
};

// Transform frontend settings to user model format
const transformToUserModelSettings = (frontendSettings: any) => {
  return {
    theme: frontendSettings.preferences?.theme ?? 'system',
    language: frontendSettings.preferences?.language ?? 'en',
    timezone: frontendSettings.preferences?.timezone ?? 'UTC',
    emailNotifications: {
      marketing: frontendSettings.notifications?.marketing ?? false,
      security: frontendSettings.notifications?.email ?? true,
      updates: true, // Default
      newsletter: false // Default
    },
    privacy: {
      profileVisibility: frontendSettings.privacy?.profileVisibility ?? 'private',
      showEmail: frontendSettings.privacy?.showEmail ?? false,
      showLastSeen: frontendSettings.privacy?.showLastSeen ?? true,
      allowSearchByEmail: true // Default
    },
    preferences: {
      dateFormat: 'MM/DD/YYYY', // Default
      timeFormat: '12h', // Default
      currency: 'USD', // Default
      pageSize: 25 // Default
    },
    twoFactorAuth: {
      enabled: false, // Default
      method: null,
      backupCodes: []
    }
  };
};

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
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      // Create user with default settings if they don't exist
      const defaultUserSettings = transformToUserModelSettings({});
      
      const newUser = new User({
        email: session.user.email,
        name: session.user.name,
        settings: defaultUserSettings
      });
      
      await newUser.save();
      
      return NextResponse.json({
        settings: transformToFrontendSettings(defaultUserSettings)
      });
    }
    
    // Return settings transformed to frontend format
    return NextResponse.json({
      settings: transformToFrontendSettings(user.settings)
    });
    
  } catch (error: any) {
    console.error("Settings fetch error:", error);
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

    const body = await req.json();
    const { settings } = body;
    
    if (!settings) {
      return NextResponse.json(
        { error: "Settings data is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Transform frontend settings to user model format
    const userModelSettings = transformToUserModelSettings(settings);
    
    // Use upsert to create user if they don't exist
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        email: session.user.email,
        name: session.user.name,
        settings: userModelSettings
      },
      { 
        new: true,
        upsert: true // Create if doesn't exist
      }
    );
    
    return NextResponse.json({
      message: "Settings updated successfully",
      settings: transformToFrontendSettings(user.settings)
    });
    
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}