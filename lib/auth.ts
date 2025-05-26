// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./db";
import { User } from "@/models/User";
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.isApproved) {
          return null;
        }

        // Check if user is active
        if (user.isActive === false) {
          throw new Error("Account has been disabled");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          isActive: user.isActive !== false,
          isApproved: user.isApproved
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isActive = user.isActive;
        token.isApproved = user.isApproved;
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
          }
        } catch (error) {
          console.error("Error refreshing user status:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
        session.user.isApproved = token.isApproved as boolean;
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
/**
 * Authenticate user credentials and return user object
 */
export async function authenticateUser({ email, password }: { email: string, password: string }) {
  await connectDB();
  const user = await User.findOne({ email });

  if (!user || !user.isApproved) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  return user.toObject();
}

/**
 * Generate JWT token from user info
 */
export async function generateToken(user: any) {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  const alg = 'HS256';

  return await new SignJWT({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role || 'user',
    isActive: user.isActive !== false,
    isApproved: user.isApproved,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

/**
 * Set JWT token as HTTP-only cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies(); // ⬅ await it
  cookieStore.set('next-auth.session-token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth_token',
    value: '',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(0), // Set expiry in the past to clear it
  });
}
