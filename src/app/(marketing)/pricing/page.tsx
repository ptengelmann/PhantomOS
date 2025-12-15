import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Sparkles, MessageSquare, ArrowRight, Building2, Rocket, TrendingUp, Database, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Join the PhantomOS pilot program. Free during pilot phase for qualified gaming publishers. Shape the future of merchandise intelligence.',
  openGraph: {
    title: 'Pricing | PhantomOS',
    description: 'Free pilot program for gaming publishers. Shape the future of merchandise intelligence.',
  },
};

const pilotFeatures = [
  'Full platform access',
  'Shopify & CSV data connectors',
  'AI-powered asset tagging',
  'Fan Intelligence Hub',
  'Revenue analytics by character',
  'Unlimited team members',
  'Priority feature requests',
  'Direct Slack channel',
  'Grandfathered pricing at launch',
];

const futurePricingTiers = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    description: 'For indie publishers starting their merch journey',
    rum: 'Up to $500K Revenue Under Management',
    features: [
      'All core features',
      '1 Shopify connector',
      'AI tagging (500 products)',
      'Basic analytics',
      '3 team members',
      'Email support',
    ],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$799',
    period: '/month',
    description: 'For publishers scaling their merchandise',
    rum: '$500K - $5M Revenue Under Management',
    features: [
      'Everything in Starter',
      'Unlimited connectors',
      'AI tagging (unlimited)',
      'Advanced analytics',
      'Cross-publisher benchmarks',
      'Unlimited team members',
      'Priority support',
      'API access',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For major publishers with complex needs',
    rum: '$5M+ Revenue Under Management',
    features: [
      'Everything in Growth',
      'Custom integrations',
      'Dedicated account manager',
      'SSO / SAML',
      'Audit logging',
      'Custom reporting',
      'SLA guarantee',
      'On-premise option',
    ],
    highlight: false,
  },
];

const moatPoints = [
  {
    icon: Database,
    title: 'IP Asset Graph',
    description: 'Every mapping you create builds a proprietary database. This data doesn\'t exist anywhere else.',
  },
  {
    icon: TrendingUp,
    title: 'Cross-Publisher Benchmarks',
    description: 'See how your characters perform vs industry averages. Only possible with network scale.',
  },
  {
    icon: Zap,
    title: 'AI That Improves',
    description: 'Our tagging AI learns from every publisher. More users = better suggestions for everyone.',
  },
  {
    icon: Shield,
    title: 'Switching Costs',
    description: 'Your character mappings and historical data become more valuable over time.',
  },
];

