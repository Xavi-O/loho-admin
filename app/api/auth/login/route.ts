// File: app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { authenticateUser, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await authenticateUser({ email, password });
    
    if (!user) {
      return Response.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = await generateToken(user);
    
    // Set HTTP-only cookie
    await setAuthCookie(token);
    
    // Don't return the password hash
    const { passwordHash, ...userWithoutPassword } = user;
    
    return Response.json({ 
      success: true, 
      message: 'Login successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}