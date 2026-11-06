import { Archivo, DM_Sans } from 'next/font/google';
import './globals.css';

// Self-hosted at build time by next/font (part of Next.js, no extra dependency). Both OFL.
// Archivo is variable on weight and width: one family gives the condensed monument and the wide kicker.
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' });
const text = DM_Sans({ subsets: ['latin'], variable: '--font-text', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://github.com/AVL05/premium-frontend-director-showcase'),
  title: 'The Art of Direction — Premium Frontend Director',
  description: 'An open-source agent skill that teaches coding agents to art-direct a frontend, build it, and prove it in a real browser against 11 quality gates.',
  openGraph: {
    title: 'The Art of Direction — Premium Frontend Director',
    description: 'Good interfaces are built. Great experiences are directed.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#f3f0e9' };

export default function RootLayout({ children }) {
  return <html lang="en" className={`${display.variable} ${text.variable}`}><body>{children}</body></html>;
}
