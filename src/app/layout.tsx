import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Footer } from '@/components/ui/Footer';
import { Navbar } from '@/components/ui/Navbar';
import { PageTransition } from '@/components/ui/PageTransition';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { env } from '@/config/runtime';
import { Providers } from '@/app/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: env.appName,
    template: `%s | ${env.appName}`,
  },
  description:
    'Real-time Bangladesh job-market intelligence for software developers.',
};

/**
 * Root layout — server shell with client Navbar inside Providers.
 * Footer stays a server component sibling (not nested inside the client boundary).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SkipToContent />
          <Navbar />
          <PageTransition>
            <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
              {children}
            </main>
          </PageTransition>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
