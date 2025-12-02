import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = ['/login', '/register', '/forgot-password', '/invite'];
        const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

        // API routes for auth are public
        if (pathname.startsWith('/api/auth')) {
          return true;
        }

        // Public routes don't need auth
        if (isPublicRoute || pathname === '/') {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|demo/).*)',
  ],
};
