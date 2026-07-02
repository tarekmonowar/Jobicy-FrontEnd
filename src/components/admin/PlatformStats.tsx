'use client';

// Platform-wide stat cards — users, jobs, alerts, applications.

import type { ReactNode } from 'react';
import { Briefcase, ClipboardList, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAdminStats } from '@/hooks/useAdmin';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  sub?: string;
};

/** Single metric card with icon, count, and optional subtitle. */
function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
          <p className="text-sm font-medium">{label}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Admin overview row — total users, jobs, active jobs, alerts, applications.
 */
export function PlatformStats() {
  const { data, isLoading, isError, refetch } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState message="Could not load platform stats" onRetry={() => void refetch()} />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={<Users className="size-5" aria-hidden />}
        label="Registered users"
        value={data.users}
      />
      <StatCard
        icon={<Briefcase className="size-5" aria-hidden />}
        label="Total jobs"
        value={data.jobs}
        sub={`${data.activeJobs.toLocaleString()} active`}
      />
      <StatCard
        icon={<Briefcase className="size-5" aria-hidden />}
        label="Active jobs"
        value={data.activeJobs}
      />
      <StatCard
        icon={<Heart className="size-5" aria-hidden />}
        label="Job alerts"
        value={data.alerts}
      />
      <StatCard
        icon={<ClipboardList className="size-5" aria-hidden />}
        label="Applications tracked"
        value={data.applications}
      />
    </div>
  );
}
