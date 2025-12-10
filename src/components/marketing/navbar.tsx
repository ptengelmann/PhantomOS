'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Roadmap', href: '/roadmap' },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
          scrolled ? 'top-2' : 'top-4'
        )}
      >
        <nav
          className={cn(
            'flex items-center gap-1 px-2 py-2 transition-all duration-300',
            'bg-white/90 backdrop-blur-md border border-[#e5e5e5] shadow-sm',
            scrolled ? 'shadow-md' : 'shadow-sm'
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="px-3 py-1.5 text-lg font-semibold text-[#0a0a0a] tracking-tight hover:bg-[#fafafa] transition-colors"
          >
            PhantomOS<span className="text-[#a3a3a3]">.</span>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-[#e5e5e5]" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 text-sm transition-colors',
                  pathname === link.href
                    ? 'text-[#0a0a0a] font-medium'
                    : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-[#e5e5e5]" />

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/waitlist"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#262626] transition-colors"
            >
              Join Waitlist
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="flex flex-col h-full pt-20 px-6">
            <div className="flex-1 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block py-3 text-lg border-b border-[#f5f5f5] transition-colors',
                    pathname === link.href
                      ? 'text-[#0a0a0a] font-medium'
                      : 'text-[#737373]'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="py-6 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center text-[#737373] border border-[#e5e5e5]"
              >
                Sign in
              </Link>
              <Link
                href="/waitlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#0a0a0a] text-white font-medium"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
