'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to waitlist - registration is invite-only
    router.replace('/waitlist');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a0a0a] mx-auto mb-4" />
        <p className="text-[#737373]">Redirecting to waitlist...</p>
      </div>
    </div>
  );
}
