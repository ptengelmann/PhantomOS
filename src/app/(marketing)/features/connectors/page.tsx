import Link from 'next/link';
import Image from 'next/image';
import { Plug, ArrowRight, RefreshCw, Shield, Zap, Clock, Database, FileSpreadsheet, Code } from 'lucide-react';

const connectors = [
  {
    name: 'Shopify',
    logo: '/logos/shopify.svg',
    color: 'bg-[#96bf48]',
    status: 'Available',
    description: 'Connect your Shopify store with one-click OAuth. Products sync automatically.',
  },
  {
    name: 'CSV Import',
    logo: '/logos/csv.svg',
    color: 'bg-[#f5f5f5]',
    status: 'Available',
    description: 'Import data from any source using our CSV template.',
  },
  {
    name: 'Amazon',
    logo: '/logos/amazon.svg',
    color: 'bg-[#232f3e]',
    status: 'Coming Soon',
    description: 'Amazon Seller Central integration coming Q1 2026.',
  },
  {
    name: 'WooCommerce',
    logo: '/logos/woocommerce.svg',
    color: 'bg-[#96588a]',
    status: 'Coming Soon',
    description: 'WordPress WooCommerce integration for self-hosted stores.',
  },
  {
    name: 'BigCommerce',
    logo: '/logos/bigcommerce.svg',
    color: 'bg-[#121118]',
    status: 'Coming Soon',
    description: 'Enterprise e-commerce platform integration.',
  },
  {
    name: 'Custom API',
    logo: null, // Uses icon instead
    color: 'bg-[#737373]',
    status: 'Coming Soon',
    description: 'Build custom integrations with our REST API.',
  },
];

export default function ConnectorsFeaturePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="w-14 h-14 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6">
              <Plug className="w-7 h-7 text-[#0a0a0a]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
              Data Connectors
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed mb-8">
              Connect your e-commerce platforms in minutes. PhantomOS automatically syncs your
              products and sales data so you always have the latest information.
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

      {/* Available Connectors */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-12">
            Available Connectors
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectors.map((connector) => (
              <div key={connector.name} className="bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${connector.color} rounded-lg flex items-center justify-center overflow-hidden`}>
                    {connector.logo ? (
                      <Image
                        src={connector.logo}
                        alt={connector.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <Code className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 ${
                    connector.status === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : connector.status === 'Coming Soon'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-purple-100 text-purple-700'
                  }`}>
                    {connector.status}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0a0a0a] mb-2">{connector.name}</h3>
                <p className="text-sm text-[#737373]">{connector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Sync Works */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-6">
                Automatic Data Sync
              </h2>
              <p className="text-lg text-[#737373] mb-8">
                Once connected, PhantomOS automatically syncs your data on a schedule.
                Products, orders, and sales data stay up-to-date without any manual work.
              </p>
              <ul className="space-y-6">
                {[
                  {
                    icon: RefreshCw,
                    title: 'Scheduled Sync',
                    description: 'Data syncs hourly for Growth plans, daily for Starter.',
                  },
                  {
                    icon: Shield,
                    title: 'Secure Connection',
                    description: 'OAuth authentication. We never store your credentials.',
                  },
                  {
                    icon: Clock,
                    title: 'Historical Import',
                    description: 'Import historical data when you first connect.',
                  },
                  {
                    icon: Database,
                    title: 'Incremental Updates',
                    description: 'Only new and changed data is synced for efficiency.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#0a0a0a]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a0a0a] mb-1">{item.title}</h3>
                        <p className="text-sm text-[#737373]">{item.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sync Visualization */}
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Sources */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#96bf48] rounded-lg flex items-center justify-center shadow-sm p-2">
                    <Image
                      src="/logos/shopify.svg"
                      alt="Shopify"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="w-16 h-16 bg-[#f5f5f5] rounded-lg flex items-center justify-center shadow-sm p-2 border border-[#e5e5e5]">
                    <FileSpreadsheet className="w-8 h-8 text-[#737373]" />
                  </div>
                  <div className="w-16 h-16 bg-[#232f3e] rounded-lg flex items-center justify-center shadow-sm p-2 opacity-50">
                    <Image
                      src="/logos/amazon.svg"
                      alt="Amazon (Coming Soon)"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Arrows */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-px h-8 bg-[#e5e5e5]" />
                  <div className="w-10 h-10 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="w-px h-8 bg-[#e5e5e5]" />
                </div>

                {/* Destination */}
                <div className="w-full max-w-xs p-4 bg-[#fafafa] border border-[#e5e5e5] text-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    <Image
                      src="/PhantomOSIcon.svg"
                      alt="PhantomOS"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <p className="font-medium text-[#0a0a0a]">PhantomOS</p>
                  <p className="text-xs text-[#737373] mt-1">All data in one place</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <RefreshCw className="w-4 h-4" />
                  <span>Shopify & CSV available now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Plug className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Connect Your Data in Minutes
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            One-click OAuth for Shopify. CSV import for everything else.
            Get your data into PhantomOS and start analyzing.
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
