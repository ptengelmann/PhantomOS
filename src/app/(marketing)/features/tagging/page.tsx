import Link from 'next/link';
import { Tag, ArrowRight, Sparkles, Check, Clock, Zap, MousePointer, Layers } from 'lucide-react';

export default function TaggingFeaturePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="w-14 h-14 bg-white border border-[#e5e5e5] flex items-center justify-center mb-6">
              <Tag className="w-7 h-7 text-[#0a0a0a]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-6">
              AI Asset Tagging
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed mb-8">
              Transform weeks of manual work into minutes. Our AI analyzes your products and
              automatically maps them to your IP assets with high accuracy.
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

      {/* Before/After Comparison */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-12">
            The Old Way vs. The PhantomOS Way
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <div className="border border-[#e5e5e5] p-8">
              <div className="flex items-center gap-2 text-red-600 mb-6">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Manual Tagging</span>
              </div>
              <ul className="space-y-4">
                {[
                  'Open spreadsheet with 5,000 products',
                  'Read each product name individually',
                  'Manually type asset tags',
                  'Copy/paste for similar products',
                  'Double-check for errors',
                  'Repeat for 2-3 weeks',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#737373]">
                    <span className="text-red-500 font-bold">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>Time: 2-3 weeks</strong> of manual work
                </p>
              </div>
            </div>

            {/* After */}
            <div className="border-2 border-[#0a0a0a] p-8">
              <div className="flex items-center gap-2 text-green-600 mb-6">
                <Zap className="w-5 h-5" />
                <span className="font-medium">AI Auto-Tagging</span>
              </div>
              <ul className="space-y-4">
                {[
                  'Connect your data source',
                  'AI analyzes all products at once',
                  'Review suggestions with confidence scores',
                  'Accept with one click',
                  'Done!',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#0a0a0a]">
                    <span className="text-green-500 font-bold">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-green-50 border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Time: 15 minutes</strong> of review
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Tagging Works */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] text-center mb-4">
            How AI Tagging Works
          </h2>
          <p className="text-lg text-[#737373] text-center mb-12 max-w-2xl mx-auto">
            Our AI examines multiple signals to accurately map products to your IP assets.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Tag,
                title: 'Product Analysis',
                description: 'AI reads product names, descriptions, and SKUs to identify character and theme references.',
              },
              {
                icon: Layers,
                title: 'Asset Matching',
                description: 'Matches products against your IP asset library using fuzzy matching and context understanding.',
              },
              {
                icon: Sparkles,
                title: 'Confidence Scoring',
                description: 'Each suggestion comes with a confidence score so you know which need review.',
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="bg-white border border-[#e5e5e5] p-8 text-center">
                  <div className="w-14 h-14 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-[#0a0a0a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0a0a0a] mb-2">{step.title}</h3>
                  <p className="text-[#737373]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-6">
                Tagging Features
              </h2>
              <ul className="space-y-6">
                {[
                  {
                    icon: Sparkles,
                    title: 'AI Suggestions',
                    description: 'Get intelligent tag suggestions based on product data analysis.',
                  },
                  {
                    icon: MousePointer,
                    title: 'One-Click Accept',
                    description: 'Accept or reject suggestions instantly. Bulk operations supported.',
                  },
                  {
                    icon: Layers,
                    title: 'Multi-Asset Support',
                    description: 'Products can be tagged with multiple assets (e.g., Mario + Luigi).',
                  },
                  {
                    icon: Check,
                    title: 'Confidence Scores',
                    description: 'See how confident the AI is in each suggestion.',
                  },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.title} className="flex gap-4">
                      <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#0a0a0a]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a0a0a] mb-1">{feature.title}</h3>
                        <p className="text-sm text-[#737373]">{feature.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Interactive Demo */}
            <div className="bg-[#fafafa] border border-[#e5e5e5] p-8">
              <div className="space-y-4">
                {[
                  { name: 'Mario Kart Deluxe T-Shirt', status: 'confirmed', tags: ['Mario', 'Racing'] },
                  { name: 'Link Adventure Poster', status: 'suggested', tags: ['Link'], confidence: 94 },
                  { name: 'Pikachu Plush Collection', status: 'suggested', tags: ['Pikachu'], confidence: 87 },
                  { name: 'Game Console Hoodie', status: 'pending', tags: [] },
                ].map((product) => (
                  <div key={product.name} className="flex items-center gap-4 p-4 bg-white border border-[#e5e5e5]">
                    <div className="w-12 h-12 bg-[#e5e5e5] rounded-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0a0a0a] truncate">{product.name}</p>
                      <div className="flex gap-1 mt-1">
                        {product.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-green-100 text-green-700">
                            {tag}
                          </span>
                        ))}
                        {product.status === 'pending' && (
                          <span className="px-2 py-0.5 text-xs bg-[#f5f5f5] text-[#737373]">
                            Needs tagging
                          </span>
                        )}
                      </div>
                    </div>
                    {product.status === 'suggested' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-600">{product.confidence}%</span>
                        <button className="px-2 py-1 text-xs bg-[#0a0a0a] text-white">Accept</button>
                      </div>
                    )}
                    {product.status === 'confirmed' && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Tag className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop Wasting Time on Manual Tagging
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            Let our AI do the heavy lifting. Connect your data and see suggestions in minutes.
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
