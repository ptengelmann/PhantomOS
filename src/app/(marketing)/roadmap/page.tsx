import Link from 'next/link';
import {
  Check,
  Clock,
  Calendar,
  Brain,
  Tag,
  BarChart3,
  Plug,
  Palette,
  Factory,
  Store,
  Users,
  Sparkles,
  Shield,
  Globe,
  Zap,
  ArrowRight
} from 'lucide-react';

type RoadmapStatus = 'completed' | 'in_progress' | 'planned' | 'exploring';

interface RoadmapItem {
  title: string;
  description: string;
  status: RoadmapStatus;
  features: string[];
  icon: React.ElementType;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  quarter: string;
  status: RoadmapStatus;
  items: RoadmapItem[];
}

const roadmap: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    quarter: 'Q4 2024',
    status: 'completed',
    items: [
      {
        title: 'Fan Intelligence Hub',
        description: 'AI-powered insights into merchandise performance',
        status: 'completed',
        icon: Brain,
        features: [
          'Real-time AI analysis of sales data',
          'Growth opportunity detection',
          'Risk and performance alerts',
          'Interactive insight cards',
        ],
      },
      {
        title: 'Asset Tagging System',
        description: 'Map products to IP assets with AI assistance',
        status: 'completed',
        icon: Tag,
        features: [
          'AI auto-tagging suggestions',
          'Bulk tagging operations',
          'Multi-asset product support',
          'Confidence scoring',
        ],
      },
      {
        title: 'Data Connectors',
        description: 'Connect your e-commerce data sources',
        status: 'completed',
        icon: Plug,
        features: [
          'Shopify OAuth integration',
          'CSV import system',
          'Automatic product sync',
          'Order data ingestion',
        ],
      },
      {
        title: 'Analytics Dashboard',
        description: 'Comprehensive revenue and performance metrics',
        status: 'completed',
        icon: BarChart3,
        features: [
          'Revenue by asset breakdown',
          'Time-based trend analysis',
          'Category performance',
          'Growth comparisons',
        ],
      },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Merch Studio',
    quarter: 'Q1 2025',
    status: 'in_progress',
    items: [
      {
        title: 'AI Design Generator',
        description: 'Generate merchandise designs from IP assets',
        status: 'in_progress',
        icon: Palette,
        features: [
          'AI-powered design generation',
          'Template library for products',
          'Style transfer options',
          'Batch generation',
        ],
      },
      {
        title: 'Mockup Previews',
        description: 'See designs on product mockups instantly',
        status: 'planned',
        icon: Sparkles,
        features: [
          'T-shirt mockups',
          'Poster and print mockups',
          'Accessory mockups',
          'Custom mockup upload',
        ],
      },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Production',
    quarter: 'Q1-Q2 2025',
    status: 'planned',
    items: [
      {
        title: 'Print-on-Demand Integration',
        description: 'Connect to fulfillment partners',
        status: 'planned',
        icon: Factory,
        features: [
          'Printful integration',
          'Printify integration',
          'Order routing automation',
          'Production tracking',
        ],
      },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Storefront',
    quarter: 'Q2 2025',
    status: 'planned',
    items: [
      {
        title: 'Hosted Stores',
        description: 'Direct-to-fan e-commerce storefronts',
        status: 'planned',
        icon: Store,
        features: [
          'Publisher-branded stores',
          'Custom domain support',
          'Full checkout experience',
          'Customer accounts',
        ],
      },
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Creators',
    quarter: 'Q3 2025',
    status: 'exploring',
    items: [
      {
        title: 'Creator Partnerships',
        description: 'Influencer and creator collaboration tools',
        status: 'exploring',
        icon: Users,
        features: [
          'Creator marketplace',
          'Revenue sharing automation',
          'Affiliate tracking',
          'Campaign management',
        ],
      },
    ],
  },
  {
    phase: 'Phase 6',
    title: 'Enterprise',
    quarter: 'Q4 2025',
    status: 'exploring',
    items: [
      {
        title: 'Enterprise Features',
        description: 'Features for large publishers',
        status: 'exploring',
        icon: Shield,
        features: [
          'SSO/SAML integration',
          'Audit logging',
          'Custom reporting',
          'Multi-region support',
        ],
      },
      {
        title: 'Advanced AI',
        description: 'Next-generation AI capabilities',
        status: 'exploring',
        icon: Zap,
        features: [
          'Demand forecasting',
          'Natural language queries',
          'Image recognition',
          'Trend prediction',
        ],
      },
    ],
  },
];

const statusConfig: Record<RoadmapStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-100', icon: Check },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
  planned: { label: 'Planned', color: 'text-purple-600', bg: 'bg-purple-100', icon: Calendar },
  exploring: { label: 'Exploring', color: 'text-[#737373]', bg: 'bg-[#f5f5f5]', icon: Sparkles },
};

function StatusBadge({ status }: { status: RoadmapStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const Icon = item.icon;
  return (
    <div className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#0a0a0a]" />
        </div>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">{item.title}</h3>
      <p className="text-sm text-[#737373] mb-4">{item.description}</p>
      <ul className="space-y-2">
        {item.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#737373]">
            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              item.status === 'completed' ? 'text-green-500' : 'text-[#e5e5e5]'
            }`} />
            {feature}
          </li>
        ))}
      </ul>
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
            Updated December 2024
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
            Product Roadmap
          </h1>
          <p className="text-lg text-[#737373] max-w-2xl mx-auto leading-relaxed">
            See what we&apos;re building and what&apos;s coming next. Our roadmap is shaped by user feedback
            and the evolving needs of gaming publishers.
          </p>
        </div>
      </section>

      {/* Status Legend */}
      <section className="py-8 border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-3 h-3 ${config.color}`} />
                  </div>
                  <span className="text-sm text-[#737373]">{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-24">
            {roadmap.map((phase, phaseIndex) => (
              <div key={phase.phase} className="relative">
                {/* Timeline Line */}
                {phaseIndex < roadmap.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-[#e5e5e5] hidden lg:block" />
                )}

                {/* Phase Header */}
                <div className="flex items-start gap-8 mb-8">
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                    phase.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : phase.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-[#f5f5f5] text-[#737373]'
                  }`}>
                    {phase.status === 'completed' ? (
                      <Check className="w-6 h-6" />
                    ) : phase.status === 'in_progress' ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <Calendar className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-[#737373]">{phase.phase}</span>
                      <span className="text-sm text-[#a3a3a3]">•</span>
                      <span className="text-sm text-[#a3a3a3]">{phase.quarter}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0a0a0a]">{phase.title}</h2>
                  </div>
                </div>

                {/* Phase Items */}
                <div className="lg:ml-20">
                  <div className="grid md:grid-cols-2 gap-6">
                    {phase.items.map((item) => (
                      <RoadmapCard key={item.title} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest Feature CTA */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Globe className="w-12 h-12 text-[#737373] mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-4">
            Have a Feature Request?
          </h2>
          <p className="text-lg text-[#737373] mb-8 max-w-2xl mx-auto">
            Our roadmap is shaped by user feedback. If you have an idea for a feature that would
            help your team, we&apos;d love to hear it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-colors flex items-center justify-center gap-2"
            >
              Submit Feature Request
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:bg-white transition-colors text-center"
            >
              Start Free Pilot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
