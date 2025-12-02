import Link from 'next/link';
import { Brain, ArrowRight, TrendingUp, AlertTriangle, Sparkles, Target, BarChart3, Zap } from 'lucide-react';

export default function IntelligenceFeaturePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="w-14 h-14 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-[#0a0a0a]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
              Fan Intelligence Hub
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed mb-8">
              AI-powered insights that reveal what your fans actually want. Stop guessing which characters
              and themes to invest in. Start knowing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-colors flex items-center justify-center gap-2"
              >
                Start Free Pilot
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/features"
                className="px-6 py-3 border border-[#e5e5e5] text-[#0a0a0a] font-medium hover:bg-white transition-colors text-center"
              >
                All Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Description */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-6">
                The Intelligence Layer for Your Merchandise
              </h2>
              <div className="prose prose-lg text-[#737373]">
                <p>
                  Traditional analytics tell you what sold. The Fan Intelligence Hub tells you <strong>why</strong> it
                  sold and <strong>what to do next</strong>.
                </p>
                <p>
                  Our AI analyzes your entire product catalog, sales history, and tagging data to surface
                  actionable insights. It identifies patterns that humans would miss and translates them
                  into concrete recommendations.
                </p>
                <p>
                  Whether you&apos;re deciding which character to feature in next season&apos;s line or
                  identifying underperforming assets that need attention, the Fan Intelligence Hub
                  gives you the data-driven confidence to make the right call.
                </p>
              </div>
            </div>

            {/* Feature Illustration */}
            <div className="bg-[#fafafa] border border-[#e5e5e5] p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white border border-[#e5e5e5]">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-[#0a0a0a]">Growth Opportunity</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">High Confidence</span>
                    </div>
                    <p className="text-sm text-[#737373] mb-2">
                      &ldquo;Link&rdquo; character products show 34% higher conversion rate than portfolio average.
                      Consider expanding this line.
                    </p>
                    <p className="text-sm font-medium text-green-600">Potential: +$45,000/quarter</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white border border-[#e5e5e5]">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-[#0a0a0a]">Performance Alert</p>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">Medium</span>
                    </div>
                    <p className="text-sm text-[#737373] mb-2">
                      &ldquo;Classic&rdquo; theme products declining 15% MoM. Review pricing or consider refreshing designs.
                    </p>
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 bg-[#0a0a0a] text-white">View Products</button>
                      <button className="text-xs px-3 py-1.5 border border-[#e5e5e5] text-[#737373]">Dismiss</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white border border-[#e5e5e5]">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-[#0a0a0a]">Emerging Trend</p>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5">New</span>
                    </div>
                    <p className="text-sm text-[#737373]">
                      Retro-themed merchandise showing 156% growth. Early signal of fan interest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Types */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-12">
            Types of Insights
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                name: 'Growth Opportunities',
                description: 'Identify assets and categories with untapped potential for expansion.',
                color: 'green',
              },
              {
                icon: AlertTriangle,
                name: 'Risk Alerts',
                description: 'Get early warnings about declining performance before it becomes a problem.',
                color: 'yellow',
              },
              {
                icon: Sparkles,
                name: 'Trend Detection',
                description: 'Spot emerging patterns in fan preferences and seasonal trends.',
                color: 'purple',
              },
              {
                icon: Target,
                name: 'Optimization Tips',
                description: 'Actionable recommendations to improve your merchandise strategy.',
                color: 'blue',
              },
            ].map((type) => {
              const Icon = type.icon;
              const colorClasses = {
                green: 'bg-green-100 text-green-600',
                yellow: 'bg-yellow-100 text-yellow-600',
                purple: 'bg-purple-100 text-purple-600',
                blue: 'bg-blue-100 text-blue-600',
              };
              return (
                <div key={type.name} className="bg-white border border-[#e5e5e5] p-6">
                  <div className={`w-12 h-12 rounded-full ${colorClasses[type.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">{type.name}</h3>
                  <p className="text-sm text-[#737373]">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[#737373] text-center mb-12 max-w-2xl mx-auto">
            The Fan Intelligence Hub continuously analyzes your data to surface the most relevant insights.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: BarChart3,
                title: 'Data Analysis',
                description: 'AI processes your product catalog, sales data, and asset mappings to understand your business.',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Pattern Recognition',
                description: 'Advanced algorithms identify trends, anomalies, and opportunities in your data.',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Actionable Insights',
                description: 'Get clear recommendations with confidence scores and potential impact estimates.',
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 bg-[#0a0a0a] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#0a0a0a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">{step.title}</h3>
                  <p className="text-[#737373]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Brain className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Getting AI-Powered Insights
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            Connect your data and let our AI reveal what your fans really want.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
          >
            Start Free Pilot
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
