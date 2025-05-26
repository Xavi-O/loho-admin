// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 NextAuth authorize called with:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          await connectDB();
          console.log("✅ Database connected");
          
          const user = await User.findOne({ email: credentials.email });
          console.log("🔍 User found:", !!user);

          if (!user) {
            console.log("❌ No user found");
            throw new Error("No user found with this email");
          }

          if (!user.isApproved) {
            console.log("❌ User not approved");
            throw new Error("Your account is pending approval by an administrator");
          }

          // Check if user is active
          if (user.isActive === false) {
            console.log("❌ User account disabled");
            throw new Error("Account has been disabled");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("🔍 Password valid:", isPasswordValid);
          
          if (!isPasswordValid) {
            console.log("❌ Invalid password");
            throw new Error("Invalid password");
          }

          console.log("✅ User authenticated successfully");
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            isActive: user.isActive !== false,
            isApproved: user.isApproved
          };
        } catch (error) {
          console.error("🚨 Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔍 JWT callback - user:", !!user, "token.sub:", token.sub);
      
      if (user) {
        token.role = user.role;
        token.isActive = user.isActive;
        token.isApproved = user.isApproved;
        console.log("✅ JWT token updated with user data");
      }
      
      // Refresh user data on each request to check current status
      if (token.sub) {
        try {
          await connectDB();
          const currentUser = await User.findById(token.sub).select('isActive role isApproved');
          if (currentUser) {
            token.isActive = currentUser.isActive !== false;
            token.role = currentUser.role || 'user';
            token.isApproved = currentUser.isApproved;
            console.log("✅ JWT token refreshed from database");
          }
        } catch (error) {
          console.error("🚨 Error refreshing user status:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("🔍 Session callback - token exists:", !!token);
      
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
        session.user.isApproved = token.isApproved as boolean;
        console.log("✅ Session updated with token data");
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Setup type declarations for NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    isApproved: boolean;
    isActive?: boolean;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      isApproved: boolean;
      isActive?: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isApproved: boolean;
    isActive?: boolean;
  }
}

// Note: All custom JWT functions removed since NextAuth handles authentication
// The authOptions export above is all you need for NextAuth configuration