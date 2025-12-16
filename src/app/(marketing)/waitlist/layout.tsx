import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Pilot Program',
  description: 'Join the PhantomOS founding pilot program. Get early access to AI-powered merchandise intelligence, shape the product, and lock in founder pricing.',
  keywords: ['pilot program', 'early access', 'PhantomOS waitlist', 'gaming merchandise analytics', 'founder pricing'],
  openGraph: {
    title: 'Join the Pilot Program | PhantomOS',
    description: 'Get early access to PhantomOS. Shape the product, influence features, and lock in founder pricing for life.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Pilot Program | PhantomOS',
    description: 'Get early access to PhantomOS. Shape the product, influence features, and lock in founder pricing for life.',
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
