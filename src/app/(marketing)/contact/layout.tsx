import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the PhantomOS team. Questions about our merchandise intelligence platform, enterprise solutions, or technical support.',
  keywords: ['contact PhantomOS', 'support', 'enterprise sales', 'merchandise analytics help'],
  openGraph: {
    title: 'Contact | PhantomOS',
    description: 'Get in touch with the PhantomOS team for questions, enterprise solutions, or support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | PhantomOS',
    description: 'Get in touch with the PhantomOS team for questions, enterprise solutions, or support.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
