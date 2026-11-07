import { Archivo, DM_Sans } from 'next/font/google';
import './globals.css';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './site';

// Self-hosted at build time by next/font (part of Next.js, no extra dependency). Both OFL.
// Archivo is variable on weight and width: one family gives the condensed monument and the wide kicker.
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' });
const text = DM_Sans({ subsets: ['latin'], variable: '--font-text', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, url: '/', siteName: 'The Art of Direction', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#f3f0e9' };

export default function RootLayout({ children }) {
  // Experience.jsx adds motion classes to <html> after hydration; React does not own them.
  return <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
    <body>{children}</body>
  </html>;
}
