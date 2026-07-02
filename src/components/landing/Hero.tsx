'use client';

// Landing hero — live job counter (socket) + CTAs.

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOverview } from '@/hooks/useAnalytics';
import { useSocketEvent } from '@/hooks/useSocketEvent';
import { env } from '@/config/runtime';
import type { StatsUpdatePayload } from '@/types/socket';

/** Brief scale pulse when the live count changes. */
function AnimatedCounter({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.08, opacity: 0.85 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

/**
 * Hero section with a live active-jobs counter seeded from analytics,
 * updated in real time via `stats:update` socket events.
 */
export function Hero() {
  const { data: overview, isLoading } = useOverview();
  const [socketCount, setSocketCount] = useState<number | undefined>();

  useSocketEvent('stats:update', (payload: StatsUpdatePayload) => {
    setSocketCount(payload.totalActiveJobs);
  });

  const count = socketCount ?? overview?.totalActiveJobs ?? 0;
  const waitingForCount = isLoading && overview === undefined && socketCount === undefined;

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
      {/* Soft-blur photo backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <div
          className="absolute inset-0 scale-[1.02] bg-cover bg-center bg-no-repeat blur-[2px]"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
      </div>
      {/* Light scrim — enough for text, image still visible */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/55 via-background/45 to-background/65"
        aria-hidden
      />

      <motion.div
        className="mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Sparkles className="size-4 text-primary" aria-hidden />
          Bangladesh developer job intelligence
        </div> */}

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Find your next role with <span className="text-primary">{env.appName}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg  sm:text-xl">
          Real-time market data from LinkedIn, Indeed, Glassdoor, and more — aggregated and
          deduplicated for Bangladesh&apos;s software developer community.
        </p>

        <div className="mt-10 flex flex-col items-center gap-2">
          {waitingForCount ? (
            <Skeleton className="h-14 w-48" />
          ) : (
            <p className="text-5xl font-bold tabular-nums text-primary sm:text-6xl">
              <AnimatedCounter value={count} />
            </p>
          )}
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Active developer jobs right now
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/jobs">
              Browse jobs
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Sign up free</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
