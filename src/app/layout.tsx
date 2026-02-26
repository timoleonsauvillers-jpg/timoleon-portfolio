import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getAboutContent } from '@/lib/queries';

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Timoléon Sauvillers — Motion Designer & Graveur',
  description: 'Portfolio de Timoléon Sauvillers, Motion Designer et Graveur basé à Paris.',
  keywords: ['motion design', 'gravure', 'direction artistique', 'animation', 'portfolio'],
  authors: [{ name: 'Timoléon Sauvillers' }],
  openGraph: {
    title: 'Timoléon Sauvillers — Motion Designer & Graveur',
    description: 'Portfolio de Timoléon Sauvillers, Motion Designer et Graveur basé à Paris.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timoléon Sauvillers — Motion Designer & Graveur',
    description: 'Portfolio de Timoléon Sauvillers, Motion Designer et Graveur basé à Paris.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const about = await getAboutContent();

  return (
    <html lang="fr" className={sora.variable}>
      <body className="bg-background text-foreground min-h-screen">
        <Navigation />
        <main>
          {children}
        </main>
        <Footer
          email={about?.email}
          phone={about?.phone}
          instagram={about?.instagram}
        />
      </body>
    </html>
  );
}
