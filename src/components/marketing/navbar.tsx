'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
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

const resources = [
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Documentation', href: '/docs' },
  { name: 'Blog', href: '/blog' },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e5e5]">
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="PhantomOS"
            width={280}
            height={96}
            className="w-48 h-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Features Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className="flex items-center gap-1 text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
            >
              Features
              <ChevronDown className={cn('w-4 h-4 transition-transform', featuresOpen && 'rotate-180')} />
            </button>

            {featuresOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#e5e5e5] shadow-lg p-2">
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
                    className="flex items-center gap-2 p-3 text-sm font-medium text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
                  >
                    View all features
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/faq"
            className={cn(
              'text-sm transition-colors',
              pathname === '/faq' ? 'text-[#0a0a0a] font-medium' : 'text-[#737373] hover:text-[#0a0a0a]'
            )}
          >
            FAQ
          </Link>

          <Link
            href="/roadmap"
            className={cn(
              'text-sm transition-colors',
              pathname === '/roadmap' ? 'text-[#0a0a0a] font-medium' : 'text-[#737373] hover:text-[#0a0a0a]'
            )}
          >
            Roadmap
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/waitlist"
            className="px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#171717] transition-colors"
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e5e5e5] px-6 py-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wider mb-2">Features</p>
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-[#737373] hover:text-[#0a0a0a]"
                >
                  {feature.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-[#e5e5e5] pt-4">
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-[#737373] hover:text-[#0a0a0a]"
              >
                FAQ
              </Link>
              <Link
                href="/roadmap"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-[#737373] hover:text-[#0a0a0a]"
              >
                Roadmap
              </Link>
            </div>
            <div className="border-t border-[#e5e5e5] pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm text-[#737373]"
              >
                Sign in
              </Link>
              <Link
                href="/waitlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 bg-[#0a0a0a] text-white text-sm font-medium"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
