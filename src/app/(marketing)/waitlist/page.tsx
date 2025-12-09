'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Check } from 'lucide-react';

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
      <div className="min-h-screen bg-white">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
              You're <span className="italic font-light">In</span>
            </h1>
            <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
              Thanks for your interest in PhantomOS. We'll review your application and send you an invite link within 48 hours.
            </p>
            <div className="bg-[#fafafa] border border-[#e5e5e5] p-6 mb-8">
              <p className="text-sm text-[#737373] font-light leading-relaxed">
                <strong className="text-[#0a0a0a] font-medium">What happens next?</strong>
                <br />
                We'll review your application and email you a secure invite link to create your account if you're a good fit for the pilot program.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">PILOT PROGRAM</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              Join the <span className="italic font-light">Founding Cohort</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto mb-8">
              We're accepting a limited number of gaming publishers into our founding pilot program. Get early access, shape the product, and lock in founder pricing.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Limited Spots Available
            </div>
          </div>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white border-2 border-[#e5e5e5] p-10">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-2 tracking-tight">
                Request <span className="italic font-light">Access</span>
              </h2>
              <p className="text-[#737373] font-light mb-8">
                Tell us about your merchandise program
              </p>

              {error && (
                <div className="p-4 bg-[#fafafa] border border-[#ef4444] text-[#ef4444] text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Work Email <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Company / Studio Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your game studio or publisher"
                    className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="revenue" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Annual Merchandise Revenue
                  </label>
                  <select
                    id="revenue"
                    value={revenueRange}
                    onChange={(e) => setRevenueRange(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  >
                    <option value="">Select a range</option>
                    {revenueRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="channel" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Primary Sales Channel
                  </label>
                  <select
                    id="channel"
                    value={primaryChannel}
                    onChange={(e) => setPrimaryChannel(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  >
                    <option value="">Select a channel</option>
                    {salesChannels.map((channel) => (
                      <option key={channel.value} value={channel.value}>
                        {channel.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="group w-full px-6 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request Access
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-xs text-[#a3a3a3] text-center font-light">
                  We'll review your application and respond within 48 hours.
                </p>
              </form>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
                Pilot Program <span className="italic font-light">Benefits</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0a0a0a]">01</span>
                </div>
                <h3 className="font-semibold text-[#0a0a0a] mb-2">Early Access</h3>
                <p className="text-sm text-[#737373] font-light leading-relaxed">
                  Be among the first to use PhantomOS and get a head start on understanding your merchandise data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0a0a0a]">02</span>
                </div>
                <h3 className="font-semibold text-[#0a0a0a] mb-2">Shape the Product</h3>
                <p className="text-sm text-[#737373] font-light leading-relaxed">
                  Direct line to our team. Your feedback will directly influence what we build next
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0a0a0a]">03</span>
                </div>
                <h3 className="font-semibold text-[#0a0a0a] mb-2">Founder Pricing</h3>
                <p className="text-sm text-[#737373] font-light leading-relaxed">
                  Lock in special pricing for life. Pilot members get 50% off when we launch paid plans
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-24 max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
                Frequently Asked <span className="italic font-light">Questions</span>
              </h2>
            </div>

            <div className="space-y-4">
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
                <div key={faq.q} className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-colors">
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[#737373] font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
