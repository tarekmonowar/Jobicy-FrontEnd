'use client';

// Mini skill-demand bar chart for the landing page.

import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSkillTrends } from '@/hooks/useAnalytics';

const PREVIEW_SKILLS = ['React', 'Node.js', 'TypeScript', 'Python', 'Docker'];

/**
 * Horizontal bars showing the latest count for top dev skills (7-day window).
 */
export function TopSkillsPreview() {
  const { data, isLoading, isError, refetch } = useSkillTrends({
    range: '7d',
    skills: PREVIEW_SKILLS,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4">
        <ErrorState message="Could not load skill trends" onRetry={() => void refetch()} />
      </div>
    );
  }

  // Use the latest point in each skill's time series as the bar height.
  const counts = data.series.map((s) => {
    const points = s.points;
    const latest = points.length > 0 ? points[points.length - 1].count : 0;
    return { skill: s.skill, count: latest };
  });

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skills in demand</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Job postings mentioning these skills over the last 7 days
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/analytics">Full analytics</Link>
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        {counts.map(({ skill, count }) => (
          <div key={skill} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{skill}</span>
              <span className="tabular-nums text-muted-foreground">{count} jobs</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
                role="presentation"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
