// File: middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define which paths are protected (require login)
  const protectedPaths = [
    "/dashboard", 
    "/admin", 
    "/schema", 
    "/schema-doc", 
    "/user-journey", 
    "/user-analysis",
    "/content-analysis"
  ];
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp));
  
  // Define paths that are specifically for admins
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some(ap => path.startsWith(ap));
  
  // Define public paths (accessible without login)
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some(pp => path === pp);
  
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // If user is not logged in and trying to access a protected route
    if (!token && isProtectedPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // If user is logged in but trying to access a public route like login/register
    if (token && isPublicPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // If user is logged in but account is disabled
    if (token && isProtectedPath && token.isActive === false) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'AccountDisabled');
      return NextResponse.redirect(loginUrl);
    }
    
    // If user is logged in but not approved
    if (token && isProtectedPath && token.isApproved === false) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'AccountPending');
      return NextResponse.redirect(loginUrl);
    }
    
    // If user is logged in but trying to access admin route without being a superadmin
    if (token && isAdminPath && token.role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // If there's an error with token validation, redirect to login
    if (isProtectedPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static files (assets)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};