import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, Users, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'PhantomOS is the operating system for gaming merchandise. We help game publishers understand what their fans love and optimize IP monetization.',
  openGraph: {
    title: 'About | PhantomOS',
    description: 'The operating system for gaming merchandise. Built for game publishers.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">ABOUT PHANTOMOS</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Built for <span className="italic font-light">Game</span> Publishers
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            We help game publishers understand which characters and IP assets drive their merchandise revenue
          </p>
        </section>

        {/* Story */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-12">
            <h2 className="text-3xl font-bold text-[#0a0a0a] mb-6">The Problem</h2>
            <div className="space-y-4 text-[#737373] leading-relaxed">
              <p>
                Game publishers sell millions in merchandise, but most have no idea which characters
                or IP assets actually drive revenue. Shopify shows total sales. Spreadsheets become
                unmanageable. Critical decisions are made based on gut feeling.
              </p>
              <p>
                <span className="text-[#0a0a0a] font-medium">A major publisher</span> with a roster
                of 50+ characters couldn't answer simple questions: Which character sells the most hoodies?
                What percentage of revenue comes from our newest IP? Should we expand this product line?
              </p>
              <p>
                They were flying blind with millions in annual merchandise revenue.
              </p>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-[#0a0a0a] text-white p-12">
            <h2 className="text-3xl font-bold mb-6">The Solution</h2>
            <div className="space-y-4 text-[#a3a3a3] leading-relaxed">
              <p>
                <span className="text-white font-medium">PhantomOS</span> connects directly to your
                sales data and maps every product to your characters, themes, and IP assets. What used
                to take weeks of manual spreadsheet work now happens automatically.
              </p>
              <p className="text-white">
                See exactly which characters drive revenue. Understand fan preferences. Make data-driven
                decisions about product development and marketing.
              </p>
              <p>
                Built specifically for game publishers who sell merchandise at scale.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center">
            How We <span className="italic font-light">Build</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Purpose-Built</h3>
              <p className="text-[#737373] leading-relaxed">
                Designed specifically for game publishers. Every feature solves real problems our
                pilot partners face daily.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">Partner-Driven</h3>
              <p className="text-[#737373] leading-relaxed">
                Building with our pilot partners, not for them. Your feedback shapes our roadmap and
                product decisions.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">AI-Powered</h3>
              <p className="text-[#737373] leading-relaxed">
                Leverage AI to automate tagging, surface insights, and forecast demand. Technology that
                saves you weeks of manual work.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0a0a0a] py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join the <span className="italic font-light">Pilot</span> Program
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Building PhantomOS with game publishers. Get early access and help shape the product.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
