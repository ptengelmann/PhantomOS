'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  faqs: FAQ[];
}

const faqCategories: FAQCategory[] = [
  {
    name: 'General',
    faqs: [
      {
        question: 'What is PhantomOS?',
        answer: 'PhantomOS is a merchandise intelligence platform built specifically for gaming publishers. It helps you understand which IP assets (characters, themes, logos) drive your merchandise revenue by connecting your sales data, using AI to tag products, and providing actionable insights.',
      },
      {
        question: 'Who is PhantomOS for?',
        answer: 'PhantomOS is designed for gaming publishers, game studios, and merchandise managers who sell branded products. Whether you have a Shopify store, sell on Amazon, or work with licensing partners, PhantomOS helps you understand your merchandise performance at the IP level.',
      },
      {
        question: 'What problem does PhantomOS solve?',
        answer: 'Gaming publishers often have thousands of merchandise products but no way to know which characters or themes actually drive revenue. Sales data is scattered across platforms, and there\'s no easy way to attribute revenue to specific IP assets. PhantomOS solves this by aggregating your data and using AI to map products to your IP.',
      },
      {
        question: 'How is PhantomOS different from Shopify Analytics or Google Analytics?',
        answer: 'Standard analytics tools show you product-level data (which products sell), but PhantomOS shows you IP-level data (which characters sell). We map your products to your specific IP assets, so you can answer questions like "How much revenue did our villain character generate this quarter?" - something impossible with generic analytics tools.',
      },
    ],
  },
  {
    name: 'Features & Capabilities',
    faqs: [
      {
        question: 'What data sources can I connect?',
        answer: 'Currently, PhantomOS supports Shopify via OAuth integration and CSV imports for any data source. We\'re adding Amazon Seller Central, WooCommerce, and BigCommerce connectors in early 2026.',
      },
      {
        question: 'How does AI auto-tagging work?',
        answer: 'Our AI analyzes your product names, descriptions, and metadata to suggest which IP assets each product features. For example, if you have a "Shadow Knight T-Shirt", the AI will suggest mapping it to your "Shadow Knight" character. You can accept, reject, or modify suggestions with one click.',
      },
      {
        question: 'What is the Fan Intelligence Hub?',
        answer: 'The Fan Intelligence Hub uses AI to analyze your sales data and surface actionable insights. It identifies trends, opportunities, and risks - like noticing that a particular character\'s merchandise is trending up, or that a product category is underperforming.',
      },
      {
        question: 'Can I tag a product with multiple IP assets?',
        answer: 'Yes! Products can be tagged with multiple assets. For example, a poster featuring two characters can be tagged with both, and the revenue will be attributed proportionally in your analytics.',
      },
      {
        question: 'What analytics and reports are available?',
        answer: 'PhantomOS provides revenue dashboards broken down by IP asset, character, theme, product category, and time period. You can see trends, compare performance, and export data to CSV for further analysis or stakeholder reports.',
      },
    ],
  },
  {
    name: 'Pilot Program',
    faqs: [
      {
        question: 'What is the pilot program?',
        answer: 'We\'re currently accepting a limited number of gaming publishers into our founding pilot program. Pilot members get early access to PhantomOS, direct communication with our team, and the opportunity to shape the product roadmap.',
      },
      {
        question: 'How much does the pilot cost?',
        answer: 'The pilot program is completely free. When we launch paid plans, founding pilot members will receive significant discounts locked in for life.',
      },
      {
        question: 'How long is the pilot program?',
        answer: 'The founding pilot runs for 90 days. During this time, you\'ll have full access to all PhantomOS features and direct support from our team.',
      },
      {
        question: 'How do I join the pilot?',
        answer: 'Submit your application through our waitlist form. We review applications within 48 hours and prioritize gaming publishers with active merchandise programs.',
      },
      {
        question: 'What happens after the pilot ends?',
        answer: 'After the pilot, you\'ll have the option to continue with a paid plan at a discounted founder rate. Your data and configurations will be preserved. If you choose not to continue, we\'ll help you export your data.',
      },
    ],
  },
  {
    name: 'Data & Security',
    faqs: [
      {
        question: 'Is my data secure?',
        answer: 'Yes. All data is encrypted in transit using TLS. We use secure cloud infrastructure and follow industry best practices for data protection. Your sales data is only accessible to your team.',
      },
      {
        question: 'Do you share my data with anyone?',
        answer: 'No. Your data is yours. We never share, sell, or use your data for anything other than providing the PhantomOS service to you. We don\'t use your data to train AI models.',
      },
      {
        question: 'Can I export my data?',
        answer: 'Yes. You can export your analytics data to CSV at any time. If you decide to leave PhantomOS, we\'ll help you export everything.',
      },
      {
        question: 'What permissions do you need for Shopify?',
        answer: 'We request read-only access to your products and orders. We never modify your store data or make changes to your Shopify setup.',
      },
    ],
  },
  {
    name: 'Team & Support',
    faqs: [
      {
        question: 'Can I invite team members?',
        answer: 'Yes! You can invite team members via email and assign them roles (Owner, Admin, Member, or Analyst). Each role has different permissions for viewing and managing data.',
      },
      {
        question: 'How do I get help if I have questions?',
        answer: 'Pilot members have direct access to our team via email. We typically respond within a few hours during business hours. We also provide documentation and onboarding support.',
      },
      {
        question: 'Do you offer onboarding help?',
        answer: 'Yes! When you join the pilot, we\'ll schedule a kickoff call to help you connect your data, set up your IP assets, and understand how to get the most out of PhantomOS.',
      },
    ],
  },
  {
    name: 'Pricing & Plans',
    faqs: [
      {
        question: 'What will pricing look like after the pilot?',
        answer: 'We\'re still finalizing pricing, but it will be based on your merchandise revenue volume. Pilot members will receive founder pricing that\'s significantly discounted from standard rates.',
      },
      {
        question: 'Will there be a free tier?',
        answer: 'We plan to offer a limited free tier for small publishers, with paid tiers for larger operations that need more features and higher data volumes.',
      },
      {
        question: 'Do you offer annual billing?',
        answer: 'We will offer both monthly and annual billing options. Annual plans will include a discount.',
      },
    ],
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#e5e5e5] bg-white hover:border-[#0a0a0a] transition-all group">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-medium text-[#0a0a0a] pr-6 tracking-tight">{faq.question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-[#737373] flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0">
          <p className="text-[#737373] leading-relaxed font-light">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('General');

  const toggleItem = (question: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(question)) {
      newOpenItems.delete(question);
    } else {
      newOpenItems.add(question);
    }
    setOpenItems(newOpenItems);
  };

  const currentCategory = faqCategories.find((c) => c.name === activeCategory) || faqCategories[0];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">HELP CENTER</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
            Frequently Asked <span className="italic font-light">Questions</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-2xl mx-auto leading-relaxed font-light">
            Everything you need to know about PhantomOS. Can&apos;t find what you&apos;re looking for?
            Reach out to our team.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Category Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">
                  Categories
                </div>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={cn(
                        'w-full text-left px-5 py-3 text-sm transition-all group',
                        activeCategory === category.name
                          ? 'bg-[#0a0a0a] text-white'
                          : 'text-[#737373] hover:text-[#0a0a0a] border border-[#e5e5e5] hover:border-[#0a0a0a]'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={activeCategory === category.name ? 'font-medium' : ''}>{category.name}</span>
                        <span className={cn(
                          "text-xs",
                          activeCategory === category.name ? 'text-[#737373]' : 'text-[#a3a3a3]'
                        )}>
                          {category.faqs.length}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ List */}
            <div className="flex-1">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-2">
                {currentCategory.name}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-8 tracking-tight">
                {currentCategory.faqs.length} Questions
              </h2>
              <div className="space-y-3">
                {currentCategory.faqs.map((faq) => (
                  <FAQItem
                    key={faq.question}
                    faq={faq}
                    isOpen={openItems.has(faq.question)}
                    onToggle={() => toggleItem(faq.question)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Still Have <span className="italic font-light">Questions?</span>
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Can&apos;t find the answer you&apos;re looking for? Join our pilot program and get direct access to our team.
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
              href="mailto:hello@phantomos.com"
              className="px-8 py-4 border border-[#525252] text-white font-medium hover:border-white transition-all text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
