import Link from 'next/link';
import { env } from '@/config/runtime';

/** Site footer with primary links. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {year} {env.appName}. Bangladesh developer job intelligence.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground" aria-label="Footer navigation">
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
