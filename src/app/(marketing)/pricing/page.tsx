import Link from 'next/link';
import { Check, X, ArrowRight, HelpCircle, Zap, Building2, Rocket } from 'lucide-react';

type FeatureIncluded = boolean | 'limited';

interface TierFeature {
  name: string;
  included: FeatureIncluded;
  detail?: string;
}

const tiers: Array<{
  name: string;
  description: string;
  price: string;
  priceDetail: string;
  rum: string;
  rumLabel: string;
  cta: string;
  ctaLink: string;
  highlighted: boolean;
  icon: typeof Zap;
  features: TierFeature[];
}> = [
  {
    name: 'Starter',
    description: 'Perfect for pilot programs and small publishers',
    price: 'Free',
    priceDetail: '30-day pilot',
    rum: 'Up to $1M',
    rumLabel: 'Revenue Under Management',
    cta: 'Start Free Pilot',
    ctaLink: '/register',
    highlighted: false,
    icon: Zap,
    features: [
      { name: 'Shopify & CSV Connectors', included: true },
      { name: 'Manual Asset Tagging', included: true },
      { name: 'Overview Dashboard', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Up to 3 team members', included: true },
      { name: 'AI Auto-Tagging', included: false },
      { name: 'Fan Intelligence Hub', included: 'limited' as const, detail: '7-day data lag' },
      { name: 'AI Insights Engine', included: false },
      { name: 'Amazon Connector', included: false },
      { name: 'Priority Support', included: false },
    ],
  },
  {
    name: 'Growth',
    description: 'For scaling publishers who need real-time insights',
    price: '$999',
    priceDetail: 'per month',
    rum: 'Up to $10M',
    rumLabel: 'Revenue Under Management',
    cta: 'Start Free Trial',
    ctaLink: '/register?plan=growth',
    highlighted: true,
    icon: Rocket,
    features: [
      { name: 'Shopify & CSV Connectors', included: true },
      { name: 'AI Auto-Tagging', included: true },
      { name: 'Full Dashboard Access', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Up to 10 team members', included: true },
      { name: 'Fan Intelligence Hub', included: true, detail: 'Real-time data' },
      { name: 'AI Insights Engine', included: true },
      { name: 'Amazon Connector', included: true },
      { name: 'Email Support', included: true },
      { name: 'API Access', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For major publishers with complex needs',
    price: 'Custom',
    priceDetail: 'contact us',
    rum: 'Unlimited',
    rumLabel: 'Revenue Under Management',
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlighted: false,
    icon: Building2,
    features: [
      { name: 'All Growth Features', included: true },
      { name: 'Unlimited RUM', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Custom Connectors', included: true },
      { name: 'Role-Based Access Control', included: true },
      { name: 'AI Demand Forecasting', included: true },
      { name: 'Custom Reporting', included: true },
      { name: 'Full API Access', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'SLA Guarantee', included: true },
    ],
  },
];

const faqs = [
  {
    question: 'What is Revenue Under Management (RUM)?',
    answer: 'RUM is the total annual merchandise revenue that PhantomOS tracks and analyzes for your organization. This includes all sales data from your connected stores and data sources.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing cycle.',
  },
  {
    question: 'What happens after the 30-day pilot?',
    answer: 'After your pilot ends, you can choose to upgrade to a paid plan to keep your data and continue using PhantomOS. If you don\'t upgrade, your account will be paused but your data will be retained for 30 days.',
  },
  {
    question: 'Do you offer annual billing?',
    answer: 'Yes, annual billing comes with a 20% discount. Contact our sales team for annual pricing.',
  },
  {
    question: 'What if I exceed my RUM limit?',
    answer: 'We\'ll notify you when you\'re approaching your limit. You can either upgrade to a higher tier or we\'ll work with you on a custom plan that fits your needs.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. All data is encrypted at rest and in transit. We\'re SOC 2 Type II compliant and follow industry best practices for data protection.',
  },
];

function FeatureRow({ name, included, detail }: TierFeature) {
  return (
    <li className="flex items-start gap-3 py-2">
      {included === true ? (
        <div className="w-5 h-5 bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-green-600" />
        </div>
      ) : included === 'limited' ? (
        <div className="w-5 h-5 bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-yellow-600" />
        </div>
      ) : (
        <div className="w-5 h-5 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0 mt-0.5">
          <X className="w-3 h-3 text-[#a3a3a3]" />
        </div>
      )}
      <div>
        <span className={included ? 'text-[#0a0a0a]' : 'text-[#a3a3a3]'}>{name}</span>
        {detail && (
          <span className={`ml-2 text-xs ${included === 'limited' ? 'text-yellow-600' : 'text-[#737373]'}`}>
            ({detail})
          </span>
        )}
      </div>
    </li>
  );
}

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-[#737373] max-w-2xl mx-auto leading-relaxed">
            Pricing based on your Revenue Under Management. Start with a free pilot,
            then scale as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative bg-white border ${
                    tier.highlighted ? 'border-[#0a0a0a] border-2' : 'border-[#e5e5e5]'
                  } p-8`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0a0a0a] text-white text-xs font-medium">
                      Most Popular
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#0a0a0a]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0a0a0a]">{tier.name}</h3>
                    <p className="text-sm text-[#737373] mt-1">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-[#e5e5e5]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#0a0a0a]">{tier.price}</span>
                      <span className="text-sm text-[#737373]">{tier.priceDetail}</span>
                    </div>
                    <div className="mt-3 p-3 bg-[#fafafa] border border-[#e5e5e5]">
                      <p className="text-xs text-[#737373] uppercase tracking-wider">{tier.rumLabel}</p>
                      <p className="text-lg font-semibold text-[#0a0a0a]">{tier.rum}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1 mb-8">
                    {tier.features.map((feature) => (
                      <FeatureRow key={feature.name} {...feature} />
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={tier.ctaLink}
                    className={`block w-full py-3 text-center font-medium transition-colors ${
                      tier.highlighted
                        ? 'bg-[#0a0a0a] text-white hover:bg-[#171717]'
                        : 'border border-[#e5e5e5] text-[#0a0a0a] hover:bg-[#fafafa]'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-12">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-[#e5e5e5]">
              <thead>
                <tr className="border-b border-[#e5e5e5]">
                  <th className="text-left p-4 font-medium text-[#0a0a0a] w-1/4">Feature</th>
                  <th className="text-center p-4 font-medium text-[#0a0a0a]">Starter</th>
                  <th className="text-center p-4 font-medium text-[#0a0a0a] bg-[#fafafa]">Growth</th>
                  <th className="text-center p-4 font-medium text-[#0a0a0a]">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                <tr>
                  <td className="p-4 text-sm text-[#737373]">Revenue Under Management</td>
                  <td className="p-4 text-center text-sm">Up to $1M</td>
                  <td className="p-4 text-center text-sm bg-[#fafafa]">Up to $10M</td>
                  <td className="p-4 text-center text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">Team Members</td>
                  <td className="p-4 text-center text-sm">3</td>
                  <td className="p-4 text-center text-sm bg-[#fafafa]">10</td>
                  <td className="p-4 text-center text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">Shopify Connector</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-4 text-center bg-[#fafafa]"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">Amazon Connector</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center bg-[#fafafa]"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">AI Auto-Tagging</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center bg-[#fafafa]"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">AI Insights Engine</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center bg-[#fafafa]"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">Fan Intelligence Hub</td>
                  <td className="p-4 text-center text-xs text-yellow-600">7-day lag</td>
                  <td className="p-4 text-center bg-[#fafafa]"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">AI Demand Forecasting</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center bg-[#fafafa]"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">API Access</td>
                  <td className="p-4 text-center"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center bg-[#fafafa]"><X className="w-4 h-4 text-[#a3a3a3] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-[#737373]">Support</td>
                  <td className="p-4 text-center text-sm">Community</td>
                  <td className="p-4 text-center text-sm bg-[#fafafa]">Email</td>
                  <td className="p-4 text-center text-sm">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-[#e5e5e5] p-6">
                <h3 className="font-medium text-[#0a0a0a] flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#737373] flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-sm text-[#737373] mt-3 ml-8 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            Start your free 30-day revenue audit today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
            >
              Start Free Pilot
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 border border-[#404040] text-white font-medium hover:bg-[#171717] transition-colors text-center"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
