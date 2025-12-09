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
  ShoppingCart,
  Filter,
  ArrowRight,
  Sparkles,
  Circle
} from 'lucide-react';

// What's Live Now
const liveFeatures = [
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Revenue metrics, trend charts, category breakdowns, and CSV export.',
  },
  {
    icon: Brain,
    title: 'Fan Intelligence Hub',
    description: 'AI-powered insights that analyze your sales and surface opportunities.',
  },
  {
    icon: Tag,
    title: 'AI Asset Tagging',
    description: 'Map products to characters and IP with AI-assisted suggestions.',
  },
  {
    icon: Plug,
    title: 'Data Connectors',
    description: 'Connect Shopify via OAuth or import any data via CSV.',
  },
];

// Q1 2026
const q1Features = [
  {
    icon: ShoppingCart,
    title: 'Amazon Connector',
    description: 'Connect Amazon Seller Central to unify all your sales data.',
  },
  {
    icon: ImageIcon,
    title: 'AI Image Recognition',
    description: 'AI analyzes product images to automatically detect characters and logos.',
  },
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Custom date ranges, regional breakdowns, and saved filter presets.',
  },
  {
    icon: Plug,
    title: 'WooCommerce Connector',
    description: 'Native integration with WooCommerce-powered stores.',
  },
];

// Future Vision
const futureFeatures = [
  {
    icon: Palette,
    title: 'Merch Studio',
    description: 'AI-powered merchandise design generation from your IP assets.',
    timeline: 'Q2 2026',
  },
  {
    icon: Factory,
    title: 'Production Integration',
    description: 'Connect to print-on-demand partners like Printful and Printify.',
    timeline: 'Q3 2026',
  },
  {
    icon: Store,
    title: 'Hosted Storefronts',
    description: 'Launch direct-to-fan stores with your branding.',
    timeline: 'Q3 2026',
  },
  {
    icon: Users,
    title: 'Creator Partnerships',
    description: 'Tools for influencer collaborations and revenue sharing.',
    timeline: 'Q4 2026',
  },
];

export default function RoadmapPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">PRODUCT ROADMAP</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              Building in <span className="italic font-light">Public</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto mb-8">
              See what's live, what's coming next, and where we're headed. Our roadmap is shaped by publisher feedback.
            </p>
            <div className="text-sm text-[#a3a3a3]">
              Last updated December 2025
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6">
          {/* Live Now */}
          <div className="relative pb-24">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e5e5e5]" />

            {/* Timeline Dot */}
            <div className="absolute left-0 top-0 w-8 h-8 -ml-4 bg-[#0a0a0a] border-4 border-white flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>

            {/* Content */}
            <div className="pl-16">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-2">NOW</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
                Live & Available
              </h2>
              <p className="text-lg text-[#737373] font-light mb-12 max-w-2xl">
                Core platform features available in pilot program today.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {liveFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0a0a0a] mb-2">{feature.title}</h3>
                          <p className="text-sm text-[#737373] leading-relaxed font-light">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Q1 2026 */}
          <div className="relative pb-24">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e5e5e5]" />

            {/* Timeline Dot */}
            <div className="absolute left-0 top-0 w-8 h-8 -ml-4 bg-white border-2 border-[#0a0a0a] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#0a0a0a]" />
            </div>

            {/* Content */}
            <div className="pl-16">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-2">IN PROGRESS</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
                Q1 2026
              </h2>
              <p className="text-lg text-[#737373] font-light mb-12 max-w-2xl">
                In active development. Expected release January - March 2026.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {q1Features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#0a0a0a]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0a0a0a] mb-2">{feature.title}</h3>
                          <p className="text-sm text-[#737373] leading-relaxed font-light">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="relative">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-0 w-8 h-8 -ml-4 bg-white border-2 border-[#e5e5e5] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#737373]" />
            </div>

            {/* Content */}
            <div className="pl-16">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-2">FUTURE</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
                Beyond 2026
              </h2>
              <p className="text-lg text-[#737373] font-light mb-12 max-w-2xl">
                Where we're headed. Timelines subject to change based on user feedback.
              </p>

              <div className="space-y-4">
                {futureFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="bg-[#fafafa] border border-dashed border-[#e5e5e5] p-6"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-[#737373]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#0a0a0a] mb-2">{feature.title}</h3>
                            <p className="text-sm text-[#737373] leading-relaxed font-light">{feature.description}</p>
                          </div>
                        </div>
                        <div className="text-xs text-[#a3a3a3] whitespace-nowrap">{feature.timeline}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Request */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Help Shape the Roadmap
          </h2>
          <p className="text-xl text-[#737373] font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our pilot program and influence which features we build next. Your feedback directly shapes our priorities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/waitlist"
              className="group px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-all inline-flex items-center justify-center gap-2"
            >
              Join the Pilot Program
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="mailto:feedback@phantomos.com"
              className="px-8 py-4 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:border-[#0a0a0a] transition-all text-center"
            >
              Request a Feature
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Start Using PhantomOS Today
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            All live features are available now in our pilot program. No waiting, no roadblocks.
          </p>

          <Link
            href="/waitlist"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
