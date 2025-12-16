import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about PhantomOS - the merchandise intelligence platform for gaming publishers. Learn about features, pricing, data security, and more.',
  keywords: ['FAQ', 'frequently asked questions', 'PhantomOS help', 'merchandise analytics questions', 'gaming publisher FAQ'],
  openGraph: {
    title: 'FAQ | PhantomOS',
    description: 'Get answers to common questions about PhantomOS, the AI-powered merchandise intelligence platform for gaming publishers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | PhantomOS',
    description: 'Get answers to common questions about PhantomOS, the AI-powered merchandise intelligence platform for gaming publishers.',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
