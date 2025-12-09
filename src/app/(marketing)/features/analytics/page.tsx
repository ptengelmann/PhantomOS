import Link from 'next/link';
import {
  BarChart3,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Download,
  Calendar,
  Filter,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function AnalyticsFeaturePage() {
  return (
    <div className="bg-white">
      {/* Hero - Consistent */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">REVENUE ANALYTICS</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              Know Exactly What <span className="italic font-light">Sells</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto">
              Finally see your merchandise revenue broken down by IP asset. Understand which characters, themes, and product categories drive your business.
            </p>
          </div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">REAL-TIME DASHBOARD</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
              All Your Metrics, One View
            </h2>
            <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
              Track revenue, orders, and performance in a clean dashboard that updates automatically with your sales data.
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Total Revenue</div>
                <DollarSign className="w-4 h-4 text-[#737373]" />
              </div>
              <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">$2.4M</div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronUp className="w-4 h-4 text-[#22c55e]" />
                <span className="text-[#22c55e] font-medium">12.5%</span>
                <span className="text-[#a3a3a3]">vs last month</span>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Total Orders</div>
                <Package className="w-4 h-4 text-[#737373]" />
              </div>
              <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">8,492</div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronUp className="w-4 h-4 text-[#22c55e]" />
                <span className="text-[#22c55e] font-medium">8.2%</span>
                <span className="text-[#a3a3a3]">vs last month</span>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Avg Order Value</div>
                <TrendingUp className="w-4 h-4 text-[#737373]" />
              </div>
              <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">$282.47</div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronUp className="w-4 h-4 text-[#22c55e]" />
                <span className="text-[#22c55e] font-medium">4.1%</span>
                <span className="text-[#a3a3a3]">vs last month</span>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider">Products</div>
                <Users className="w-4 h-4 text-[#737373]" />
              </div>
              <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">1,247</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#a3a3a3]">total catalog</span>
              </div>
            </div>
          </div>

          {/* Large Revenue Chart Preview */}
          <div className="bg-white border border-[#e5e5e5] p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-1">Revenue by Character</h3>
                <p className="text-sm text-[#737373]">Last 30 days performance breakdown</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-xs border border-[#e5e5e5] text-[#737373] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Last 30 days
                </button>
                <button className="px-3 py-1.5 text-xs border border-[#e5e5e5] text-[#737373] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Shadow Knight', revenue: 89400, percentage: 37, trend: 'up', change: '+12%' },
                { name: 'Pixel', revenue: 67200, percentage: 28, trend: 'up', change: '+34%' },
                { name: 'Luna Starfire', revenue: 45800, percentage: 19, trend: 'up', change: '+8%' },
                { name: 'Iron Fang', revenue: 24100, percentage: 10, trend: 'down', change: '-5%' },
                { name: 'Others', revenue: 14300, percentage: 6, trend: 'neutral', change: '+2%' },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[#0a0a0a] min-w-[140px]">{item.name}</span>
                      <div className="flex items-center gap-2">
                        {item.trend === 'up' && <ChevronUp className="w-4 h-4 text-[#22c55e]" />}
                        {item.trend === 'down' && <ChevronDown className="w-4 h-4 text-[#ef4444]" />}
                        <span className={`text-xs font-medium ${
                          item.trend === 'up' ? 'text-[#22c55e]' :
                          item.trend === 'down' ? 'text-[#ef4444]' :
                          'text-[#737373]'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-[#737373]">${(item.revenue / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-3 bg-[#fafafa] border border-[#e5e5e5]">
                    <div
                      className="h-full bg-[#0a0a0a] transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chart Types Showcase */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">VISUALIZATION OPTIONS</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
              Multiple Ways to View Your Data
            </h2>
            <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
              Choose the right visualization for your analysis. Switch between views to uncover different insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Revenue Trend</h3>
                <p className="text-sm text-[#737373]">Track growth over time with trend lines</p>
              </div>
              <div className="h-48 bg-[#fafafa] border border-[#e5e5e5] flex items-end justify-around gap-1 p-4">
                {[45, 52, 48, 61, 58, 67, 64, 78, 73, 82, 85, 91].map((height, i) => (
                  <div
                    key={i}
                    className="bg-[#0a0a0a] w-full transition-all hover:bg-[#171717]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#a3a3a3]">
                <span>Jan</span>
                <span>Dec</span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Category Split</h3>
                <p className="text-sm text-[#737373]">Product distribution by category</p>
              </div>
              <div className="h-48 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Simplified donut chart representation */}
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#0a0a0a" strokeWidth="20" strokeDasharray="88 163" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#404040" strokeWidth="20" strokeDasharray="63 188" strokeDashoffset="-88" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a3a3a3" strokeWidth="20" strokeDasharray="50 201" strokeDashoffset="-151" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e5e5" strokeWidth="20" strokeDasharray="50 201" strokeDashoffset="-201" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Apparel', color: '#0a0a0a' },
                  { label: 'Accessories', color: '#404040' },
                  { label: 'Collectibles', color: '#a3a3a3' },
                  { label: 'Other', color: '#e5e5e5' },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: color }} />
                    <span className="text-xs text-[#737373]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Performance */}
            <div className="bg-white border border-[#e5e5e5] p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">Regional Breakdown</h3>
                <p className="text-sm text-[#737373]">Revenue by geographic region</p>
              </div>
              <div className="h-48 flex flex-col justify-center space-y-4">
                {[
                  { region: 'North America', percentage: 48 },
                  { region: 'Europe', percentage: 28 },
                  { region: 'Asia Pacific', percentage: 18 },
                  { region: 'Other', percentage: 6 },
                ].map((item) => (
                  <div key={item.region}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#737373]">{item.region}</span>
                      <span className="text-xs font-medium text-[#0a0a0a]">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#fafafa] border border-[#e5e5e5]">
                      <div
                        className="h-full bg-[#0a0a0a]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Insight Example */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">DATA-DRIVEN DECISIONS</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
                Turn Data Into <span className="italic font-light">Action</span>
              </h2>
              <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
                PhantomOS doesn't just show you numbers—it helps you understand what they mean for your business. Identify top performers, spot trends early, and make confident decisions about inventory and marketing.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#0a0a0a] text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Spot the Trend</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      Shadow Knight products show 34% growth while overall category is flat at 8%
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#0a0a0a] text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Understand the Impact</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      This character drives 37% of total revenue but only represents 22% of catalog
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#0a0a0a] text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Make the Decision</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      Expand Shadow Knight product line and allocate more marketing budget to capitalize on demand
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8">
              <div className="bg-white border border-[#e5e5e5] p-6 mb-4">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-2">AI Insight</p>
                    <p className="text-sm font-medium text-[#0a0a0a] leading-relaxed">
                      Shadow Knight products show 34% higher growth than category average. Consider expanding this line.
                    </p>
                  </div>
                  <div className="text-xs bg-[#22c55e] text-white px-2 py-1 font-medium">HIGH</div>
                </div>

                <div className="border-t border-[#e5e5e5] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#737373]">Current revenue share</span>
                    <span className="font-semibold text-[#0a0a0a]">37%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#737373]">Growth vs category</span>
                    <span className="font-semibold text-[#22c55e]">+34%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#737373]">Catalog allocation</span>
                    <span className="font-semibold text-[#0a0a0a]">22%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#e5e5e5] p-4 text-center">
                  <div className="text-2xl font-bold text-[#0a0a0a] mb-1 tracking-tight">$89.4K</div>
                  <div className="text-xs text-[#737373] uppercase tracking-wider">Monthly Revenue</div>
                </div>
                <div className="bg-white border border-[#e5e5e5] p-4 text-center">
                  <div className="text-2xl font-bold text-[#22c55e] mb-1 tracking-tight">+34%</div>
                  <div className="text-xs text-[#737373] uppercase tracking-wider">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export & Filters */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Download className="w-8 h-8 text-[#0a0a0a]" />
              </div>
              <h3 className="text-3xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Export Anything</h3>
              <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
                Download reports as CSV for your spreadsheets, or share dashboards with stakeholders. Your data, your way.
              </p>
              <ul className="space-y-3">
                {[
                  'One-click CSV export of any view',
                  'Custom date range selection',
                  'Filter by asset, category, or region',
                  'Formatted reports for executives',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-[#0a0a0a] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#0a0a0a]" />
                    </div>
                    <span className="text-[#525252]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Filter className="w-8 h-8 text-[#0a0a0a]" />
              </div>
              <h3 className="text-3xl font-bold text-[#0a0a0a] mb-4 tracking-tight">Filter Everything</h3>
              <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
                Drill down into exactly what you need to see. Combine filters to answer specific questions about your merchandise performance.
              </p>
              <ul className="space-y-3">
                {[
                  'Filter by character, theme, or IP asset',
                  'Product category breakdowns',
                  'Regional and channel analysis',
                  'Custom date ranges and comparisons',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-[#0a0a0a] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#0a0a0a]" />
                    </div>
                    <span className="text-[#525252]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Consistent */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            See Your Revenue by <span className="italic font-light">Asset</span>
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Connect your sales data and discover which characters and themes drive your merchandise business.
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
