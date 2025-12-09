'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brain, ArrowRight, TrendingUp, AlertTriangle, Sparkles, Target, BarChart3, Zap, Check } from 'lucide-react';

const insightExamples = [
  {
    id: 'growth',
    icon: TrendingUp,
    type: 'Growth Opportunity',
    badge: 'High Confidence',
    title: 'Shadow Knight products show 34% higher conversion',
    description: 'This character significantly outperforms your portfolio average. Consider expanding the product line with new categories like home goods and accessories.',
    metrics: [
      { label: 'Conversion Rate', value: '+34%' },
      { label: 'Revenue Potential', value: '$45K/quarter' },
      { label: 'Confidence', value: '94%' },
    ],
  },
  {
    id: 'alert',
    icon: AlertTriangle,
    type: 'Performance Alert',
    badge: 'Medium Priority',
    title: 'Classic theme products declining 15% MoM',
    description: 'Vintage-themed products showing consistent decline over the past 3 months. Consider refreshing designs, adjusting pricing, or exploring new vintage styles.',
    metrics: [
      { label: 'Decline Rate', value: '-15%' },
      { label: 'Affected Products', value: '47 items' },
      { label: 'Confidence', value: '88%' },
    ],
  },
  {
    id: 'trend',
    icon: Sparkles,
    type: 'Emerging Trend',
    badge: 'New Pattern',
    title: 'Pixel character trending up 67% this month',
    description: 'Early signals suggest growing fan interest in retro pixel art designs. This could be an opportunity to introduce limited edition pixel-themed merchandise.',
    metrics: [
      { label: 'Growth Rate', value: '+67%' },
      { label: 'Time Period', value: '30 days' },
      { label: 'Confidence', value: '82%' },
    ],
  },
];

