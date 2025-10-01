// File: types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    isApproved?: boolean;
    isActive?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      isApproved?: boolean;
      isActive?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  // Simple declaration so TS doesn't complain when you import getToken
  export function getToken(params: any): Promise<any>;
}