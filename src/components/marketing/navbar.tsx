'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    name: 'Fan Intelligence Hub',
    href: '/features/intelligence',
    description: 'AI-powered insights into your merchandise performance',
  },
  {
    name: 'Asset Tagging',
    href: '/features/tagging',
    description: 'Map products to IP assets with AI assistance',
  },
  {
    name: 'Revenue Analytics',
    href: '/features/analytics',
    description: 'Track revenue by character, theme, and more',
  },
  {
    name: 'Data Connectors',
    href: '/features/connectors',
    description: 'Connect Shopify, Amazon, and more',
  },
];

const navLinks = [
  { name: 'FAQ', href: '/faq' },
  { name: 'Roadmap', href: '/roadmap' },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
    }

    if (featuresOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [featuresOpen]);

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
            'flex items-center gap-2 px-4 py-2.5 transition-all duration-300',
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
          <div className="hidden md:flex items-center gap-1">
            {/* Features Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 text-sm transition-colors',
                  featuresOpen || pathname.startsWith('/features')
                    ? 'text-[#0a0a0a] font-medium'
                    : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]'
                )}
              >
                Features
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', featuresOpen && 'rotate-180')} />
              </button>

              {featuresOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#e5e5e5] shadow-lg p-2">
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      onClick={() => setFeaturesOpen(false)}
                      className="block p-3 hover:bg-[#fafafa] transition-colors"
                    >
                      <p className="text-sm font-medium text-[#0a0a0a]">{feature.name}</p>
                      <p className="text-xs text-[#737373] mt-0.5">{feature.description}</p>
                    </Link>
                  ))}
                  <div className="border-t border-[#e5e5e5] mt-2 pt-2">
                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="flex items-center justify-between p-3 text-sm text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
                    >
                      View all features
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/waitlist"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#262626] transition-colors"
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
              {/* Features Section */}
              <div className="py-3 border-b border-[#f5f5f5]">
                <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wide mb-3">Features</p>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-[#737373] hover:text-[#0a0a0a]"
                    >
                      {feature.name}
                    </Link>
                  ))}
                </div>
              </div>

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
