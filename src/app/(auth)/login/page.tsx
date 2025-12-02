'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For now, just redirect to dashboard (will add auth later)
    setTimeout(() => {
      router.push('/overview');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your PhantomOS account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 border border-[#e5e5e5] accent-[#0a0a0a]" />
                  <span className="text-sm text-[#737373]">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-[#0a0a0a] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-[#737373]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#0a0a0a] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-[#a3a3a3] mt-8">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="hover:text-[#737373] underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-[#737373] underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
