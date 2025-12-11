'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Brain, Tag, BarChart3, Plug, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    name: 'Fan Intelligence',
    href: '/features/intelligence',
    description: 'AI-powered insights into what your fans actually want',
    icon: Brain,
  },
  {
    name: 'Asset Tagging',
    href: '/features/tagging',
    description: 'Map products to characters, themes, and IPs',
    icon: Tag,
  },
  {
    name: 'Analytics',
    href: '/features/analytics',
    description: 'Revenue breakdowns by IP asset and trend detection',
    icon: BarChart3,
  },
  {
    name: 'Connectors',
    href: '/features/connectors',
    description: 'Shopify, Amazon, WooCommerce and more',
    icon: Plug,
  },
];

const navLinks = [
  { name: 'FAQ', href: '/faq' },
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Updates', href: '/updates' },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFeaturesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setFeaturesOpen(false), 150);
  };

  return (
    <>
      {/* Full-width mega menu backdrop */}
      {featuresOpen && (
        <div
          className="fixed inset-0 bg-black/5 z-40 top-14"
          onClick={() => setFeaturesOpen(false)}
        />
      )}

      {/* Regular Navbar - visible when not scrolled */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 bg-white/80 backdrop-blur-sm'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="relative group">
              <span className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
                Phantom<span className="italic font-light">OS</span><span className="text-[#a3a3a3]">.</span>
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-1">
              {/* Features with mega menu */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={cn(
                    'px-4 py-2 text-sm transition-all duration-200 flex items-center gap-1',
                    featuresOpen || pathname.startsWith('/features')
                      ? 'text-[#0a0a0a]'
                      : 'text-[#737373] hover:text-[#0a0a0a]'
                  )}
                >
                  Features
                  <ChevronDown className={cn(
                    'w-3 h-3 transition-transform duration-200',
                    featuresOpen ? 'rotate-180' : ''
                  )} />
                </button>

                {/* Mega Menu */}
                {featuresOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-white border border-[#e5e5e5] shadow-2xl p-6 min-w-[550px]">
                      <div className="grid grid-cols-2 gap-4">
                        {features.map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <Link
                              key={feature.name}
                              href={feature.href}
                              onClick={() => setFeaturesOpen(false)}
                              className="group flex gap-4 p-4 hover:bg-[#fafafa] transition-colors"
                            >
                              <div className="flex-shrink-0 w-10 h-10 bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#0a0a0a] transition-colors">
                                <Icon className="w-5 h-5 text-[#737373] group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#0a0a0a] mb-0.5">{feature.name}</p>
                                <p className="text-xs text-[#737373] leading-relaxed">{feature.description}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#f5f5f5] flex items-center justify-between">
                        <span className="text-xs text-[#a3a3a3]">Explore all capabilities</span>
                        <Link
                          href="/features"
                          onClick={() => setFeaturesOpen(false)}
                          className="flex items-center gap-2 text-sm font-medium text-[#0a0a0a] hover:gap-3 transition-all"
                        >
                          View all
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm transition-colors',
                    pathname === link.href
                      ? 'text-[#0a0a0a]'
                      : 'text-[#737373] hover:text-[#0a0a0a]'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/waitlist"
                className="group flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#262626] transition-all"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
            >
              <div className="relative w-5 h-4">
                <span className={cn(
                  'absolute left-0 w-5 h-0.5 bg-[#0a0a0a] transition-all duration-300',
                  mobileMenuOpen ? 'top-1.5 rotate-45' : 'top-0'
                )} />
                <span className={cn(
                  'absolute left-0 top-1.5 w-5 h-0.5 bg-[#0a0a0a] transition-all duration-300',
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                )} />
                <span className={cn(
                  'absolute left-0 w-5 h-0.5 bg-[#0a0a0a] transition-all duration-300',
                  mobileMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                )} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Floating Pill Navbar - visible when scrolled */}
      <div
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500',
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="hidden md:flex items-center gap-1 px-2 py-2 bg-white/95 backdrop-blur-md border border-[#e5e5e5] shadow-lg">
          {/* Logo - compact */}
          <Link href="/" className="px-3 py-1.5 mr-2">
            <span className="text-lg font-bold text-[#0a0a0a] tracking-tight">
              P<span className="italic font-light">OS</span><span className="text-[#a3a3a3]">.</span>
            </span>
          </Link>

          <div className="w-px h-5 bg-[#e5e5e5]" />

          {/* Features dropdown in pill */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                'px-3 py-1.5 text-sm transition-all duration-200 flex items-center gap-1',
                featuresOpen || pathname.startsWith('/features')
                  ? 'text-[#0a0a0a]'
                  : 'text-[#737373] hover:text-[#0a0a0a]'
              )}
            >
              Features
              <ChevronDown className={cn(
                'w-3 h-3 transition-transform duration-200',
                featuresOpen ? 'rotate-180' : ''
              )} />
            </button>

            {/* Mega Menu for Pill */}
            {featuresOpen && scrolled && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white border border-[#e5e5e5] shadow-2xl p-6 min-w-[550px]">
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <Link
                          key={feature.name}
                          href={feature.href}
                          onClick={() => setFeaturesOpen(false)}
                          className="group flex gap-4 p-4 hover:bg-[#fafafa] transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#0a0a0a] transition-colors">
                            <Icon className="w-5 h-5 text-[#737373] group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#0a0a0a] mb-0.5">{feature.name}</p>
                            <p className="text-xs text-[#737373] leading-relaxed">{feature.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#f5f5f5] flex items-center justify-between">
                    <span className="text-xs text-[#a3a3a3]">Explore all capabilities</span>
                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-[#0a0a0a] hover:gap-3 transition-all"
                    >
                      View all
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
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
                  ? 'text-[#0a0a0a]'
                  : 'text-[#737373] hover:text-[#0a0a0a]'
              )}
            >
              {link.name}
            </Link>
          ))}

          <div className="w-px h-5 bg-[#e5e5e5] ml-1" />

          <Link
            href="/login"
            className="px-3 py-1.5 text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/waitlist"
            className="group flex items-center gap-1.5 px-4 py-1.5 bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#262626] transition-all ml-1"
          >
            Join
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'fixed inset-0 z-40 bg-white md:hidden transition-all duration-500',
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <div className="flex flex-col h-full pt-20 px-6">
          <div className="flex-1">
            {/* Features Grid */}
            <div className="mb-8">
              <p className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-6">Features</p>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-4 border border-[#e5e5e5] hover:border-[#0a0a0a] transition-colors"
                    >
                      <Icon className="w-5 h-5 text-[#737373] mb-3" />
                      <p className="text-sm font-medium text-[#0a0a0a]">{feature.name}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Other Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block py-4 text-2xl font-light border-b border-[#f5f5f5] transition-colors',
                    pathname === link.href ? 'text-[#0a0a0a]' : 'text-[#737373]'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="py-8 space-y-3">
            <Link
              href="/waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#0a0a0a] text-white font-medium"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-4 text-center text-[#737373] border border-[#e5e5e5]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
