import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Brain, Tag, BarChart3, Plug, Sparkles, TrendingUp, Users, Zap, ArrowUpRight, ChevronRight, FileSpreadsheet } from 'lucide-react';

// Pilot mode
const SIGNUP_URL = '/waitlist';
const SIGNUP_CTA = 'Join the Pilot Program';

// Feature Bento Grid Component
function FeatureBentoGrid() {
  return (
    <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">PLATFORM FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
            From AI insights to data connectors, see how PhantomOS transforms your merchandise intelligence
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fan Intelligence - Large Card */}
          <Link
            href="/features/intelligence"
            className="group lg:col-span-2 bg-[#0a0a0a] p-8 lg:p-10 hover:bg-[#171717] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-white flex items-center justify-center">
                <Brain className="w-7 h-7 text-[#0a0a0a]" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-[#525252] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Fan Intelligence Hub</h3>
            <p className="text-[#a3a3a3] font-light leading-relaxed mb-8 max-w-lg">
              AI analyzes your sales patterns to surface actionable insights about what your fans actually want.
            </p>
            {/* Preview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#171717] border border-[#333] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-xs text-[#737373] uppercase tracking-wide">Opportunity</span>
                </div>
                <p className="text-sm text-white font-medium">Shadow Knight +40% conversion</p>
                <div className="mt-2 text-xs bg-white text-[#0a0a0a] px-2 py-1 inline-block">94% confidence</div>
              </div>
              <div className="bg-[#171717] border border-[#333] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-xs text-[#737373] uppercase tracking-wide">Trending</span>
                </div>
                <p className="text-sm text-white font-medium">Pixel character +67% this month</p>
                <div className="mt-2 text-xs bg-white text-[#0a0a0a] px-2 py-1 inline-block">88% confidence</div>
              </div>
            </div>
          </Link>

          {/* AI Asset Tagging - Tall Card */}
          <Link
            href="/features/tagging"
            className="group bg-white border-2 border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all row-span-2"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-[#0a0a0a] flex items-center justify-center">
                <Tag className="w-7 h-7 text-white" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-[#a3a3a3] group-hover:text-[#0a0a0a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">AI Asset Tagging</h3>
            <p className="text-[#737373] font-light leading-relaxed mb-6">
              Automatically map products to characters. What used to take weeks now takes minutes.
            </p>
            {/* Preview */}
            <div className="space-y-3 flex-1">
              {[
                { name: 'Shadow Knight T-Shirt', tag: 'Shadow Knight', score: '94%' },
                { name: 'Pixel Plush Keychain', tag: 'Pixel', score: '96%' },
                { name: 'Luna Starfire Poster', tag: 'Luna Starfire', score: '91%' },
                { name: 'Iron Fang Hoodie', tag: 'Iron Fang', score: '89%' },
                { name: 'Crimson Guard Figure', tag: 'Crimson Guard', score: '92%' },
                { name: 'Phantom Warriors Mug', tag: 'Brand', score: '87%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#fafafa] border border-[#e5e5e5]">
                  <div className="w-10 h-10 bg-[#e5e5e5]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#0a0a0a] truncate">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#0a0a0a] text-white">{item.tag}</span>
                      <span className="text-[10px] text-[#737373]">{item.score}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center text-xs text-[#a3a3a3] pt-2">
                Auto-tagging 156 products...
              </div>
            </div>
          </Link>

          {/* Revenue Analytics */}
          <Link
            href="/features/analytics"
            className="group bg-white border-2 border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-[#0a0a0a] flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-[#a3a3a3] group-hover:text-[#0a0a0a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Revenue Analytics</h3>
            <p className="text-[#737373] font-light leading-relaxed mb-6">
              See exactly how much revenue each character generates.
            </p>
            {/* Mini Chart */}
            <div className="space-y-3">
              {[
                { name: 'Shadow Knight', pct: 92 },
                { name: 'Pixel', pct: 69 },
                { name: 'Luna Starfire', pct: 47 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#0a0a0a] font-medium">{item.name}</span>
                    <span className="text-[#737373]">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#e5e5e5]">
                    <div className="h-full bg-[#0a0a0a]" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Link>

          {/* Data Connectors */}
          <Link
            href="/features/connectors"
            className="group bg-white border-2 border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-[#0a0a0a] flex items-center justify-center">
                <Plug className="w-7 h-7 text-white" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-[#a3a3a3] group-hover:text-[#0a0a0a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Data Connectors</h3>
            <p className="text-[#737373] font-light leading-relaxed mb-6">
              One-click Shopify OAuth. CSV import for everything else.
            </p>
            {/* Connector Icons */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#fafafa] border border-[#e5e5e5] p-2 flex items-center justify-center">
                <Image src="/logos/shopify.svg" alt="Shopify" width={32} height={32} className="object-contain" />
              </div>
              <div className="w-12 h-12 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-[#737373]" />
              </div>
              <div className="w-12 h-12 bg-[#fafafa] border border-dashed border-[#e5e5e5] flex items-center justify-center">
                <span className="text-xs text-[#a3a3a3]">+2</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Centered with Dashboard Below */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Centered Hero Content */}
          <div className="pt-24 lg:pt-32 pb-16 text-center max-w-4xl mx-auto">
            {/* Tag */}
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">AI-POWERED INSIGHTS</div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0a0a0a] leading-[1.1] tracking-tight mb-8">
              Know What Your Fans
              <br />
              <span className="italic font-light">Actually</span> Love
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-[#525252] leading-relaxed max-w-2xl mx-auto font-light mb-10">
              PhantomOS reveals which characters and IP assets drive your merchandise revenue.
              <span className="text-[#0a0a0a] font-normal"> Stop guessing. Start knowing.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href={SIGNUP_URL}
                className="group relative px-8 py-4 bg-[#0a0a0a] text-white font-medium overflow-hidden flex items-center justify-center gap-2 hover:gap-3 transition-all"
              >
                <span className="relative z-10">{SIGNUP_CTA}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-[#171717] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/how-it-works"
                className="group px-8 py-4 bg-white text-[#0a0a0a] font-medium border-2 border-[#e5e5e5] hover:border-[#0a0a0a] transition-all flex items-center justify-center gap-2"
              >
                See How It Works
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Line */}
            <p className="text-sm text-[#a3a3a3] tracking-wide">
              FREE 30-DAY PILOT · NO CREDIT CARD · 5-MINUTE SETUP
            </p>
          </div>

          {/* Dashboard Preview - Hidden on mobile, shown on tablet+ */}
          <div className="relative pb-0 hidden md:block">
            {/* Dashboard Container with Browser Chrome */}
            <div className="bg-[#0a0a0a] border-2 border-[#0a0a0a] shadow-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#171717] border-b border-[#333]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#525252]" />
                  <div className="w-3 h-3 rounded-full bg-[#525252]" />
                  <div className="w-3 h-3 rounded-full bg-[#525252]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-[#0a0a0a] text-xs text-[#737373] font-mono">
                    app.phantomos.com/overview
                  </div>
                </div>
                <div className="w-16" />
              </div>

              {/* Dashboard Content - Bento Grid */}
              <div className="p-3 lg:p-4 bg-[#fafafa]">
                <div className="grid grid-cols-12 gap-2 lg:gap-3">
                  {/* Stats Row */}
                  <div className="col-span-6 lg:col-span-3 bg-white border border-[#e5e5e5] p-3 lg:p-4">
                    <div className="text-[10px] lg:text-xs text-[#737373] uppercase tracking-wide mb-1 lg:mb-2">Total Revenue</div>
                    <div className="text-lg lg:text-2xl font-bold text-[#0a0a0a]">$227,849</div>
                    <div className="text-[10px] lg:text-xs text-[#22c55e] font-medium mt-1">+24.5% ↑</div>
                  </div>
                  <div className="col-span-6 lg:col-span-3 bg-white border border-[#e5e5e5] p-3 lg:p-4">
                    <div className="text-[10px] lg:text-xs text-[#737373] uppercase tracking-wide mb-1 lg:mb-2">Total Orders</div>
                    <div className="text-lg lg:text-2xl font-bold text-[#0a0a0a]">2,847</div>
                    <div className="text-[10px] lg:text-xs text-[#22c55e] font-medium mt-1">+18.2% ↑</div>
                  </div>
                  <div className="col-span-6 lg:col-span-3 bg-white border border-[#e5e5e5] p-3 lg:p-4">
                    <div className="text-[10px] lg:text-xs text-[#737373] uppercase tracking-wide mb-1 lg:mb-2">Products Mapped</div>
                    <div className="text-lg lg:text-2xl font-bold text-[#0a0a0a]">156</div>
                    <div className="text-[10px] lg:text-xs text-[#737373] font-medium mt-1">of 164 total</div>
                  </div>
                  <div className="col-span-6 lg:col-span-3 bg-[#0a0a0a] p-3 lg:p-4">
                    <div className="text-[10px] lg:text-xs text-[#737373] uppercase tracking-wide mb-1 lg:mb-2">AI Insights</div>
                    <div className="text-lg lg:text-2xl font-bold text-white">12 New</div>
                    <div className="text-[10px] lg:text-xs text-[#a3a3a3] font-medium mt-1">View recommendations →</div>
                  </div>

                  {/* Main Chart - Bar Chart */}
                  <div className="col-span-12 lg:col-span-8 row-span-2 bg-white border border-[#e5e5e5] p-4 lg:p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <div>
                        <div className="text-xs lg:text-sm font-semibold text-[#0a0a0a]">Revenue by Character</div>
                        <div className="text-[10px] lg:text-xs text-[#737373]">Which IP assets drive your sales</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-[#0a0a0a] text-white text-[10px] lg:text-xs">30D</div>
                        <div className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-[#f5f5f5] text-[#737373] text-[10px] lg:text-xs">90D</div>
                        <div className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-[#f5f5f5] text-[#737373] text-[10px] lg:text-xs">1Y</div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end gap-2 lg:gap-3">
                      {[
                        { pct: 95, label: 'Shadow', value: '$89.4K' },
                        { pct: 72, label: 'Pixel', value: '$67.2K' },
                        { pct: 58, label: 'Luna', value: '$45.8K' },
                        { pct: 42, label: 'Iron', value: '$24.1K' },
                        { pct: 35, label: 'Nova', value: '$18.3K' },
                        { pct: 28, label: 'Echo', value: '$12.7K' },
                        { pct: 22, label: 'Other', value: '$10.2K' },
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                          <div className="w-full flex flex-col items-center justify-end h-24 lg:h-32">
                            <div className="text-[8px] lg:text-[10px] text-[#737373] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}</div>
                            <div
                              className="w-full bg-[#0a0a0a] group-hover:bg-[#333] transition-colors"
                              style={{ height: `${bar.pct}%` }}
                            />
                          </div>
                          <span className="text-[8px] lg:text-[9px] text-[#a3a3a3] mt-1 lg:mt-2 truncate w-full text-center">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Performer */}
                  <div className="col-span-6 lg:col-span-4 bg-white border border-[#e5e5e5] p-3 lg:p-5">
                    <div className="flex items-center justify-between mb-2 lg:mb-4">
                      <div className="text-[10px] lg:text-xs text-[#737373] uppercase tracking-wide">Top Performer</div>
                      <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-[#a3a3a3]" />
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-[#0a0a0a] flex items-center justify-center text-white font-bold text-xs lg:text-base">
                        SK
                      </div>
                      <div>
                        <div className="font-semibold text-[#0a0a0a] text-xs lg:text-base">Shadow Knight</div>
                        <div className="text-[10px] lg:text-xs text-[#737373]">40% of revenue</div>
                      </div>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                      <div className="flex justify-between text-[10px] lg:text-xs">
                        <span className="text-[#737373]">Revenue</span>
                        <span className="font-medium text-[#0a0a0a]">$89,423</span>
                      </div>
                      <div className="h-1 lg:h-1.5 bg-[#e5e5e5]">
                        <div className="h-full bg-[#0a0a0a] w-[92%]" />
                      </div>
                    </div>
                  </div>

                  {/* AI Insight Card */}
                  <div className="col-span-6 lg:col-span-4 bg-white border border-[#e5e5e5] p-3 lg:p-5">
                    <div className="flex items-center gap-2 mb-2 lg:mb-3">
                      <Brain className="w-3 h-3 lg:w-4 lg:h-4 text-[#0a0a0a]" />
                      <div className="text-[10px] lg:text-xs text-[#737373] uppercase tracking-wide">AI Insight</div>
                      <div className="ml-auto text-[8px] lg:text-[10px] px-1 lg:px-1.5 py-0.5 bg-[#0a0a0a] text-white">94%</div>
                    </div>
                    <div className="text-xs lg:text-sm font-medium text-[#0a0a0a] mb-1 lg:mb-2">
                      Shadow Knight +34% conversion
                    </div>
                    <div className="text-[10px] lg:text-xs text-[#737373] leading-relaxed hidden lg:block">
                      Consider expanding the Shadow Knight product line.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fade to white at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>

          {/* Mobile Dashboard Preview - Simplified version for mobile */}
          <div className="relative pb-8 md:hidden">
            <div className="bg-[#0a0a0a] border-2 border-[#0a0a0a] shadow-xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#171717] border-b border-[#333]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#525252]" />
                  <div className="w-2 h-2 rounded-full bg-[#525252]" />
                  <div className="w-2 h-2 rounded-full bg-[#525252]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-2 py-0.5 bg-[#0a0a0a] text-[10px] text-[#737373] font-mono">
                    app.phantomos.com
                  </div>
                </div>
              </div>

              {/* Simplified Mobile Dashboard */}
              <div className="p-3 bg-[#fafafa]">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white border border-[#e5e5e5] p-3">
                    <div className="text-[10px] text-[#737373] uppercase mb-1">Revenue</div>
                    <div className="text-lg font-bold text-[#0a0a0a]">$227K</div>
                    <div className="text-[10px] text-[#22c55e]">+24.5%</div>
                  </div>
                  <div className="bg-[#0a0a0a] p-3">
                    <div className="text-[10px] text-[#737373] uppercase mb-1">AI Insights</div>
                    <div className="text-lg font-bold text-white">12 New</div>
                    <div className="text-[10px] text-[#a3a3a3]">View all →</div>
                  </div>
                </div>

                {/* Mini Bar Chart */}
                <div className="bg-white border border-[#e5e5e5] p-3">
                  <div className="text-xs font-medium text-[#0a0a0a] mb-3">Revenue by Character</div>
                  <div className="flex items-end gap-2 h-20">
                    {[95, 72, 58, 42, 35].map((pct, i) => (
                      <div key={i} className="flex-1 bg-[#0a0a0a]" style={{ height: `${pct}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fade to white at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Problem/Solution - Split Design */}
      <section id="features" className="pt-8 lg:pt-12 pb-24 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">THE PROBLEM</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight leading-[1.15]">
              Your Merchandise Data
              <br />
              is a <span className="italic font-light">Black Box</span>
            </h2>
            <p className="text-lg text-[#737373] leading-relaxed font-light">
              You know total revenue. But which character drove 40% of Q4? Which theme is trending?
              Which assets are underperforming? <span className="text-[#0a0a0a] font-normal">You're flying blind.</span>
            </p>
          </div>

          {/* Before/After Grid */}
          <div className="grid lg:grid-cols-2 gap-2">
            {/* Before */}
            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a0a0a] opacity-[0.02] transform rotate-45 translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="text-xs font-bold text-[#0a0a0a] mb-8 tracking-[0.3em] uppercase">Without PhantomOS</div>
                <ul className="space-y-6">
                  {[
                    'Spreadsheets with thousands of SKUs',
                    'No visibility into IP performance',
                    'Manual tagging taking weeks',
                    'Decisions based on gut feeling',
                    'Revenue opportunities missed',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <div className="w-6 h-6 mt-0.5 border-2 border-[#0a0a0a] flex items-center justify-center flex-shrink-0 group-hover/item:rotate-45 transition-transform">
                        <span className="text-xs">✕</span>
                      </div>
                      <span className="text-[#737373] font-light text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* After */}
            <div className="bg-[#0a0a0a] text-white p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="text-xs font-bold mb-8 tracking-[0.3em] uppercase">With PhantomOS</div>
                <ul className="space-y-6">
                  {[
                    'One dashboard, all your data',
                    'Revenue by character, theme, IP',
                    'AI auto-tags products in minutes',
                    'Data-driven licensing decisions',
                    'Maximize high-performing assets',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <div className="w-6 h-6 mt-0.5 bg-white text-[#0a0a0a] flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <span className="text-xs">✓</span>
                      </div>
                      <span className="text-white font-light text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <FeatureBentoGrid />

      {/* Why PhantomOS - The Moat */}
      <section className="py-24 lg:py-32 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">WHY PHANTOMOS?</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight leading-[1.15]">
                We're Building the
                <br />
                <span className="italic font-light">IP Asset Graph</span>
              </h2>
              <p className="text-lg text-[#737373] leading-relaxed font-light mb-8">
                Not another analytics dashboard. We're building a proprietary database of which game characters
                sell merchandise. <span className="text-[#0a0a0a] font-normal">This data doesn't exist anywhere else.</span>
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">AI That Gets Smarter</h3>
                    <p className="text-sm text-[#737373]">Every product you tag teaches our AI. More publishers = better suggestions for everyone.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Cross-Publisher Benchmarks</h3>
                    <p className="text-sm text-[#737373]">See how your characters perform vs. industry averages. Only possible with network scale.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Your Data Gets More Valuable</h3>
                    <p className="text-sm text-[#737373]">Historical mappings and attribution data compound over time. Switching means losing years of insights.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="bg-[#0a0a0a] p-8 lg:p-10">
              <div className="text-xs tracking-[0.2em] text-[#737373] uppercase mb-6">THE IP ASSET GRAPH</div>
              <div className="space-y-4">
                {/* Product to Character Mapping Visual */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[#171717] border border-[#333] p-4">
                    <div className="text-xs text-[#737373] mb-1">PRODUCT</div>
                    <div className="text-sm text-white font-medium">Shadow Knight Hoodie</div>
                    <div className="text-xs text-[#525252] mt-1">SKU: APP-HOD-001</div>
                  </div>
                  <div className="text-[#525252]">→</div>
                  <div className="flex-1 bg-[#171717] border border-[#333] p-4">
                    <div className="text-xs text-[#737373] mb-1">CHARACTER</div>
                    <div className="text-sm text-white font-medium">Shadow Knight</div>
                    <div className="text-xs text-[#525252] mt-1">40% of revenue</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[#171717] border border-[#333] p-4">
                    <div className="text-xs text-[#737373] mb-1">PRODUCT</div>
                    <div className="text-sm text-white font-medium">Pixel Plush Keychain</div>
                    <div className="text-xs text-[#525252] mt-1">SKU: COL-PLU-042</div>
                  </div>
                  <div className="text-[#525252]">→</div>
                  <div className="flex-1 bg-[#171717] border border-[#333] p-4">
                    <div className="text-xs text-[#737373] mb-1">CHARACTER</div>
                    <div className="text-sm text-white font-medium">Pixel</div>
                    <div className="text-xs text-[#525252] mt-1">23% of revenue</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-[#171717] border border-[#333] p-4">
                    <div className="text-xs text-[#737373] mb-1">PRODUCT</div>
                    <div className="text-sm text-white font-medium">Luna Poster Set</div>
                    <div className="text-xs text-[#525252] mt-1">SKU: ART-POS-017</div>
                  </div>
                  <div className="text-[#525252]">→</div>
                  <div className="flex-1 bg-[#171717] border border-[#333] p-4">
                    <div className="text-xs text-[#737373] mb-1">CHARACTER</div>
                    <div className="text-sm text-white font-medium">Luna Starfire</div>
                    <div className="text-xs text-[#525252] mt-1">18% of revenue</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#333]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#737373]">Mappings in network</span>
                  <span className="text-white font-bold">47,000+</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-[#737373]">Unique characters</span>
                  <span className="text-white font-bold">2,400+</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-[#737373]">AI tagging accuracy</span>
                  <span className="text-white font-bold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Large text background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] select-none pointer-events-none">
          <div className="text-[16rem] font-bold tracking-tighter">START</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6 tracking-tight leading-[1.15]">
            Ready to See What Your Fans <span className="italic font-light">Love</span>?
          </h2>

          <p className="text-xl text-[#737373] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Free 30-day pilot. Connect your data in minutes and get AI-powered insights.
          </p>

          <Link
            href={SIGNUP_URL}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white font-medium hover:gap-4 transition-all"
          >
            {SIGNUP_CTA}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-center gap-12 mt-16 text-sm text-[#a3a3a3]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>5-minute setup</span>
            </div>
            <div className="w-px h-4 bg-[#e5e5e5]" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>No credit card</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
