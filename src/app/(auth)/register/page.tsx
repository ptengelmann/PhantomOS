'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { ArrowRight, ArrowLeft, Check, Building2, User, Lock } from 'lucide-react';

type Step = 'account' | 'company' | 'success';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [joinExisting, setJoinExisting] = useState(true); // Default to joining existing workspace

  const validateStep1 = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!joinExisting && !publisherName.trim()) {
      setError('Company name is required');
      return false;
    }
    return true;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (validateStep1()) {
      setStep('company');
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          publisherName: joinExisting ? publisherName : publisherName,
          joinExisting,
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
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Account created but auto-login failed, show success and let user login manually
        setStep('success');
      } else {
        // Successfully signed in, redirect to dashboard
        router.push('/overview');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const goBack = () => {
    setError('');
    setStep('account');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image
            src="/logo.png"
            alt="PhantomOS"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl font-semibold text-[#0a0a0a] tracking-tight">PhantomOS</span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
            step === 'account'
              ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
              : 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
          }`}>
            {step !== 'account' ? <Check className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div className={`w-16 h-0.5 transition-colors ${
            step !== 'account' ? 'bg-[#0a0a0a]' : 'bg-[#e5e5e5]'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
            step === 'company'
              ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
              : step === 'success'
                ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                : 'border-[#e5e5e5] bg-white text-[#a3a3a3]'
          }`}>
            {step === 'success' ? <Check className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
          </div>
        </div>

        {step === 'account' && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'company' && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Set up your workspace</CardTitle>
              <CardDescription>Configure your company workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep2Submit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Workspace Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0a0a0a]">Workspace Setup</label>

                  <div
                    onClick={() => setJoinExisting(true)}
                    className={`p-4 border cursor-pointer transition-colors ${
                      joinExisting
                        ? 'border-[#0a0a0a] bg-[#fafafa]'
                        : 'border-[#e5e5e5] hover:border-[#a3a3a3]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        joinExisting ? 'border-[#0a0a0a]' : 'border-[#a3a3a3]'
                      }`}>
                        {joinExisting && <div className="w-2 h-2 bg-[#0a0a0a] rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#0a0a0a]">Use existing workspace</p>
                        <p className="text-sm text-[#737373]">Join your existing data and connectors</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setJoinExisting(false)}
                    className={`p-4 border cursor-pointer transition-colors ${
                      !joinExisting
                        ? 'border-[#0a0a0a] bg-[#fafafa]'
                        : 'border-[#e5e5e5] hover:border-[#a3a3a3]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        !joinExisting ? 'border-[#0a0a0a]' : 'border-[#a3a3a3]'
                      }`}>
                        {!joinExisting && <div className="w-2 h-2 bg-[#0a0a0a] rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#0a0a0a]">Create new workspace</p>
                        <p className="text-sm text-[#737373]">Start fresh with a new company</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Input
                  label={joinExisting ? "Company Name (optional)" : "Company Name"}
                  type="text"
                  placeholder="Your Game Studio"
                  value={publisherName}
                  onChange={(e) => setPublisherName(e.target.value)}
                  required={!joinExisting}
                />

                <p className="text-xs text-[#737373]">
                  {joinExisting
                    ? "You'll join the workspace with all existing products, connectors, and analytics data."
                    : "You'll create a new workspace. You can connect data sources after signup."
                  }
                </p>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" loading={loading}>
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Account created!</CardTitle>
              <CardDescription>Your account has been created successfully</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-[#737373] mb-6">
                Please sign in with your new credentials to access your workspace.
              </p>
              <Button onClick={() => router.push('/login')} className="w-full">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step !== 'success' && (
          <p className="text-center text-sm text-[#737373] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0a0a0a] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        )}

        <p className="text-center text-xs text-[#a3a3a3] mt-8">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="hover:text-[#737373] underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-[#737373] underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
