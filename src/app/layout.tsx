import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://phantom-os.vercel.app'),
  title: {
    default: "PhantomOS - The Gaming Commerce OS",
    template: "%s | PhantomOS",
  },
  description: "The operating system for gaming merchandise. AI-powered insights to understand what your fans love and optimize your IP monetization strategy.",
  keywords: ["gaming merchandise", "IP monetization", "game publishers", "merchandise analytics", "fan intelligence", "gaming commerce", "Shopify gaming", "merchandise optimization"],
  authors: [{ name: "PhantomOS" }],
  creator: "PhantomOS",
  publisher: "PhantomOS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "PhantomOS - The Gaming Commerce OS",
    description: "The operating system for gaming merchandise. Know what your fans love.",
    url: 'https://phantom-os.vercel.app',
    siteName: 'PhantomOS',
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "PhantomOS - The Gaming Commerce OS",
    description: "The operating system for gaming merchandise. Know what your fans love.",
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
