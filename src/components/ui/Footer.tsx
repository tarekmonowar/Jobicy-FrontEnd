'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { env } from '@/config/runtime';

const AUTH_PATHS = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
]);

/** Site footer — hidden on auth pages (login, register, forgot, reset). */
export function Footer() {
  const pathname = usePathname();

  if (AUTH_PATHS.has(pathname)) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} {env.appName}. Bangladesh developer job intelligence.
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          aria-label="Footer navigation"
        >
          <Link href="/jobs" className="hover:text-foreground">
            Jobs
          </Link>
          <Link href="/analytics" className="hover:text-foreground">
            Analytics
          </Link>
          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>
        </nav>
      </div>
    </footer>
  );
}
