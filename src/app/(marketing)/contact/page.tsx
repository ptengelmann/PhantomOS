import { Mail, MessageSquare, Building2 } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="mb-4">
            <div className="inline-block px-3 py-1 bg-[#f5f5f5] border border-[#e5e5e5] text-xs font-medium text-[#737373] tracking-wide">
              CONTACT
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            Get in <span className="italic font-light">Touch</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed">
            Questions about PhantomOS? Want to discuss enterprise needs? We're here to help.
          </p>
        </section>

        {/* Contact Options */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e5e5e5] p-8 text-center">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">General Inquiries</h3>
              <p className="text-sm text-[#737373] mb-4">Questions about PhantomOS or the pilot program</p>
              <a href="mailto:hello@phantomos.com" className="text-sm text-[#0a0a0a] hover:underline">
                hello@phantomos.com
              </a>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8 text-center">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">Enterprise Sales</h3>
              <p className="text-sm text-[#737373] mb-4">Custom solutions for major publishers</p>
              <a href="mailto:sales@phantomos.com" className="text-sm text-[#0a0a0a] hover:underline">
                sales@phantomos.com
              </a>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-8 text-center">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-bold text-[#0a0a0a] mb-2">Support</h3>
              <p className="text-sm text-[#737373] mb-4">Technical assistance for pilot partners</p>
              <a href="mailto:support@phantomos.com" className="text-sm text-[#0a0a0a] hover:underline">
                support@phantomos.com
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-2xl mx-auto px-6 pb-24">
          <div className="bg-white border border-[#e5e5e5] p-10">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                >
                  <option>General Inquiry</option>
                  <option>Enterprise Sales</option>
                  <option>Technical Support</option>
                  <option>Partnership Opportunity</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#262626] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Alternative Contact */}
        <section className="bg-[#fafafa] border-y border-[#e5e5e5] py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">
              Prefer to Join the <span className="italic font-light">Waitlist</span>?
            </h3>
            <p className="text-[#737373] mb-6 leading-relaxed">
              Skip the form and join our pilot program directly
            </p>
            <a
              href="/waitlist"
              className="inline-block px-8 py-3 border border-[#e5e5e5] bg-white text-[#0a0a0a] font-medium hover:border-[#0a0a0a] transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
