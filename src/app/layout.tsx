import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PhantomOS - The Gaming Commerce OS",
  description: "The HubSpot for Gaming IP Monetization. Transform gaming merchandise from guesswork to data-driven, scalable commerce.",
  keywords: ["gaming", "merchandise", "commerce", "IP monetization", "game publishers"],
  authors: [{ name: "PhantomOS" }],
  openGraph: {
    title: "PhantomOS - The Gaming Commerce OS",
    description: "The HubSpot for Gaming IP Monetization",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
