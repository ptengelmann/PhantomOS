import { Rocket, Users, Code, Target, Zap, Heart } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">CAREERS</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Build the <span className="italic font-light">Future</span> of Merch
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            We're building revenue intelligence for game publishers. Early stage, ambitious vision.
          </p>
        </section>

        {/* Current State */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Where We Are</h2>
            <p className="text-[#737373] leading-relaxed mb-4">
              PhantomOS is in pilot phase with select game publishers. We're building the product,
              talking to customers, and figuring out what matters. Not yet registered as a company
              (that's happening in Q1 2026), no office, no formal structure.
            </p>
            <p className="text-[#737373] leading-relaxed">
              Just focused on building something game publishers actually need.
            </p>
          </div>
        </section>

        {/* What We Care About */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center">
            What We <span className="italic font-light">Value</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Customer Obsession</h3>
              <p className="text-[#737373] leading-relaxed">
                We build with game publishers, not for them. Every feature solves a real problem
                our pilot partners face.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Move Fast</h3>
              <p className="text-[#737373] leading-relaxed">
                Ship quickly, learn fast, iterate constantly. We're not precious about code.
                If it solves the problem, it's good enough.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Technical Excellence</h3>
              <p className="text-[#737373] leading-relaxed">
                Clean code, good architecture, thoughtful decisions. Fast doesn't mean sloppy.
                We care about craft.
              </p>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-[#0a0a0a] text-white p-10">
            <h2 className="text-2xl font-bold mb-6">Our Stack</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <div className="text-sm text-[#a3a3a3] mb-2">Frontend</div>
                <div className="text-[#ffffff]">Next.js, React, TypeScript, Tailwind</div>
              </div>
              <div>
                <div className="text-sm text-[#a3a3a3] mb-2">Backend</div>
                <div className="text-[#ffffff]">Next.js API Routes, PostgreSQL, Drizzle ORM</div>
              </div>
              <div>
                <div className="text-sm text-[#a3a3a3] mb-2">AI</div>
                <div className="text-[#ffffff]">Claude (Anthropic), structured outputs</div>
              </div>
              <div>
                <div className="text-sm text-[#a3a3a3] mb-2">Infrastructure</div>
                <div className="text-[#ffffff]">Vercel, Neon (Postgres), GitHub</div>
              </div>
            </div>
          </div>
        </section>

        {/* Not Hiring Yet */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <div className="flex items-start gap-4 mb-6">
              <Rocket className="w-8 h-8 text-[#0a0a0a] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-[#0a0a0a] mb-2">Not Actively Hiring</h2>
                <p className="text-[#737373] leading-relaxed mb-4">
                  We're focused on building and validating with pilot partners right now. No open
                  roles, no formal hiring process.
                </p>
                <p className="text-[#737373] leading-relaxed">
                  That said - if you're exceptional and this problem space excites you, reach out.
                  We're always interested in talking to great people, even if we're not ready to hire yet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You'd Work On */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-[#fafafa] border border-[#e5e5e5] p-10">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">
              What You'd Work On <span className="italic font-light">(Eventually)</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a] mb-1">Core Product</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    Building the platform game publishers use daily. Analytics, insights, tagging,
                    data connectors. Real product work.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a] mb-1">AI Features</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    Auto-tagging products to characters. Surfacing insights from sales patterns.
                    Forecasting demand. Making AI actually useful.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a] mb-1">Data Infrastructure</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    Connecting to Shopify, Amazon, custom sources. Processing millions of transactions.
                    Making data pipelines reliable.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a] mb-1">Customer Success</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    Working directly with game publishers. Understanding their workflows. Helping
                    them get value from the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0a0a0a] py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Interested in <span className="italic font-light">PhantomOS</span>?
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Send us your background, what you're working on, and why PhantomOS interests you.
            </p>
            <a
              href="mailto:careers@phantomos.com"
              className="inline-block px-10 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              careers@phantomos.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
