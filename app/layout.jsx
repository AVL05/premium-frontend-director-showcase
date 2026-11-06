import './globals.css';

export const metadata = {
  metadataBase: new URL('https://github.com/AVL05/premium-frontend-director-showcase'),
  title: 'The Art of Direction — Premium Frontend Director',
  description: 'An expressive frontend design experience. Art direction, engineering, and visual proof — an open-source Agent Skill.',
  openGraph: {
    title: 'The Art of Direction — Premium Frontend Director',
    description: 'Good interfaces are built. Great experiences are directed.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
