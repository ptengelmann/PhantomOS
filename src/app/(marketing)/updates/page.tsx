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

        {/* Social CTA */}
        <section className="bg-[#0a0a0a] py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Follow Our <span className="italic font-light">Journey</span>
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Stay updated with new features, pilot program news, and product updates.
              Follow us on your preferred platform.
            </p>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X / Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href="https://reddit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
