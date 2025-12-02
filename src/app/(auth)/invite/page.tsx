'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui';
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react';

interface InviteData {
  email: string;
  name: string | null;
  role: string;
  publisherName: string;
}

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    // Validate the token
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/settings/invite/validate?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Invalid invitation');
          setLoading(false);
          return;
        }

        setInviteData(data.invitation);
        if (data.invitation.name) {
          setName(data.invitation.name);
        }
      } catch {
        setError('Failed to validate invitation');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

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

    setSubmitting(true);

    try {
      const response = await fetch('/api/settings/invite/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setSubmitting(false);
        return;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      setError('An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#737373] mx-auto mb-4" />
          <p className="text-sm text-[#737373]">Validating invitation...</p>
        </div>
      </div>
    );
  }

  // Error state (invalid/expired token)
  if (error && !inviteData) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-[#0a0a0a] mb-2">Invalid Invitation</h2>
                <p className="text-sm text-[#737373] mb-6">{error}</p>
                <Link href="/login">
                  <Button variant="outline">Go to Login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-[#0a0a0a] mb-2">Account Created!</h2>
                <p className="text-sm text-[#737373] mb-2">
                  You&apos;ve joined {inviteData?.publisherName}
                </p>
                <p className="text-xs text-[#a3a3a3]">Redirecting to login...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Invitation form
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#737373]" />
            </div>
            <CardTitle>Join {inviteData?.publisherName}</CardTitle>
            <CardDescription>
              You&apos;ve been invited to join as{' '}
              <Badge variant="outline" className="ml-1">{inviteData?.role}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={inviteData?.email || ''}
                disabled
                className="bg-[#f5f5f5]"
              />

              <Input
                label="Full Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

              <Button type="submit" className="w-full" loading={submitting}>
                {submitting ? 'Creating Account...' : 'Create Account & Join'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#a3a3a3] mt-8">
          Already have an account?{' '}
          <Link href="/login" className="hover:text-[#737373] underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#737373] mx-auto mb-4" />
        <p className="text-sm text-[#737373]">Loading...</p>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InviteContent />
    </Suspense>
  );
}
