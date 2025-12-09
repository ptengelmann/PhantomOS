import { CalendarDays, Sparkles, Users, Code } from 'lucide-react';

const updates = [
  {
    date: 'December 2025',
    title: 'Building for Launch',
    icon: Code,
    content: [
      'Platform development in full swing. Building core analytics, manual tagging workflows, and Shopify integration.',
      'Pilot program launching early 2026 (January-February) with select game publishers. Finalizing the product and onboarding process.',
    ],
  },
  {
    date: 'November 2025',
    title: 'Platform Development Begins',
    icon: Sparkles,
    content: [
      'Started building PhantomOS after extensive conversations with game publishers about their merchandise operations.',
      'Initial focus: solving the fundamental problem of understanding what characters and IP elements drive sales.',
    ],
  },
  {
    date: 'October 2025',
    title: 'Customer Discovery',
    icon: Users,
    content: [
      'Talked to 20+ game publishers about how they manage merchandise revenue. Discovered a consistent pattern: teams manually track sales in spreadsheets, guess at what fans want, and struggle to justify inventory decisions.',
      'The problem is clear. Time to build.',
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">UPDATES</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Community <span className="italic font-light">Updates</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            Follow our journey building revenue intelligence for game publishers.
            We'll share progress, new features, and what we're learning from pilot partners.
          </p>
        </section>

        {/* Updates Timeline */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="space-y-6">
            {updates.map((update, index) => {
              const Icon = update.icon;
              return (
                <div key={index} className="bg-white border border-[#e5e5e5] p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#0a0a0a]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CalendarDays className="w-4 h-4 text-[#a3a3a3]" />
                        <span className="text-xs tracking-[0.1em] text-[#a3a3a3] uppercase">
                          {update.date}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">{update.title}</h2>
                      <div className="space-y-3">
                        {update.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-[#737373] leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="bg-[#0a0a0a] py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay in the <span className="italic font-light">Loop</span>
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Want to hear about new features, pilot program openings, and product updates?
              Join our waitlist.
            </p>
            <a
              href="/waitlist"
              className="inline-block px-10 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
