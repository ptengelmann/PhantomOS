import Link from 'next/link';
import Image from 'next/image';
import { Plug, ArrowRight, RefreshCw, Shield, Clock, Database, FileSpreadsheet, Code, Check, Zap, ShoppingBag, Calendar } from 'lucide-react';

export default function ConnectorsFeaturePage() {
  return (
    <div className="bg-white">
      {/* Hero - Consistent */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">DATA CONNECTORS</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              All Your Data, <span className="italic font-light">One Place</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto">
              Connect your e-commerce platforms and import data from any source. PhantomOS automatically syncs your products and sales data on a schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Connection Speed */}
      <section className="py-16 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-6xl font-bold text-[#0a0a0a] mb-3 tracking-tighter">5 Min</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider">Setup Time</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-[#0a0a0a] mb-3 tracking-tighter">Automatic</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider">Sync Schedule</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-[#0a0a0a] mb-3 tracking-tighter">Zero</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider">Manual Work</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Connector Demo */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">AVAILABLE NOW</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
                Connect in <span className="italic font-light">One Click</span>
              </h2>
              <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
                Shopify OAuth integration takes 60 seconds. CSV import works with any platform. Your data flows automatically after setup.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0 p-2">
                    <Image src="/logos/shopify.svg" alt="Shopify" width={40} height={40} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Shopify OAuth</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      One-click authorization. No API keys, no credentials, no technical setup.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-6 h-6 text-[#737373]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">CSV Import</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      Universal format works with any platform. Download our template and upload your data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0 opacity-40">
                    <ShoppingBag className="w-6 h-6 text-[#737373]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a0a] mb-1">Amazon & More</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      WooCommerce, Amazon, and BigCommerce integrations launching Q1 2026.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Connection Interface */}
            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-8">
              <div className="bg-white border border-[#e5e5e5] p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#0a0a0a]">Active Connections</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                    <span className="text-xs text-[#737373]">Live</span>
                  </div>
                </div>

                {/* Shopify Connection */}
                <div className="flex items-center gap-4 p-4 bg-[#fafafa] border border-[#e5e5e5] mb-3">
                  <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center p-3">
                    <Image src="/logos/shopify.svg" alt="Shopify" width={56} height={56} className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#0a0a0a] mb-1">Shopify Store</div>
                    <div className="flex items-center gap-3 text-xs text-[#737373]">
                      <span>OAuth Connected</span>
                      <span>•</span>
                      <span>2,847 products</span>
                    </div>
                  </div>
                  <div className="text-xs bg-[#0a0a0a] text-white px-3 py-1.5 font-medium">Active</div>
                </div>

                {/* CSV Import */}
                <div className="flex items-center gap-4 p-4 border border-dashed border-[#e5e5e5]">
                  <div className="w-16 h-16 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8 text-[#737373]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#0a0a0a] mb-1">Import CSV</div>
                    <div className="text-xs text-[#737373]">Upload sales data from any platform</div>
                  </div>
                  <button className="text-xs px-3 py-1.5 border border-[#e5e5e5] hover:border-[#0a0a0a] transition-colors font-medium">
                    Upload
                  </button>
                </div>
              </div>

              {/* Sync Status */}
              <div className="bg-white border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-[#525252]">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing products...</span>
                  </div>
                  <span className="text-xs text-[#737373]">2,847 / 3,000</span>
                </div>
                <div className="h-2 bg-[#fafafa] border border-[#e5e5e5]">
                  <div className="h-full bg-[#0a0a0a] transition-all" style={{ width: '95%' }} />
                </div>
                <div className="mt-3 text-xs text-[#a3a3a3]">Next sync in 45 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">HOW IT WORKS</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
              Set It Once, <span className="italic font-light">Forget It</span>
            </h2>
            <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
              Three simple steps to automatic data sync. No ongoing maintenance required.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect',
                description: 'Click "Connect Shopify" and authorize PhantomOS. Or upload a CSV file with your product data.',
                icon: Plug,
                time: '60 seconds',
              },
              {
                step: '02',
                title: 'Import',
                description: 'We pull your historical data—products, orders, customers. Everything needed for analysis.',
                icon: Database,
                time: '5-10 minutes',
              },
              {
                step: '03',
                title: 'Sync',
                description: 'Automatic updates keep your data fresh. Hourly for Growth plans, daily for Starter.',
                icon: RefreshCw,
                time: 'Automatic',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-[#0a0a0a] flex items-center justify-center group-hover:bg-[#171717] transition-all">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-[#e5e5e5] group-hover:text-[#0a0a0a] transition-colors tracking-tighter">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0a0a0a] mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-[#737373] font-light leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#a3a3a3]" />
                    <span className="text-[#a3a3a3]">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Reliability */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-[#fafafa] border-2 border-[#e5e5e5] p-12">
              <div className="space-y-8">
                <div className="bg-white border border-[#e5e5e5] p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a] mb-1">Bank-Level Encryption</h3>
                      <p className="text-sm text-[#737373] font-light">AES-256 encryption at rest and in transit</p>
                    </div>
                  </div>
                  <div className="border-t border-[#e5e5e5] pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">SOC 2</div>
                        <div className="text-xs text-[#737373] uppercase tracking-wider">Compliant</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">GDPR</div>
                        <div className="text-xs text-[#737373] uppercase tracking-wider">Ready</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#e5e5e5] p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-[#0a0a0a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a0a0a] mb-1">Incremental Sync</h3>
                      <p className="text-sm text-[#737373] font-light">Only new/changed data syncs for speed</p>
                    </div>
                  </div>
                  <div className="border-t border-[#e5e5e5] pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#0a0a0a] tracking-tight">99.9%</div>
                      <div className="text-xs text-[#737373] uppercase tracking-wider">Uptime SLA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">SECURE & RELIABLE</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
                Enterprise-Grade <span className="italic font-light">Infrastructure</span>
              </h2>
              <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
                Your data security is our priority. We use the same encryption standards as banks and never store your platform credentials.
              </p>

              <ul className="space-y-4">
                {[
                  'OAuth 2.0 for secure authorization',
                  'No credentials stored on our servers',
                  'Automatic retry on connection failures',
                  'Full audit logs for all data operations',
                  'Dedicated support for Enterprise plans',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-[#0a0a0a] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#0a0a0a]" />
                    </div>
                    <span className="text-[#525252] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Grid */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">ROADMAP</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight mb-6">
              More Platforms Coming Soon
            </h2>
            <p className="text-lg text-[#737373] font-light max-w-2xl mx-auto">
              We're expanding to support the most popular e-commerce platforms. Join the pilot to get early access.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Amazon Seller', logo: '/logos/amazon.svg', date: 'Q1 2026', popular: true },
              { name: 'WooCommerce', logo: '/logos/woocommerce.svg', date: 'Q1 2026', popular: false },
              { name: 'BigCommerce', logo: '/logos/bigcommerce.svg', date: 'Q1 2026', popular: false },
            ].map((platform) => (
              <div key={platform.name} className="bg-white border border-dashed border-[#e5e5e5] p-8 text-center">
                {platform.popular && (
                  <div className="inline-block px-3 py-1 bg-[#0a0a0a] text-white text-xs font-medium mb-4 uppercase tracking-wider">
                    Most Requested
                  </div>
                )}
                <div className="w-24 h-24 bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-6 p-4">
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    width={80}
                    height={80}
                    className="object-contain opacity-50"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0a] mb-2 tracking-tight">{platform.name}</h3>
                <div className="text-sm text-[#a3a3a3]">{platform.date}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white border border-[#e5e5e5] p-8 inline-block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white border border-[#e5e5e5] flex items-center justify-center">
                  <Code className="w-6 h-6 text-[#737373]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-[#0a0a0a] mb-1">Custom API</h3>
                  <p className="text-sm text-[#737373]">Q2 2026 • Growth & Enterprise plans</p>
                </div>
              </div>
              <p className="text-sm text-[#737373] font-light">
                Build custom integrations with our REST API for proprietary systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Consistent */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Connect Your First <span className="italic font-light">Data Source</span>
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            One-click OAuth for Shopify or universal CSV import. Start analyzing your merchandise data in minutes.
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
