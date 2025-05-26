// File: app/api/auth/login/route.ts
import { NextRequest } from 'next/server';

// Remove this custom login route entirely since you're using NextAuth
// NextAuth handles authentication through its own API routes

export async function POST(req: NextRequest) {
  return Response.json(
    { success: false, message: 'Please use NextAuth authentication endpoints' },
    { status: 400 }
  );
}