'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, Sparkles, Users, Zap, Shield } from 'lucide-react';

const revenueRanges = [
  { value: 'under_100k', label: 'Under $100K' },
  { value: '100k_500k', label: '$100K - $500K' },
  { value: '500k_1m', label: '$500K - $1M' },
  { value: '1m_5m', label: '$1M - $5M' },
  { value: '5m_plus', label: '$5M+' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const salesChannels = [
  { value: 'shopify', label: 'Shopify' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'woocommerce', label: 'WooCommerce' },
  { value: 'multiple', label: 'Multiple channels' },
  { value: 'other', label: 'Other' },
  { value: 'none_yet', label: 'Not selling yet' },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [revenueRange, setRevenueRange] = useState('');
  const [primaryChannel, setPrimaryChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          companyWebsite,
          revenueRange,
          primaryChannel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0a0a0a] mb-4">
            You&apos;re on the list!
          </h1>
          <p className="text-[#737373] mb-6">
            Thanks for your interest in PhantomOS. We&apos;re reviewing applications
            for our founding pilot program and will be in touch within 48 hours.
          </p>
          <div className="p-4 bg-[#fafafa] border border-[#e5e5e5] mb-6">
            <p className="text-sm text-[#737373]">
              <strong className="text-[#0a0a0a]">What happens next?</strong>
              <br />
              We&apos;ll review your application and send you an invite link
              to create your account if you&apos;re a good fit.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#e5e5e5] text-sm text-[#737373] mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Pilot Program
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
              Join the Founding Cohort
            </h1>
            <p className="text-lg text-[#737373] leading-relaxed">
              We&apos;re accepting a limited number of gaming publishers into our
              founding pilot program. Get early access, shape the product, and
              lock in founder pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-8">
                Pilot Program Benefits
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: 'Early Access',
                    description: 'Be among the first to use PhantomOS and get a head start on understanding your merchandise data.',
                  },
                  {
                    icon: Users,
                    title: 'Shape the Product',
                    description: 'Direct line to our team. Your feedback will directly influence what we build next.',
                  },
                  {
                    icon: Shield,
                    title: 'Founder Pricing',
                    description: 'Lock in special pricing for life. Pilot members get 50% off when we launch paid plans.',
                  },
                ].map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#0a0a0a]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a0a0a] mb-1">{benefit.title}</h3>
                        <p className="text-sm text-[#737373]">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 p-6 bg-[#0a0a0a] text-white">
                <p className="text-sm text-[#a3a3a3] mb-2">Current Status</p>
                <p className="text-2xl font-bold mb-1">Limited Spots Available</p>
                <p className="text-sm text-[#a3a3a3]">
                  We&apos;re accepting 25 publishers into our founding cohort.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-[#e5e5e5] p-8">
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-6">
                Request Access
              </h3>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 mb-6">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0a0a0a] mb-1.5">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-11 px-4 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-[#0a0a0a] mb-1.5">
                    Company / Studio Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your game studio or publisher"
                    className="w-full h-11 px-4 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-[#0a0a0a] mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full h-11 px-4 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                </div>

                {/* Revenue Range */}
                <div>
                  <label htmlFor="revenue" className="block text-sm font-medium text-[#0a0a0a] mb-1.5">
                    Annual Merchandise Revenue
                  </label>
                  <select
                    id="revenue"
                    value={revenueRange}
                    onChange={(e) => setRevenueRange(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#e5e5e5] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  >
                    <option value="">Select a range</option>
                    {revenueRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sales Channel */}
                <div>
                  <label htmlFor="channel" className="block text-sm font-medium text-[#0a0a0a] mb-1.5">
                    Primary Sales Channel
                  </label>
                  <select
                    id="channel"
                    value={primaryChannel}
                    onChange={(e) => setPrimaryChannel(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#e5e5e5] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  >
                    <option value="">Select a channel</option>
                    {salesChannels.map((channel) => (
                      <option key={channel.value} value={channel.value}>
                        {channel.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-12 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request Access
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-[#a3a3a3] text-center">
                  We&apos;ll review your application and respond within 48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#0a0a0a] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Who is the pilot program for?',
                a: 'Gaming publishers, game studios, and merchandise managers who want to understand which IP assets drive their merchandise revenue. Ideal candidates have an existing Shopify store or merchandise program.',
              },
              {
                q: 'How long is the pilot program?',
                a: 'The founding pilot runs for 90 days. During this time, you\'ll have full access to PhantomOS and direct communication with our team.',
              },
              {
                q: 'Is there a cost to join the pilot?',
                a: 'The pilot program is free. When we launch paid plans, founding pilot members will receive 50% off for life.',
              },
              {
                q: 'What if I\'m not selected?',
                a: 'We\'ll keep your application on file and notify you when we open up more spots or launch publicly.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white border border-[#e5e5e5] p-6">
                <h3 className="font-semibold text-[#0a0a0a] mb-2">{faq.q}</h3>
                <p className="text-sm text-[#737373]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
