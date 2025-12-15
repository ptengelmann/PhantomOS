'use client';

import Link from 'next/link';
import { ArrowRight, Upload, Sparkles, BarChart3, Lightbulb, Check, Plug, FileSpreadsheet, Tag, TrendingUp, ChevronRight, Zap, Clock, Target } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">HOW IT WORKS</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              From Data to <span className="italic font-light">Decisions</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto mb-10">
              Four simple steps to transform how you understand your merchandise performance. No complex setup, no learning curve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/waitlist"
                className="group px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-all inline-flex items-center justify-center gap-2"
              >
                Start Free Pilot
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/features"
                className="px-8 py-4 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:border-[#0a0a0a] transition-all text-center"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Stats */}
      <section className="py-16 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">5 min</div>
              <div className="text-sm text-[#737373]">Setup time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">15 min</div>
              <div className="text-sm text-[#737373]">To first insights</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">90%+</div>
              <div className="text-sm text-[#737373]">AI accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">$0</div>
              <div className="text-sm text-[#737373]">Pilot program</div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Connect Your Data */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">STEP ONE</div>
              </div>
              <h2 className="text-4xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                Connect Your <span className="italic font-light">Data</span>
              </h2>
              <p className="text-lg text-[#737373] font-light leading-relaxed mb-8">
                Import your product catalog and sales data in minutes. We support direct integrations with major e-commerce platforms and universal CSV upload for any data source.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-[#fafafa] border border-[#e5e5e5]">
                  <Plug className="w-6 h-6 text-[#0a0a0a]" />
                  <div>
                    <div className="font-medium text-[#0a0a0a]">Shopify OAuth</div>
                    <div className="text-sm text-[#737373]">One-click connect, auto-sync products & orders</div>
                  </div>
                  <div className="ml-auto text-xs bg-[#0a0a0a] text-white px-2 py-1">60 sec</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#fafafa] border border-[#e5e5e5]">
                  <FileSpreadsheet className="w-6 h-6 text-[#0a0a0a]" />
                  <div>
                    <div className="font-medium text-[#0a0a0a]">CSV Import</div>
                    <div className="text-sm text-[#737373]">Universal upload for any platform or source</div>
                  </div>
                  <div className="ml-auto text-xs bg-[#0a0a0a] text-white px-2 py-1">5 min</div>
                </div>
              </div>

              <Link
                href="/features/connectors"
                className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:gap-3 transition-all"
              >
                Learn about connectors
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual */}
            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">DATA SOURCES</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Shopify', status: 'connected', count: '2,847 products' },
                  { name: 'CSV Upload', status: 'ready', count: 'Drag & drop' },
                  { name: 'Amazon', status: 'coming', count: 'Q1 2026' },
                  { name: 'WooCommerce', status: 'coming', count: 'Q1 2026' },
                ].map((source, i) => (
                  <div key={i} className={`p-4 border ${source.status === 'connected' ? 'border-[#0a0a0a] bg-white' : 'border-[#e5e5e5] bg-[#fafafa]'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#0a0a0a]">{source.name}</span>
                      {source.status === 'connected' && <Check className="w-4 h-4 text-[#0a0a0a]" />}
                    </div>
                    <div className="text-xs text-[#737373]">{source.count}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[#e5e5e5] text-center">
                <div className="text-sm text-[#737373]">Your data stays secure with enterprise-grade encryption</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: AI Auto-Tags Products */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual - comes first on desktop */}
            <div className="order-2 lg:order-1 bg-white border-2 border-[#e5e5e5] overflow-hidden">
              <div className="bg-[#0a0a0a] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">AI Auto-Tagging</span>
                </div>
                <span className="text-xs text-[#737373]">Processing 156 products...</span>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { product: 'Shadow Knight T-Shirt', tag: 'Shadow Knight', confidence: 96, status: 'matched' },
                  { product: 'Pixel Plush Keychain', tag: 'Pixel', confidence: 94, status: 'matched' },
                  { product: 'Luna Starfire Poster', tag: 'Luna Starfire', confidence: 91, status: 'matched' },
                  { product: 'Iron Fang Action Figure', tag: 'Iron Fang', confidence: 89, status: 'processing' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 border ${item.status === 'processing' ? 'border-[#0a0a0a] bg-[#fafafa]' : 'border-[#e5e5e5]'}`}>
                    <div className="w-12 h-12 bg-[#e5e5e5] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#0a0a0a] truncate">{item.product}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-[#0a0a0a] text-white">{item.tag}</span>
                        <span className="text-xs text-[#737373]">{item.confidence}% confidence</span>
                      </div>
                    </div>
                    {item.status === 'matched' ? (
                      <Check className="w-5 h-5 text-[#0a0a0a]" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">STEP TWO</div>
              </div>
              <h2 className="text-4xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                AI Maps <span className="italic font-light">Products</span>
              </h2>
              <p className="text-lg text-[#737373] font-light leading-relaxed mb-8">
                Our AI analyzes product names, descriptions, and metadata to automatically map each product to your IP assets - characters, franchises, and themes. What used to take weeks now happens in minutes.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Sparkles, text: 'Analyzes product names and descriptions' },
                  { icon: Tag, text: 'Suggests character/franchise tags with confidence scores' },
                  { icon: Zap, text: 'Process 5,000+ products per hour' },
                  { icon: Check, text: 'One-click accept or bulk approve high-confidence matches' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#0a0a0a]" />
                    <span className="text-[#525252]">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/tagging"
                className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:gap-3 transition-all"
              >
                See AI tagging in action
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: View Revenue Analytics */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">STEP THREE</div>
              </div>
              <h2 className="text-4xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                See Revenue by <span className="italic font-light">Character</span>
              </h2>
              <p className="text-lg text-[#737373] font-light leading-relaxed mb-8">
                Finally answer the question every publisher asks: "Which characters actually drive revenue?" See performance breakdowns by IP asset, franchise, and product category in real-time.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: BarChart3, text: 'Revenue breakdown by character/franchise' },
                  { icon: TrendingUp, text: 'Track performance trends over time' },
                  { icon: Target, text: 'Identify your top-performing IP assets' },
                  { icon: Clock, text: 'Real-time updates as sales come in' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#0a0a0a]" />
                    <span className="text-[#525252]">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/analytics"
                className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:gap-3 transition-all"
              >
                Explore analytics features
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual */}
            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">REVENUE BY IP ASSET</div>

              <div className="space-y-6">
                {[
                  { name: 'Shadow Knight', revenue: '$142,847', pct: 92, trend: '+12%' },
                  { name: 'Pixel', revenue: '$98,234', pct: 69, trend: '+8%' },
                  { name: 'Luna Starfire', revenue: '$67,891', pct: 47, trend: '+23%' },
                  { name: 'Iron Fang', revenue: '$45,123', pct: 32, trend: '-3%' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0a0a0a]" />
                        <span className="font-medium text-[#0a0a0a]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#0a0a0a]">{item.revenue}</span>
                        <span className={`text-xs ${item.trend.startsWith('+') ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{item.trend}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-[#e5e5e5]">
                      <div className="h-full bg-[#0a0a0a]" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#e5e5e5] flex items-center justify-between">
                <span className="text-sm text-[#737373]">Total Revenue</span>
                <span className="text-2xl font-bold text-[#0a0a0a]">$354,095</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Get AI Insights */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="order-2 lg:order-1 bg-[#0a0a0a] p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-white" />
                <span className="text-white font-medium">AI Insights</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    type: 'Opportunity',
                    title: 'Shadow Knight apparel underperforming',
                    desc: 'T-shirts converting 40% below your average. Consider promotional pricing or new designs.',
                    confidence: '94%',
                    action: 'View products'
                  },
                  {
                    type: 'Trending',
                    title: 'Pixel merchandise +67% this month',
                    desc: 'Driven by social media mentions. Good time to expand the product line.',
                    confidence: '88%',
                    action: 'See trend'
                  },
                  {
                    type: 'Alert',
                    title: 'Luna Starfire stock running low',
                    desc: '3 SKUs below reorder threshold based on current velocity.',
                    confidence: '91%',
                    action: 'Check inventory'
                  },
                ].map((insight, i) => (
                  <div key={i} className="bg-[#171717] border border-[#333] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs uppercase tracking-wider text-[#737373]">{insight.type}</span>
                      <span className="text-xs bg-white text-[#0a0a0a] px-2 py-0.5">{insight.confidence}</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">{insight.title}</h4>
                    <p className="text-sm text-[#a3a3a3] mb-4">{insight.desc}</p>
                    <button className="text-xs text-white border border-[#525252] px-3 py-1.5 hover:border-white transition-colors">
                      {insight.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">STEP FOUR</div>
              </div>
              <h2 className="text-4xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                Get Actionable <span className="italic font-light">Insights</span>
              </h2>
              <p className="text-lg text-[#737373] font-light leading-relaxed mb-8">
                AI continuously analyzes your data to surface actionable recommendations. Know which characters to invest in, what products to promote, and where to focus your licensing conversations.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Sparkles, text: 'AI-powered recommendations with confidence scores' },
                  { icon: TrendingUp, text: 'Spot emerging trends before they peak' },
                  { icon: Target, text: 'Identify underperforming assets with fix suggestions' },
                  { icon: Lightbulb, text: 'Data-backed insights for licensing negotiations' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#0a0a0a]" />
                    <span className="text-[#525252]">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/intelligence"
                className="inline-flex items-center gap-2 text-[#0a0a0a] font-medium hover:gap-3 transition-all"
              >
                Explore Fan Intelligence Hub
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Timeline */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">YOUR FIRST DAY</div>
            <h2 className="text-4xl font-bold text-[#0a0a0a] tracking-tight mb-4">
              From Sign-up to Insights
            </h2>
            <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
              Most users have their first revenue insights within 20 minutes of creating an account
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#e5e5e5] hidden md:block" />

            <div className="space-y-12">
              {[
                { time: '0:00', title: 'Create account', desc: 'Sign up for the pilot program' },
                { time: '0:01', title: 'Connect Shopify', desc: 'One-click OAuth connection' },
                { time: '0:02', title: 'Products synced', desc: 'Auto-imports your catalog' },
                { time: '0:05', title: 'Create IP assets', desc: 'Define your characters/franchises' },
                { time: '0:07', title: 'AI starts tagging', desc: 'Automatic product mapping begins' },
                { time: '0:15', title: 'Review suggestions', desc: 'Accept AI recommendations' },
                { time: '0:20', title: 'First insights', desc: 'See revenue by character' },
              ].map((step, i) => (
                <div key={i} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="text-2xl font-bold text-[#0a0a0a] mb-1">{step.time}</div>
                    <div className="font-medium text-[#0a0a0a]">{step.title}</div>
                    <div className="text-sm text-[#737373]">{step.desc}</div>
                  </div>
                  <div className="w-4 h-4 bg-[#0a0a0a] rounded-full relative z-10 hidden md:block" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to <span className="italic font-light">Start?</span>
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Join the pilot program and see exactly which characters drive your merchandise revenue. Setup takes 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/waitlist"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-all"
            >
              Start Free Pilot
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 border border-[#525252] text-white font-medium hover:border-white transition-all text-center"
            >
              View All Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
