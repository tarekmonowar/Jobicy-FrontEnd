'use client';

// Landing hero — live job counter (socket) + CTAs.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOverview } from '@/hooks/useAnalytics';
import { useSocketEvent } from '@/hooks/useSocketEvent';
import { env } from '@/config/runtime';
import type { StatsUpdatePayload } from '@/types/socket';

/** Animated number that springs toward the latest live count. */
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

/**
 * Hero section with a live active-jobs counter seeded from analytics,
 * updated in real time via `stats:update` socket events.
 */
export function Hero() {
  const { data: overview, isLoading } = useOverview();
  const [liveCount, setLiveCount] = useState<number | null>(null);

  // Seed from REST; socket patches override between refetches.
  useEffect(() => {
    if (overview?.totalActiveJobs != null && liveCount === null) {
      setLiveCount(overview.totalActiveJobs);
    }
  }, [overview?.totalActiveJobs, liveCount]);

  useSocketEvent('stats:update', (payload: StatsUpdatePayload) => {
    setLiveCount(payload.totalActiveJobs);
  });

  const count = liveCount ?? overview?.totalActiveJobs ?? 0;

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
      {/* Soft gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-background to-background"
        aria-hidden
      />

      <motion.div
        className="mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Sparkles className="size-4 text-primary" aria-hidden />
          Bangladesh developer job intelligence
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Find your next role with{' '}
          <span className="text-primary">{env.appName}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Real-time market data from LinkedIn, Indeed, Glassdoor, and more — aggregated
          and deduplicated for Bangladesh&apos;s software developer community.
        </p>

        <div className="mt-10 flex flex-col items-center gap-2">
          {isLoading && liveCount === null ? (
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
