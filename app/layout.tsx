import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'CivicShield | India Election Intelligence & Fact-Checking',
    template: '%s | CivicShield'
  },
  description: 'The definitive AI-powered platform for Indian election education, real-time fact-checking, and voter readiness. Empowering citizens with verified information.',
  keywords: ['Indian Elections', 'ECI', 'Voter Education', 'Fact Checking', 'Election Rumors', 'Gemini AI', 'Civic Intelligence'],
  authors: [{ name: 'Vivek Kumar Verma' }],
  creator: 'Vivek Kumar Verma',
  publisher: 'CivicShield',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://civicshield.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en',
      'hi-IN': '/hi',
      'mr-IN': '/mr',
    },
  },
  openGraph: {
    title: 'CivicShield | India Election Intelligence Hub',
    description: 'Real-time AI fact-checking and guided voter education for the Indian electoral ecosystem.',
    url: 'https://civicshield.app',
    siteName: 'CivicShield',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CivicShield Dashboard Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CivicShield | India Election Intelligence Hub',
    description: 'Real-time AI fact-checking and guided voter education.',
    creator: '@civicshield',
    images: ['/og-image.png'],
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-white">
        {children}
      </body>
    </html>
  );
}
