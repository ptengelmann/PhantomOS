import Link from 'next/link';
import { Check, Sparkles, Users, MessageSquare, ArrowRight, Building2, Rocket } from 'lucide-react';

const currentFeatures = [
  'Shopify & CSV data connectors',
  'Manual asset tagging system',
  'Overview dashboard with key metrics',
  'Basic analytics and reporting',
  'Multi-team member support',
  'Secure data encryption',
];

const comingSoonFeatures = [
  { name: 'AI-powered auto-tagging', status: 'Q1 2026' },
  { name: 'Fan Intelligence Hub', status: 'Q1 2026' },
  { name: 'AI Insights Engine', status: 'Q2 2026' },
  { name: 'Amazon marketplace connector', status: 'Q2 2026' },
  { name: 'Demand forecasting', status: 'Q3 2026' },
  { name: 'API access for integrations', status: 'Q3 2026' },
];

const accessTiers = [
  {
    name: 'Pilot Program',
    description: 'Early access for game publishers',
    icon: Rocket,
    features: [
      'Full platform access',
      'Priority feature requests',
      'Direct feedback channel',
      'Grandfathered pricing when we launch',
    ],
    cta: 'Join Waitlist',
    ctaLink: '/waitlist',
  },
  {
    name: 'Enterprise Early Access',
    description: 'Tailored solutions for major publishers',
    icon: Building2,
    features: [
      'Custom implementation',
      'Dedicated support team',
      'Feature development input',
      'Flexible data connectors',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

const faqs = [
  {
    question: 'When will PhantomOS be generally available?',
    answer: 'We\'re currently in early access with select game publishers. General availability is planned for Q2 2026. Join the pilot program to get early access and grandfathered pricing.',
  },
  {
    question: 'What will pricing look like at launch?',
    answer: 'Pricing will be based on Revenue Under Management (RUM) - the total annual merchandise revenue we track for you. Pilot program members will receive significant grandfathered discounts.',
  },
  {
    question: 'Can I request specific features?',
    answer: 'Absolutely! We\'re building PhantomOS with our pilot partners. Your feedback directly influences our roadmap. Use the feedback form below to suggest features.',
  },
  {
    question: 'What data sources do you support?',
    answer: 'Currently we support Shopify and CSV imports. Amazon marketplace connector is coming Q2 2026. Need a specific connector? Let us know and we\'ll prioritize it.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. All data is encrypted in transit and at rest. We use bcrypt password hashing, SSL database connections, and follow industry best practices for data protection.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">EARLY ACCESS</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Join the <span className="italic font-light">Pilot</span> Program
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            We're building PhantomOS with game publishers. Get early access, influence our roadmap,
            and lock in grandfathered pricing before general availability.
          </p>
        </section>

        {/* Access Tiers */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 gap-6">
            {accessTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div key={tier.name} className="bg-white border border-[#e5e5e5] p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-[#0a0a0a]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0a0a0a] mb-2">{tier.name}</h3>
                      <p className="text-[#737373]">{tier.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#0a0a0a] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0a0a0a]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.ctaLink}
                    className="block w-full py-4 text-center bg-[#0a0a0a] text-white font-medium hover:bg-[#262626] transition-colors"
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Current Features */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-[#0a0a0a]" />
              <h2 className="text-2xl font-bold text-[#0a0a0a]">Available Now</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {currentFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0a0a0a] flex-shrink-0 mt-0.5" />
                  <span className="text-[#0a0a0a]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-[#fafafa] border border-[#e5e5e5] p-10">
            <div className="flex items-center gap-3 mb-8">
              <Rocket className="w-6 h-6 text-[#737373]" />
              <h2 className="text-2xl font-bold text-[#0a0a0a]">On the Roadmap</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {comingSoonFeatures.map((feature) => (
                <div key={feature.name} className="flex items-start justify-between gap-4">
                  <span className="text-[#737373]">{feature.name}</span>
                  <span className="text-xs text-[#a3a3a3] font-medium tracking-wide flex-shrink-0">{feature.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Feedback */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-[#0a0a0a]" />
              <h2 className="text-2xl font-bold text-[#0a0a0a]">Request Features</h2>
            </div>
            <p className="text-[#737373] mb-8 leading-relaxed">
              Building PhantomOS for game publishers. Your feedback shapes our roadmap.
              Tell us what features would help you understand your fans better.
            </p>
            <div className="space-y-4">
              <textarea
                rows={4}
                placeholder="What features would help you better understand your merchandise customers?"
                className="w-full px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                />
                <button className="px-6 py-3 bg-[#0a0a0a] text-white font-medium hover:bg-[#262626] transition-colors">
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
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
              Ready to Join <span className="italic font-light">Early</span> Access?
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Get full platform access, influence our roadmap, and lock in grandfathered pricing
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/waitlist"
                className="w-full sm:w-auto px-10 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
              >
                Join Pilot Program
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-10 py-4 border border-[#404040] text-white font-medium hover:bg-[#171717] transition-colors text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
