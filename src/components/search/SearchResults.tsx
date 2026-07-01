'use client';

// Search results — infinite scroll via useSearch (reads debounced `?q=` from URL).

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { JobCard } from '@/components/jobs/JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSearch } from '@/hooks/useSearch';

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
 * Renders debounced search hits with infinite scroll and standard empty/error states.
 * Query comes from the URL (`?q=`) so it stays in sync with SearchBar debounce.
 */
export function SearchResults() {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();
  const query = useSearch(q);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    query;

  const jobs = data?.pages.flatMap((p) => p.data) ?? [];

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

  if (q.length <= 1) {
    return (
      <EmptyState
        title="Start searching"
        message="Type at least 2 characters to search across job titles, companies, and skills."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? 'Search failed'}
        onRetry={() => void refetch()}
      />
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No results"
        message={`No jobs matched "${q}". Try different keywords or browse the jobs board.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {data?.pages[0]?.meta.total ?? jobs.length} result
        {(data?.pages[0]?.meta.total ?? jobs.length) !== 1 ? 's' : ''} for &ldquo;
        {q}&rdquo;
      </p>

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
          End of search results
        </p>
      )}
    </div>
  );
}
