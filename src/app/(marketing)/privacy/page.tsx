export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">PRIVACY POLICY</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Your <span className="italic font-light">Privacy</span> Matters
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Introduction</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                PhantomOS Limited (to be registered in the United Kingdom) operates PhantomOS, a revenue
                intelligence platform for game publishers. This Privacy Policy explains how we collect,
                use, and protect your personal information.
              </p>
              <p className="text-[#737373] leading-relaxed">
                By using PhantomOS, you agree to the collection and use of information in accordance
                with this policy.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Information We Collect</h2>

              <h3 className="text-lg font-bold text-[#0a0a0a] mt-6 mb-3">Account Information</h3>
              <p className="text-[#737373] leading-relaxed mb-4">
                When you create an account, we collect:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Email address</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Name</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Password (hashed using bcrypt - we never store plain-text passwords)</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Company name and details</span>
                </li>
              </ul>

              <h3 className="text-lg font-bold text-[#0a0a0a] mt-6 mb-3">Business Data</h3>
              <p className="text-[#737373] leading-relaxed mb-4">
                When you connect your data sources, we collect and process:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Sales transaction data from connected stores (Shopify, CSV uploads)</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Product catalog information</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Character and IP asset tags you create</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Revenue analytics and aggregated metrics</span>
                </li>
              </ul>

              <h3 className="text-lg font-bold text-[#0a0a0a] mt-6 mb-3">Waitlist Information</h3>
              <p className="text-[#737373] leading-relaxed mb-4">
                If you join our pilot program waitlist, we collect:
              </p>
              <ul className="space-y-2">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Email address</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Company name and website</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Revenue range</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Primary sales channel</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">How We Use Your Information</h2>
              <ul className="space-y-3">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>To provide and maintain the PhantomOS platform</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>To analyze your sales data and generate insights</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>To communicate with you about your account and updates</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>To improve our platform and develop new features</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>To ensure security and prevent fraud</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Data Storage and Security</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                Your data is stored securely:
              </p>
              <ul className="space-y-3">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>PostgreSQL database hosted on Neon with SSL encryption</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>All passwords are hashed using bcrypt</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Data transmitted using HTTPS/TLS encryption</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Publisher data is isolated - you can only access your own organization's data</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Data Sharing</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                We do not sell your data. We may share your information only in these circumstances:
              </p>
              <ul className="space-y-3">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>With your explicit consent</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>With service providers who help us operate the platform (e.g., hosting, analytics)</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>When required by law or to protect our legal rights</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Your Rights</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-3">
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Access your personal data</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Correct inaccurate data</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Delete your data (right to be forgotten)</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Export your data in a machine-readable format</span>
                </li>
                <li className="text-[#737373] flex items-start gap-2">
                  <span className="text-[#0a0a0a]">•</span>
                  <span>Object to certain processing of your data</span>
                </li>
              </ul>
              <p className="text-[#737373] leading-relaxed mt-6">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@phantomos.com" className="text-[#0a0a0a] hover:underline">
                  privacy@phantomos.com
                </a>
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Data Retention</h2>
              <p className="text-[#737373] leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide services.
                If you delete your account, we will delete your data within 30 days, except where we're
                required to retain it for legal or compliance purposes.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Children's Privacy</h2>
              <p className="text-[#737373] leading-relaxed">
                PhantomOS is not intended for children under 16. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-10 mb-8">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Changes to This Policy</h2>
              <p className="text-[#737373] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div className="bg-[#fafafa] border border-[#e5e5e5] p-10">
              <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Contact Us</h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm text-[#737373]">
                  Email:{' '}
                  <a href="mailto:privacy@phantomos.com" className="text-[#0a0a0a] hover:underline">
                    privacy@phantomos.com
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
