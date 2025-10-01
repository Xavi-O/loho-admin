// File: lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type TempUser = {
  email: string;
  password: string;
  role: string;
};

const tempUsers: TempUser[] = process.env.TEMP_USERS
  ? JSON.parse(process.env.TEMP_USERS)
  : [];

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

        const user = tempUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.email, // use email as ID for temp users
          email: user.email,
          name: user.email.split("@")[0],
          role: user.role,
          isApproved: true,
          isActive: true,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.isActive = (user as any).isActive;
        token.isApproved = (user as any).isApproved;
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
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};