'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  initAnalytics,
  identifyUser,
  trackPageView,
  resetAnalytics,
} from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Identify user when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      identifyUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        publisherId: session.user.publisherId,
        publisherName: session.user.publisherName,
      });
    } else if (status === 'unauthenticated') {
      resetAnalytics();
    }
  }, [session, status]);

  // Track page views
  useEffect(() => {
    if (pathname) {
      // Derive page name from pathname
      const pageName = getPageName(pathname);
      trackPageView(pageName, {
        path: pathname,
        search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// Helper to get friendly page names
function getPageName(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Landing Page',
    '/overview': 'Dashboard',
    '/intelligence': 'Intelligence Hub',
    '/products': 'Asset Tagging',
    '/connectors': 'Connectors',
    '/settings': 'Settings',
    '/login': 'Login',
    '/register': 'Register',
    '/waitlist': 'Waitlist',
    '/features': 'Features Overview',
    '/features/intelligence': 'Feature: Intelligence',
    '/features/tagging': 'Feature: Tagging',
    '/features/analytics': 'Feature: Analytics',
    '/features/connectors': 'Feature: Connectors',
    '/pricing': 'Pricing',
    '/about': 'About',
    '/contact': 'Contact',
    '/how-it-works': 'How It Works',
    '/roadmap': 'Roadmap',
    '/updates': 'Updates',
    '/faq': 'FAQ',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Service',
    '/security': 'Security',
    '/careers': 'Careers',
    '/admin': 'Admin Panel',
  };

  return routes[pathname] || pathname;
}
