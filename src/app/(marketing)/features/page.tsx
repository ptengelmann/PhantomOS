import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Brain,
  Tag,
  BarChart3,
  Plug,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Clock,
  Shield,
  Users,
  Check,
  ArrowUpRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover PhantomOS features: AI-powered fan intelligence, automated asset tagging, revenue analytics, and seamless data connectors for gaming merchandise.',
  openGraph: {
    title: 'Features | PhantomOS',
    description: 'AI-powered tools to understand what your fans love and optimize your merchandise strategy.',
  },
};

const mainFeatures = [
  {
    slug: 'intelligence',
    icon: Brain,
    name: 'Fan Intelligence Hub',
    tagline: 'AI-POWERED INSIGHTS',
    description: 'Get actionable insights into what your fans actually want. Our AI analyzes your sales patterns, product catalog, and market trends to surface opportunities you\'d otherwise miss.',
    benefits: [
      'Identify which characters and themes drive the most revenue',
      'Get AI-generated recommendations for new merchandise',
      'Detect underperforming assets before they become problems',
      'Track fan preferences across regions and channels',
    ],
    illustration: (
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-6 bg-white border border-[#e5e5e5]">
          <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#737373] uppercase tracking-wide mb-1">Opportunity</p>
            <p className="text-sm font-medium text-[#0a0a0a]">Shadow Knight products show 34% higher conversion</p>
          </div>
          <div className="text-xs bg-[#0a0a0a] text-white px-2 py-1 font-medium">94%</div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white border border-[#e5e5e5]">
          <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#737373] uppercase tracking-wide mb-1">Trend</p>
            <p className="text-sm font-medium text-[#0a0a0a]">Pixel character trending up 67% this month</p>
          </div>
          <div className="text-xs bg-[#0a0a0a] text-white px-2 py-1 font-medium">88%</div>
        </div>
      </div>
    ),
  },
  {
    slug: 'tagging',
    icon: Tag,
    name: 'AI Asset Tagging',
    tagline: 'FROM WEEKS TO MINUTES',
    description: 'Stop wasting time manually categorizing thousands of products. Our AI analyzes product names and descriptions to suggest IP asset mappings with confidence scores.',
    benefits: [
      'AI suggests mappings with 90%+ confidence scores',
      'Accept or reject suggestions with one click',
      'Bulk operations for maximum efficiency',
      'Support for multi-asset products',
    ],
    illustration: (
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-4 bg-white border border-[#e5e5e5]">
          <div className="w-14 h-14 bg-[#fafafa] border border-[#e5e5e5]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a] mb-2">Shadow Knight T-Shirt</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[#0a0a0a] text-white text-xs">Shadow Knight</span>
              <span className="px-2 py-1 border border-[#e5e5e5] text-xs text-[#737373]">Apparel</span>
            </div>
          </div>
          <div className="text-xs text-[#737373]">AI: 96%</div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white border border-[#e5e5e5]">
          <div className="w-14 h-14 bg-[#fafafa] border border-[#e5e5e5]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a] mb-2">Pixel Plush Keychain</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[#0a0a0a] text-white text-xs">Pixel</span>
              <span className="px-2 py-1 border border-[#e5e5e5] text-xs text-[#737373]">Collectible</span>
            </div>
          </div>
          <div className="text-xs text-[#737373]">AI: 94%</div>
        </div>
      </div>
    ),
  },
  {
    slug: 'analytics',
    icon: BarChart3,
    name: 'Revenue Analytics',
    tagline: 'KNOW EXACTLY WHAT SELLS',
    description: 'Finally see your merchandise revenue broken down by IP asset. Understand which characters, themes, and product categories drive your business.',
    benefits: [
      'Revenue attribution by character and theme',
      'Time-based trend analysis and forecasting',
      'Regional and channel breakdowns',
      'Export reports for stakeholders',
    ],
    illustration: (
      <div className="p-6 bg-white border border-[#e5e5e5]">
        <div className="text-xs text-[#737373] uppercase tracking-wide mb-6">Revenue by Character</div>
        <div className="space-y-4">
          {[
            { name: 'Shadow Knight', value: 92, revenue: '$89.4K' },
            { name: 'Pixel', value: 69, revenue: '$67.2K' },
            { name: 'Luna Starfire', value: 47, revenue: '$45.8K' },
            { name: 'Iron Fang', value: 25, revenue: '$24.1K' },
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#0a0a0a]">{item.name}</span>
                <span className="text-[#737373]">{item.revenue}</span>
              </div>
              <div className="h-2 bg-[#fafafa] border border-[#e5e5e5]">
                <div className="h-full bg-[#0a0a0a] transition-all" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    slug: 'connectors',
    icon: Plug,
    name: 'Data Connectors',
    tagline: 'ALL YOUR DATA, ONE PLACE',
    description: 'Connect your e-commerce platforms and import data from any source. PhantomOS automatically syncs your products and sales data on a schedule.',
    benefits: [
      'One-click Shopify OAuth connection',
      'CSV import for any data source',
      'Automatic hourly/daily sync',
      'Amazon & WooCommerce coming 2026',
    ],
    illustration: (
      <div className="space-y-6 p-6 bg-white border border-[#e5e5e5]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white border border-[#e5e5e5] flex items-center justify-center p-4">
            <Image src="/logos/shopify.svg" alt="Shopify" width={64} height={64} className="object-contain w-full h-full" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[#0a0a0a] mb-1">Shopify Store</div>
            <div className="text-xs text-[#737373]">OAuth • Auto-sync</div>
          </div>
          <div className="text-xs bg-[#0a0a0a] text-white px-3 py-1">Active</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
            <span className="text-sm font-bold text-[#737373]">CSV</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[#0a0a0a] mb-1">CSV Import</div>
            <div className="text-xs text-[#737373]">Universal format</div>
          </div>
          <button className="text-xs px-3 py-1 border border-[#e5e5e5] hover:border-[#0a0a0a] transition-colors">Import</button>
        </div>
      </div>
    ),
  },
];

const additionalFeatures = [
  {
    icon: Target,
    name: 'Smart Filters',
    description: 'Filter products by status, category, IP, or custom tags for precise analysis',
  },
  {
    icon: Clock,
    name: 'On-Demand Sync',
    description: 'Sync your data whenever you need the latest updates - no waiting',
  },
  {
    icon: Shield,
    name: 'Secure & Private',
    description: 'Bank-level encryption with enterprise-grade security standards',
  },
  {
    icon: Users,
    name: 'Team Collaboration',
    description: 'Invite team members with role-based access permissions',
  },
  {
    icon: Zap,
    name: 'Fast Performance',
    description: 'Optimized queries deliver insights in milliseconds, not minutes',
  },
  {
    icon: Sparkles,
    name: 'Continuous AI',
    description: 'AI learns from your data to provide better recommendations over time',
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">PLATFORM FEATURES</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              Everything You Need to
              <br />
              <span className="italic font-light">Understand</span> Your Fans
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto">
              From AI-powered insights to automated data sync, PhantomOS gives you complete visibility into your merchandise performance.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-32">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={feature.slug}
                  className={`grid lg:grid-cols-12 gap-16 items-center`}
                >
                  {/* Content */}
                  <div className={`lg:col-span-5 ${!isEven ? 'lg:col-start-8' : ''}`}>
                    <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mb-8">
                      <Icon className="w-8 h-8 text-[#0a0a0a]" />
                    </div>

                    <div className="text-xs font-medium text-[#a3a3a3] uppercase tracking-[0.2em] mb-4">
                      {feature.tagline}
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                      {feature.name}
                    </h2>

                    <p className="text-lg text-[#737373] leading-relaxed font-light mb-8">
                      {feature.description}
                    </p>

                    <ul className="space-y-4 mb-10">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <div className="w-5 h-5 border border-[#0a0a0a] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#0a0a0a]" />
                          </div>
                          <span className="text-[#525252] leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/features/${feature.slug}`}
                      className="group inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:gap-3 transition-all"
                    >
                      <span>Explore {feature.name}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>

                  {/* Preview */}
                  <div className={`lg:col-span-7 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8">
                      {feature.illustration}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">ADDITIONAL FEATURES</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
              Built for <span className="italic font-light">Scale</span>
            </h2>
            <p className="text-lg text-[#737373] font-light">
              Everything you need to run a professional merchandise operation, from team collaboration to enterprise security.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.name}
                  className="bg-white border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all group"
                >
                  <Icon className="w-8 h-8 text-[#0a0a0a] mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-[#0a0a0a] mb-2 text-lg">{feature.name}</h3>
                  <p className="text-sm text-[#737373] leading-relaxed font-light">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to See It in <span className="italic font-light">Action</span>?
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Start your free 30-day pilot. Connect your data in minutes and discover which IP assets drive your revenue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/waitlist"
              className="group px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-all inline-flex items-center gap-2"
            >
              Join the Pilot Program
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border border-[#525252] text-white font-medium hover:border-white transition-all text-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
