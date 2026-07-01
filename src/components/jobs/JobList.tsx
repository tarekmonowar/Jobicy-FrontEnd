'use client';

// Infinite-scroll job list with loading, empty, and error states.

import { useEffect, useRef } from 'react';
import { JobCard } from '@/components/jobs/JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import type { useJobs } from '@/hooks/useJobs';

type JobsQuery = ReturnType<typeof useJobs>;

type JobListProps = {
  query: JobsQuery;
  onResetFilters?: () => void;
};

function JobCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

/**
 * Renders paginated job cards; loads more when the sentinel enters the viewport.
 */
export function JobList({ query, onResetFilters }: JobListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    query;

  const jobs = data?.pages.flatMap((p) => p.data) ?? [];

  // IntersectionObserver triggers the next page fetch
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? 'Failed to load jobs'}
        onRetry={() => void refetch()}
      />
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        message="Try adjusting your filters or check back after the next fetch run."
        action={
          onResetFilters ? (
            <Button variant="outline" onClick={onResetFilters}>
              Clear filters
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      <div ref={sentinelRef} className="h-4" aria-hidden />

      {isFetchingNextPage && (
        <div className="grid gap-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      )}

      {!hasNextPage && jobs.length > 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          You&apos;ve reached the end of the list
        </p>
      )}
    </div>
  );
}
