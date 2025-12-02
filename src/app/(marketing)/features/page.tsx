import Link from 'next/link';
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
  Users
} from 'lucide-react';

const mainFeatures = [
  {
    slug: 'intelligence',
    icon: Brain,
    name: 'Fan Intelligence Hub',
    tagline: 'AI-Powered Merchandise Insights',
    description: 'Get actionable insights into what your fans actually want. Our AI analyzes your sales patterns, product catalog, and market trends to surface opportunities you\'d otherwise miss.',
    benefits: [
      'Identify which characters and themes drive the most revenue',
      'Get AI-generated recommendations for new merchandise',
      'Detect underperforming assets before they become problems',
      'Track fan preferences across regions and channels',
    ],
    illustration: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 bg-white border border-[#e5e5e5]">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a]">Growth Opportunity</p>
            <p className="text-xs text-[#737373]">Link character products show 34% higher conversion</p>
          </div>
          <div className="text-sm font-medium text-green-600">+$45K</div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white border border-[#e5e5e5]">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a]">Emerging Trend</p>
            <p className="text-xs text-[#737373]">Retro theme products up 156% MoM</p>
          </div>
          <div className="text-sm font-medium text-purple-600">Trending</div>
        </div>
      </div>
    ),
  },
  {
    slug: 'tagging',
    icon: Tag,
    name: 'AI Asset Tagging',
    tagline: 'From Weeks to Minutes',
    description: 'Stop wasting time manually categorizing thousands of products. Our AI analyzes product names, descriptions, and images to automatically map them to your IP assets.',
    benefits: [
      'AI suggests mappings with confidence scores',
      'Accept or reject suggestions with one click',
      'Bulk operations for efficiency',
      'Support for multi-asset products',
    ],
    illustration: (
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 bg-white border border-[#e5e5e5]">
          <div className="w-12 h-12 bg-[#f5f5f5] rounded-sm" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a]">Mario Kart T-Shirt</p>
          </div>
          <div className="flex gap-1">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium">Mario</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium">Racing</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white border border-[#e5e5e5]">
          <div className="w-12 h-12 bg-[#f5f5f5] rounded-sm" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a]">Princess Zelda Poster</p>
          </div>
          <div className="flex gap-1">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium">AI Suggested</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white border border-[#e5e5e5]">
          <div className="w-12 h-12 bg-[#f5f5f5] rounded-sm" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0a0a0a]">Pikachu Plush Toy</p>
          </div>
          <div className="flex gap-1">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium">Pending</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: 'analytics',
    icon: BarChart3,
    name: 'Revenue Analytics',
    tagline: 'Know Exactly What Sells',
    description: 'Finally see your merchandise revenue broken down by IP asset. Understand which characters, themes, and product categories drive your business.',
    benefits: [
      'Revenue attribution by character and theme',
      'Time-based trend analysis',
      'Regional and channel breakdowns',
      'Export reports for stakeholders',
    ],
    illustration: (
      <div className="p-4 bg-white border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-[#0a0a0a]">Revenue by Asset</p>
          <p className="text-xs text-[#737373]">Last 30 days</p>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Mario', value: 85, revenue: '$124,500' },
            { name: 'Link', value: 65, revenue: '$89,200' },
            { name: 'Pikachu', value: 45, revenue: '$52,800' },
            { name: 'Sonic', value: 30, revenue: '$34,100' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <p className="text-sm text-[#737373] w-16">{item.name}</p>
              <div className="flex-1 h-4 bg-[#f5f5f5] rounded-sm overflow-hidden">
                <div className="h-full bg-[#0a0a0a] rounded-sm" style={{ width: `${item.value}%` }} />
              </div>
              <p className="text-sm font-medium text-[#0a0a0a] w-20 text-right">{item.revenue}</p>
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
    tagline: 'All Your Data in One Place',
    description: 'Connect your e-commerce platforms and import data from any source. PhantomOS automatically syncs your products and sales data.',
    benefits: [
      'One-click Shopify OAuth connection',
      'Amazon Seller Central integration',
      'CSV import for any data source',
      'Automatic sync and updates',
    ],
    illustration: (
      <div className="flex flex-col items-center gap-4 p-4 bg-white border border-[#e5e5e5]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#96bf48] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-px bg-[#0a0a0a]" />
            <Zap className="w-4 h-4 text-green-500" />
            <div className="w-8 h-px bg-[#0a0a0a]" />
          </div>
          <div className="w-14 h-14 bg-[#0a0a0a] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">P</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#ff9900] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-px bg-[#0a0a0a]" />
            <Zap className="w-4 h-4 text-green-500" />
            <div className="w-8 h-px bg-[#0a0a0a]" />
          </div>
          <div className="w-14 h-14 bg-[#0a0a0a] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">P</span>
          </div>
        </div>
        <p className="text-xs text-[#737373] mt-2">Connected & Syncing</p>
      </div>
    ),
  },
];

const additionalFeatures = [
  {
    icon: Target,
    name: 'Smart Filters',
    description: 'Filter products by status, category, IP, or custom tags',
  },
  {
    icon: Clock,
    name: 'Real-time Sync',
    description: 'Data updates automatically as sales come in',
  },
  {
    icon: Shield,
    name: 'Secure & Private',
    description: 'SOC 2 compliant with enterprise-grade security',
  },
  {
    icon: Users,
    name: 'Team Collaboration',
    description: 'Invite team members with role-based permissions',
  },
  {
    icon: Zap,
    name: 'Fast Performance',
    description: 'Lightning-fast queries on millions of records',
  },
  {
    icon: Sparkles,
    name: 'AI-First Design',
    description: 'AI assistance throughout the entire platform',
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
            Features Built for Gaming Publishers
          </h1>
          <p className="text-lg text-[#737373] max-w-2xl mx-auto leading-relaxed">
            Everything you need to understand your merchandise performance and make data-driven
            decisions about your IP.
          </p>
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
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    !isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={!isEven ? 'lg:order-2' : ''}>
                    <div className="w-14 h-14 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#0a0a0a]" />
                    </div>
                    <p className="text-sm font-medium text-[#737373] uppercase tracking-wider mb-2">
                      {feature.tagline}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
                      {feature.name}
                    </h2>
                    <p className="text-lg text-[#737373] leading-relaxed mb-8">
                      {feature.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-[#0a0a0a]">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/features/${feature.slug}`}
                      className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:underline"
                    >
                      Learn more about {feature.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className={`bg-[#fafafa] border border-[#e5e5e5] p-8 ${!isEven ? 'lg:order-1' : ''}`}>
                    {feature.illustration}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-4">
              And Much More
            </h2>
            <p className="text-lg text-[#737373]">
              Additional features to power your merchandise operations
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.name}
                  className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#0a0a0a]" />
                  </div>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">{feature.name}</h3>
                  <p className="text-sm text-[#737373]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-[#737373] mb-8 max-w-2xl mx-auto">
            Start your free 30-day revenue audit. Connect your data in minutes and see
            which IP assets drive your merchandise revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-colors flex items-center justify-center gap-2"
            >
              Start Free Pilot
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:bg-[#fafafa] transition-colors text-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
