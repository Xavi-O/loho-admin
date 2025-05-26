// File: app/api/auth/logout/route.ts
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  clearAuthCookie();
  
  return Response.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
}