import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Check if we're in pilot mode (waitlist required)
const isPilotMode = process.env.PILOT_MODE === 'true';

// Emails that can always access the dashboard (you + any approved testers)
// Add emails here to bypass waitlist during development
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // In pilot mode, redirect /register to /waitlist
    if (isPilotMode && pathname === '/register') {
      return NextResponse.redirect(new URL('/waitlist', req.url));
    }

    // Check if user is allowed in pilot mode
    if (isPilotMode && token?.email) {
      const userEmail = (token.email as string).toLowerCase();
      const isAllowed = ALLOWED_EMAILS.includes(userEmail);

      // If user is logged in but not on allowed list, redirect to a "pending approval" page
      // For now, we'll let them through since they're authenticated
      // You can make this stricter if needed
      if (!isAllowed) {
        // Optional: You could redirect to a "pending approval" page here
        // return NextResponse.redirect(new URL('/pending-approval', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Marketing routes are always public
        const marketingRoutes = ['/', '/features', '/pricing', '/roadmap', '/waitlist', '/contact', '/about', '/careers', '/faq', '/privacy', '/terms', '/security', '/how-it-works', '/updates'];
        const isMarketingRoute = marketingRoutes.some((route) =>
          pathname === route || pathname.startsWith('/features/')
        );

        if (isMarketingRoute) {
          return true;
        }

        // Auth routes
        const authRoutes = ['/login', '/register', '/forgot-password', '/invite'];
        const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

        // API routes for auth and waitlist are public
        if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/waitlist')) {
          return true;
        }

        // In pilot mode, /register is redirected to /waitlist (handled above)
        // but we still need to allow the route check
        if (isAuthRoute) {
          return true;
        }

        // All dashboard routes require authentication
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
     * - public folder files (images, logos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|PhantomOSIcon.svg|logos/|demo/|og-image.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.xml$|.*\\.txt$).*)',
  ],
};
