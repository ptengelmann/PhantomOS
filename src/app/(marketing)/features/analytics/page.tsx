import Link from 'next/link';
import { BarChart3, ArrowRight, TrendingUp, PieChart, Calendar, Download, Filter, Globe } from 'lucide-react';

export default function AnalyticsFeaturePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="w-14 h-14 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-[#0a0a0a]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
              Revenue Analytics
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed mb-8">
              See exactly how much revenue each character, theme, and IP asset generates.
              Finally understand what drives your merchandise business.
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

      {/* Dashboard Preview */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-6">
                Revenue Attribution by Asset
              </h2>
              <p className="text-lg text-[#737373] mb-8">
                Stop wondering which characters drive sales. Our analytics dashboard shows you exactly
                how much revenue each IP asset generates, with breakdowns by time, region, and channel.
              </p>
              <ul className="space-y-4">
                {[
                  'Revenue by character, theme, and category',
                  'Time-based trend analysis (daily, weekly, monthly)',
                  'Regional and channel breakdowns',
                  'Growth rate comparisons',
                  'Export reports for stakeholders',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#0a0a0a]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chart Preview */}
            <div className="bg-[#fafafa] border border-[#e5e5e5] p-8">
              <div className="bg-white border border-[#e5e5e5] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-[#0a0a0a]">Revenue by Asset</h3>
                  <select className="text-sm border border-[#e5e5e5] px-2 py-1">
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Mario', revenue: '$124,500', percent: 35, growth: '+12%' },
                    { name: 'Link', revenue: '$89,200', percent: 25, growth: '+34%' },
                    { name: 'Pikachu', revenue: '$52,800', percent: 15, growth: '+8%' },
                    { name: 'Sonic', revenue: '$34,100', percent: 10, growth: '-5%' },
                    { name: 'Others', revenue: '$53,400', percent: 15, growth: '+2%' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <p className="w-16 text-sm text-[#737373]">{item.name}</p>
                      <div className="flex-1">
                        <div className="h-6 bg-[#f5f5f5] rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-[#0a0a0a] rounded-sm"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                      <p className="w-20 text-sm font-medium text-[#0a0a0a] text-right">{item.revenue}</p>
                      <p className={`w-12 text-sm text-right ${
                        item.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.growth}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-12">
            Analytics Capabilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Trend Analysis',
                description: 'Track performance over time with daily, weekly, and monthly views.',
              },
              {
                icon: PieChart,
                title: 'Category Breakdown',
                description: 'See revenue distribution across product categories.',
              },
              {
                icon: Globe,
                title: 'Regional Insights',
                description: 'Understand which assets perform best in different regions.',
              },
              {
                icon: Calendar,
                title: 'Custom Date Ranges',
                description: 'Analyze any time period with flexible date selection.',
              },
              {
                icon: Filter,
                title: 'Advanced Filtering',
                description: 'Filter by asset, category, channel, or custom tags.',
              },
              {
                icon: Download,
                title: 'Export Reports',
                description: 'Download data as CSV or generate PDF reports.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white border border-[#e5e5e5] p-6">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#0a0a0a]" />
                  </div>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#737373]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <BarChart3 className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Tracking Revenue by Asset
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            Connect your data and see exactly which characters drive your merchandise revenue.
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
