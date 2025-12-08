import Link from 'next/link';
import {
  Check,
  Clock,
  Brain,
  Tag,
  BarChart3,
  Plug,
  Palette,
  Factory,
  Store,
  Users,
  Image as ImageIcon,
  Calendar,
  ShoppingCart,
  Filter,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// What's Live Now - Core Platform
const liveFeatures = [
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Revenue metrics, trend charts, category breakdowns, and CSV export.',
    highlights: ['Revenue by asset', 'Growth tracking', 'Export reports'],
  },
  {
    icon: Brain,
    title: 'Fan Intelligence Hub',
    description: 'AI-powered insights that analyze your sales and surface opportunities.',
    highlights: ['AI recommendations', 'Risk alerts', 'Trend detection'],
  },
  {
    icon: Tag,
    title: 'AI Asset Tagging',
    description: 'Map products to characters and IP with AI-assisted suggestions.',
    highlights: ['Auto-tagging', 'Confidence scores', 'Bulk operations'],
  },
  {
    icon: Plug,
    title: 'Data Connectors',
    description: 'Connect Shopify via OAuth or import any data via CSV.',
    highlights: ['Shopify OAuth', 'CSV import', 'Product sync'],
  },
];

// Coming Soon - Q1 2026
const comingSoon = [
  {
    icon: ShoppingCart,
    title: 'Amazon Connector',
    description: 'Connect Amazon Seller Central to unify all your sales data.',
    quarter: 'Q1 2026',
  },
  {
    icon: ImageIcon,
    title: 'AI Image Recognition',
    description: 'AI analyzes product images to automatically detect characters and logos.',
    quarter: 'Q1 2026',
  },
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Custom date ranges, regional breakdowns, and saved filter presets.',
    quarter: 'Q1 2026',
  },
  {
    icon: Plug,
    title: 'WooCommerce Connector',
    description: 'Native integration with WooCommerce-powered stores.',
    quarter: 'Q2 2026',
  },
];

// Future Vision - 2026+
const futureVision = [
  {
    icon: Palette,
    title: 'Merch Studio',
    description: 'AI-powered merchandise design generation from your IP assets.',
  },
  {
    icon: Factory,
    title: 'Production Integration',
    description: 'Connect to print-on-demand partners like Printful and Printify.',
  },
  {
    icon: Store,
    title: 'Hosted Storefronts',
    description: 'Launch direct-to-fan stores with your branding.',
  },
  {
    icon: Users,
    title: 'Creator Partnerships',
    description: 'Tools for influencer collaborations and revenue sharing.',
  },
];

function LiveFeatureCard({ feature }: { feature: typeof liveFeatures[0] }) {
  const Icon = feature.icon;
  return (
    <div className="bg-white border border-[#e5e5e5] p-6 relative">
      {/* Live Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium">
          <Check className="w-3 h-3" />
          Live
        </span>
      </div>

      <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">{feature.title}</h3>
      <p className="text-sm text-[#737373] mb-4">{feature.description}</p>

      <div className="flex flex-wrap gap-2">
        {feature.highlights.map((highlight) => (
          <span key={highlight} className="px-2 py-1 bg-[#f5f5f5] text-xs text-[#737373]">
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
}

function ComingSoonCard({ feature }: { feature: typeof comingSoon[0] }) {
  const Icon = feature.icon;
  return (
    <div className="bg-white border border-[#e5e5e5] p-5 hover:border-[#0a0a0a] transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#0a0a0a]">{feature.title}</h3>
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium">
              {feature.quarter}
            </span>
          </div>
          <p className="text-sm text-[#737373]">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}

function FutureCard({ feature }: { feature: typeof futureVision[0] }) {
  const Icon = feature.icon;
  return (
    <div className="p-5 border border-dashed border-[#e5e5e5] bg-[#fafafa]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[#a3a3a3]" />
        </div>
        <div>
          <h3 className="font-medium text-[#737373] mb-1">{feature.title}</h3>
          <p className="text-sm text-[#a3a3a3]">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#e5e5e5] text-sm text-[#737373] mb-6">
            <Calendar className="w-4 h-4" />
            Last updated December 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
            Product Roadmap
          </h1>
          <p className="text-lg text-[#737373] max-w-2xl mx-auto leading-relaxed">
            See what&apos;s live, what&apos;s coming next, and where we&apos;re headed.
            Our roadmap is shaped by publisher feedback.
          </p>
        </div>
      </section>

      {/* What's Live Now */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0a0a0a]">What&apos;s Live Now</h2>
              <p className="text-sm text-[#737373]">Core platform features available today</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveFeatures.map((feature) => (
              <LiveFeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 lg:py-24 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0a0a0a]">Coming Soon</h2>
              <p className="text-sm text-[#737373]">In active development for early 2026</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {comingSoon.map((feature) => (
              <ComingSoonCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#737373]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0a0a0a]">Future Vision</h2>
              <p className="text-sm text-[#737373]">Where we&apos;re headed in 2026 and beyond</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {futureVision.map((feature) => (
              <FutureCard key={feature.title} feature={feature} />
            ))}
          </div>

          <p className="text-center text-sm text-[#a3a3a3] mt-8">
            Future features are subject to change based on user feedback and market needs.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Globe className="w-12 h-12 text-[#737373] mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Want to Shape the Roadmap?
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            Join our pilot program and help us build the features that matter most to gaming publishers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
            >
              Join the Pilot Program
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 border border-[#404040] text-white font-medium hover:bg-[#171717] transition-colors text-center"
            >
              Request a Feature
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
