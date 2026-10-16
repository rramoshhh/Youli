import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { CartProvider } from '@/components/cart/CartProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const siteUrl = (() => {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL('http://localhost:3000');
  }
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  } catch {
    return new URL('http://localhost:3000');
  }
})();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Youli Atelier',
    template: '%s · Youli Atelier',
  },
  description:
    'Youli Atelier creates refined lingerie essentials with atelier-level fit and premium materials.',
  openGraph: {
    title: 'Youli Atelier — Quiet luxury, everyday.',
    description:
      'Silk, lace, and mesh essentials crafted for a confident, refined fit.',
    type: 'website',
    siteName: 'Youli Atelier',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youli Atelier — Quiet luxury, everyday.',
    description:
      'Atelier-crafted silk, lace, and mesh essentials designed for a confident fit.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        <CartProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <div className="noise" aria-hidden="true"></div>
          <div className="backdrop" aria-hidden="true"></div>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
