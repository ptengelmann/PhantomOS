'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function InviteRegisterPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/auth/validate-invite?token=${token}`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
        setInviteEmail(data.email);
      } else {
        setTokenValid(false);
        setError(data.error || 'Invalid or expired invite link');
      }
    } catch {
      setTokenValid(false);
      setError('Failed to validate invite link');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Account created, now sign in
      const result = await signIn('credentials', {
        email: inviteEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please try logging in manually.');
        setLoading(false);
      } else {
        router.push('/overview');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mb-4" />
          <p className="text-[#737373]">Validating invite...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-[#ef4444]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0a0a0a] mb-4 tracking-tight">
              Invalid <span className="italic font-light">Invite</span>
            </h1>
            <p className="text-lg text-[#737373] font-light mb-8 leading-relaxed">
              {error || 'This invite link is invalid or has already been used.'}
            </p>
            <div className="space-y-4">
              <Link
                href="/waitlist"
                className="block px-6 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-all"
              >
                Join the Waitlist
              </Link>
              <Link
                href="/login"
                className="block text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <Link href="/" className="mb-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="PhantomOS"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-[#0a0a0a] tracking-tight">PhantomOS</span>
          </div>
        </Link>

        {/* Registration Card */}
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#e5e5e5] p-10">
            {/* Success Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-[#f0fdf4] border border-[#86efac]">
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
              <span className="text-sm font-medium text-[#166534]">Invite Verified</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#0a0a0a] mb-3 tracking-tight">
                Create Your <span className="italic font-light">Account</span>
              </h1>
              <p className="text-[#737373] font-light">
                Welcome to PhantomOS Pilot Program
              </p>
              <p className="text-sm text-[#a3a3a3] mt-2">
                {inviteEmail}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-[#fafafa] border border-[#ef4444] text-[#ef4444] text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="Create a password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0a0a0a] mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full px-6 py-4 bg-[#0a0a0a] text-white font-medium hover:bg-[#171717] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-[#a3a3a3]">
            By creating an account, you agree to our{' '}
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
    </div>
  );
}
