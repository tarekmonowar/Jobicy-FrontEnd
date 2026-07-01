'use client';

// Landing stats row — overview metrics from analytics API.

import type { ReactNode } from 'react';
import { Briefcase, Building2, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useOverview } from '@/hooks/useAnalytics';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
};

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Three overview cards: active jobs, hiring companies, market demand index.
 */
export function StatsRow() {
  const { data, isLoading, isError, refetch } = useOverview();

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="px-4">
        <ErrorState message="Could not load market stats" onRetry={() => void refetch()} />
      </div>
    );
  }

  const trendLabel =
    data.demandTrend > 0
      ? `↑ ${data.demandTrend}% vs yesterday`
      : data.demandTrend < 0
        ? `↓ ${Math.abs(data.demandTrend)}% vs yesterday`
        : 'Stable vs yesterday';

  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-3">
      <StatCard
        icon={<Briefcase className="size-5" aria-hidden />}
        label="Active developer jobs"
        value={data.totalActiveJobs.toLocaleString()}
        sub={`${data.newJobsToday} new today`}
      />
      <StatCard
        icon={<Building2 className="size-5" aria-hidden />}
        label="Companies hiring"
        value={data.companiesHiringThisMonth.toLocaleString()}
        sub="This month"
      />
      <StatCard
        icon={<TrendingUp className="size-5" aria-hidden />}
        label="Market demand index"
        value={`${Math.round(data.demandIndex)}`}
        sub={trendLabel}
      />
    </div>
  );
}
