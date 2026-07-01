import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { env } from '@/config/runtime';

/** Landing placeholder — full hero ships in Phase 11. */
export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {env.appName}
      </h1>
      <p className="max-w-lg text-lg text-muted-foreground">
        Real-time Bangladesh job-market intelligence for software developers.
        Browse roles, track applications, and explore market analytics.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/jobs">Browse jobs</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/analytics">View analytics</Link>
        </Button>
      </div>
    </div>
  );
}