const faqs = [
  {
    question: 'What is Revenue Under Management (RUM)?',
    answer: 'RUM is the total annual merchandise revenue we track across all your connected stores. It\'s how we align our pricing with your success - you only pay more as you grow.',
  },
  {
    question: 'Why is the pilot program free?',
    answer: 'We\'re building PhantomOS with game publishers, not for them. Your feedback shapes our product. In exchange for early access and direct input, we offer free usage during the pilot.',
  },
  {
    question: 'What happens to my data if I don\'t continue after pilot?',
    answer: 'You retain full ownership of your data. We can export everything for you. However, pilot members who continue will receive significant grandfathered discounts - typically 40-60% off standard pricing.',
  },
  {
    question: 'How do cross-publisher benchmarks work?',
    answer: 'We aggregate anonymized performance data across all publishers to show how specific character archetypes perform. You see "protagonists average $X per SKU" without any individual publisher data exposed.',
  },
  {
    question: 'Can I request custom connectors?',
    answer: 'Yes! Enterprise customers can request custom integrations. We\'ve built connectors for internal systems, licensing portals, and regional marketplaces based on customer needs.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-block px-4 py-1.5 bg-[#0a0a0a] text-white text-xs tracking-wider uppercase mb-6">
            PILOT PROGRAM ACTIVE
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Free During <span className="italic font-light">Pilot</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed mb-4">
            Build the IP Asset Graph with us. Get full platform access, influence our roadmap,
            and lock in grandfathered pricing before general availability.
          </p>
          <p className="text-sm text-[#a3a3a3]">
            10 pilot slots remaining
          </p>
        </section>

        {/* Pilot Program CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-[#0a0a0a] text-white p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#171717] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-6 h-6" />
                <span className="text-xs tracking-wider uppercase text-[#a3a3a3]">Limited Availability</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Pilot Program</h2>
              <p className="text-[#a3a3a3] mb-8 max-w-xl">
                For game publishers serious about understanding their merchandise. Free during pilot.
                Grandfathered pricing when we launch.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {pilotFeatures.slice(0, 9).map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/waitlist"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                Apply for Pilot
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Free? The Moat */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">WHY FREE?</div>
            <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4">
              You're Building Our <span className="italic font-light">Moat</span>
            </h2>
            <p className="text-[#737373] max-w-2xl mx-auto">
              Every product you tag to a character grows a proprietary database that doesn't exist anywhere else.
              This data makes our AI smarter and unlocks cross-publisher insights.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {moatPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="bg-white border border-[#e5e5e5] p-6">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#0a0a0a]" />
                  </div>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">{point.title}</h3>
                  <p className="text-sm text-[#737373]">{point.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Future Pricing */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">POST-PILOT</div>
            <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4">
              Planned <span className="italic font-light">Pricing</span>
            </h2>
            <p className="text-[#737373] max-w-2xl mx-auto">
              Pricing at general availability. Pilot members receive 40-60% grandfathered discount.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {futurePricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white border p-8 ${
                  tier.highlight
                    ? 'border-[#0a0a0a] ring-1 ring-[#0a0a0a]'
                    : 'border-[#e5e5e5]'
                }`}
              >
                {tier.highlight && (
                  <div className="text-xs tracking-wider uppercase text-[#0a0a0a] font-medium mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#0a0a0a] mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-[#0a0a0a]">{tier.price}</span>
                  <span className="text-[#737373]">{tier.period}</span>
                </div>
                <p className="text-sm text-[#737373] mb-2">{tier.description}</p>
                <p className="text-xs text-[#a3a3a3] mb-6 pb-6 border-b border-[#e5e5e5]">{tier.rum}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0a0a0a] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#0a0a0a]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/waitlist"
                  className={`block w-full py-3 text-center text-sm font-medium transition-colors ${
                    tier.highlight
                      ? 'bg-[#0a0a0a] text-white hover:bg-[#262626]'
                      : 'border border-[#e5e5e5] text-[#0a0a0a] hover:bg-[#fafafa]'
                  }`}
                >
                  Join Pilot First
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[#a3a3a3] mt-8">
            All prices in USD. Billed annually. Monthly billing available at +20%.
          </p>
        </section>

        {/* Enterprise Section */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-[#fafafa] border border-[#e5e5e5] p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-[#0a0a0a]" />
                  <span className="text-xs tracking-wider uppercase text-[#737373]">Enterprise</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4">Major Publisher?</h3>
                <p className="text-[#737373] mb-6">
                  We offer custom implementations for publishers with complex needs.
                  SSO, dedicated support, custom connectors, and more.
                </p>
                <ul className="grid grid-cols-2 gap-2 mb-6">
                  {['Custom integrations', 'Dedicated support', 'SSO / SAML', 'SLA guarantee'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#0a0a0a]">
                      <Check className="w-4 h-4" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#262626] transition-colors"
                >
                  Contact Sales
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center">
            Frequently Asked <span className="italic font-light">Questions</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white border border-[#e5e5e5] p-6">
                <h3 className="font-semibold text-[#0a0a0a] mb-3">{faq.question}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0a0a0a] py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join the <span className="italic font-light">Pilot</span> Today
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Free during pilot. Grandfathered pricing at launch. Help us build the IP Asset Graph.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/waitlist"
                className="w-full sm:w-auto px-10 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
              >
                Apply for Pilot
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-10 py-4 border border-[#404040] text-white font-medium hover:bg-[#171717] transition-colors text-center"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