export default function IntelligenceFeaturePage() {
  const [activeInsight, setActiveInsight] = useState(0);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">AI-POWERED INSIGHTS</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              Fan Intelligence <span className="italic font-light">Hub</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto mb-10">
              AI-powered insights that reveal what your fans actually want. Stop guessing which characters
              and themes to invest in. Start knowing.
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
                All Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After + Dashboard Preview */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">THE DIFFERENCE</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] text-center mb-16 tracking-tight">
            Traditional Analytics vs Intelligence Hub
          </h2>

          {/* Before/After Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Before - Traditional Analytics */}
            <div className="bg-white border-2 border-[#e5e5e5] p-8">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">WITHOUT INTELLIGENCE HUB</div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                Just Numbers
              </h3>
              <div className="space-y-4">
                <div className="border border-[#e5e5e5] p-4">
                  <div className="text-sm text-[#737373] mb-2">Shadow Knight T-Shirt</div>
                  <div className="text-2xl font-bold text-[#0a0a0a]">$12,450</div>
                  <div className="text-xs text-[#a3a3a3] mt-1">Revenue this month</div>
                </div>
                <div className="border border-[#e5e5e5] p-4">
                  <div className="text-sm text-[#737373] mb-2">Classic Theme Mug</div>
                  <div className="text-2xl font-bold text-[#0a0a0a]">$3,280</div>
                  <div className="text-xs text-[#a3a3a3] mt-1">Revenue this month</div>
                </div>
                <div className="border border-[#e5e5e5] p-4">
                  <div className="text-sm text-[#737373] mb-2">Pixel Poster</div>
                  <div className="text-2xl font-bold text-[#0a0a0a]">$5,190</div>
                  <div className="text-xs text-[#a3a3a3] mt-1">Revenue this month</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
                <p className="text-sm text-[#737373] font-light italic">
                  "Which product should I invest in? What's trending? I have no idea..."
                </p>
              </div>
            </div>

            {/* After - Intelligence Hub */}
            <div className="bg-[#0a0a0a] text-white p-8">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">WITH INTELLIGENCE HUB</div>
              <h3 className="text-xl font-bold mb-6 tracking-tight">
                Actionable Intelligence
              </h3>
              <div className="space-y-3">
                <div className="border border-[#525252] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#22c55e]" />
                    <span className="text-xs bg-[#22c55e] text-white px-2 py-0.5 font-medium">Opportunity</span>
                    <span className="text-xs text-[#737373] ml-auto">94% confidence</span>
                  </div>
                  <p className="text-sm font-medium mb-2">Shadow Knight products show 34% higher conversion</p>
                  <p className="text-xs text-[#a3a3a3] font-light">Expand this line with new categories. Potential: +$45K/quarter</p>
                </div>
                <div className="border border-[#525252] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                    <span className="text-xs bg-[#f59e0b] text-white px-2 py-0.5 font-medium">Alert</span>
                    <span className="text-xs text-[#737373] ml-auto">88% confidence</span>
                  </div>
                  <p className="text-sm font-medium mb-2">Classic theme declining 15% MoM</p>
                  <p className="text-xs text-[#a3a3a3] font-light">Refresh designs or adjust pricing to reverse trend</p>
                </div>
                <div className="border border-[#525252] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
                    <span className="text-xs bg-[#3b82f6] text-white px-2 py-0.5 font-medium">Trend</span>
                    <span className="text-xs text-[#737373] ml-auto">82% confidence</span>
                  </div>
                  <p className="text-sm font-medium mb-2">Pixel character trending up 67% this month</p>
                  <p className="text-xs text-[#a3a3a3] font-light">Early signal for limited edition pixel art drops</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#525252]">
                <p className="text-sm font-light">
                  ✓ Know exactly what to do next with AI-powered recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Real Dashboard Preview */}
          <div>
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">DASHBOARD PREVIEW</div>
            <h3 className="text-2xl font-bold text-[#0a0a0a] text-center mb-8 tracking-tight">
              What You'll See in the Intelligence Hub
            </h3>

            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2">Active Insights</div>
                  <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight">12</div>
                </div>
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2">Opportunities</div>
                  <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight">5</div>
                </div>
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2">Alerts</div>
                  <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight">3</div>
                </div>
                <div className="bg-white border border-[#e5e5e5] p-4">
                  <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2">AI Confidence</div>
                  <div className="text-3xl font-bold text-[#0a0a0a] tracking-tight">High</div>
                </div>
              </div>

              {/* Insights List */}
              <div className="bg-white border border-[#e5e5e5] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#0a0a0a]" />
                    <h4 className="font-semibold text-[#0a0a0a]">AI Insights</h4>
                  </div>
                  <button className="text-xs px-3 py-1.5 border border-[#e5e5e5] text-[#737373] hover:border-[#0a0a0a] transition-colors">
                    Refresh
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Insight 1 */}
                  <div className="border border-[#e5e5e5] p-4 hover:border-[#0a0a0a] transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#22c55e] mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#0a0a0a]">Revenue opportunity detected</span>
                          <span className="text-xs bg-[#22c55e] text-white px-2 py-0.5">Opportunity</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373]">94% confidence</span>
                        </div>
                        <p className="text-sm text-[#737373]">Shadow Knight products outperform by 34%—expand line</p>
                      </div>
                    </div>
                  </div>

                  {/* Insight 2 */}
                  <div className="border border-[#e5e5e5] p-4 hover:border-[#0a0a0a] transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#f59e0b] mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#0a0a0a]">Performance declining</span>
                          <span className="text-xs bg-[#f59e0b] text-white px-2 py-0.5">Alert</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373]">88% confidence</span>
                        </div>
                        <p className="text-sm text-[#737373]">Classic theme products down 15% MoM—review pricing</p>
                      </div>
                    </div>
                  </div>

                  {/* Insight 3 */}
                  <div className="border border-[#e5e5e5] p-4 hover:border-[#0a0a0a] transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-[#3b82f6] mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#0a0a0a]">Emerging trend spotted</span>
                          <span className="text-xs bg-[#3b82f6] text-white px-2 py-0.5">Trend</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373]">82% confidence</span>
                        </div>
                        <p className="text-sm text-[#737373]">Pixel character trending up 67%—limited edition opportunity</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#e5e5e5] text-center">
                  <p className="text-sm text-[#737373] font-light">
                    Click any insight to see detailed recommendations and take action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">THE PROCESS</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] text-center mb-6 tracking-tight">
            How the Intelligence Hub Works
          </h2>
          <p className="text-lg text-[#737373] text-center mb-16 max-w-2xl mx-auto font-light">
            The AI continuously analyzes your data to surface the most relevant insights at the right time.
          </p>

          {/* Step 1 */}
          <div className="mb-12 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-7xl font-bold text-[#0a0a0a] tracking-tighter">01</div>
                <div className="h-px flex-1 bg-[#e5e5e5]"></div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Data Collection</h3>
              <p className="text-[#737373] font-light leading-relaxed text-lg">
                AI ingests your product catalog, sales history, and asset mappings to build a complete picture of your merchandise performance.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-white border-2 border-[#e5e5e5] p-8">
                <div className="flex items-center justify-between mb-6">
                  <BarChart3 className="w-8 h-8 text-[#0a0a0a]" />
                  <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Processing...</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0a0a0a]"></div>
                    <div className="text-sm text-[#0a0a0a]">Syncing product catalog</div>
                    <div className="ml-auto text-xs text-[#737373]">2,847 items</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0a0a0a]"></div>
                    <div className="text-sm text-[#0a0a0a]">Importing sales data</div>
                    <div className="ml-auto text-xs text-[#737373]">Last 12 months</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#e5e5e5]"></div>
                    <div className="text-sm text-[#737373]">Processing asset tags</div>
                    <div className="ml-auto text-xs text-[#a3a3a3]">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-12 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 lg:order-1">
              <div className="bg-white border-2 border-[#e5e5e5] p-8">
                <div className="flex items-center justify-between mb-6">
                  <Brain className="w-8 h-8 text-[#0a0a0a]" />
                  <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Analyzing</div>
                </div>
                <div className="space-y-4">
                  <div className="border border-[#e5e5e5] p-4">
                    <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2">Pattern Detected</div>
                    <div className="text-sm font-medium text-[#0a0a0a]">Character X shows 34% higher conversion</div>
                  </div>
                  <div className="border border-[#e5e5e5] p-4">
                    <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-2">Trend Identified</div>
                    <div className="text-sm font-medium text-[#0a0a0a]">Retro theme gaining 67% momentum</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-7xl font-bold text-[#0a0a0a] tracking-tighter">02</div>
                <div className="h-px flex-1 bg-[#e5e5e5]"></div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Pattern Analysis</h3>
              <p className="text-[#737373] font-light leading-relaxed text-lg">
                Advanced algorithms detect trends, anomalies, and opportunities that would be impossible to spot manually across thousands of products.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-7xl font-bold text-[#0a0a0a] tracking-tighter">03</div>
                <div className="h-px flex-1 bg-[#e5e5e5]"></div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Actionable Insights</h3>
              <p className="text-[#737373] font-light leading-relaxed text-lg">
                Receive clear recommendations with confidence scores, impact estimates, and specific next steps to optimize your strategy.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-[#0a0a0a] text-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6" />
                  <div className="text-xs uppercase tracking-wider text-[#a3a3a3]">Ready to Review</div>
                </div>
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-2 tracking-tight">12 New Insights</div>
                  <div className="text-[#a3a3a3] font-light">Generated from your latest data sync</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="border border-[#525252] p-3">
                    <div className="text-xl font-bold tracking-tight">5</div>
                    <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">High Priority</div>
                  </div>
                  <div className="border border-[#525252] p-3">
                    <div className="text-xl font-bold tracking-tight">4</div>
                    <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Medium</div>
                  </div>
                  <div className="border border-[#525252] p-3">
                    <div className="text-xl font-bold tracking-tight">3</div>
                    <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Trends</div>
                  </div>
                </div>
                <button className="w-full px-6 py-3 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors">
                  View All Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Types */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">CAPABILITIES</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] text-center mb-16 tracking-tight">
            Four Types of Intelligence
          </h2>

          {/* Large Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border-2 border-[#e5e5e5] p-10 hover:border-[#0a0a0a] transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:border-[#0a0a0a] transition-all">
                  <TrendingUp className="w-8 h-8 text-[#0a0a0a] group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">01</div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Growth Opportunities</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-6">
                Identify high-potential assets and categories ready for expansion. Get recommendations on which characters deserve more investment.
              </p>
              <div className="border-t border-[#e5e5e5] pt-6">
                <div className="text-sm text-[#0a0a0a] font-medium mb-2">Example Insight:</div>
                <div className="text-sm text-[#737373] font-light">&ldquo;Shadow Knight products show 34% higher conversion—expand this line&rdquo;</div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#e5e5e5] p-10 hover:border-[#0a0a0a] transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:border-[#0a0a0a] transition-all">
                  <AlertTriangle className="w-8 h-8 text-[#0a0a0a] group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">02</div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Risk Detection</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-6">
                Early warnings about declining performance before revenue drops. Catch problems while you still have time to fix them.
              </p>
              <div className="border-t border-[#e5e5e5] pt-6">
                <div className="text-sm text-[#0a0a0a] font-medium mb-2">Example Insight:</div>
                <div className="text-sm text-[#737373] font-light">&ldquo;Classic theme declining 15% MoM—refresh designs or adjust pricing&rdquo;</div>
              </div>
            </div>
          </div>

          {/* Large Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-[#e5e5e5] p-10 hover:border-[#0a0a0a] transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:border-[#0a0a0a] transition-all">
                  <Sparkles className="w-8 h-8 text-[#0a0a0a] group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">03</div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Trend Forecasting</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-6">
                Spot emerging patterns in fan preferences and seasonal behavior. Stay ahead of the curve with predictive insights.
              </p>
              <div className="border-t border-[#e5e5e5] pt-6">
                <div className="text-sm text-[#0a0a0a] font-medium mb-2">Example Insight:</div>
                <div className="text-sm text-[#737373] font-light">&ldquo;Retro pixel art trending up 67%—consider limited edition drops&rdquo;</div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#e5e5e5] p-10 hover:border-[#0a0a0a] transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:border-[#0a0a0a] transition-all">
                  <Target className="w-8 h-8 text-[#0a0a0a] group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase">04</div>
              </div>
              <h3 className="text-2xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Strategy Optimization</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-6">
                Concrete recommendations to improve your merchandise approach. Data-driven guidance for product development and inventory.
              </p>
              <div className="border-t border-[#e5e5e5] pt-6">
                <div className="text-sm text-[#0a0a0a] font-medium mb-2">Example Insight:</div>
                <div className="text-sm text-[#737373] font-light">&ldquo;Optimize inventory mix—increase apparel by 20%, reduce accessories&rdquo;</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">WHY IT MATTERS</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
                From Data to <span className="italic font-light">Decisions</span>
              </h2>
              <p className="text-lg text-[#737373] font-light leading-relaxed mb-8">
                Traditional analytics show you what happened. The Intelligence Hub tells you what to do next.
                Make confident, data-driven decisions about your merchandise strategy.
              </p>
              <ul className="space-y-4">
                {[
                  'Discover hidden revenue opportunities',
                  'Catch problems before they impact sales',
                  'Understand fan preferences at a deeper level',
                  'Optimize inventory and product development',
                  'Make smarter investment decisions',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-[#0a0a0a] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#0a0a0a]" />
                    </div>
                    <span className="text-[#525252] leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border-2 border-[#e5e5e5] p-8">
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">EXAMPLE INSIGHT</div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-2">Portfolio Analysis Complete</h3>
                    <p className="text-sm text-[#737373] font-light leading-relaxed">
                      Analyzed 2,847 products across 12 IP assets and 8 categories to identify optimization opportunities.
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#e5e5e5] pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">23</div>
                      <div className="text-xs text-[#737373] uppercase tracking-wider">Active Insights</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">$127K</div>
                      <div className="text-xs text-[#737373] uppercase tracking-wider">Revenue Impact</div>
                    </div>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-colors">
                  View All Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Start Getting <span className="italic font-light">AI-Powered</span> Insights
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Connect your data and let our AI reveal what your fans really want. Available now in the pilot program.
          </p>
          <Link
            href="/waitlist"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-all"
          >
            Start Free Pilot
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
