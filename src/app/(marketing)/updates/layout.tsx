import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Updates',
  description: 'Stay up to date with the latest PhantomOS features, improvements, and fixes. Follow our journey building revenue intelligence for game publishers.',
  keywords: ['product updates', 'changelog', 'new features', 'PhantomOS updates', 'release notes'],
  openGraph: {
    title: 'Updates | PhantomOS',
    description: 'Latest features, improvements, and fixes. Follow our journey building revenue intelligence for game publishers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Updates | PhantomOS',
    description: 'Latest features, improvements, and fixes. Follow our journey building revenue intelligence for game publishers.',
  },
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
