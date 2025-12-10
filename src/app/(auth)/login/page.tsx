'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/overview');
      }
    } catch {
      // Demo mode: just redirect
      router.push('/overview');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <Link href="/" className="mb-12">
          <span className="text-3xl font-bold text-[#0a0a0a] tracking-tight">
            Phantom<span className="italic font-light">OS</span><span className="text-[#a3a3a3]">.</span>
          </span>
        </Link>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#e5e5e5] p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#0a0a0a] mb-3 tracking-tight">
                Welcome <span className="italic font-light">Back</span>
              </h1>
              <p className="text-[#737373] font-light">
                Sign in to your pilot account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-[#fafafa] border border-[#ef4444] text-[#ef4444] text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full px-6 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#e5e5e5] text-center">
              <p className="text-sm text-[#737373]">
                Need access?{' '}
                <Link href="/waitlist" className="text-[#0a0a0a] font-medium hover:underline">
                  Join the waitlist
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-[#a3a3a3]">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="hover:text-[#737373] underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-[#737373] underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
