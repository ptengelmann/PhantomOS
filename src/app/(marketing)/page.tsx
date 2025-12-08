'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Brain, Tag, BarChart3, Plug, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

// Pilot mode - change this to '/register' when ready for public signup
const SIGNUP_URL = '/waitlist';
const SIGNUP_CTA = 'Join the Pilot Program';

// Hero Illustration Component
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Dashboard Preview */}
      <div className="relative bg-white border border-[#e5e5e5] shadow-2xl rounded-sm overflow-hidden">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#fafafa] border-b border-[#e5e5e5]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#e5e5e5]" />
            <div className="w-3 h-3 rounded-full bg-[#e5e5e5]" />
            <div className="w-3 h-3 rounded-full bg-[#e5e5e5]" />
          </div>
          <div className="flex-1 mx-4">
            <div className="w-48 h-5 bg-[#f5f5f5] rounded-sm mx-auto" />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-[#fafafa]">
          <div className="flex gap-4">
            {/* Sidebar Preview */}
            <div className="w-48 bg-white border border-[#e5e5e5] p-4 hidden md:block">
              <div className="w-20 h-4 bg-[#0a0a0a] rounded-sm mb-6" />
              <div className="space-y-3">
                <div className="w-full h-3 bg-[#f5f5f5] rounded-sm" />
                <div className="w-3/4 h-3 bg-[#e5e5e5] rounded-sm" />
                <div className="w-5/6 h-3 bg-[#e5e5e5] rounded-sm" />
                <div className="w-2/3 h-3 bg-[#e5e5e5] rounded-sm" />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="w-16 h-2 bg-[#e5e5e5] rounded-sm mb-2" />
                  <div className="w-20 h-5 bg-[#0a0a0a] rounded-sm" />
                  <div className="w-12 h-2 bg-green-200 rounded-sm mt-2" />
                </div>
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="w-16 h-2 bg-[#e5e5e5] rounded-sm mb-2" />
                  <div className="w-20 h-5 bg-[#0a0a0a] rounded-sm" />
                  <div className="w-12 h-2 bg-green-200 rounded-sm mt-2" />
                </div>
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="w-16 h-2 bg-[#e5e5e5] rounded-sm mb-2" />
                  <div className="w-20 h-5 bg-[#0a0a0a] rounded-sm" />
                  <div className="w-12 h-2 bg-blue-200 rounded-sm mt-2" />
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-[#e5e5e5] p-4">
                <div className="w-32 h-3 bg-[#e5e5e5] rounded-sm mb-4" />
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#0a0a0a] rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 bg-white border border-[#e5e5e5] shadow-lg p-3 rounded-sm animate-float">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-[#737373]">Revenue</p>
            <p className="text-sm font-semibold text-[#0a0a0a]">+24.5%</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 bg-white border border-[#e5e5e5] shadow-lg p-3 rounded-sm animate-float-delayed">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-[#737373]">AI Insight</p>
            <p className="text-sm font-semibold text-[#0a0a0a]">3 new</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Card with Illustration
function FeatureCard({
  icon: Icon,
  title,
  description,
  illustration
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  illustration: React.ReactNode;
}) {
  return (
    <div className="group relative bg-white border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fafafa] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
          <Icon className="w-6 h-6 text-[#0a0a0a]" />
        </div>
        <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">{title}</h3>
        <p className="text-[#737373] leading-relaxed mb-6">{description}</p>
        <div className="mt-4 p-4 bg-[#fafafa] border border-[#e5e5e5]">
          {illustration}
        </div>
      </div>
    </div>
  );
}

// How It Works Step
function HowItWorksStep({
  step,
  title,
  description,
  isLast = false
}: {
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-6">
      {/* Step Number & Line */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-[#0a0a0a] text-white flex items-center justify-center text-lg font-semibold">
          {step}
        </div>
        {!isLast && <div className="w-px flex-1 bg-[#e5e5e5] my-2" />}
      </div>
      {/* Content */}
      <div className="flex-1 pb-12">
        <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">{title}</h3>
        <p className="text-[#737373] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}


export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] border border-[#e5e5e5] text-sm text-[#737373] mb-6">
                <Sparkles className="w-4 h-4" />
                Now with AI-Powered Insights
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a0a0a] leading-tight mb-6">
                Know What Your
                <br />
                <span className="relative">
                  Fans Love
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 2 150 2 198 10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#737373] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                PhantomOS reveals which characters, themes, and IP assets drive your merchandise revenue.
                Stop guessing. Start knowing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href={SIGNUP_URL}
                  className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-colors flex items-center justify-center gap-2"
                >
                  {SIGNUP_CTA}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/features"
                  className="w-full sm:w-auto px-8 py-4 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:bg-[#fafafa] transition-colors text-center"
                >
                  See How It Works
                </Link>
              </div>

              <p className="text-sm text-[#a3a3a3] mt-6">
                Free 30-day pilot. No credit card required.
              </p>
            </div>

            {/* Hero Illustration */}
            <div className="relative lg:ml-8">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>


      {/* Problem/Solution Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
              Your Merchandise Data is a Black Box
            </h2>
            <p className="text-lg text-[#737373] leading-relaxed">
              You know your total revenue. But do you know which character drove 40% of Q4 sales?
              Which theme is trending with your fans? Which assets are underperforming?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <div className="bg-[#fafafa] border border-[#e5e5e5] p-8">
              <div className="text-sm font-medium text-red-600 mb-4">WITHOUT PHANTOMOS</div>
              <ul className="space-y-4">
                {[
                  'Spreadsheets with thousands of SKUs',
                  'No visibility into IP performance',
                  'Manual tagging taking weeks',
                  'Decisions based on gut feeling',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</div>
                    <span className="text-[#737373]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-white border-2 border-[#0a0a0a] p-8">
              <div className="text-sm font-medium text-green-600 mb-4">WITH PHANTOMOS</div>
              <ul className="space-y-4">
                {[
                  'One dashboard, all your data',
                  'Revenue by character, theme, IP',
                  'AI auto-tags products in minutes',
                  'Data-driven licensing decisions',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                    <span className="text-[#0a0a0a]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
              Everything You Need to Understand Fan Demand
            </h2>
            <p className="text-lg text-[#737373] leading-relaxed">
              From data ingestion to AI insights, PhantomOS gives you complete visibility into your merchandise performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={Brain}
              title="Fan Intelligence Hub"
              description="AI analyzes your sales patterns and product catalog to surface actionable insights about what your fans actually want."
              illustration={
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#e5e5e5]">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="w-3/4 h-2 bg-[#e5e5e5] rounded-sm" />
                      <div className="w-1/2 h-2 bg-[#f5f5f5] rounded-sm mt-1" />
                    </div>
                    <div className="text-xs text-green-600">+24%</div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-[#e5e5e5]">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="w-2/3 h-2 bg-[#e5e5e5] rounded-sm" />
                      <div className="w-1/3 h-2 bg-[#f5f5f5] rounded-sm mt-1" />
                    </div>
                    <div className="text-xs text-purple-600">New</div>
                  </div>
                </div>
              }
            />

            <FeatureCard
              icon={Tag}
              title="AI Asset Tagging"
              description="Automatically map products to characters, themes, and IP assets. What used to take weeks now takes minutes."
              illustration={
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#e5e5e5] rounded-sm" />
                    <div className="flex-1">
                      <div className="w-1/2 h-2 bg-[#e5e5e5] rounded-sm" />
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs">Mario</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs">Luigi</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#e5e5e5] rounded-sm" />
                    <div className="flex-1">
                      <div className="w-2/3 h-2 bg-[#e5e5e5] rounded-sm" />
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs">AI Suggested</span>
                    </div>
                  </div>
                </div>
              }
            />

            <FeatureCard
              icon={BarChart3}
              title="Revenue Analytics"
              description="See exactly how much revenue each character, theme, or IP asset generates. Filter by time, region, or channel."
              illustration={
                <div className="h-24 flex items-end justify-between gap-1">
                  {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-[#0a0a0a] rounded-t-sm" style={{ height: `${h}%` }} />
                      <span className="text-[10px] text-[#a3a3a3]">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              }
            />

            <FeatureCard
              icon={Plug}
              title="Data Connectors"
              description="Connect your Shopify store or import CSVs. All your data in one place. More connectors coming 2026."
              illustration={
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-[#96bf48] rounded-sm flex items-center justify-center p-2">
                    <Image src="/logos/shopify.svg" alt="Shopify" width={32} height={32} className="object-contain" />
                  </div>
                  <div className="w-8 h-px bg-[#e5e5e5]" />
                  <div className="w-12 h-12 bg-[#f5f5f5] rounded-sm flex items-center justify-center border border-[#e5e5e5]">
                    <span className="text-[#737373] text-xs font-bold">CSV</span>
                  </div>
                  <div className="w-8 h-px bg-[#e5e5e5]" />
                  <div className="w-12 h-12 bg-[#e5e5e5] rounded-sm flex items-center justify-center">
                    <span className="text-[#737373] text-lg font-bold">+</span>
                  </div>
                </div>
              }
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:underline"
            >
              Explore all features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
                From Data Chaos to Clarity in 3 Steps
              </h2>
              <p className="text-lg text-[#737373] leading-relaxed mb-12">
                Get started in minutes, not months. Our streamlined process gets you to insights fast.
              </p>

              <div>
                <HowItWorksStep
                  step={1}
                  title="Connect Your Data"
                  description="Link your Shopify store or upload a CSV. We automatically ingest all your products and sales data."
                />
                <HowItWorksStep
                  step={2}
                  title="AI Tags Your Products"
                  description="Our AI analyzes product names and descriptions to suggest IP asset mappings. Review suggestions and approve with one click."
                />
                <HowItWorksStep
                  step={3}
                  title="Discover Fan Insights"
                  description="See exactly which characters and themes drive revenue. Get AI-powered recommendations to optimize your merchandise strategy."
                  isLast
                />
              </div>
            </div>

            {/* Process Illustration */}
            <div className="relative">
              <div className="sticky top-24 space-y-4">
                {/* Step 1 Illustration */}
                <div className="bg-white border border-[#e5e5e5] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-[#96bf48] rounded-sm flex items-center justify-center p-1.5">
                      <Image src="/logos/shopify.svg" alt="Shopify" width={28} height={28} className="object-contain" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#e5e5e5]" />
                    <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-[#0a0a0a] rounded-full animate-pulse" />
                    </div>
                  </div>
                  <p className="text-sm text-[#737373]">Syncing 2,847 products...</p>
                </div>

                {/* Step 2 Illustration */}
                <div className="bg-white border border-[#e5e5e5] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">AI Processing</span>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1">94% Complete</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#f5f5f5] rounded-sm" />
                      <div className="flex-1 h-2 bg-[#f5f5f5] rounded-sm" />
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700">Mapped</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#f5f5f5] rounded-sm" />
                      <div className="flex-1 h-2 bg-[#f5f5f5] rounded-sm" />
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700">Suggested</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 Illustration */}
                <div className="bg-white border border-[#e5e5e5] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#0a0a0a]" />
                    <span className="text-sm font-medium">Top Insight</span>
                  </div>
                  <p className="text-sm text-[#737373] mb-3">
                    &ldquo;Link&rdquo; character products show 34% higher conversion than average. Consider expanding this line.
                  </p>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 bg-[#0a0a0a] text-white">View Details</button>
                    <button className="text-xs px-3 py-1.5 border border-[#e5e5e5] text-[#737373]">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6">
            Ready to See What Your Fans Love?
          </h2>
          <p className="text-lg text-[#737373] leading-relaxed mb-8 max-w-2xl mx-auto">
            Start your free 30-day revenue audit. Connect your data in minutes and get AI-powered insights into your merchandise performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={SIGNUP_URL}
              className="w-full sm:w-auto px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-colors flex items-center justify-center gap-2"
            >
              {SIGNUP_CTA}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/faq"
              className="w-full sm:w-auto px-8 py-4 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:bg-[#fafafa] transition-colors text-center"
            >
              Learn More
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-[#737373]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
