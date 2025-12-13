import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how PhantomOS transforms your merchandise data into actionable insights in 4 simple steps. Connect your store, AI tags products, view revenue by character, and get AI-powered recommendations.',
  keywords: ['how it works', 'merchandise analytics setup', 'product tagging', 'revenue tracking', 'AI insights', 'Shopify integration'],
  openGraph: {
    title: 'How It Works | PhantomOS',
    description: 'From data to decisions in 4 simple steps. See how PhantomOS reveals which characters drive your merchandise revenue.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | PhantomOS',
    description: 'From data to decisions in 4 simple steps. See how PhantomOS reveals which characters drive your merchandise revenue.',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
