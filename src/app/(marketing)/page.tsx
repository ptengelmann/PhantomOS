'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Brain, Tag, BarChart3, Plug, Sparkles, TrendingUp, Users, Zap, ArrowUpRight, ChevronRight, FileSpreadsheet } from 'lucide-react';

// Pilot mode
const SIGNUP_URL = '/waitlist';
const SIGNUP_CTA = 'Join the Pilot Program';

// Feature Carousel Component
function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      id: 'intelligence',
      name: 'Fan Intelligence Hub',
      slug: '/features/intelligence',
      icon: Brain,
      description: 'AI analyzes your sales patterns and product catalog to surface actionable insights about what your fans actually want.',
      preview: (
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e5e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#737373] uppercase tracking-wide mb-1">Opportunity</div>
                <div className="text-sm font-medium text-[#0a0a0a]">Shadow Knight products show 40% higher conversion</div>
              </div>
              <div className="text-xs bg-[#0a0a0a] text-white px-2 py-1">94%</div>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">Analysis shows this character drives significantly more revenue. Consider expanding product line.</p>
          </div>
          <div className="bg-white border border-[#e5e5e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#737373] uppercase tracking-wide mb-1">Trend</div>
                <div className="text-sm font-medium text-[#0a0a0a]">Pixel character trending up 67% this month</div>
              </div>
              <div className="text-xs bg-[#0a0a0a] text-white px-2 py-1">88%</div>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">Fan demand increasing. Stock more Pixel merchandise.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'tagging',
      name: 'AI Asset Tagging',
      slug: '/features/tagging',
      icon: Tag,
      description: 'Automatically map products to characters and themes. What used to take weeks now takes minutes with AI-powered suggestions.',
      preview: (
        <div className="bg-white border border-[#e5e5e5] p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#e5e5e5]">
              <div className="w-16 h-16 bg-[#fafafa] border border-[#e5e5e5]" />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#0a0a0a] mb-2">Shadow Knight Premium T-Shirt</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs px-2 py-1 bg-[#0a0a0a] text-white">Shadow Knight</div>
                  <div className="text-xs px-2 py-1 border border-[#e5e5e5] text-[#737373]">Apparel</div>
                  <div className="text-xs text-[#737373]">AI Suggested · 94%</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#0a0a0a] text-white text-xs font-medium">Accept</button>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-[#e5e5e5]">
              <div className="w-16 h-16 bg-[#fafafa] border border-[#e5e5e5]" />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#0a0a0a] mb-2">Pixel Plush Keychain</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs px-2 py-1 bg-[#0a0a0a] text-white">Pixel</div>
                  <div className="text-xs px-2 py-1 border border-[#e5e5e5] text-[#737373]">Collectible</div>
                  <div className="text-xs text-[#737373]">AI Suggested · 96%</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#0a0a0a] text-white text-xs font-medium">Accept</button>
            </div>
            <div className="text-center pt-2">
              <div className="text-xs text-[#a3a3a3]">Auto-tagging 156 products...</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      name: 'Revenue Analytics',
      slug: '/features/analytics',
      icon: BarChart3,
      description: 'See exactly how much revenue each character, theme, or IP asset generates. Filter by time period, region, or sales channel.',
      preview: (
        <div className="bg-white border border-[#e5e5e5] p-8">
          <div className="mb-6">
            <div className="text-xs text-[#737373] uppercase tracking-wide mb-4">Revenue by Character</div>
            <div className="space-y-4">
              {[
                { name: 'Shadow Knight', revenue: 89400, percentage: 92 },
                { name: 'Pixel', revenue: 67200, percentage: 69 },
                { name: 'Luna Starfire', revenue: 45800, percentage: 47 },
                { name: 'Iron Fang', revenue: 24100, percentage: 25 },
              ].map((char, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#0a0a0a]">{char.name}</span>
                    <span className="text-[#737373]">${(char.revenue / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-2 bg-[#fafafa] border border-[#e5e5e5]">
                    <div className="h-full bg-[#0a0a0a]" style={{ width: `${char.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'connectors',
      name: 'Data Connectors',
      slug: '/features/connectors',
      icon: Plug,
      description: 'One-click OAuth for Shopify. CSV import for everything else. All your merchandise data aggregated in one place.',
      preview: (
        <div className="bg-white border border-[#e5e5e5] p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-[#fafafa] border border-[#e5e5e5]">
              <div className="w-20 h-20 bg-white border border-[#e5e5e5] flex items-center justify-center p-4">
                <Image src="/logos/shopify.svg" alt="Shopify" width={64} height={64} className="object-contain w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#0a0a0a] mb-1">Shopify Store</div>
                <div className="text-xs text-[#737373]">Connected • Last synced 2 min ago</div>
              </div>
              <div className="text-xs bg-[#0a0a0a] text-white px-3 py-1">Active</div>
            </div>
            <div className="flex items-center gap-6 p-6 border border-[#e5e5e5]">
              <div className="w-20 h-20 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <FileSpreadsheet className="w-10 h-10 text-[#737373]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#0a0a0a] mb-1">CSV Import</div>
                <div className="text-xs text-[#737373]">Upload product catalogs & sales data</div>
              </div>
              <button className="px-4 py-2 border border-[#e5e5e5] text-xs font-medium hover:border-[#0a0a0a] transition-colors">
                Import
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeFeature = features[activeIndex];
  const Icon = activeFeature.icon;

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">PLATFORM FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
            From AI insights to data connectors, see how PhantomOS transforms your merchandise intelligence
          </p>
        </div>

        {/* Custom Carousel */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Navigation Tabs - Left Side */}
          <div className="lg:col-span-4 space-y-2">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-6 border transition-all group ${
                    activeIndex === index
                      ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                      : 'bg-white border-[#e5e5e5] hover:border-[#0a0a0a]'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <FeatureIcon className={`w-6 h-6 ${activeIndex === index ? 'text-white' : 'text-[#0a0a0a]'}`} />
                    <span className={`font-semibold ${activeIndex === index ? 'text-white' : 'text-[#0a0a0a]'}`}>
                      {feature.name}
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed ${
                    activeIndex === index ? 'text-[#a3a3a3]' : 'text-[#737373]'
                  }`}>
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className={`text-xs font-medium ${
                      activeIndex === index ? 'text-white' : 'text-[#0a0a0a]'
                    }`}>
                      Learn more
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      activeIndex === index ? 'text-white translate-x-1' : 'text-[#737373] group-hover:translate-x-1'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview - Right Side */}
          <div className="lg:col-span-8">
            <Link
              href={activeFeature.slug}
              className="block group"
            >
              <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8 group-hover:border-[#0a0a0a] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0a0a0a] text-lg">{activeFeature.name}</div>
                      <div className="text-xs text-[#737373]">Click to explore feature →</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-[#737373] group-hover:text-[#0a0a0a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>

                {/* Animated Preview */}
                <div className="transition-opacity duration-300">
                  {activeFeature.preview}
                </div>
              </div>
            </Link>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1 transition-all ${
                    activeIndex === index ? 'w-8 bg-[#0a0a0a]' : 'w-1 bg-[#e5e5e5] hover:bg-[#a3a3a3]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Asymmetric Layout */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left: Content - 7 cols */}
            <div className="lg:col-span-7 space-y-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium group hover:gap-3 transition-all cursor-default">
                <Sparkles className="w-4 h-4" />
                <span className="tracking-wide">AI-POWERED INSIGHTS</span>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Headline */}
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0a0a0a] leading-[1.1] tracking-tight">
                  Know What
                  <br />
                  Your Fans
                  <br />
                  <span className="italic font-light">Actually</span> Love
                </h1>

                <div className="w-24 h-px bg-[#0a0a0a]" />
              </div>

              {/* Subheadline */}
              <p className="text-xl text-[#525252] leading-relaxed max-w-xl font-light">
                PhantomOS reveals which characters and IP assets drive your merchandise revenue.
                <span className="text-[#0a0a0a] font-normal"> Stop guessing. Start knowing.</span>
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link
                  href={SIGNUP_URL}
                  className="group relative px-6 py-3 bg-[#0a0a0a] text-white font-medium overflow-hidden flex items-center justify-center gap-2 hover:gap-3 transition-all"
                >
                  <span className="relative z-10">{SIGNUP_CTA}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-[#171717] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link
                  href="#features"
                  className="group px-6 py-3 bg-white text-[#0a0a0a] font-medium border border-[#e5e5e5] hover:border-[#0a0a0a] transition-all text-center flex items-center justify-center gap-2"
                >
                  See How It Works
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Line */}
              <p className="text-sm text-[#a3a3a3] tracking-wide">
                FREE 30-DAY PILOT · NO CREDIT CARD · 5-MINUTE SETUP
              </p>
            </div>

            {/* Right: Visual - 5 cols */}
            <div className="lg:col-span-5 relative">
              {/* Floating Card 1 - Top */}
              <div className="absolute -top-12 -right-8 z-20 bg-white border-2 border-[#0a0a0a] p-6 shadow-2xl animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#737373] uppercase tracking-wider">Revenue Growth</p>
                    <p className="text-2xl font-bold text-[#0a0a0a]">+34%</p>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Preview */}
              <div className="relative bg-white border-2 border-[#0a0a0a] shadow-2xl">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#fafafa] border-b-2 border-[#0a0a0a]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-[#0a0a0a]" />
                    <div className="w-3 h-3 border border-[#0a0a0a]" />
                    <div className="w-3 h-3 border border-[#0a0a0a]" />
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-8 bg-white">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Revenue', value: '$227K', growth: '+24%' },
                      { label: 'Orders', value: '2.8K', growth: '+18%' },
                      { label: 'Products', value: '156', growth: '+12%' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#fafafa] border border-[#e5e5e5] p-4">
                        <div className="text-xs text-[#737373] mb-2 tracking-wide uppercase">{stat.label}</div>
                        <div className="text-xl font-bold text-[#0a0a0a] mb-1">{stat.value}</div>
                        <div className="text-xs text-[#0a0a0a]">{stat.growth}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Preview */}
                  <div className="bg-[#fafafa] border border-[#e5e5e5] p-6">
                    <div className="flex items-end justify-between gap-1 h-32">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[#0a0a0a] transition-all duration-1000 ease-out hover:bg-[#525252]"
                          style={{
                            height: `${height}%`,
                            animationDelay: `${i * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - Bottom */}
              <div className="absolute -bottom-8 -left-8 z-20 bg-[#0a0a0a] text-white p-6 shadow-2xl animate-float-delayed">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8" />
                  <div>
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wider">AI Insights</p>
                    <p className="text-lg font-semibold">12 New</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution - Split Design */}
      <section id="features" className="pt-16 lg:pt-20 pb-24 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">THE PROBLEM</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight leading-[1.15]">
              Your Merchandise Data
              <br />
              is a <span className="italic font-light">Black Box</span>
            </h2>
            <p className="text-lg text-[#737373] leading-relaxed font-light">
              You know total revenue. But which character drove 40% of Q4? Which theme is trending?
              Which assets are underperforming? <span className="text-[#0a0a0a] font-normal">You're flying blind.</span>
            </p>
          </div>

          {/* Before/After Grid */}
          <div className="grid lg:grid-cols-2 gap-2">
            {/* Before */}
            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a0a0a] opacity-[0.02] transform rotate-45 translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="text-xs font-bold text-[#0a0a0a] mb-8 tracking-[0.3em] uppercase">Without PhantomOS</div>
                <ul className="space-y-6">
                  {[
                    'Spreadsheets with thousands of SKUs',
                    'No visibility into IP performance',
                    'Manual tagging taking weeks',
                    'Decisions based on gut feeling',
                    'Revenue opportunities missed',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <div className="w-6 h-6 mt-0.5 border-2 border-[#0a0a0a] flex items-center justify-center flex-shrink-0 group-hover/item:rotate-45 transition-transform">
                        <span className="text-xs">✕</span>
                      </div>
                      <span className="text-[#737373] font-light text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* After */}
            <div className="bg-[#0a0a0a] text-white p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="text-xs font-bold mb-8 tracking-[0.3em] uppercase">With PhantomOS</div>
                <ul className="space-y-6">
                  {[
                    'One dashboard, all your data',
                    'Revenue by character, theme, IP',
                    'AI auto-tags products in minutes',
                    'Data-driven licensing decisions',
                    'Maximize high-performing assets',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <div className="w-6 h-6 mt-0.5 bg-white text-[#0a0a0a] flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-white font-light text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <FeatureCarousel />

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Large text background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] select-none pointer-events-none">
          <div className="text-[16rem] font-bold tracking-tighter">START</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight leading-[1.15]">
            Ready to See What
            <br />
            Your Fans Love?
          </h2>

          <p className="text-xl text-[#737373] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Free 30-day pilot. Connect your data in minutes and get AI-powered insights.
          </p>

          <Link
            href={SIGNUP_URL}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:gap-4 transition-all"
          >
            {SIGNUP_CTA}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-center gap-12 mt-16 text-sm text-[#a3a3a3]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>5-minute setup</span>
            </div>
            <div className="w-px h-4 bg-[#e5e5e5]" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>No credit card</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
