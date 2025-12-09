'use client';

import Link from 'next/link';
import { Tag, ArrowRight, Sparkles, Check, Zap, MousePointer, Clock, Package, X } from 'lucide-react';

export default function TaggingFeaturePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">AI-POWERED ASSET TAGGING</div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-8 tracking-tight leading-[1.1]">
              From Weeks to <span className="italic font-light">Minutes</span>
            </h1>
            <p className="text-xl text-[#737373] leading-relaxed font-light max-w-2xl mx-auto mb-10">
              Stop manually tagging thousands of products. Our AI reads your catalog and maps everything to IP assets automatically.
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

      {/* Time Savings Stat */}
      <section className="py-16 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-6xl font-bold text-[#0a0a0a] mb-3 tracking-tighter">2-3 Weeks</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider">Manual Tagging Time</div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-12 h-12 text-[#a3a3a3]" />
            </div>
            <div>
              <div className="text-6xl font-bold text-[#0a0a0a] mb-3 tracking-tighter">15 Min</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider">With AI Auto-Tagging</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interface Demo */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">SEE IT IN ACTION</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] text-center mb-6 tracking-tight">
            How AI Tagging Works
          </h2>
          <p className="text-lg text-[#737373] text-center mb-16 max-w-2xl mx-auto font-light">
            Click a product, get AI suggestions, accept with one click. That's it.
          </p>

          <div className="max-w-6xl mx-auto">
            {/* Tagging Interface */}
            <div className="bg-white border-2 border-[#e5e5e5] overflow-hidden">
              {/* Top Bar */}
              <div className="bg-[#fafafa] border-b border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-[#0a0a0a]">Products</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#737373]">2,847 total</span>
                      <span className="text-[#737373]">•</span>
                      <span className="text-[#22c55e] font-medium">1,923 mapped</span>
                      <span className="text-[#737373]">•</span>
                      <span className="text-[#eab308] font-medium">924 unmapped</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Auto-Tag 924 Products
                  </button>
                </div>
              </div>

              {/* Product Detail */}
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left: Product Info */}
                  <div>
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-24 h-24 bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center flex-shrink-0">
                        <Package className="w-12 h-12 text-[#737373]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-[#0a0a0a] mb-2">Shadow Knight Premium T-Shirt</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-[#737373]">SKU-2847</span>
                          <span className="text-sm px-2 py-0.5 border border-[#e5e5e5] text-[#737373]">Apparel</span>
                          <span className="text-xs px-2 py-1 bg-[#eab308] text-white font-medium">UNMAPPED</span>
                        </div>
                        <p className="text-sm text-[#737373] leading-relaxed">
                          Premium quality t-shirt featuring Shadow Knight character design. High-quality print on soft cotton fabric.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#e5e5e5] pt-6">
                      <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4">Product Details</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-[#737373] mb-1">Price</div>
                          <div className="text-lg font-semibold text-[#0a0a0a]">$29.99</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#737373] mb-1">Category</div>
                          <div className="text-lg font-semibold text-[#0a0a0a]">Apparel</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Suggestions */}
                  <div className="border-l border-[#e5e5e5] pl-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#0a0a0a]" />
                        <h5 className="font-semibold text-[#0a0a0a]">AI Suggestions</h5>
                      </div>
                      <span className="text-xs text-[#737373]">2 found</span>
                    </div>

                    <div className="space-y-4">
                      {/* High Confidence Suggestion */}
                      <div className="border-2 border-[#0a0a0a] bg-white p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Tag className="w-4 h-4 text-[#0a0a0a]" />
                              <span className="font-semibold text-[#0a0a0a]">Shadow Knight</span>
                              <span className="text-xs bg-[#0a0a0a] text-white px-2 py-0.5">Character</span>
                            </div>
                            <p className="text-sm text-[#737373] mb-3">
                              Product name contains "Shadow Knight" - strong character match
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-[#f5f5f5] overflow-hidden">
                                <div className="h-full bg-[#0a0a0a]" style={{ width: '96%' }}></div>
                              </div>
                              <span className="text-xs font-medium text-[#0a0a0a]">96%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#171717] transition-colors flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button className="px-4 py-2 border border-[#e5e5e5] text-[#737373] text-sm hover:border-[#0a0a0a] transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Medium Confidence Suggestion */}
                      <div className="border border-[#e5e5e5] bg-white p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Tag className="w-4 h-4 text-[#737373]" />
                              <span className="font-semibold text-[#0a0a0a]">Dark Fantasy Theme</span>
                              <span className="text-xs border border-[#e5e5e5] px-2 py-0.5 text-[#737373]">Theme</span>
                            </div>
                            <p className="text-sm text-[#737373] mb-3">
                              "Knight" and "Dark" keywords suggest fantasy theme
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-[#f5f5f5] overflow-hidden">
                                <div className="h-full bg-[#737373]" style={{ width: '72%' }}></div>
                              </div>
                              <span className="text-xs font-medium text-[#737373]">72%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 border border-[#e5e5e5] text-[#0a0a0a] text-sm font-medium hover:border-[#0a0a0a] transition-colors flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button className="px-4 py-2 border border-[#e5e5e5] text-[#737373] text-sm hover:border-[#0a0a0a] transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#e5e5e5]">
                      <p className="text-xs text-[#737373] text-center">
                        AI learns from your choices to improve suggestions over time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">WHY IT WORKS</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] text-center mb-16 tracking-tight">
            Built for Scale and Speed
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">Smart AI</h3>
              <p className="text-[#737373] font-light leading-relaxed">
                Analyzes product names, descriptions, and SKUs to detect character and theme references with 90%+ accuracy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-6">
                <MousePointer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">One-Click Accept</h3>
              <p className="text-[#737373] font-light leading-relaxed">
                Accept or reject suggestions instantly. Bulk operations let you tag hundreds of products at once.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">Lightning Fast</h3>
              <p className="text-[#737373] font-light leading-relaxed">
                Process 5,000+ products per hour. Tag your entire catalog faster than you can import it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Comparison */}
      <section className="py-24 lg:py-32 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Manual Process */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 border-2 border-[#e5e5e5] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#737373]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">Manual Process</h3>
                  <p className="text-sm text-[#737373]">The old way</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', text: 'Export products to spreadsheet', time: '30 min' },
                  { step: '2', text: 'Read each product name manually', time: '2-3 days' },
                  { step: '3', text: 'Type character/IP tags by hand', time: '1-2 weeks' },
                  { step: '4', text: 'Check for typos and errors', time: '2-3 days' },
                  { step: '5', text: 'Import back to system', time: '1 hour' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 p-4 bg-white border border-[#e5e5e5]">
                    <div className="w-8 h-8 border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-[#737373]">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#0a0a0a]">{item.text}</p>
                    </div>
                    <div className="text-xs text-[#737373] whitespace-nowrap">{item.time}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white border border-[#e5e5e5]">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-1">Total Time</div>
                <div className="text-2xl font-bold text-[#0a0a0a]">2-3 Weeks</div>
              </div>
            </div>

            {/* AI Process */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">AI Auto-Tagging</h3>
                  <p className="text-sm text-[#737373]">The PhantomOS way</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', text: 'Click "Auto-Tag" button', time: '1 second' },
                  { step: '2', text: 'AI analyzes all products', time: '2-3 min' },
                  { step: '3', text: 'Review AI suggestions', time: '10-12 min' },
                  { step: '4', text: 'Accept high-confidence tags', time: '1-2 min' },
                  { step: '5', text: 'Done - start using data', time: 'Instant' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 p-4 bg-white border-2 border-[#0a0a0a]">
                    <div className="w-8 h-8 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-white">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#0a0a0a] font-medium">{item.text}</p>
                    </div>
                    <div className="text-xs text-[#0a0a0a] font-medium whitespace-nowrap">{item.time}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#0a0a0a] text-white">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-1">Total Time</div>
                <div className="text-2xl font-bold">15 Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-white border-y border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">98%</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider mb-2">Time Saved</div>
              <p className="text-xs text-[#a3a3a3]">vs manual spreadsheet tagging</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">90%+</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider mb-2">Accuracy</div>
              <p className="text-xs text-[#a3a3a3]">Average AI confidence score</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#0a0a0a] mb-2 tracking-tighter">5,000+</div>
              <div className="text-sm text-[#737373] uppercase tracking-wider mb-2">Products/Hour</div>
              <p className="text-xs text-[#a3a3a3]">AI processing speed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-4 text-center">PERFECT FOR</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] text-center mb-16 tracking-tight">
            Common Use Cases
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all">
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">Initial Catalog Setup</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-4">
                Just imported 5,000 products from Shopify? Auto-tag everything in 15 minutes instead of spending weeks in spreadsheets.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#0a0a0a]" />
                <span className="text-[#525252]">Tag entire catalog at once</span>
              </div>
            </div>

            <div className="border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all">
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">New Product Launches</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-4">
                Adding 100 new products? Get AI suggestions instantly and approve them before you finish your coffee.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#0a0a0a]" />
                <span className="text-[#525252]">Tag as you import</span>
              </div>
            </div>

            <div className="border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all">
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">Multi-Asset Products</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-4">
                Crossover merchandise with multiple characters? AI detects all relevant assets and suggests them together.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#0a0a0a]" />
                <span className="text-[#525252]">Multiple tags per product</span>
              </div>
            </div>

            <div className="border border-[#e5e5e5] p-8 hover:border-[#0a0a0a] transition-all">
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3 tracking-tight">Catalog Cleanup</h3>
              <p className="text-[#737373] font-light leading-relaxed mb-4">
                Old products never properly tagged? Run auto-tag on your entire catalog to fill in the gaps.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#0a0a0a]" />
                <span className="text-[#525252]">Bulk operations supported</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Stop Manual <span className="italic font-light">Tagging</span>
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Let AI do the heavy lifting. Connect your data and see tag suggestions in minutes. Available now in the pilot program.
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
