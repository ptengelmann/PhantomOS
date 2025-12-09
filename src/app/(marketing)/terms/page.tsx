export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">TERMS OF SERVICE</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Terms of <span className="italic font-light">Service</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Agreement to Terms</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                These Terms of Service constitute a legally binding agreement between you and
                PhantomOS Limited (to be registered in the United Kingdom) concerning your access
                to and use of the PhantomOS platform.
              </p>
              <p className="text-[#737373] leading-relaxed">
                By accessing or using PhantomOS, you agree to be bound by these Terms. If you do
                not agree, you may not access or use the platform.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Pilot Program Terms</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                PhantomOS is currently in pilot program phase. During this period:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Access is invite-only through our waitlist approval process</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>The platform is provided free of charge during the 30-day pilot period</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Features and functionality may change without notice</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>The platform is provided "as is" with no warranties</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>We may terminate pilot accounts at any time with 7 days notice</span>
                </li>
              </ul>
              <p className="text-[#737373] leading-relaxed">
                Pilot participants who remain active when we launch commercially will receive
                grandfathered pricing at a significant discount.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">User Accounts</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                To use PhantomOS, you must:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Be at least 16 years old</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Provide accurate and complete information</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Not share your account with others</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Notify us immediately of any unauthorized access</span>
                </li>
              </ul>
              <p className="text-[#737373] leading-relaxed">
                You are responsible for all activity that occurs under your account.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Acceptable Use</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-3">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Use the platform for any illegal purpose</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Attempt to gain unauthorized access to our systems</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Interfere with or disrupt the platform</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Upload malicious code or viruses</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Reverse engineer or attempt to extract source code</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Use the platform to compete with us or build a similar product</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Scrape or data mine the platform</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Your Data</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                You retain all rights to your data. By using PhantomOS, you grant us a limited license to:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Store and process your data to provide the service</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Use aggregated, anonymized data to improve the platform</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Generate analytics and insights from your data</span>
                </li>
              </ul>
              <p className="text-[#737373] leading-relaxed">
                You are responsible for ensuring you have the right to upload and process any data
                you provide to PhantomOS.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Intellectual Property</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                The PhantomOS platform, including all software, designs, and content, is owned by
                PhantomOS Limited and protected by intellectual property laws.
              </p>
              <p className="text-[#737373] leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to use the platform
                during your subscription period.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Disclaimer of Warranties</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                During the pilot program, PhantomOS is provided "as is" and "as available" without
                warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="space-y-3">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Merchantability</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Fitness for a particular purpose</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Non-infringement</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Accuracy, reliability, or completeness of insights</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Limitation of Liability</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                To the maximum extent permitted by law, PhantomOS Limited shall not be liable for any:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Indirect, incidental, special, or consequential damages</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Loss of profits, revenue, data, or use</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Business interruption</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Decisions made based on platform insights</span>
                </li>
              </ul>
              <p className="text-[#737373] leading-relaxed">
                Our total liability shall not exceed the amount you paid us in the 12 months
                preceding the claim (or £100 during the free pilot period).
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Termination</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                Either party may terminate your account:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>You may delete your account at any time</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>We may suspend or terminate accounts that violate these Terms</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>We may terminate pilot accounts with 7 days notice</span>
                </li>
              </ul>
              <p className="text-[#737373] leading-relaxed">
                Upon termination, your access will cease and your data will be deleted within 30
                days unless otherwise required by law.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Changes to Terms</h2>
              <p className="text-[#737373] leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes by
                email or through the platform. Continued use after changes constitutes acceptance
                of the new Terms.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Governing Law</h2>
              <p className="text-[#737373] leading-relaxed">
                These Terms are governed by the laws of England and Wales. Any disputes shall be
                subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </div>

            <div className="bg-[#fafafa] border border-[#e5e5e5] p-10">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Contact Us</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm text-[#737373]">
                  Email:{' '}
                  <a href="mailto:legal@phantomos.com" className="text-[#0a0a0a] hover:underline">
                    legal@phantomos.com
                  </a>
                </p>
                <p className="text-sm text-[#737373]">
                  Company: PhantomOS Limited (to be registered in the United Kingdom)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
