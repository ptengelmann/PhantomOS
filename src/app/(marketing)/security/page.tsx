import { Shield, Lock, Database, Key, AlertCircle, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">SECURITY</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Your Data is <span className="italic font-light">Secure</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            We take security seriously. Here's exactly what we do to protect your data.
          </p>
        </section>

        {/* Current Security Measures */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center">
            Current <span className="italic font-light">Security</span> Measures
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Password Security</h3>
                  <p className="text-[#737373] text-sm leading-relaxed">
                    All passwords are hashed using bcrypt with industry-standard salt rounds before storage.
                    We never store passwords in plain text.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                  <Key className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Authentication</h3>
                  <p className="text-[#737373] text-sm leading-relaxed">
                    NextAuth-powered authentication with JWT-based sessions. Sessions expire after 30 days
                    and tokens are signed with secure secrets.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Database Security</h3>
                  <p className="text-[#737373] text-sm leading-relaxed">
                    PostgreSQL database hosted on Neon with SSL connections required. All database
                    connections use encrypted transport (sslmode=require).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Transport Security</h3>
                  <p className="text-[#737373] text-sm leading-relaxed">
                    All data transmitted between your browser and our servers is encrypted using
                    HTTPS/TLS. No plain HTTP connections are accepted in production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Access Control */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Access Control</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0a0a0a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0a0a0a] font-medium">Publisher Isolation</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    Each publisher's data is isolated by publisher ID. Users can only access data
                    for their own organization.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0a0a0a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0a0a0a] font-medium">Role-Based Access</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    User roles (owner, admin, member) determine access levels within your organization.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0a0a0a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0a0a0a] font-medium">API Authentication</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    All API routes require valid authentication tokens. Unauthorized requests are rejected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Responsible Disclosure */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-4">Responsible Disclosure</h2>
            <p className="text-[#737373] mb-6 leading-relaxed">
              If you discover a security vulnerability, please report it to us responsibly:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-sm text-[#737373] pt-1">
                  Email <a href="mailto:security@phantomos.com" className="text-[#0a0a0a] hover:underline">security@phantomos.com</a> with details
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm text-[#737373] pt-1">
                  Allow us 48 hours to respond and 90 days to address the issue
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#0a0a0a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm text-[#737373] pt-1">
                  Do not publicly disclose the vulnerability until we've addressed it
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="bg-[#0a0a0a] py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Security <span className="italic font-light">Questions</span>?
            </h3>
            <p className="text-[#a3a3a3] mb-6 leading-relaxed">
              Have questions about our security practices? We're happy to discuss.
            </p>
            <a
              href="mailto:security@phantomos.com"
              className="inline-block px-8 py-3 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Contact Security Team
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
